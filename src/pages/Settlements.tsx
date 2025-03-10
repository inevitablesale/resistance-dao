
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { Shield, Plus, Users, Zap } from "lucide-react";

type Settlement = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  creator: string;
  totalRaised: string;
  targetAmount: string;
  backerCount: number;
  progress: number;
  status: 'active' | 'completed' | 'failed';
};

export default function Settlements() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch settlement data from Party Protocol
    // For now, we'll use placeholder data
    setTimeout(() => {
      setSettlements([
        {
          id: "0x1234567890123456789012345678901234567890",
          name: "Decentralized Identity Protocol",
          description: "A protocol for self-sovereign identity management using zero-knowledge proofs",
          imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55",
          creator: "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2",
          totalRaised: "125.5",
          targetAmount: "500",
          backerCount: 12,
          progress: 25,
          status: 'active'
        },
        {
          id: "0x2345678901234567890123456789012345678901",
          name: "Wasteland Marketplace",
          description: "A decentralized marketplace for survivors to trade resources and skills",
          imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
          creator: "0x8c2B2b967923bC3EB4d9Bf5472EA017Ac644e5B3",
          totalRaised: "750",
          targetAmount: "1000",
          backerCount: 35,
          progress: 75,
          status: 'active'
        },
        {
          id: "0x3456789012345678901234567890123456789012",
          name: "Resistance Communication Network",
          description: "A secure, censorship-resistant communication network for wasteland settlements",
          imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
          creator: "0x9d3C3b967923bC3EB4d9Bf5472EA017Ac644e6C4",
          totalRaised: "2000",
          targetAmount: "2000",
          backerCount: 64,
          progress: 100,
          status: 'completed'
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Settlements</h1>
              <p className="text-gray-400 max-w-2xl">
                Discover and support settlements being built in the wasteland. Sentinels can contribute ETH to fund promising projects.
              </p>
            </div>
            <Link to="/thesis">
              <Button className="bg-blue-500 hover:bg-blue-600 gap-2">
                <Plus className="w-4 h-4" />
                Create Settlement
              </Button>
            </Link>
          </div>
          
          {/* Settlement Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settlements.map((settlement) => (
                <Link 
                  key={settlement.id} 
                  to={`/settlements/${settlement.id}`}
                  className="bg-[#111] rounded-xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-colors"
                >
                  <div 
                    className="h-48 bg-center bg-cover" 
                    style={{ backgroundImage: `url(${settlement.imageUrl})` }}
                  />
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold">{settlement.name}</h2>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        settlement.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : settlement.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {settlement.status === 'active' 
                          ? 'Active' 
                          : settlement.status === 'completed' 
                            ? 'Funded' 
                            : 'Failed'}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm line-clamp-2">{settlement.description}</p>
                    
                    <div className="bg-black/50 h-2 w-full rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ width: `${settlement.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{settlement.totalRaised} ETH</span>
                      <span>{settlement.progress}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>{settlement.backerCount}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span>Join</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
