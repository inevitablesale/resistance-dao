import { motion } from "framer-motion";
import { 
  Rocket, 
  Coins, 
  Users, 
  Share2, 
  Check, 
  ChevronRight, 
  Building2, 
  CircleDollarSign,
  Scale,
  FileText,
  ChevronRight as ArrowIcon,
  Clock,
  Target,
  Wallet,
  RefreshCw,
  Radiation,
  Skull,
  Zap,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardDescription, ToxicCardFooter } from "@/components/ui/toxic-card";
import { Progress } from "@/components/ui/progress";
import { ToxicProgress } from "@/components/ui/toxic-progress";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { useProposalStats } from "@/hooks/useProposalStats";
import { BuyRDTokens } from "@/components/BuyRDTokens";
import { FACTORY_ADDRESS, RD_TOKEN_ADDRESS } from "@/lib/constants";
import { DrippingSlime, ToxicPuddle } from "@/components/ui/dripping-slime";
import { ToxicBadge } from "@/components/ui/toxic-badge";

const Index = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: isLoadingStats } = useProposalStats();
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <DrippingSlime position="top" dripsCount={15} />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -bottom-48 -right-24" />
        </div>
        
        <div className="container px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Network Status and Title */}
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm mb-4 font-mono">
                <span className="w-2 h-2 bg-toxic-neon rounded-full animate-pulse" />
                Network Status: Active
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-mono mb-6 text-toxic-neon toxic-glow">
                DeFi-Powered Launch Platform
              </h1>

              {/* Metrics Cards */}
              <div className="flex gap-4 mb-8">
                <div className="bg-toxic-dark/70 border border-toxic-neon/20 rounded-lg p-4 flex-1 relative overflow-hidden">
                  <div className="scanline"></div>
                  <div className="text-toxic-neon text-sm mb-1">Total Hodlers</div>
                  <div className="font-mono text-2xl text-white">821</div>
                </div>
                <div className="bg-toxic-dark/70 border border-toxic-neon/20 rounded-lg p-4 flex-1 relative overflow-hidden">
                  <div className="scanline"></div>
                  <div className="text-toxic-neon text-sm mb-1">Community</div>
                  <div className="font-mono text-2xl text-white">2.5K</div>
                </div>
                <div className="bg-toxic-dark/70 border border-toxic-neon/20 rounded-lg p-4 flex-1 relative overflow-hidden">
                  <div className="scanline"></div>
                  <div className="text-toxic-neon text-sm mb-1">Newsletter</div>
                  <div className="font-mono text-2xl text-white">2.7K</div>
                </div>
              </div>
              
              {/* Add Buy RD Tokens component here */}
              <div className="relative mb-8">
                <BuyRDTokens />
                <ToxicPuddle className="absolute -bottom-2 -right-10" />
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <ToxicButton 
                  size="lg"
                  onClick={() => navigate('/thesis')}
                  variant="glowing"
                >
                  <Radiation className="w-5 h-5 mr-2" />
                  Add Project
                </ToxicButton>
                <ToxicButton 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/proposals')}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  View Projects
                </ToxicButton>
              </div>
            </div>

            <div className="mt-12 bg-toxic-dark/40 border border-toxic-neon/20 rounded-xl p-6 relative">
              <div className="scanline"></div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-mono text-toxic-neon">Live Activity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-toxic-muted">
                    <div className="w-2 h-2 bg-toxic-neon rounded-full animate-pulse" />
                    Real-time Updates
                  </div>
                  <ToxicButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </ToxicButton>
                </div>
              </div>
              <div className="space-y-4">
                {isLoadingStats ? (
                  <div className="animate-pulse">Loading activities...</div>
                ) : (
                  stats?.recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-toxic-neon/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'vote' ? 'bg-toxic-neon' :
                          activity.type === 'create' ? 'bg-toxic-muted' : 'bg-yellow-500'
                        }`} />
                        <span className="text-white/70">
                          {activity.type === 'vote' ? 'New Commitment' :
                           activity.type === 'create' ? 'Proposal Launched' :
                           'Target Reached'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-toxic-neon">
                          {activity.type === 'vote' || activity.type === 'complete' 
                            ? formatCurrency(Number(activity.amount))
                            : `#${activity.proposalId}`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <ToxicCard className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-toxic-neon/10">
                    <CircleDollarSign className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <div>
                    <div className="text-toxic-muted text-sm">Total Soft Commitments</div>
                    <div className="text-2xl font-semibold text-white">
                      {isLoadingStats ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        formatCurrency(stats?.totalLockedValue || 0)
                      )}
                    </div>
                  </div>
                </div>
              </ToxicCard>

              <ToxicCard className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-toxic-neon/10">
                    <Users className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <div>
                    <div className="text-toxic-muted text-sm">Total Participants</div>
                    <div className="text-2xl font-semibold text-white">
                      {isLoadingStats ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        formatNumber(stats?.totalHolders || 0)
                      )}
                    </div>
                  </div>
                </div>
              </ToxicCard>

              <ToxicCard className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-toxic-neon/10">
                    <Scale className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <div>
                    <div className="text-toxic-muted text-sm">Active Proposals</div>
                    <div className="text-2xl font-semibold text-white">
                      {isLoadingStats ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        formatNumber(stats?.activeProposals || 0)
                      )}
                    </div>
                  </div>
                </div>
              </ToxicCard>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative radiation-bg">
        <DrippingSlime position="both" dripsCount={6} className="absolute inset-x-0 h-full" />
        <div className="container px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-toxic-neon/20 bg-toxic-dark/40 text-toxic-neon mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">3-Step Process</span>
            </div>
            <h2 className="text-3xl font-bold font-mono mb-4 text-toxic-neon toxic-glow">
              Launch Protocol
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ToxicCard className="relative group">
              <ToxicCardContent>
                <Target className="w-8 h-8 text-toxic-neon mb-4" />
                <h3 className="text-lg font-mono text-toxic-neon mb-2">1. Market Testing</h3>
                <p className="text-white/70 relative z-10">
                  Submit proposal and collect soft commitments with minimal risk. Smart contracts ensure transparent voting and commitment tracking.
                </p>
                <div className="absolute bottom-6 right-6 text-toxic-neon/20 group-hover:text-toxic-neon/40 transition-colors">
                  <ArrowIcon className="w-6 h-6" />
                </div>
              </ToxicCardContent>
            </ToxicCard>

            <ToxicCard className="relative group">
              <ToxicCardContent>
                <Share2 className="w-8 h-8 text-toxic-muted mb-4" />
                <h3 className="text-lg font-mono text-toxic-neon mb-2">2. Community Building</h3>
                <p className="text-white/70 relative z-10">
                  Connect with supporters and track engagement metrics. Build proof of market interest through on-chain analytics.
                </p>
                <div className="absolute bottom-6 right-6 text-toxic-neon/20 group-hover:text-toxic-neon/40 transition-colors">
                  <ArrowIcon className="w-6 h-6" />
                </div>
              </ToxicCardContent>
            </ToxicCard>

            <ToxicCard className="relative group">
              <ToxicCardContent>
                <Wallet className="w-8 h-8 text-toxic-muted mb-4" />
                <h3 className="text-lg font-mono text-toxic-neon mb-2">3. Token Launch</h3>
                <p className="text-white/70 relative z-10">
                  Convert soft commitments to investment when targets are met. Automated distribution through smart contract execution.
                </p>
                <div className="absolute bottom-6 right-6 text-toxic-neon/20 group-hover:text-toxic-neon/40 transition-colors">
                  <ArrowIcon className="w-6 h-6" />
                </div>
              </ToxicCardContent>
            </ToxicCard>
          </div>
        </div>
      </section>

      {/* Keep the rest of the sections, updating styling to match the toxic theme */}
      <section className="py-24 relative radiation-bg">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-toxic-neon toxic-glow">
              Test Market Interest, Then Launch With Confidence
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Collect soft commitments from interested supporters and build your launch community before investing in development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ToxicCard>
              <ToxicCardContent>
                <div className="mb-4">
                  <CircleDollarSign className="w-8 h-8 text-toxic-neon" />
                </div>
                <p className="text-white/70">
                  Supporters indicate their potential investment amount through soft pledges with a voting fee to RD. Test your project's market interest verified without requiring immediate investment.
                </p>
              </ToxicCardContent>
            </ToxicCard>

            <ToxicCard>
              <ToxicCardContent>
                <div className="mb-4">
                  <Share2 className="w-8 h-8 text-toxic-neon" />
                </div>
                <p className="text-white/70">
                  Connect directly with interested supporters and track their soft commitment amounts. Build reports that provide concrete proof of market interest.
                </p>
              </ToxicCardContent>
            </ToxicCard>

            <ToxicCard>
              <ToxicCardContent>
                <div className="mb-4">
                  <CircleDollarSign className="w-8 h-8 text-toxic-neon" />
                </div>
                <p className="text-white/70">
                  Once you hit your soft commitment target, re-engage supporters for their pledged investments. Launch with confidence knowing you have verified interest and committed capital.
                </p>
              </ToxicCardContent>
            </ToxicCard>
          </div>
        </div>
      </section>

      {/* Keep remaining sections with updated toxic theme styling */}
      <section className="py-24 relative overflow-hidden radiation-bg">
        <ToxicPuddle className="absolute bottom-20 left-1/3" />
        <ToxicPuddle className="absolute bottom-40 right-1/4" />
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-toxic-neon toxic-glow">
              How Soft Commitments & Voting Work
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Our unique two-step process helps you validate market interest and build a community of committed supporters before launch.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ToxicCard>
              <ToxicCardContent>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-toxic-neon/10 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <h3 className="text-xl font-bold text-toxic-neon">Initial Voting</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "$1 Voting Fee: Small fee to ensure genuine interest and prevent spam",
                    "Soft Commitment Amount: Supporters indicate how much they'd potentially invest",
                    "No Lock-in: Soft commitments are non-binding to encourage honest feedback"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70">
                      <Check className="w-5 h-5 text-toxic-neon mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ToxicCardContent>
            </ToxicCard>

            <ToxicCard>
              <ToxicCardContent>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-toxic-neon/10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <h3 className="text-xl font-bold text-toxic-neon">Launch Process</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Target Reached: Once your soft commitment goal is met, begin the launch phase",
                    "Direct Communication: Re-engage supporters who showed interest through voting",
                    "Convert Interest: Turn soft commitments into actual investments"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70">
                      <Check className="w-5 h-5 text-toxic-neon mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ToxicCardContent>
            </ToxicCard>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden radiation-bg">
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] bg-toxic-neon/10 rounded-full blur-[100px] -top-1/4 -right-1/4" />
        </div>
        <div className="container px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-toxic-neon/20 bg-toxic-dark/40 backdrop-blur">
                <FileText className="w-5 h-5 text-toxic-neon" />
                <span className="text-sm font-medium text-toxic-neon">Smart Contract NFT</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-toxic-neon toxic-glow">
              NFT-Backed Agreement
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Your proposal is minted as an NFT, representing a binding smart contract with the community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <ToxicCard className="relative">
                <ToxicCardContent>
                  <h3 className="text-2xl font-bold text-toxic-neon mb-4">Community Agreement NFT</h3>
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
                        <Check className="w-5 h-5 text-toxic-neon flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </ToxicCardContent>
              </ToxicCard>
              <div className="bg-toxic-dark/40 rounded-xl p-6 border border-toxic-neon/20">
                <h4 className="text-xl font-bold text-toxic-neon mb-2">Token Distribution</h4>
                <p className="text-white/70">
                  The 2.5% token allocation is automatically distributed to DAO members through the smart contract when your project launches, ensuring fairness and transparency.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-toxic-neon/20 rounded-2xl blur-2xl opacity-50" />
              <ToxicCard className="relative">
                <ToxicCardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-toxic-neon/20 pb-4">
                      <span className="text-white/70">Token Allocation</span>
                      <span className="text-toxic-neon font-bold">2.5%</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-toxic-neon/20 pb-4">
                      <span className="text-white/70">Distribution Method</span>
                      <span className="text-toxic-neon font-bold">Automatic</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-toxic-neon/20 pb-4">
                      <span className="text-white/70">Contract Type</span>
                      <span className="text-toxic-neon font-bold">ERC-721</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Verification</span>
                      <span className="text-toxic-neon font-bold">On-chain</span>
                    </div>
                  </div>
                </ToxicCardContent>
              </ToxicCard>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative radiation-bg">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-toxic-neon toxic-glow">
              Amplify Your Reach
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Get your project in front of thousands of potential supporters through our established channels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ToxicCard>
              <ToxicCardContent>
                <div className="mb-4">
                  <CircleDollarSign className="w-8 h-8 text-toxic-neon" />
                </div>
                <p className="text-white/70">
                  Reach 1,500+ engaged subscribers through our curated newsletter. Each proposal gets dedicated coverage to maximize visibility.
                </p>
              </ToxicCardContent>
            </ToxicCard>

            <ToxicCard>
              <ToxicCardContent>
                <div className="mb-4">
                  <Building2 className="w-8 h-8 text-toxic-neon" />
                </div>
                <p className="text-white/70">
                  Get exposure to our network of 2,500+ LinkedIn professionals. Your proposal will be shared with detailed insights.
                </p>
              </ToxicCardContent>
            </ToxicCard>

            <ToxicCard>
              <ToxicCardContent>
                <div className="mb-4">
                  <Users className="w-8 h-8 text-toxic-neon" />
                </div>
                <p className="text-white/70">
                  Present your project in our community calls and AMAs. Connect directly with potential supporters and get valuable feedback.
                </p>
              </ToxicCardContent>
            </ToxicCard>
          </div>
        </div>
      </section>

      <section className="py-24 relative radiation-bg">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-toxic-neon mb-6">Feeling Sidelined?</h3>
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
              <h3 className="text-2xl font-bold text-toxic-neon mb-6">Our Pre-Launch Solution</h3>
              <ul className="space-y-4">
                {[
                  "Create a proposal NFT that tests your token, NFT, DeFi, or AI project",
                  "Tap our network of 1,500+ newsletter subscribers and 2,500+ LinkedIn members",
                  "Gather soft commitments with $1 votes before investing in smart contracts"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/70">
                    <Check className="w-5 h-5 text-toxic-neon mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative radiation-bg">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-toxic-neon toxic-glow">
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
              <ToxicCard key={index} className="relative">
                <ToxicCardContent>
                  <h3 className="text-xl font-bold text-toxic-neon mb-3">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                </ToxicCardContent>
              </ToxicCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative radiation-bg">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-toxic-neon toxic-glow">
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
                question: "How does it work?",
                answer: "Our platform allows you to submit a proposal, collect soft commitments, and launch your project with confidence."
              },
              {
                question: "What are the fees?",
                answer: "The platform has three fee components: 25 RD tokens to list a project, 1 RD token to vote on proposals, and 2.5% of project tokens distributed to DAO holders upon launch."
              },
              {
                question: "Is it secure?",
                answer: (
                  <span>
                    Yes, our platform uses verified smart contracts and secure protocols to ensure the safety of your project. View our contracts on Polyscan: {' '}
                    <a 
                      href={`https://polygonscan.com/address/${FACTORY_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Proposal Factory
                    </a>
                    {' '} and {' '}
                    <a 
                      href={`https://polygonscan.com/address/${RD_TOKEN_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      RD Token
                    </a>
                  </span>
                )
              },
              {
                question: "Benefits?",
                answer: "Join our community and access capital, support, and visibility to grow your project."
              }
            ].map((item, index) => (
              <ToxicCard key={index} className="relative">
                <ToxicCardContent>
                  <h3 className="text-xl font-bold text-toxic-neon mb-3">{item.question}</h3>
                  <p className="text-white/70">
                    {typeof item.answer === 'string' ? item.answer : item.answer}
                  </p>
                </ToxicCardContent>
              </ToxicCard>
            ))}
          </div>
        </div>
      </section>

      <DrippingSlime position="bottom" dripsCount={12} className="absolute inset-x-0 bottom-0" />
    </div>
  );
};

export default Index;
