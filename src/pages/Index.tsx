import { motion } from "framer-motion";
import { Rocket, DollarSign, Users, Share2, Shield, Zap, Check, ChevronRight, Building2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function Index() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-3xl -top-48 -left-24 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -bottom-48 -right-24 animate-pulse" />
        </div>
        
        <div className="container px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-500 mb-6">
              Launch Your Web3 Idea for $25
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Got a Web3 vision—token, NFT, DeFi, AI, or beyond? Don't let it die in your head. With our Resistance Proposal Factory, you mint a proposal NFT, pitch your idea to 1,500+ subscribers and 2,500+ LinkedIn members, and collect soft commitments to gauge real interest. No coding, no gatekeepers, no upfront fortune required.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/thesis')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Mint Your Proposal NFT
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/proposals')}
                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500"
              >
                <Share2 className="w-5 h-5 mr-2" />
                View Active Proposals
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: DollarSign, label: "Proposal Mint Cost", value: "$25" },
              { icon: Users, label: "Community Members", value: "2,558+" },
              { icon: Share2, label: "Newsletter Subscribers", value: "1,545+" },
              { icon: Zap, label: "Voting Fee", value: "$1" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-teal-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur border border-white/10 group-hover:border-yellow-500/50 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-yellow-500 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/60">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-500">
                  The Resistance is Back
                </h2>
                <p className="text-xl text-white/80">
                  We started as a web3 group connecting early stage entrepreneurs with early stage capital. With the crypto winter, we went on to work in the alternative investments space. However, Resistance DAO is back.
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-teal-500/10 rounded-2xl blur-xl" />
              <img 
                src="https://media.licdn.com/dms/image/v2/C5622AQF4qrRtwMVNIQ/feedshare-shrink_800/feedshare-shrink_800/0/1658061466739?e=1743033600&v=beta&t=cxc5SGWFNT1lRXR1TKuBaFJrNlN05NaUmIGQvPrmrqA"
                alt="Resistance DAO at Metaverse Summit Paris 2022"
                className="relative rounded-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/90 text-sm">Metaverse Summit Paris 2022</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Proposal Section - Redesigned */}
      <section className="py-16 relative">
        <div className="container px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-yellow-500">
              Create Your Project Proposal
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Share your Web3 vision with our community and gather support through a streamlined proposal process.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 via-yellow-500/5 to-transparent rounded-3xl blur-xl" />
            <div className="relative grid grid-cols-12 gap-6 p-8">
              <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Mint Your Proposal</h3>
                      <p className="text-white/70">Create a Resistance Proposal NFT for just $25 and share your vision</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Connect & Grow</h3>
                      <p className="text-white/70">Reach 1,500+ subscribers and 2,500+ LinkedIn members</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-6 h-6 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Launch With Confidence</h3>
                      <p className="text-white/70">Validate interest through soft commitments before full launch</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8 relative">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-yellow-500/20" />
                  <div className="relative h-full flex items-center justify-center p-8">
                    <div className="space-y-6 text-center">
                      <h3 className="text-2xl font-bold">Ready to Share Your Vision?</h3>
                      <p className="text-lg text-white/80 max-w-md mx-auto">
                        Start your Web3 journey today by creating a proposal and connecting with our community of builders and investors.
                      </p>
                      <Button
                        size="lg"
                        onClick={() => navigate('/thesis')}
                        className="bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-black font-semibold px-8"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Start Your Proposal
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Detailed Soft Commitments & Voting Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
              How Soft Commitments & Voting Work
            </h2>
            <p className="text-xl text-white mb-8">
              Our unique two-step process helps you validate market interest and build a community of committed supporters before launch.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card className="bg-black/30 border-white/10 p-8 hover:border-yellow-500/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-yellow-500" />
                </div>
                Initial Voting
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div className="text-white">
                    <span className="font-semibold">$1 Voting Fee:</span> Small fee to ensure genuine interest and prevent spam
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div className="text-white">
                    <span className="font-semibold">Soft Commitment Amount:</span> Supporters indicate how much they'd potentially invest
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div className="text-white">
                    <span className="font-semibold">No Lock-in:</span> Soft commitments are non-binding to encourage honest feedback
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="bg-black/30 border-white/10 p-8 hover:border-teal-500/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-teal-500" />
                </div>
                Launch Process
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                  <div className="text-white">
                    <span className="font-semibold">Target Reached:</span> Once your soft commitment goal is met, begin the launch phase
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                  <div className="text-white">
                    <span className="font-semibold">Direct Communication:</span> Re-engage supporters who showed interest through voting
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                  <div className="text-white">
                    <span className="font-semibold">Convert Interest:</span> Turn soft commitments into actual investments
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* NEW: Community Promotion Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
              Amplify Your Reach
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get your project in front of thousands of potential supporters through our established channels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-black/30 border-white/10 p-6 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Newsletter Feature</h3>
              </div>
              <p className="text-white/70">
                Reach 1,500+ engaged subscribers through our curated newsletter. Each proposal gets dedicated coverage to maximize visibility.
              </p>
            </Card>

            <Card className="bg-black/30 border-white/10 p-6 hover:border-teal-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="text-xl font-semibold">LinkedIn Network</h3>
              </div>
              <p className="text-white/70">
                Get exposure to our network of 2,500+ LinkedIn professionals. Your proposal will be shared with detailed insights.
              </p>
            </Card>

            <Card className="bg-black/30 border-white/10 p-6 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Community Events</h3>
              </div>
              <p className="text-white/70">
                Present your project in our community calls and AMAs. Connect directly with potential supporters and get valuable feedback.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Soft Commitments Process Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
              Test Market Interest, Then Launch With Confidence
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Collect soft commitments from interested supporters and build your launch community before investing in development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black/30 border-white/10 p-6 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Collect Commitments</h3>
              </div>
              <p className="text-white/70">
                Supporters indicate their potential investment amount through soft commitments, with just a $1 voting fee to show genuine interest. Gauge real market demand without requiring immediate investment.
              </p>
            </Card>

            <Card className="bg-black/30 border-white/10 p-6 hover:border-teal-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="text-xl font-semibold">Build Community</h3>
              </div>
              <p className="text-white/70">
                Connect directly with interested supporters and track their soft commitment amounts. Build relationships with potential investors before launch.
              </p>
            </Card>

            <Card className="bg-black/30 border-white/10 p-6 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Launch With Backing</h3>
              </div>
              <p className="text-white/70">
                Once you hit your soft commitment target, re-engage supporters for their pledged investments. Launch with confidence knowing you have verified interest and committed capital.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Feeling Sidelined?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-1"><ChevronRight className="w-5 h-5 text-yellow-500" /></div>
                  Watching others launch tokens, NFTs, and DeFi platforms while your idea stays locked in your head
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-1"><ChevronRight className="w-5 h-5 text-yellow-500" /></div>
                  Launchpads demand steep fees and force commitments before proving interest
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-1"><ChevronRight className="w-5 h-5 text-yellow-500" /></div>
                  Social platforms drown out fresh voices, and traditional routes demand insider networks
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Our Pre-Launch Solution</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-1"><Check className="w-5 h-5 text-teal-500" /></div>
                  Start with just $25—create a proposal NFT that tests your token, NFT, DeFi, or AI project
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-1"><Check className="w-5 h-5 text-teal-500" /></div>
                  Tap our network of 1,500+ newsletter subscribers and 2,500+ LinkedIn members
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-1"><Check className="w-5 h-5 text-teal-500" /></div>
                  Gather soft commitments with $1 votes before investing in smart contracts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Web3-Native Fundraising Section - Redesigned */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl -top-1/2 -right-1/4 animate-pulse" />
          <div className="absolute w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl -bottom-1/4 -left-1/4 animate-pulse" />
        </div>
        
        <div className="container px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-500">
                Supporting the Future of Web3
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Resistance DAO is more than a platform—we're a Web3-native project using utility-driven tokenomics to build the future of decentralized investment.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-teal-500/10 rounded-3xl blur-xl" />
              <div className="relative rounded-3xl border border-white/10 bg-black/40 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto">
                      <DollarSign className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-semibold">Proposal Minting</h3>
                    <p className="text-white/70">Each $25 proposal mint strengthens our treasury and supports platform development</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-teal-500" />
                    </div>
                    <h3 className="text-xl font-semibold">Community Voting</h3>
                    <p className="text-white/70">$1 voting fees contribute directly to DAO growth and governance</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto">
                      <Share2 className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-semibold">Shared Success</h3>
                    <p className="text-white/70">Your participation helps build the infrastructure for decentralized investment</p>
                  </motion.div>
                </div>

                <div className="mt-12 text-center">
                  <p className="text-lg text-white/80 italic max-w-3xl mx-auto">
                    By participating in Resistance DAO, you're not just pitching or voting on projects—you're helping build the future of decentralized investment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presale Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              LGR Token Presale: Your Gateway to Web3 Innovation
            </h2>
            <p className="text-2xl text-yellow-500 mb-8">Early Access Price: $0.10 USD per LGR</p>
            
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Every LGR token holder gains exclusive benefits:</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-teal-500" />
                  Priority access to mint proposal NFTs at discounted rates
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-teal-500" />
                  Voting power on community-driven Web3 proposals
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-teal-500" />
                  Share in the success of funded Web3 projects
                </li>
              </ul>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
            >
              Join LGR Presale Now
            </Button>
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
                description: "At $50K raised in LGR tokens, early supporters gain exclusive access to mint Resistance Proposals, testing and pitching Web3 projects to our community for $25.",
                amount: "$50K"
              },
              {
                title: "Community Voting Power",
                description: "At $100K raised, our community elects a governance board to steer investment decisions, with NFT holders voting with $1 each.",
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
                description: "At $500K raised, complete our first Web3 project investment, inviting 5 random NFT holders to a virtual launch event with $1,000 in crypto rewards.",
                amount: "$500K"
              }
            ].map((milestone, index) => (
              <Card key={index} className="bg-black/30 border-white/10 p-6 hover:border-yellow-500/50 transition-all duration-300">
                <div className="text-yellow-500 font-bold text-2xl mb-2">{milestone.amount}</div>
                <h3 className="text-xl font-semibold text
