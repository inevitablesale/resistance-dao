
import { Shield, Vote, DollarSign } from "lucide-react";
import { Card } from "./ui/card";

export const InvestmentReadiness = () => {
  return (
    <section className="py-16 bg-black/30 backdrop-blur-sm">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Support Our Vision</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl">
          Join us in revolutionizing the accounting industry. Start by minting your LedgerFren NFT to participate 
          in governance, then support the platform's development by acquiring LGR tokens.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
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
                Future platform utility
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};
