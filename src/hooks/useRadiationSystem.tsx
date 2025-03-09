
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
    status: 'Critical Danger'
  });

  // Define feature unlocks
  const defineFeatureUnlocks = (currentRadiation: number) => {
    const features: FeatureUnlock[] = [
      {
        radiationLevel: 100,
        name: "Referral System",
        description: "Generate referral links and earn 50% of each NFT purchase",
        unlocked: currentRadiation <= 100,
        category: 'economic'
      },
      {
        radiationLevel: 90,
        name: "Job Board",
        description: "Bounty Hunters can post jobs for Survivors",
        unlocked: currentRadiation <= 90,
        category: 'economic'
      },
      {
        radiationLevel: 75,
        name: "Settlement Fundraising",
        description: "Fund new settlements and basic trading",
        unlocked: currentRadiation <= 75,
        category: 'social'
      },
      {
        radiationLevel: 50,
        name: "Full Marketplace",
        description: "Complete marketplace opens with all features",
        unlocked: currentRadiation <= 50,
        category: 'economic'
      },
      {
        radiationLevel: 25,
        name: "Trade Routes",
        description: "Establish trade routes between settlements",
        unlocked: currentRadiation <= 25,
        category: 'governance'
      }
    ];

    const nextFeature = features.find(feature => !feature.unlocked) || null;
    return { features, nextFeature };
  };

  // Get radiation status
  const getRadiationStatus = (level: number) => {
    if (level > 90) return "Critical Danger";
    if (level > 75) return "High Risk";
    if (level > 50) return "Settlement Formation";
    if (level > 25) return "Economic Stability";
    if (level > 0) return "Flourishing Economy";
    return "Civilization Rebuilt";
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
        status: getRadiationStatus(radiationLevel) as RadiationSystemData['status']
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
