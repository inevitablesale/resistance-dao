
import { Shield, Vote, DollarSign, BarChart3, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  fetchTotalLGRSold,
  fetchRemainingPresaleSupply,
  fetchPresaleUSDPrice,
  fetchPresaleMaticPrice,
  TOTAL_PRESALE_SUPPLY
} from "@/services/presaleContractService";
import { ethers } from "ethers";

export const InvestmentReadiness = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [totalSold, setTotalSold] = useState<string>("0");
  const [remainingSupply, setRemainingSupply] = useState<string>("0");
  const [priceUSD, setPriceUSD] = useState<string>("0");
  const [priceMatic, setPriceMatic] = useState<string>("0");

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setIsLoading(true);
        // Fetch all contract data in parallel
        const [sold, remaining, usdPrice, maticPrice] = await Promise.all([
          fetchTotalLGRSold(),
          fetchRemainingPresaleSupply(),
          fetchPresaleUSDPrice(),
          fetchPresaleMaticPrice()
        ]);
        
        // Update state with fetched values
        setTotalSold(sold);
        setRemainingSupply(remaining);
        setPriceUSD(usdPrice);
        setPriceMatic(maticPrice);
      } catch (error) {
        console.error("Error fetching contract data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchContractData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate percentage sold
  const percentageSold = isLoading ? 0 : Math.min(
    100,
    (Number(totalSold) / ethers.utils.formatUnits(TOTAL_PRESALE_SUPPLY, 18)) * 100
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
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur border border-yellow-500/20">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[76px]">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-yellow-400 mb-2">
                      {Number(totalSold).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-sm text-gray-300">Tokens Sold</p>
                  </>
                )}
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur border border-yellow-500/20">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[76px]">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-yellow-400 mb-2">
                      {Number(remainingSupply).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-sm text-gray-300">Remaining Supply</p>
                  </>
                )}
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur border border-teal-500/20">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[76px]">
                    <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-teal-400 mb-2">
                      {Number(priceMatic).toLocaleString(undefined, { maximumFractionDigits: 6 })} MATIC
                    </p>
                    <p className="text-sm text-gray-300">Price Per Token</p>
                  </>
                )}
              </div>
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur border border-yellow-500/20">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[76px]">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-yellow-400 mb-2">
                      ${Number(priceUSD).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-300">USD Price</p>
                  </>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-teal-500 transition-all duration-1000"
                  style={{ width: `${percentageSold}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {percentageSold.toFixed(2)}% Sold
              </p>
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
