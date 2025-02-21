import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ReclaimControl } from "@/components/ReclaimControl";
import { SystemWeDeserve } from "@/components/SystemWeDeserve";
import { HowItWorks } from "@/components/HowItWorks";
import { WhatWeBuilding } from "@/components/WhatWeBuilding";
import { CallToAction } from "@/components/CallToAction";
import { FAQ } from "@/components/FAQ";
import { Partners } from "@/components/Partners";
import { AlternativeToEquity } from "@/components/AlternativeToEquity";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LedgerFrens } from "@/components/LedgerFrens";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";

const presaleData = [
  {
    title: "LGR Token Presale",
    description: "Exclusive opportunity to acquire LGR tokens at a discounted rate before public launch.",
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    discount: "20%",
    minInvestment: "100",
    maxInvestment: "10000",
    terms: "KYC verification required. Tokens distributed after presale completion.",
    risks: "Token value may fluctuate. Presale participation is non-refundable."
  },
  {
    title: "Early Adopter Bonus",
    description: "Reward for early participants who contribute to the platform's growth and development.",
    startDate: "2024-05-01",
    endDate: "2024-07-31",
    bonusPercentage: "10%",
    requirements: "Active participation in community discussions and feedback provision.",
    benefits: "Increased voting power and access to exclusive platform features.",
    terms: "Bonus tokens distributed quarterly based on contribution level."
  },
  {
    title: "Referral Program",
    description: "Incentive for users who refer new members to the LedgerFren community.",
    startDate: "2024-05-15",
    endDate: "2024-08-31",
    referralBonus: "5%",
    requirements: "Referred users must complete KYC and make a minimum investment.",
    benefits: "Additional LGR tokens for each successful referral.",
    terms: "Referral bonuses paid out monthly."
  },
  {
    title: "Staking Rewards",
    description: "Opportunity to earn passive income by staking LGR tokens on the platform.",
    startDate: "2024-06-01",
    endDate: "Ongoing",
    stakingAPR: "15%",
    requirements: "Lock LGR tokens in the staking pool for a specified period.",
    benefits: "Earn LGR tokens as staking rewards.",
    terms: "Staking rewards distributed daily. Minimum staking period of 30 days."
  },
  {
    title: "Governance Participation",
    description: "Incentive for users who actively participate in platform governance decisions.",
    startDate: "2024-07-01",
    endDate: "Ongoing",
    rewards: "LGR tokens",
    requirements: "Participate in voting on proposals and community initiatives.",
    benefits: "Influence the platform's direction and earn LGR tokens.",
    terms: "Governance rewards distributed quarterly based on participation level."
  }
];

export default function Index() {
  const navigate = useNavigate();
  const { wallet, setShowOnRamp, setShowAuthFlow } = useWalletConnection();
  const [showLGRModal, setShowLGRModal] = useState(false);

  const handleBuyToken = () => {
    if (!wallet) {
      setShowAuthFlow(true);
      return;
    }
    setShowOnRamp(true);
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-teal-500/5 to-yellow-500/5 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black" />
      </div>

      <ScrollToTop />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full mb-8 border border-white/10">
              <img src="/lgr-logo.png" alt="LGR Logo" className="w-6 h-6 rounded-full" />
              <span className="text-yellow-500">Launch Your Web3 Idea for $25</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-400 to-yellow-300">
              Accounting Firm Ownership Simplified
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Got a Web3 vision? Don't let it die in your head. Mint a proposal NFT, pitch to our network, and collect soft commitments to validate real interest.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button
                onClick={handleBuyToken}
                className="bg-gradient-to-r from-yellow-500 to-teal-400 hover:from-yellow-600 hover:to-teal-500 text-black font-semibold px-8"
                size="lg"
              >
                Join LGR Presale
              </Button>
              <Button
                onClick={() => navigate("/proposals")}
                variant="outline"
                size="lg"
                className="border-yellow-500/20 hover:bg-yellow-500/10"
              >
                View Active Proposals
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>1,500+ newsletter subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>2,500+ LinkedIn network members</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReclaimControl />
      <SystemWeDeserve />
      <WhatWeBuilding />
      <HowItWorks />
      <AlternativeToEquity />
      <LedgerFrens />
      <CallToAction />
      <FAQ />
      <Partners />
      <NewsletterSubscription />

      {/* Floating Widget */}
      <Dialog open={showLGRModal} onOpenChange={setShowLGRModal}>
        <LGRFloatingWidget onClose={() => setShowLGRModal(false)} />
      </Dialog>
    </main>
  );
}
