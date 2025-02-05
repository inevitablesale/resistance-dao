
import { Shield, Vote, DollarSign, BarChart3 } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";

export const InvestmentReadiness = () => {
  const navigate = useNavigate();

  return (
    <section id="join-our-vision" className="py-16 bg-black/30 backdrop-blur-sm">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Join Our Vision</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl">
          Participate in revolutionizing the accounting industry through our token presale. 
          Send MATIC to purchase LGR tokens and shape the future of decentralized accounting.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Simple Purchase Process
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Direct MATIC transfer
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Instant token delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                1-year lockup period
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
                Propose firm acquisitions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Select managing partners
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Choose service providers
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Post-Launch Features
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                KYC/AML for firm investment
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Fiat on/off ramps
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8247E5]">•</span>
                Professional liquidity
              </li>
            </ul>
          </Card>
        </div>

        <div className="bg-[#8247E5]/10 border border-[#8247E5]/20 rounded-lg p-8 backdrop-blur">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">LGR Token Presale</h3>
            <p className="text-lg text-gray-300 mb-6">
              Join the future of accounting with LGR tokens. Purchase during presale with MATIC 
              and gain early access to governance rights. After launch, complete KYC/AML to invest 
              in accounting firm acquisitions and operations.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur">
                <p className="text-3xl font-bold text-[#8247E5] mb-2">10M</p>
                <p className="text-sm text-gray-300">Total Supply</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur">
                <p className="text-3xl font-bold text-[#8247E5] mb-2">5M</p>
                <p className="text-sm text-gray-300">Presale Tokens</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur">
                <p className="text-3xl font-bold text-[#8247E5] mb-2">$0.10</p>
                <p className="text-sm text-gray-300">Price Per Token</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/token-presale')}
              className="px-8 py-3 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-colors text-lg font-medium"
            >
              Join Token Presale
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
