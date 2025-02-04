
import { Crown, Coins, Vote } from "lucide-react";

export const ReclaimControl = () => {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Reclaim What's Yours</h2>
          <p className="text-xl text-gray-300">
            It's time to rewrite the rules. LedgerFund is creating a system designed for accounting professionals, by accounting professionals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-[#8247E5]/20">
            <Crown className="w-8 h-8 text-[#8247E5] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Own the Value</h3>
            <p className="text-gray-300">
              Tokenized ownership rewards those who do the work.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-[#8247E5]/20">
            <Coins className="w-8 h-8 text-[#8247E5] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Share the Wealth</h3>
            <p className="text-gray-300">
              Dividends from firm profits go to the professionals, not outsiders.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-[#8247E5]/20">
            <Vote className="w-8 h-8 text-[#8247E5] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Make the Decisions</h3>
            <p className="text-gray-300">
              Every token holder has a voice in the future of the firm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
