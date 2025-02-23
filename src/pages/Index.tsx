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
        <section className="py-16 relative">
          <div className="container px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300">
                Ecosystem Economy
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Simple, transparent economics for a thriving Web3 ecosystem
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Creators Section */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">For Creators</h3>
                <div className="grid gap-6">
                  {[
                    { icon: Coins, label: "Proposal Mint Cost", value: "25 RD", description: "One-time fee to submit your Web3 proposal" },
                    { icon: Percent, label: "DAO Agreement", value: "2.5%", description: "Token allocation for DAO members" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                      <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur border border-white/10 group-hover:border-blue-400/50 transition-all duration-300">
                        <stat.icon className="w-8 h-8 text-blue-400 mb-4" />
                        <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                        <div className="text-white/60 mb-2">{stat.label}</div>
                        <div className="text-sm text-white/40">{stat.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Members Section */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">For Members</h3>
                <div className="grid gap-6">
                  {[
                    { icon: CreditCard, label: "Access Card NFT", value: "$50", description: "One-time access pass to join the community" },
                    { icon: Zap, label: "Voting Fee", value: "1 RD", description: "Per-vote fee to ensure genuine interest" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                      <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur border border-white/10 group-hover:border-blue-400/50 transition-all duration-300">
                        <stat.icon className="w-8 h-8 text-blue-400 mb-4" />
                        <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                        <div className="text-white/60 mb-2">{stat.label}</div>
                        <div className="text-sm text-white/40">{stat.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Milestones */}
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
