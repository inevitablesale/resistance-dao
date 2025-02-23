
import { motion } from "framer-motion";
import { Rocket, Coins, Users, Share2, Zap, Check, ChevronRight, Building2, FileText, Percent, BadgeDollarSign, CircleDollarSign, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { AccessCoverOverlay } from "@/components/AccessCoverOverlay";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <AccessCoverOverlay />
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl -top-48 -left-24 animate-pulse" />
            <div className="absolute w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-3xl -bottom-48 -right-24 animate-pulse" />
          </div>
          
          <div className="container px-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 mb-6">
                Launch Your Web3 Idea
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Got a Web3 vision—token, NFT, DeFi, AI, or beyond? Don't let it die in your head. With our Resistance Proposal Factory, you mint a proposal NFT, pitch your idea to 1,500+ subscribers and 2,500+ LinkedIn members, and collect soft commitments to gauge real interest. No coding, no gatekeepers, no upfront fortune required.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/thesis')}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Your Proposal
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/proposals')}
                  className="border-blue-400/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  View Active Proposals
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ecosystem Economy Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -top-1/2 -left-1/4" />
            <div className="absolute w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[100px] -bottom-1/4 -right-1/4" />
          </div>

          <div className="container px-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <div className="inline-block mb-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/20 bg-blue-500/5 backdrop-blur">
                  <CircleDollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Transparent Economics</span>
                </div>
              </div>
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300">
                Ecosystem Economy
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Simple, transparent economics for a thriving Web3 ecosystem
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Creators Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/5 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative h-full p-8 rounded-2xl border border-blue-300/10 bg-gradient-to-br from-blue-900/40 via-blue-900/20 to-blue-900/30 backdrop-blur">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">For Creators</h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      { icon: Coins, label: "Proposal Mint Cost", value: "25 RD", description: "One-time fee to submit your Web3 proposal" },
                      { icon: Percent, label: "DAO Agreement", value: "2.5%", description: "Token allocation for DAO members" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-blue-950/40 border border-blue-400/10 hover:border-blue-400/30 transition-colors">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                          <item.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                          <div className="text-blue-200 font-medium mb-1">{item.label}</div>
                          <div className="text-sm text-blue-300/60">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Members Section */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-400/5 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative h-full p-8 rounded-2xl border border-blue-300/10 bg-gradient-to-br from-blue-900/40 via-blue-900/20 to-blue-900/30 backdrop-blur">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">For Members</h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      { icon: CreditCard, label: "Access Card NFT", value: "50 USDC", description: "One-time access pass to join the community" },
                      { icon: Zap, label: "Voting Fee", value: "1 RD", description: "Per-vote fee to ensure genuine interest" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-blue-950/40 border border-blue-400/10 hover:border-blue-400/30 transition-colors">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                          <item.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                          <div className="text-blue-200 font-medium mb-1">{item.label}</div>
                          <div className="text-sm text-blue-300/60">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Investment Milestones Section */}
        <section className="py-16 relative">
          <div className="container px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Investment Milestones</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Early Access to Proposals",
                  description: "At $50K raised in LGR tokens, early supporters gain exclusive access to mint Resistance Proposals, testing and pitching Web3 projects to our community.",
                  amount: "$50K"
                },
                {
                  title: "Community Voting Power",
                  description: "At $100K raised, our community elects a governance board to steer investment decisions, with NFT holders voting with RD tokens.",
                  amount: "$100K"
                },
                {
                  title: "Exclusive Web3 Swag",
                  description: "At $150K raised, 150 random NFT minters or LGR token stakers receive exclusive Web3 merchandise—limited-edition digital art and apparel.",
                  amount: "$150K"
                },
                {
                  title: "Investment Proposals Open",
                  description: "At $250K raised, NFT holders can submit investment thesis proposals for Web3 projects, pledging LGR tokens to indicate interest.",
                  amount: "$250K"
                },
                {
                  title: "Deal Scout Program",
                  description: "At $400K raised, launch our Deal Scout Program, rewarding community members who identify high-potential Web3 projects with LGR token bounties.",
                  amount: "$400K"
                },
                {
                  title: "First Web3 Investment",
                  description: "At $500K raised, complete our first Web3 project investment, inviting 5 random NFT holders to a virtual launch event with crypto rewards.",
                  amount: "$500K"
                }
              ].map((milestone, index) => (
                <Card key={index} className="bg-black/30 border-white/10 p-6 hover:border-blue-400/50 transition-all duration-300">
                  <div className="text-blue-400 font-bold text-2xl mb-4">{milestone.amount}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                  <p className="text-white/70">{milestone.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
