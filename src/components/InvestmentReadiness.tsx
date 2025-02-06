
import { Shield, Vote, DollarSign, BarChart3, Trophy, Wallet } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { TOTAL_PRESALE_SUPPLY } from "@/services/presaleContractService";

export const InvestmentReadiness = () => {
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  const [totalSold] = useState<string>("4999990"); // Fixed value as requested
  const [remainingSupply] = useState<string>("10"); // Fixed value as requested
  const [priceUSD] = useState<string>("0.1"); // Fixed value as requested
  const [priceMatic] = useState<string>("0.335275"); // Fixed value as requested

  // Calculate percentage sold using Number() to fix the TS error
  const percentageSold = isLoading ? 0 : Math.min(
    100,
    (Number(totalSold) / Number(ethers.utils.formatUnits(TOTAL_PRESALE_SUPPLY, 18))) * 100
  );

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
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-8">
              Presale Stage 1
            </h3>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur">
                <p className="text-4xl font-bold text-white mb-1">83</p>
                <p className="text-sm text-gray-400">DAYS</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur">
                <p className="text-4xl font-bold text-white mb-1">04</p>
                <p className="text-sm text-gray-400">HOURS</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur">
                <p className="text-4xl font-bold text-white mb-1">47</p>
                <p className="text-sm text-gray-400">MINUTES</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur">
                <p className="text-4xl font-bold text-white mb-1">05</p>
                <p className="text-sm text-gray-400">SECONDS</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg text-gray-400">Token Price</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  ${priceUSD} USD
                  <span className="text-sm text-yellow-400 ml-2">(90% Discount)</span>
                </p>
                <p className="text-lg text-gray-400">{priceMatic} MATIC</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-teal-400" />
                  <span className="text-lg text-gray-400">Supply</span>
                </div>
                <p className="text-2xl font-bold text-white">5M</p>
                <p className="text-lg text-gray-400">Total Supply</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-teal-500 transition-all duration-1000"
                  style={{ width: `${percentageSold}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-400">
                  {Number(totalSold).toLocaleString()} / {Number("5000000").toLocaleString()} LGR Tokens Sold
                </p>
                <p className="text-sm text-gray-400">
                  {percentageSold.toFixed(2)}%
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                UNTIL PRICE INCREASE
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => navigate('/token-presale')}
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/70 to-yellow-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-3 text-white font-medium">
                  <Trophy className="w-5 h-5" />
                  <span>Buy with Card</span>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/token-presale')}
                className="group relative px-8 py-4 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-3 text-white font-medium">
                  <Wallet className="w-5 h-5" />
                  <span>Buy with Crypto</span>
                </div>
              </button>
            </div>

            <button 
              onClick={() => navigate('/mint-nft')}
              className="text-white/80 hover:text-white underline text-sm transition-colors"
            >
              New to crypto? Get started here
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

