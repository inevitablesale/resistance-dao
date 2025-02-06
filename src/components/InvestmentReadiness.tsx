
import { Shield, Vote, DollarSign, BarChart3 } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";

export const InvestmentReadiness = () => {
  const navigate = useNavigate();

  return (
    <section id="join-our-vision" className="py-16 bg-black/30 backdrop-blur-sm">
      <div className="container px-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-4">Join Our Vision</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl">
          Participate in revolutionizing the accounting industry through our token presale. 
          Send MATIC to purchase LGR tokens and shape the future of decentralized accounting.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              Simple Purchase Process
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-teal-300">•</span>
                Direct MATIC transfer
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-300">•</span>
                Instant token delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-300">•</span>
                1-year lockup period
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Vote className="w-5 h-5 text-teal-400" />
              Governance Rights
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">•</span>
                Propose firm acquisitions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">•</span>
                Select managing partners
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">•</span>
                Choose service providers
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              Post-Launch Features
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-teal-300">•</span>
                KYC/AML for firm investment
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-300">•</span>
                Fiat on/off ramps
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-300">•</span>
                Professional liquidity
              </li>
            </ul>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/5 via-teal-500/5 to-yellow-500/5 border border-yellow-500/20 rounded-lg p-8 backdrop-blur">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-4">LGR Token Presale</h3>
            <p className="text-lg text-gray-300 mb-6">
              Join the future of accounting with LGR tokens. Purchase during presale with MATIC 
              and gain early access to governance rights. After launch, complete KYC/AML to invest 
              in accounting firm acquisitions and operations.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur border border-yellow-500/20">
                <p className="text-3xl font-bold text-yellow-400 mb-2">10M</p>
                <p className="text-sm text-gray-300">Total Supply</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur border border-teal-500/20">
                <p className="text-3xl font-bold text-teal-400 mb-2">5M</p>
                <p className="text-sm text-gray-300">Presale Tokens</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur border border-yellow-500/20">
                <p className="text-3xl font-bold text-yellow-400 mb-2">$0.10</p>
                <p className="text-sm text-gray-300">Price Per Token</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/token-presale')}
              className="group relative px-8 py-3 bg-gradient-to-r from-yellow-600 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
              <span className="relative text-white font-medium">Join Token Presale</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

