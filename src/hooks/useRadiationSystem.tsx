
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useCustomWallet } from './useCustomWallet';
import { useWalletProvider } from './useWalletProvider';
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/lib/constants';
import { subscribeToRadiationEvents, EventConfig } from '@/services/eventListenerService';
import { useToast } from '@/hooks/use-toast';
import { handleDynamicError } from '@/services/dynamicErrorHandler';

export interface FeatureUnlock {
  radiationLevel: number;
  name: string;
  description: string;
  unlocked: boolean;
  category: 'economic' | 'social' | 'governance';
  icon?: string;
  narrative?: string;
}

export interface RadiationSystemData {
  currentRadiation: number;
  totalHolders: number;
  radiationReduction: number;
  reductionPerHolder: number;
  featureUnlocks: FeatureUnlock[];
  nextFeatureUnlock: FeatureUnlock | null;
  isLoading: boolean;
  error: string | null;
  status: 'Critical Danger' | 'High Risk' | 'Settlement Formation' | 'Economic Stability' | 'Flourishing Economy' | 'Civilization Rebuilt';
  narrativeContext: string;
}

export const useRadiationSystem = () => {
  const { isConnected } = useCustomWallet();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  const [data, setData] = useState<RadiationSystemData>({
    currentRadiation: 100, // Start at 100% radiation
    totalHolders: 0,
    radiationReduction: 0,
    reductionPerHolder: 0.1, // 0.1% reduction per holder
    featureUnlocks: [],
    nextFeatureUnlock: null,
    isLoading: true,
    error: null,
    status: 'Critical Danger',
    narrativeContext: 'The Last Archive remains inaccessible. Radiation levels are critical, preventing access to humanity\'s collective knowledge. Each NFT holder strengthens our connection to this lost database.'
  });

  // Define feature unlocks with enhanced narrative
  const defineFeatureUnlocks = (currentRadiation: number) => {
    const features: FeatureUnlock[] = [
      {
        radiationLevel: 100,
        name: "The Archive Awakens",
        description: "First connection to the Archive established",
        unlocked: currentRadiation <= 100,
        category: 'economic',
        narrative: "The first data packets break through the static. The Archive acknowledges our presence, but most systems remain locked down."
      },
      {
        radiationLevel: 90,
        name: "Survivor Network",
        description: "Basic communication channels open between Archive users",
        unlocked: currentRadiation <= 90,
        category: 'social',
        narrative: "Scattered survivor groups begin to connect through the Archive. The knowledge sharing begins, albeit limited by radiation interference."
      },
      {
        radiationLevel: 75,
        name: "Memory Fragments",
        description: "First historical records and critical knowledge become accessible",
        unlocked: currentRadiation <= 75,
        category: 'economic',
        narrative: "Fragments of the old world's knowledge start to surface. Technological schematics, agricultural data, and medical information begin to flow."
      },
      {
        radiationLevel: 50,
        name: "Resource Coordination",
        description: "Advanced resource tracking and allocation systems activate",
        unlocked: currentRadiation <= 50,
        category: 'economic',
        narrative: "The Archive's resource management protocols come online. For the first time since the collapse, communities can coordinate efforts across vast distances."
      },
      {
        radiationLevel: 25,
        name: "Governance Restoration",
        description: "Democratic systems and decision-making frameworks restored",
        unlocked: currentRadiation <= 25,
        category: 'governance',
        narrative: "The Archive reveals the accumulated wisdom of thousands of years of governance systems. A new society begins to form around these rediscovered principles."
      }
    ];

    const nextFeature = features.find(feature => !feature.unlocked) || null;
    return { features, nextFeature };
  };

  // Get radiation status with narrative context
  const getRadiationStatus = (level: number) => {
    if (level > 90) return "Critical Danger";
    if (level > 75) return "High Risk";
    if (level > 50) return "Settlement Formation";
    if (level > 25) return "Economic Stability";
    if (level > 0) return "Flourishing Economy";
    return "Civilization Rebuilt";
  };

  // Get narrative context based on radiation level
  const getNarrativeContext = (level: number) => {
    if (level > 90) return "The Last Archive remains inaccessible. Radiation levels are critical, preventing access to humanity's collective knowledge. Each NFT holder strengthens our connection to this lost database.";
    if (level > 75) return "Faint signals penetrate the noise. The Archive's basic systems flicker to life, offering glimpses of the knowledge within. The Resistance grows stronger with each new member.";
    if (level > 50) return "The Archive's defenses recognize allied signatures. More systems come online as radiation levels decrease. Communities begin forming around the rediscovered knowledge.";
    if (level > 25) return "The Archive's vast libraries begin systematic restoration. Technologies long forgotten return to humanity's grasp. A new era of rebuilding has begun.";
    return "The Archive stands fully restored, a beacon of humanity's resilience. What was once lost is found again, guiding us toward a future brighter than our past.";
  };

  // Fetch radiation data from contract
  const fetchRadiationData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // For now, use mock data matching contract's initial state
      // In the future, this should connect to the contract
      const radiationLevel = 100; // Starting at 100%
      const holderCount = 0;      // No holders initially
      const reductionPerHolder = 0.1; // 0.1% reduction per holder
      
      // Calculate radiation reduction
      const radiationReduction = holderCount * reductionPerHolder;
      
      // Define features and next feature
      const { features, nextFeature } = defineFeatureUnlocks(radiationLevel);
      
      // Get narrative context
      const narrativeContext = getNarrativeContext(radiationLevel);
      
      // Update state
      setData({
        currentRadiation: radiationLevel,
        totalHolders: holderCount,
        radiationReduction,
        reductionPerHolder,
        featureUnlocks: features,
        nextFeatureUnlock: nextFeature,
        isLoading: false,
        error: null,
        status: getRadiationStatus(radiationLevel) as RadiationSystemData['status'],
        narrativeContext
      });

    } catch (error) {
      console.error('Error fetching radiation data:', error);
      const proposalError = handleDynamicError(error);
      setData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: proposalError.message 
      }));
      
      toast({
        title: "Error fetching radiation data",
        description: proposalError.message,
        variant: "destructive"
      });
    }
  };

  // Subscribe to radiation events
  const subscribeToEvents = async () => {
    if (!isConnected) {
      return;
    }

    try {
      const walletProvider = await getProvider();
      
      const eventConfig: EventConfig = {
        provider: walletProvider.provider,
        contractAddress: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        eventName: 'RadiationLevelUpdated' // Match the event name in the contract
      };

      const subscription = subscribeToRadiationEvents(
        eventConfig,
        (event) => {
          // Update radiation data when event is received
          const radiationLevel = event.newLevel / 100; // Convert from basis points if needed
          const holderCount = event.uniqueHolderCount;
          const reductionPerHolder = 0.1;
          const radiationReduction = holderCount * reductionPerHolder;
          const { features, nextFeature } = defineFeatureUnlocks(radiationLevel);
          
          setData({
            currentRadiation: radiationLevel,
            totalHolders: holderCount,
            radiationReduction,
            reductionPerHolder,
            featureUnlocks: features,
            nextFeatureUnlock: nextFeature,
            isLoading: false,
            error: null,
            status: getRadiationStatus(radiationLevel) as RadiationSystemData['status']
          });
          
          toast({
            title: "Radiation Level Updated",
            description: `New level: ${radiationLevel}%`,
            variant: "default"
          });
        },
        (error) => {
          console.error('Radiation event subscription error:', error);
          toast({
            title: "Subscription Error",
            description: error.message,
            variant: "destructive"
          });
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error subscribing to radiation events:', error);
      const proposalError = handleDynamicError(error);
      toast({
        title: "Subscription Error",
        description: proposalError.message,
        variant: "destructive"
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRadiationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // Subscribe to events
  useEffect(() => {
    const unsubscribe = subscribeToEvents();
    return () => {
      unsubscribe?.then(unsub => unsub?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return {
    ...data,
    refresh: fetchRadiationData
  };
};
