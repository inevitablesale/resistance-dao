
import { Shield, Vote, DollarSign } from "lucide-react";
import { Card } from "./ui/card";

export const InvestmentReadiness = () => {
  return (
    <section className="py-16 bg-black/30 backdrop-blur-sm">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Support Our Vision</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl">
          Join us in revolutionizing the accounting industry. Start by minting your LedgerFren NFT to participate 
          in governance, then support the platform's development through our limited LGR token pre-sale.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Step 1: Mint NFT
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Get your LedgerFren NFT
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Become a governance member
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Early supporter benefits
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Step 2: Governance
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Vote on platform decisions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Shape development priorities
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Join governance meetings
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Step 3: Support Platform
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Purchase LGR tokens
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Support platform development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Early adopter benefits
              </li>
            </ul>
          </Card>
        </div>

        <div className="bg-[#8247E5]/10 border border-[#8247E5]/20 rounded-lg p-8 backdrop-blur">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Limited LGR Token Pre-sale</h3>
            <p className="text-lg text-gray-300 mb-6">
              Secure your position in the future of accounting with LGR tokens. Only 10 million tokens 
              will ever be minted, with just 2 million available during our pre-sale phase.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur">
                <p className="text-3xl font-bold text-[#8247E5] mb-2">10M</p>
                <p className="text-sm text-gray-300">Total Supply</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur">
                <p className="text-3xl font-bold text-[#8247E5] mb-2">2M</p>
                <p className="text-sm text-gray-300">Pre-sale Tokens</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur">
                <p className="text-3xl font-bold text-[#8247E5] mb-2">20%</p>
                <p className="text-sm text-gray-300">Early Bird Bonus</p>
              </div>
            </div>
            <button className="px-8 py-3 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-colors text-lg font-medium">
              Join Pre-sale Waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
