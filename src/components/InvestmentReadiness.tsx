
import { Shield, Vote, DollarSign } from "lucide-react";
import { Card } from "./ui/card";

export const InvestmentReadiness = () => {
  return (
    <section className="py-16 bg-black/30 backdrop-blur-sm">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Join Our Vision</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl">
          We're raising funds to revolutionize the accounting industry. Mint your LedgerFren NFT to become part 
          of our governance board and shape the future of decentralized accounting.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Initial Offering
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Limited NFT mint available
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Early supporter benefits
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Secure your governance rights
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Governance Rights
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Vote on key decisions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Shape platform development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Participate in governance meetings
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Investment Process
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Connect your wallet
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Mint your LedgerFren NFT
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Participate in platform governance
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};
