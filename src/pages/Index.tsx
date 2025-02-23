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

        {/* Test Market Interest */}
        <section className="py-24 relative">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#98FF98] to-[#98FF98]">
                Test Market Interest, Then Launch With Confidence
              </h2>
              <p className="text-xl text-white/70 mb-12">
                Collect soft commitments from interested supporters and build your launch community before investing in development.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-black/30 border border-white/10 p-6">
                <div className="mb-4">
                  <CircleDollarSign className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-white/70">
                  Supporters indicate their potential investment amount through soft pledges with a voting fee to RD. Test your project's market interest verified without requiring immediate investment.
                </p>
              </Card>

              <Card className="bg-black/30 border border-white/10 p-6">
                <div className="mb-4">
                  <Share2 className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-white/70">
                  Connect directly with interested supporters and track their soft commitment amounts. Build reports that provide concrete proof of market interest.
                </p>
              </Card>

              <Card className="bg-black/30 border border-white/10 p-6">
                <div className="mb-4">
                  <BadgeDollarSign className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-white/70">
                  Once you hit your soft commitment target, re-engage supporters for their pledged investments. Launch with confidence knowing you have verified interest and committed capital.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How Soft Commitments & Voting Work */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#98FF98] to-[#98FF98]">
                How Soft Commitments & Voting Work
              </h2>
              <p className="text-xl text-white/70 mb-12">
                Our unique two-step process helps you validate market interest and build a community of committed supporters before launch.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/30 border border-white/10 p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Initial Voting</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "$1 Voting Fee: Small fee to ensure genuine interest and prevent spam",
                    "Soft Commitment Amount: Supporters indicate how much they'd potentially invest",
                    "No Lock-in: Soft commitments are non-binding to encourage honest feedback"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70">
                      <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/30 border border-white/10 p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Launch Process</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Target Reached: Once your soft commitment goal is met, begin the launch phase",
                    "Direct Communication: Re-engage supporters who showed interest through voting",
                    "Convert Interest: Turn soft commitments into actual investments"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70">
                      <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* NFT Contract Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -top-1/4 -right-1/4" />
          </div>
          <div className="container px-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-block mb-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/20 bg-blue-500/5 backdrop-blur">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Smart Contract NFT</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300">
                NFT-Backed Agreement
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Your proposal is minted as an NFT, representing a binding smart contract with the community
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-blue-950/40 border border-blue-400/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Community Agreement NFT</h3>
                  <p className="text-white/70 mb-4">
                    When you submit your proposal, a unique NFT is minted representing your commitment to allocate 2.5% of your project's tokens to the DAO community.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Immutable smart contract agreement",
                      "Automated token distribution mechanism",
                      "Transparent on-chain verification",
                      "Permanent proof of commitment"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-white/70">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-400/20">
                  <h4 className="text-xl font-bold text-white mb-2">Token Distribution</h4>
                  <p className="text-white/70">
                    The 2.5% token allocation is automatically distributed to DAO members through the smart contract when your project launches, ensuring fairness and transparency.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-2xl opacity-50" />
                <div className="relative bg-blue-950/40 border border-blue-400/20 rounded-xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-blue-400/20 pb-4">
                      <span className="text-white/70">Token Allocation</span>
                      <span className="text-white font-bold">2.5%</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-blue-400/20 pb-4">
                      <span className="text-white/70">Distribution Method</span>
                      <span className="text-white font-bold">Automatic</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-blue-400/20 pb-4">
                      <span className="text-white/70">Contract Type</span>
                      <span className="text-white font-bold">ERC-721</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Verification</span>
                      <span className="text-white font-bold">On-chain</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Amplify Your Reach */}
        <section className="py-24 relative bg-black/50">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#98FF98] to-[#98FF98]">
                Amplify Your Reach
              </h2>
              <p className="text-xl text-white/70 mb-12">
                Get your project in front of thousands of potential supporters through our established channels.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-black/30 border border-white/10 p-6">
                <div className="mb-4">
                  <FileText className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-white/70">
                  Reach 1,500+ engaged subscribers through our curated newsletter. Each proposal gets dedicated coverage to maximize visibility.
                </p>
              </Card>

              <Card className="bg-black/30 border border-white/10 p-6">
                <div className="mb-4">
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-white/70">
                  Get exposure to our network of 2,500+ LinkedIn professionals. Your proposal will be shared with detailed insights.
                </p>
              </Card>

              <Card className="bg-black/30 border border-white/10 p-6">
                <div className="mb-4">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-white/70">
                  Present your project in our community calls and AMAs. Connect directly with potential supporters and get valuable feedback.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pre-Launch Solution */}
        <section className="py-24 relative bg-black/50">
          <div className="container px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Feeling Sidelined?</h3>
                <ul className="space-y-4">
                  {[
                    "Watching others launch tokens, NFTs, and DeFi platforms while your idea stays locked in your head",
                    "Launchpads demand steep fees and force commitments before proving interest",
                    "Social platforms drown out fresh voices, and traditional routes demand insider networks"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70">
                      <ChevronRight className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Our Pre-Launch Solution</h3>
                <ul className="space-y-4">
                  {[
                    "Create a proposal NFT that tests your token, NFT, DeFi, or AI project",
                    "Tap our network of 1,500+ newsletter subscribers and 2,500+ LinkedIn members",
                    "Gather soft commitments with $1 votes before investing in smart contracts"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70">
                      <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative to Equity */}
        <section className="py-24 relative">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#98FF98] to-[#98FF98]">
                Alternative to Equity
              </h2>
              <p className="text-xl text-white/70">
                Support early-stage Web3 innovation without the traditional equity model
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "No Dilution",
                  description: "Keep full ownership of your project while accessing capital and community support"
                },
                {
                  title: "Token Economics",
                  description: "Align incentives through token distributions and innovative reward mechanisms"
                },
                {
                  title: "Community Power",
                  description: "Leverage the power of decentralized communities for growth and adoption"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-black/30 border border-white/10 p-6 hover:border-green-400/20 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 relative bg-black/50">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#98FF98] to-[#98FF98]">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-white/70">
                Everything you need to know about the Resistance DAO
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: "What is Resistance DAO?",
                  answer: "Resistance DAO is a community-driven platform connecting Web3 innovators with early-stage capital and support."
                },
                {
                  question: "How do I submit a proposal?",
                  answer: "Simply mint a Resistance Proposal NFT for $25 and share your Web3 vision with our community."
                },
                {
                  question: "What types of projects are accepted?",
                  answer: "We welcome all Web3 projects including tokens, NFTs, DeFi platforms, and innovative blockchain applications."
                },
                {
                  question: "How does voting work?",
                  answer: "Community members can vote on proposals with a small fee to ensure genuine interest and prevent spam."
                }
              ].map((item, index) => (
                <Card key={index} className="bg-black/30 border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{item.question}</h3>
                  <p className="text-white/70">{item.answer}</p>
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
