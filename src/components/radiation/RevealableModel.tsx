
import React, { useState, useEffect } from 'react';
import { ModelPreview } from '@/components/marketplace/ModelPreview';
import { Loader2, Radiation, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToxicButton } from '@/components/ui/toxic-button';
import { useCharacterMetadata } from '@/hooks/useCharacterMetadata';

// Default radiation cloud model URL
const RADIATION_CLOUD_MODEL = "https://gateway.pinata.cloud/ipfs/bafybeifqzxpq7qlc3vq4rkyt3owfxdhsqnfv5xqgkgfipwsb46szdkgrfi";

interface RevealableModelProps {
  ipfsCID: string;
  role: 'SENTINEL' | 'SURVIVOR' | 'BOUNTY_HUNTER';
  name: string;
  className?: string;
  height?: string;
  width?: string;
  autoRotate?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
}

export const RevealableModel: React.FC<RevealableModelProps> = ({ 
  ipfsCID, 
  role,
  name,
  className = "", 
  height = "200px", 
  width = "100%",
  autoRotate = true,
  revealed = false,
  onReveal
}) => {
  const [isRevealed, setIsRevealed] = useState(revealed);
  const [isRevealing, setIsRevealing] = useState(false);
  const { metadata, loading, error } = useCharacterMetadata({ ipfsCID, role, name });
  
  // Check if user has already revealed this item
  useEffect(() => {
    const revealedStatus = localStorage.getItem(`revealed-${ipfsCID}`);
    if (revealedStatus === 'true') {
      setIsRevealed(true);
    }
  }, [ipfsCID]);
  
  // Update when revealed prop changes
  useEffect(() => {
    setIsRevealed(revealed);
  }, [revealed]);
  
  const handleReveal = () => {
    setIsRevealing(true);
    
    // Simulate reveal animation
    setTimeout(() => {
      setIsRevealed(true);
      setIsRevealing(false);
      
      // Store reveal status
      localStorage.setItem(`revealed-${ipfsCID}`, 'true');
      
      // Call the callback if provided
      if (onReveal) {
        onReveal();
      }
    }, 2500);
  };
  
  if (loading) {
    return (
      <div 
        className={`relative flex items-center justify-center bg-black/70 ${className}`} 
        style={{ height, width }}
      >
        <Loader2 className="h-8 w-8 text-toxic-neon animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div 
        className={`relative flex items-center justify-center bg-black/70 ${className}`} 
        style={{ height, width }}
      >
        <div className="text-apocalypse-red text-center p-4">
          <p>Error loading model</p>
          <p className="text-xs mt-2">Please try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ height, width }}
    >
      <AnimatePresence>
        {!isRevealed && !isRevealing && (
          <motion.div 
            className="absolute inset-0 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ModelPreview
              modelUrl={RADIATION_CLOUD_MODEL}
              height="100%"
              width="100%"
              autoRotate={autoRotate}
              className="bg-black/70"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
              <Radiation className="w-12 h-12 text-toxic-neon mb-4" />
              <h3 className="text-toxic-neon font-mono text-lg mb-2">Radiation Contaminated</h3>
              <p className="text-white/70 text-sm mb-4 text-center px-4">
                This character is locked behind radiation.
              </p>
              <ToxicButton 
                variant="toxic" 
                onClick={handleReveal}
                className="bg-toxic-neon/20 hover:bg-toxic-neon/30"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Clear Radiation
              </ToxicButton>
            </div>
          </motion.div>
        )}
        
        {isRevealing && (
          <motion.div 
            className="absolute inset-0 z-20 flex items-center justify-center bg-toxic-neon/10 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <Loader2 className="h-16 w-16 text-toxic-neon animate-spin mx-auto mb-4" />
              <h3 className="text-toxic-neon font-mono text-xl mb-2">Clearing Radiation</h3>
              <p className="text-white/70">Decontaminating character data...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className={`${!isRevealed && !isRevealing ? 'opacity-0' : 'opacity-100'}`}
        transition={{ duration: 0.5 }}
      >
        <ModelPreview
          modelUrl={`https://gateway.pinata.cloud/ipfs/${ipfsCID}`}
          height="100%"
          width="100%"
          autoRotate={autoRotate}
        />
      </motion.div>
    </div>
  );
};
