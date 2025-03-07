
import { useState } from 'react';
import { ToxicButton } from "@/components/ui/toxic-button";
import { Wallet, Radiation, ArrowRightLeft, CornerRightDown, Coins } from 'lucide-react';
import { ToxicCard } from '@/components/ui/toxic-card';

interface BuyRDTokensProps {
  onConnectWallet?: () => void;
}

export const BuyRDTokens = ({ onConnectWallet }: BuyRDTokensProps) => {
  const [amount, setAmount] = useState<number>(100);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };
  
  return (
    <ToxicCard className="relative bg-black/40 border border-toxic-neon/20 p-0 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-6">
          <h3 className="text-2xl font-mono text-toxic-neon mb-4 toxic-glow flex items-center">
            <Radiation className="w-6 h-6 mr-2" /> Fuel The New Economy
          </h3>
          <p className="text-white/70 mb-2">
            <span className="text-toxic-neon font-semibold">PRESALE NOW ACTIVE</span> - Join the first wave of wasteland rebuilders.
          </p>
          <p className="text-white/70 mb-4">
            Convert your <span className="text-apocalypse-red font-semibold">Old World currency (USDC)</span> into <span className="text-toxic-neon font-semibold">Resistance Dollars (RD)</span> to establish trade networks and power the post-apocalyptic economy.
          </p>
          
          <div className="mb-4">
            <div className="bg-black/70 border border-toxic-neon/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-toxic-neon font-mono">Exchange Rate</span>
                <span className="text-white font-mono">1 USDC = 1 RD</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-toxic-neon font-mono">Minimum Contribution</span>
                <span className="text-white font-mono">10 USDC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-toxic-neon font-mono">Protocol Fee</span>
                <span className="text-white font-mono">0.5%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/60 border border-toxic-neon/20 p-4 rounded-lg mb-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">Amount to Convert</span>
                <span className="text-toxic-neon text-sm">Balance: 0 USDC</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-black/70 border border-toxic-neon/30 text-white p-2 rounded-lg focus:outline-none focus:border-toxic-neon font-mono"
                />
                <span className="text-white font-mono bg-toxic-neon/20 py-2 px-3 rounded-lg">USDC</span>
              </div>
              
              <div className="flex items-center justify-center my-3">
                <div className="bg-toxic-neon/20 p-2 rounded-full">
                  <ArrowRightLeft className="h-5 w-5 text-toxic-neon" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">You'll Receive</span>
                <span className="text-toxic-neon text-sm">Est. Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-black/70 border border-toxic-neon/30 text-white p-2 rounded-lg font-mono">
                  {amount} RD
                </div>
                <span className="text-white font-mono bg-toxic-neon/20 py-2 px-3 rounded-lg">RD</span>
              </div>
            </div>
          </div>
          
          <ToxicButton
            className="w-full bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
            size="lg"
            onClick={onConnectWallet}
          >
            <Coins className="w-5 h-5 mr-2 text-toxic-neon" />
            <span className="text-lg font-mono flash-beacon">JOIN THE RESISTANCE ECONOMY</span>
          </ToxicButton>
        </div>
        
        <div className="bg-toxic-neon/5 p-6 border-l border-toxic-neon/20">
          <h3 className="text-xl font-mono text-toxic-neon mb-4">Presale Benefits</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0 bg-toxic-neon/10 w-8 h-8 rounded-full flex items-center justify-center">
                <Coins className="w-4 h-4 text-toxic-neon" />
              </div>
              <div>
                <h4 className="text-white font-mono mb-1">Economic Pioneer Status</h4>
                <p className="text-white/70 text-sm">Early adopters receive special pioneer status in the wasteland registry, providing enhanced trading privileges.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 bg-toxic-neon/10 w-8 h-8 rounded-full flex items-center justify-center">
                <Radiation className="w-4 h-4 text-toxic-neon" />
              </div>
              <div>
                <h4 className="text-white font-mono mb-1">Resource Allocation Rights</h4>
                <p className="text-white/70 text-sm">RD token holders vote on crucial resource allocation and trade route governance throughout wasteland territories.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 bg-toxic-neon/10 w-8 h-8 rounded-full flex items-center justify-center">
                <CornerRightDown className="w-4 h-4 text-toxic-neon" />
              </div>
              <div>
                <h4 className="text-white font-mono mb-1">Supply Chain Access</h4>
                <p className="text-white/70 text-sm">Privileged access to scarce goods and wasteland supply chains before they're available in general settlement markets.</p>
              </div>
            </li>
          </ul>
          
          <div className="mt-6 p-3 bg-apocalypse-red/10 border border-apocalypse-red/30 rounded-lg">
            <p className="text-white/80 text-sm font-mono">
              <span className="text-apocalypse-red font-bold">PRESALE WARNING:</span> The nuclear wasteland economy is still stabilizing. Early adopters face higher risks but stand to gain the most when full trade networks are established.
            </p>
          </div>
        </div>
      </div>
    </ToxicCard>
  );
};
