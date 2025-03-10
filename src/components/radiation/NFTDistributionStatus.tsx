
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Shield, Target, Hammer, Radiation, ExternalLink } from 'lucide-react';

// Define character data based on the contract
export const CHARACTERS = {
  // SENTINELS (1..7)
  SENTINEL_CHARACTERS: [
    { id: 1, name: "DAO Enforcer", ipfsCID: "bafkreibo6bk5dezlsii7imuabncv7tihxwbi4f4urds75l7nuy2rnxfkru" },
    { id: 2, name: "Insolvent Medic", ipfsCID: "bafkreid7oobbrlbxcnnigfcwfbgr5m3dmsl6wemsuaxluzd54ioclneubq" },
    { id: 3, name: "Liquidation Phantom", ipfsCID: "bafkreicfsovqdpu3byxvyfev4y7xdmqz3hggewsuyx4brifoscercektpy" },
    { id: 4, name: "Margin Call Marauder", ipfsCID: "bafkreiaasojzt45tw5jkohgwvibtth6nl4jlognknercfpgir6zjpw335u" },
    { id: 5, name: "Overleveraged Berserker", ipfsCID: "bafkreihigf4xjzy4jrqkm7wsxxdtokwew4m3njdxt6hheb67nuit47byta" },
    { id: 6, name: "Rugged Nomad", ipfsCID: "bafkreibhb3upqoifbl77jbrqxp2puudelcrjf45jnfkdqipef6skzpewti" },
    { id: 7, name: "Yield Farm Executioner", ipfsCID: "bafkreibo5yjsmqlt2cc7olqeuz2wxref7oe54bmallzl4mgwkt3xsnjlqi" }
  ],
  // SURVIVORS (8..10)
  SURVIVOR_CHARACTERS: [
    { id: 8, name: "Rugpull Veteran", ipfsCID: "bafkreiek2ihnc7fmpwzseitea2vflvwdmm6qvn4vydd5ww6wgipntf3w7a" },
    { id: 9, name: "Blacklist Exile", ipfsCID: "bafkreica5ugau5cjah7hkwz4ko36oqxkg2v4swqpxnhzi7z4wgftl76q5m" },
    { id: 10, name: "Failed Validator", ipfsCID: "bafkreigw5k75stzjhamdjtwlssbolhxepbeglfs3qoyowgu2q4n2fnfszy" }
  ],
  // BOUNTY HUNTERS (11..16)
  BOUNTY_HUNTER_CHARACTERS: [
    { id: 11, name: "Chain Reaper", ipfsCID: "bafkreifepvbd2shm4uxfysdxtva5mjs7fqnxbxehutcoqfblmcgtp7h7ka" },
    { id: 12, name: "Forked Hunter", ipfsCID: "bafkreierebrs3yw24r7wgkezgok6lhbiwqwwgen5fnfqxm6cqul644x3fe" },
    { id: 13, name: "Liquidated Tracker", ipfsCID: "bafkreiajc2mwtirx3423mbf55scuniqlwh3ph2cglk7y2nbd764r6g6ine" },
    { id: 14, name: "Oracle Stalker", ipfsCID: "bafkreieytk2bsis7fdavqu74t3dgquew36ppycxnlbxt6dgzudjakcrexq" },
    { id: 15, name: "Slippage Sniper", ipfsCID: "bafkreidrcpfmaken4gsbeweqthzrg3bkcxi344bftqwndiapeo6pm4msda" },
    { id: 16, name: "Sandwich Hunter", ipfsCID: "bafkreigxfbvntll522na4la6b4cdvp5g74jztgjhgdmz2b5uv7uaieywie" }
  ]
};

// Constants for supply caps
const SENTINEL_PER_TYPE = 100;
const OTHER_ROLES_PER_TYPE = 150;

interface NFTSupply {
  type: 'sentinel' | 'bounty-hunter' | 'survivor';
  name: string;
  icon: React.ReactNode;
  total: number;
  claimed: number;
  free: number;
  cost: number | 'Free';
  description: string;
  // New fields for OpenSea integration
  openSeaLink?: string;
  characterList: Array<{ id: number, name: string, ipfsCID: string }>;
}

interface NFTDistributionStatusProps {
  className?: string;
}

