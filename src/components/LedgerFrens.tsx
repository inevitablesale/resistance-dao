
import { PartyPopper, Trophy, Rocket } from "lucide-react";

export const LedgerFrens = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse -top-32 -left-32" />
        <div className="absolute w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse -bottom-32 -right-32" />
      </div>

      <div className="container px-4 relative">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
            The Ultimate Launch Party
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join an exclusive fellowship of early adopters and visionaries in the accounting revolution!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <PartyPopper className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Early Minting Bonus</h3>
            <p className="text-gray-300">
              LedgerFrens NFTs will be minted after reaching the first $50,000 milestone (10% of raise), rewarding early supporters.
            </p>
          </div>

          <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Trophy className="w-10 h-10 text-teal-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Governance Power</h3>
            <p className="text-gray-300">
              First 500 holders will have exclusive voting rights on the DAO governance board, shaping the future of decentralized accounting.
            </p>
          </div>

          <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Rocket className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Guaranteed Membership</h3>
            <p className="text-gray-300">
              First 1,000 holders investing $250+ during presale secure guaranteed membership to an ultra-exclusive fellowship.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

