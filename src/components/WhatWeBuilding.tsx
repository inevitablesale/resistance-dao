
import { Coins, Wallet, BadgeCheck, UsersRound, GanttChartSquare, Building2 } from "lucide-react";

export const WhatWeBuilding = () => {
  return (
    <section className="py-16 relative">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6 text-center">
          LedgerFund Tokenomics
        </h2>
        
        <p className="text-xl text-white/80 mb-12 text-center max-w-3xl mx-auto">
          Our dual-token system combines liquidity provision with NFT-based governance, ensuring transparency, 
          stability, and alignment with long-term goals.
        </p>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* LGR Token Section */}
          <div className="space-y-8">
            <div className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Coins className="w-8 h-8 text-yellow-400" />
              <span>LGR Token (Liquidity)</span>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                <div className="mb-4">
                  <Wallet className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Liquidity Provision</h3>
                <p className="text-gray-300">
                  Provide liquidity to the protocol and earn rewards from platform fees and transactions.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                <div className="mb-4">
                  <UsersRound className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Platform Access</h3>
                <p className="text-gray-300">
                  Access platform features and participate in the tokenized accounting firm ecosystem.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                <div className="mb-4">
                  <BadgeCheck className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Reward Distribution</h3>
                <p className="text-gray-300">
                  Earn rewards from platform activities and contribute to the ecosystem's growth.
                </p>
              </div>
            </div>
          </div>

          {/* LP Token Section */}
          <div className="space-y-8">
            <div className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-teal-400" />
              <span>LP Token (Ownership)</span>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                <div className="mb-4">
                  <Coins className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Real Asset Backing</h3>
                <p className="text-gray-300">
                  Represents direct fractional ownership in acquired firms, with value tied to firm performance.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                <div className="mb-4">
                  <GanttChartSquare className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Structured Liquidity</h3>
                <p className="text-gray-300">
                  Annual redemption windows after 3-year lock-up period, ensuring stability while providing exit options.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                <div className="mb-4">
                  <Coins className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Profit Distribution</h3>
                <p className="text-gray-300">
                  Receive proportional distributions from firm profits, creating passive income streams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
