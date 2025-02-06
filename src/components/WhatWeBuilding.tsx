
import { Coins, Settings, Users } from "lucide-react";

export const WhatWeBuilding = () => {
  return (
    <section className="py-16 relative">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-200 to-blue-400 mb-12 text-center">
          What We're Building
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <div className="mb-4">
              <Coins className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Tokenized Ownership</h3>
            <p className="text-gray-300">
              With LedgerToken (LGR), we enable professionals to own a stake in firms and earn dividends from firm profits.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <div className="mb-4">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Efficient Operations</h3>
            <p className="text-gray-300">
              Acquired firms transition to a centralized managed services model, unlocking growth and operational excellence.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <div className="mb-4">
              <Users className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Community Governance</h3>
            <p className="text-gray-300">
              LGR holders participate in decisions that shape the future of our community's acquired firms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
