
import { PartyPopper, Trophy, Gift, ShoppingBag, Medal, Star, DollarSign, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export const LedgerFrens = () => {
  const { setShowOnRamp } = useWalletConnection();

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
            Support Web3 Innovation—Join the LedgerFund DAO Presale
          </h2>

          {/* Community Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-500" />
              <span className="text-white/80">2,558 Community Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-teal-500" />
              <span className="text-white/80">1,545 Subscribers</span>
            </div>
          </div>

          {/* Presale CTA */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-teal-500/10 rounded-xl p-8 mb-8 backdrop-blur-sm border border-white/10">
            <h3 className="text-3xl font-bold text-white mb-4">LGR Token Presale: Your Gateway to Web3 Innovation</h3>
            <div className="space-y-4 mb-6">
              <p className="text-xl text-white/90">Early Access Price: $0.10 USD per LGR</p>
              <p className="text-lg text-white/80">
                Every LGR token holder gains exclusive benefits:
              </p>
              <ul className="text-white/80 space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                  <span>Priority access to mint proposal NFTs at discounted rates</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5 text-teal-500" />
                  <span>Voting power on community-driven Web3 proposals</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Rocket className="w-5 h-5 text-yellow-500" />
                  <span>Share in the success of funded Web3 projects</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => setShowOnRamp?.(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-6 text-xl"
            >
              <DollarSign className="w-6 h-6 mr-2" />
              Join LGR Presale Now
            </Button>
          </div>

          <p className="text-xl text-white/80">
            Your LGR tokens fuel the next generation of Web3 innovation
          </p>
          <p className="mt-4 text-lg text-white/70">
            Every presale contribution strengthens our ability to fund and launch groundbreaking Web3 projects through the LedgerFund DAO
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Investment Milestones</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <PartyPopper className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Early Access to Proposals</h4>
                  <p className="text-gray-300">
                    At $50K raised in LGR tokens, early supporters gain exclusive access to mint LedgerFren Proposals (LFP), testing and pitching Web3 projects to our community for $25.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Trophy className="w-8 h-8 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Community Voting Power</h4>
                  <p className="text-gray-300">
                    At $100K raised, our community elects a governance board to steer investment decisions, with LFP holders voting with $1 each.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Gift className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Exclusive Web3 Swag</h4>
                  <p className="text-gray-300">
                    At $150K raised, 150 random LFP minters or LGR token stakers receive exclusive Web3 merchandise—limited-edition digital art and apparel.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Rocket className="w-8 h-8 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Investment Proposals Open</h4>
                  <p className="text-gray-300">
                    At $250K raised, LFP holders can submit investment thesis proposals for Web3 projects, pledging LGR tokens to indicate interest.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <Medal className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Deal Scout Program</h4>
                  <p className="text-gray-300">
                    At $400K raised, launch our Deal Scout Program, rewarding community members who identify high-potential Web3 projects with LGR token bounties.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-4">
                <DollarSign className="w-8 h-8 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">First Web3 Investment</h4>
                  <p className="text-gray-300">
                    At $500K raised, complete our first Web3 project investment, inviting 5 random LFP holders to a virtual launch event with $1,000 in crypto rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">Why Now? Trump's Crypto Reforms (February 2025)</h3>
            <p className="text-white/70">
              With President Trump's 2025 crypto reforms—promising regulatory clarity, tax breaks for Web3 investments, and a pro-innovation stance—LedgerFund DAO is poised to lead. Recent articles highlight skyrocketing investor interest, token launches, and DeFi growth, making now the perfect moment to fund visionary projects through our community-driven model.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
