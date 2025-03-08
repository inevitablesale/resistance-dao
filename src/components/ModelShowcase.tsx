
import React, { useState, useEffect } from 'react';
import { ModelViewer } from './ui/model-viewer';
import { ToxicCard } from './ui/toxic-card';
import { ToxicButton } from './ui/toxic-button';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelInfo {
  name: string;
  description: string;
  ipfsHash: string;
  type: 'bounty-hunter' | 'survivor' | 'equipment';
  stats?: {
    [key: string]: string | number;
  };
}

interface ModelShowcaseProps {
  className?: string;
}

export const ModelShowcase: React.FC<ModelShowcaseProps> = ({ 
  className 
}) => {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  // Sample models (you would replace these with your actual models)
  const models: ModelInfo[] = [
    {
      name: "Mutant Zero X-35",
      description: "Elite bounty hunter with neural hacking mutations. Specializes in tracking digital signatures across the wasteland.",
      ipfsHash: "bafybeic2yffnslotf33yojsihiyv73rmxenstfwcxnyws5ktxp2mptkb3q", // Your provided CID
      type: 'bounty-hunter',
      stats: {
        "Radiation Level": "High (78%)",
        "Mutation Type": "Neural Hacking",
        "Threat Rating": "Extreme",
        "Bounties Claimed": 24
      }
    }
    // You can add more models here later
  ];

  const currentModel = models[currentModelIndex];
  
  const nextModel = () => {
    setCurrentModelIndex((prev) => (prev + 1) % models.length);
  };
  
  const prevModel = () => {
    setCurrentModelIndex((prev) => (prev - 1 + models.length) % models.length);
  };
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  
  // Randomly change models every 20 seconds if there's more than one
  useEffect(() => {
    if (models.length > 1) {
      const interval = setInterval(() => {
        setCurrentModelIndex((prev) => (prev + 1) % models.length);
      }, 20000);
      
      return () => clearInterval(interval);
    }
  }, [models.length]);
  
  return (
    <div className={cn("model-showcase relative", className)}>
      <ToxicCard className="bg-black/60 border-toxic-neon/30 relative overflow-hidden">
        <div className="relative h-[400px]">
          <ModelViewer 
            ipfsHash={currentModel.ipfsHash}
            height="400px"
            autoRotate={true}
            radiationEffect={true}
            rotationSpeed={0.003}
            showControls={true}
            className="w-full"
          />
          
          {/* Navigation buttons */}
          {models.length > 1 && (
            <>
              <button 
                onClick={prevModel}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 p-2 rounded-full border border-toxic-neon/30 text-toxic-neon hover:bg-black/60 transition-all z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextModel}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 p-2 rounded-full border border-toxic-neon/30 text-toxic-neon hover:bg-black/60 transition-all z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          
          {/* Info toggle button */}
          <button 
            onClick={toggleInfo}
            className="absolute right-2 top-2 bg-black/40 p-2 rounded-full border border-toxic-neon/30 text-toxic-neon hover:bg-black/60 transition-all z-10"
          >
            <Info className="h-5 w-5" />
          </button>
          
          {/* Model info panel */}
          <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 z-20 flex flex-col ${showInfo ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="p-6 flex-1 overflow-auto">
              <h3 className="text-2xl font-mono text-toxic-neon mb-2">{currentModel.name}</h3>
              <div className="mb-4 pb-4 border-b border-toxic-neon/20">
                <p className="text-white/80">{currentModel.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {currentModel.stats && Object.entries(currentModel.stats).map(([key, value]) => (
                  <div key={key} className="bg-black/40 p-3 rounded-md border border-toxic-neon/20">
                    <div className="text-white/60 text-sm">{key}</div>
                    <div className="text-toxic-neon font-mono">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-toxic-neon/20 flex justify-between">
              <div className="flex items-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm font-mono">
                  {currentModel.type === 'bounty-hunter' ? 'BOUNTY HUNTER' : 
                   currentModel.type === 'survivor' ? 'SURVIVOR' : 'EQUIPMENT'}
                </span>
              </div>
              <ToxicButton variant="outline" size="sm" onClick={toggleInfo}>
                Close Details
              </ToxicButton>
            </div>
          </div>
        </div>
      </ToxicCard>
    </div>
  );
};
