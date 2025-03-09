
import React, { useState } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Database, Shield, Eye, EyeOff, ExternalLink, Radiation, Lock, Unlock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface ArchiveNFTRevealProps {
  currentRadiation: number;
  totalHolders: number;
}

type ArchiveNFT = {
  id: number;
  name: string;
  codename: string;
  imageUrl: string;
  radiationThreshold: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  description: string;
  revealed: boolean;
};

export function ArchiveNFTReveal({ currentRadiation, totalHolders }: ArchiveNFTRevealProps) {
  const [revealingId, setRevealingId] = useState<number | null>(null);
  
  // Sample NFTs - in real implementation, this would come from your NFT contract
  const archiveNFTs: ArchiveNFT[] = [
    {
      id: 1,
      name: "Protocol Guardian",
      codename: "PG-001",
      imageUrl: "https://gateway.pinata.cloud/ipfs/bafybeiheog5wgtnl7ldazmsj3n7xmkgkzpjnix5e4tuxndzw7j3bgkp2n4",
      radiationThreshold: 100,
      rarity: 'Legendary',
      description: "First-generation Archive interface unit. Maintains core protocols even in extreme radiation.",
      revealed: currentRadiation <= 100
    },
    {
      id: 2,
      name: "Memory Keeper",
      codename: "MK-042",
      imageUrl: "https://gateway.pinata.cloud/ipfs/bafybeiavqxeov62wgj6upfpvq6g4vpvot4mnwl3ggunxp27sbfjgs4hlfq",
      radiationThreshold: 90,
      rarity: 'Rare',
      description: "Specialized unit for data preservation and integrity verification across Archive nodes.",
      revealed: currentRadiation <= 90
    },
    {
      id: 3,
      name: "Network Sentinel",
      codename: "NS-173",
      imageUrl: "https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa",
      radiationThreshold: 75,
      rarity: 'Uncommon',
      description: "Monitors Archive network integrity and defends against unauthorized access attempts.",
      revealed: currentRadiation <= 75
    },
    {
      id: 4,
      name: "Data Scavenger",
      codename: "DS-889",
      imageUrl: "https://gateway.pinata.cloud/ipfs/bafybeig47okn4sqqbajhje57htkxw6py3tdms7boyc3hkvvr4qlj7zsabu",
      radiationThreshold: 50,
      rarity: 'Common',
      description: "Recovers corrupted data packets and rebuilds fragmented Archive sectors.",
      revealed: currentRadiation <= 50
    }
  ];
  
  // Simulate NFT reveal animation
  const handleReveal = (id: number) => {
    setRevealingId(id);
    setTimeout(() => {
      setRevealingId(null);
    }, 3000);
  };
  
  // OpenSea collection URL
  const openSeaUrl = "https://opensea.io/collection/resistance-collection";

  return (
    <ToxicCard className="bg-black/80 border-toxic-neon/30 p-5 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-toxic-neon/10">
          <Database className="h-6 w-6 text-toxic-neon" />
        </div>
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">Wasteland Archives</h2>
          <p className="text-white/60 text-sm">Reconnect with the Archive through NFT Acquisition</p>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-white/80 mb-4">
          The Archive's interface units were scattered during the collapse. Each NFT represents a recovered unit, 
          strengthening our connection to humanity's lost knowledge.
        </p>
        
        <div className="bg-black/40 rounded-lg p-3 mb-4 border border-toxic-neon/20">
          <div className="flex justify-between mb-1">
            <span className="text-white/70">Total Archive Units</span>
            <span className="text-toxic-neon font-mono">19</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-white/70">Units Recovered</span>
            <span className="text-toxic-neon font-mono">{totalHolders}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Radiation Reduction</span>
            <span className="text-toxic-neon font-mono">-{(totalHolders * 0.1).toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {archiveNFTs.map((nft) => (
          <motion.div 
            key={nft.id}
            className={`relative rounded-lg border overflow-hidden ${
              nft.revealed 
                ? nft.rarity === 'Legendary' 
                  ? 'border-purple-500/50 bg-black/60' 
                  : nft.rarity === 'Rare'
                    ? 'border-blue-500/50 bg-black/60'
                    : nft.rarity === 'Uncommon'
                      ? 'border-toxic-neon/50 bg-black/60'
                      : 'border-gray-500/50 bg-black/60'
                : 'border-gray-700/30 bg-black/80'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: nft.id * 0.1 }}
          >
            {/* Radiation overlay for unrevealed NFTs */}
            {!nft.revealed && (
              <div className="absolute inset-0 backdrop-blur-sm bg-black/70 z-10 flex flex-col items-center justify-center p-4 radiation-scan-lines">
                <Radiation className="h-10 w-10 text-apocalypse-red animate-pulse mb-3" />
                <p className="text-white/80 text-center font-mono mb-1">Archive Unit Locked</p>
                <p className="text-xs text-white/60 text-center mb-3">
                  Requires radiation level below {nft.radiationThreshold}%
                </p>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-apocalypse-red" />
                  <span className="text-apocalypse-red text-sm font-mono">RADIATION INTERFERENCE</span>
                </div>
              </div>
            )}
            
            {/* Content visible only when revealed */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className={`font-mono ${
                    nft.rarity === 'Legendary' ? 'text-purple-400' : 
                    nft.rarity === 'Rare' ? 'text-blue-400' : 
                    nft.rarity === 'Uncommon' ? 'text-toxic-neon' :
                    'text-gray-300'
                  }`}>
                    {nft.name}
                  </h3>
                  <div className="text-xs text-white/60 font-mono">{nft.codename}</div>
                </div>
                <ToxicBadge 
                  variant="outline" 
                  className={
                    nft.rarity === 'Legendary' ? 'text-purple-400 border-purple-400/30' :
                    nft.rarity === 'Rare' ? 'text-blue-400 border-blue-400/30' :
                    nft.rarity === 'Uncommon' ? 'text-toxic-neon border-toxic-neon/30' :
                    'text-gray-400 border-gray-400/30'
                  }
                >
                  {nft.rarity}
                </ToxicBadge>
              </div>

              {/* NFT image with reveal animation */}
              <div className="aspect-square mb-3 bg-black/40 rounded overflow-hidden relative">
                {nft.revealed ? (
                  <motion.img 
                    src={nft.imageUrl} 
                    alt={nft.name}
                    className="w-full h-full object-cover"
                    initial={revealingId === nft.id ? { filter: 'blur(20px)', opacity: 0.5 } : {}}
                    animate={revealingId === nft.id ? { filter: 'blur(0px)', opacity: 1 } : {}}
                    transition={{ duration: 2.5 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/60">
                    <Lock className="h-8 w-8 text-gray-600 opacity-50" />
                  </div>
                )}
              </div>

              {nft.revealed && (
                <div className="mb-3 text-xs text-white/70">
                  <p>{nft.description}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center text-xs">
                        <Radiation className="h-3 w-3 text-toxic-neon mr-1" />
                        <span className="text-white/70">Threshold:</span>
                        <span className="text-toxic-neon ml-1">{nft.radiationThreshold}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Archive unit becomes accessible when global radiation drops below this threshold</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {nft.revealed ? (
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-7 px-2 border-toxic-neon/30"
                    onClick={() => handleReveal(nft.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Inspect
                  </ToxicButton>
                ) : (
                  <ToxicBadge variant="outline" className="text-apocalypse-red border-apocalypse-red/30 text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </ToxicBadge>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <ToxicButton 
        variant="default" 
        className="w-full"
        onClick={() => window.open(openSeaUrl, "_blank")}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Recover Archive Units on OpenSea
      </ToxicButton>
    </ToxicCard>
  );
}