export function NFTDistributionStatus({ className = "" }: NFTDistributionStatusProps) {
  const nftSupplies: NFTSupply[] = [
    {
      type: 'sentinel',
      name: "Founder Sentinels",
      icon: <Shield className="h-5 w-5 text-purple-400" />,
      total: SENTINEL_PER_TYPE * CHARACTERS.SENTINEL_CHARACTERS.length,
      claimed: 326,
      free: 821,
      cost: 50,
      description: "Governance & Economic Oversight",
      openSeaLink: "https://opensea.io/collection/resistance-sentinels",
      characterList: CHARACTERS.SENTINEL_CHARACTERS
    },
    {
      type: 'bounty-hunter',
      name: "Bounty Hunters",
      icon: <Target className="h-5 w-5 text-apocalypse-red" />,
      total: OTHER_ROLES_PER_TYPE * CHARACTERS.BOUNTY_HUNTER_CHARACTERS.length,
      claimed: 187,
      free: 500,
      cost: 'Free',
      description: "Enforcers & Funders",
      openSeaLink: "https://opensea.io/collection/resistance-bounty-hunters",
      characterList: CHARACTERS.BOUNTY_HUNTER_CHARACTERS
    },
    {
      type: 'survivor',
      name: "Survivors",
      icon: <Hammer className="h-5 w-5 text-amber-400" />,
      total: OTHER_ROLES_PER_TYPE * CHARACTERS.SURVIVOR_CHARACTERS.length,
      claimed: 412,
      free: 0,
      cost: 50,
      description: "Builders & Innovators",
      openSeaLink: "https://opensea.io/collection/resistance-survivors",
      characterList: CHARACTERS.SURVIVOR_CHARACTERS
    }
  ];

  // Calculate total claimed and percentage
  const totalNFTs = nftSupplies.reduce((sum, supply) => sum + supply.total, 0);
  const totalClaimed = nftSupplies.reduce((sum, supply) => sum + supply.claimed, 0);
  const claimedPercentage = (totalClaimed / totalNFTs) * 100;
  
  // Calculate radiation reduction
  const radiationReduction = totalClaimed * 0.1;

  return (
    <ToxicCard className={`bg-black/80 border-toxic-neon/30 p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-toxic-neon/10">
          <Radiation className="h-6 w-6 text-toxic-neon" />
        </div>
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">NFT Distribution Status</h2>
          <p className="text-white/60 text-sm">Total Radiation Reduction: {radiationReduction.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Global Claim Progress</span>
          <span className="text-toxic-neon font-mono">{totalClaimed} / {totalNFTs}</span>
        </div>
        <ToxicProgress 
          value={claimedPercentage} 
          variant="radiation" 
          className="h-3" 
        />
      </div>
      
      <div className="space-y-4">
        {nftSupplies.map((supply) => (
          <div key={supply.type} className="bg-black/40 rounded-lg p-3 border border-toxic-neon/20">
            <div className="flex items-center gap-2 mb-2">
              {supply.icon}
              <div>
                <h3 className="text-toxic-neon font-mono">{supply.name}</h3>
                <p className="text-white/60 text-xs">{supply.description}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">Claimed</span>
                <span className="text-toxic-neon font-mono">{supply.claimed} / {supply.total}</span>
              </div>
              <ToxicProgress 
                value={(supply.claimed / supply.total) * 100}
                variant={supply.type === 'sentinel' ? 'governance' : supply.type === 'bounty-hunter' ? 'reputation' : 'staking'}
                className="h-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-black/30 p-2 rounded">
                <span className="text-white/60 block">Free Claims</span>
                <span className="text-toxic-neon font-mono">{Math.max(0, supply.free - supply.claimed)} remaining</span>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <span className="text-white/60 block">Cost</span>
                <span className="text-toxic-neon font-mono">
                  {typeof supply.cost === 'number' ? `${supply.cost} MATIC` : supply.cost}
                </span>
              </div>
            </div>
            
            <ToxicButton 
              variant={supply.type === 'sentinel' ? 'default' : supply.type === 'bounty-hunter' ? 'secondary' : 'outline'}
              size="sm"
              className="w-full"
              onClick={() => window.open(supply.openSeaLink, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get on OpenSea
            </ToxicButton>
          </div>
        ))}
      </div>
    </ToxicCard>
  );
}
