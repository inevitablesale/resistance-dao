
import { Link } from "react-router-dom";
import BlackHoleAnimation from "./BlackHoleAnimation";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { user } = useDynamicContext();
  const navigate = useNavigate();

  const handleClaimClick = () => {
    navigate('/eligibility');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BlackHoleAnimation />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
        <div className="max-w-[1200px] space-y-8">
          <h1 className="max-w-[1000px] mx-auto mb-8 text-5xl font-bold tracking-tight md:text-7xl text-white font-heading leading-tight flex items-center justify-center gap-2">
            The future of accounting belongs to you
          </h1>
          
          <p className="max-w-[900px] mx-auto mb-12 text-lg text-gray-200/90 md:text-xl">
            Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 items-center justify-center">
            <Link 
              to="/whitepaper"
              className="px-8 py-4 text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-full font-medium transition-all duration-200 backdrop-blur-sm"
            >
              Earn Rewards with Quests
            </Link>
            
            {user ? (
              <button 
                onClick={() => {
                  if (window?.dynamic) {
                    window.dynamic.handleLogOut();
                  }
                }}
                className="px-8 py-4 text-black bg-white hover:bg-gray-100 rounded-full font-medium transition-all duration-200 backdrop-blur-sm"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={handleClaimClick}
                className="px-8 py-4 text-black bg-white hover:bg-gray-100 rounded-full font-medium transition-all duration-200 backdrop-blur-sm"
              >
                Mint Ledger NFT
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-300/90">
          Check your eligibility to join the future of accounting
        </div>
      </div>
    </div>
  );
};

export default Hero;
