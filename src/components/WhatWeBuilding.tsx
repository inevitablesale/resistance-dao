
import { Coins, Settings, Users } from "lucide-react";

export const WhatWeBuilding = () => {
  return (
    <section className="py-16 relative">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          What We're Building
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <div className="mb-4">
              <Coins className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Tokenized Ownership</h3>
            <p className="text-gray-300">
              With LedgerToken (LGR), we enable professionals to own a stake in firms and earn dividends from firm profits.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
            <div className="mb-4">
              <Settings className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Efficient Operations</h3>
            <p className="text-gray-300">
              Acquired firms transition to a centralized managed services model, unlocking growth and operational excellence.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <div className="mb-4">
              <Users className="w-8 h-8 text-yellow-400" />
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

