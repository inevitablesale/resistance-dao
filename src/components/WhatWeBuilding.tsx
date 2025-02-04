
import { Tokens, Settings, Users } from "lucide-react";

export const WhatWeBuilding = () => {
  return (
    <section className="py-16 relative">
      <div className="container px-4">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">What We're Building</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-white/10">
            <div className="mb-4">
              <Tokens className="w-8 h-8 text-[#8247E5]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Tokenized Ownership</h3>
            <p className="text-gray-300">
              With LedgerToken (LGR), we enable professionals to own a stake in firms and earn dividends from firm profits.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-white/10">
            <div className="mb-4">
              <Settings className="w-8 h-8 text-[#8247E5]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Efficient Operations</h3>
            <p className="text-gray-300">
              Acquired firms transition to a centralized managed services model, unlocking growth and operational excellence.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-white/10">
            <div className="mb-4">
              <Users className="w-8 h-8 text-[#8247E5]" />
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
