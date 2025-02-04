
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import Nav from "@/components/Nav";
import { InvestmentReadiness } from "@/components/InvestmentReadiness";
import { WhatWeBuilding } from "@/components/WhatWeBuilding";
import { PrivateEquityImpact } from "@/components/PrivateEquityImpact";
import { ReclaimControl } from "@/components/ReclaimControl";
import { HowItWorks } from "@/components/HowItWorks";
import { AlternativeToEquity } from "@/components/AlternativeToEquity";
import { SystemWeDeserve } from "@/components/SystemWeDeserve";
import { CallToAction } from "@/components/CallToAction";
import { Roadmap } from "@/components/Roadmap";
import { useNavigate } from "react-router-dom";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { WalletInfo } from "@/components/WalletInfo";

const zeroDevConfig = {
  bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
  paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
};

const IndexContent = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
          The future of accounting<br />belongs to you
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
          <button 
            onClick={() => navigate('/mint-nft')}
            className="px-8 py-3 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-colors text-lg font-medium"
          >
            Mint LedgerFren NFT
          </button>
          <button className="px-8 py-3 bg-white hover:bg-white/90 text-[#8247E5] rounded-lg transition-colors text-lg font-medium">
            Read Whitepaper
          </button>
        </div>
      </div>

      <InvestmentReadiness />
      <WhatWeBuilding />
      <PrivateEquityImpact />
      <ReclaimControl />
      <HowItWorks />
      <AlternativeToEquity />
      <SystemWeDeserve />
      <CallToAction />
      <Roadmap />
    </>
  );
};

const Index = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "2b74d425-6827-4ff1-af57-f9543d71cca0",
        walletConnectors: [
          EthereumWalletConnectors,
          ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
        ],
      }}
    >
      <div className="min-h-screen bg-black overflow-hidden relative">
        <div className="absolute inset-0">
          {/* Deep space base */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, #000B2E 0%, #000000 100%)",
              opacity: 0.98
            }}
          />
          
          {/* Quantum waves */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)",
              animation: "quantumField 30s ease-in-out infinite"
            }}
          />
          
          {/* Star field */}
          <div 
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage: "radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent), radial-gradient(2px 2px at 20% 20%, rgba(0, 255, 255, 0.7) 100%, transparent), radial-gradient(1.5px 1.5px at 30% 30%, rgba(147, 51, 255, 0.8) 100%, transparent), radial-gradient(2px 2px at 40% 40%, rgba(64, 156, 255, 0.6) 100%, transparent), radial-gradient(1.5px 1.5px at 50% 50%, rgba(255, 255, 255, 0.7) 100%, transparent)",
              backgroundSize: "400% 400%",
              animation: "temporalWake 240s ease-in-out infinite"
            }}
          />
          
          {/* Spacecraft Fleet */}
          <div className="absolute inset-0">
            {/* Flagship */}
            <div
              className="absolute animate-quantum-ship"
              style={{
                left: "50%",
                top: "40%",
                width: "300px",
                height: "100px",
                background: "linear-gradient(45deg, rgba(64, 156, 255, 0.9) 0%, rgba(147, 51, 255, 0.8) 50%, rgba(0, 255, 255, 0.7) 100%)",
                boxShadow: "0 0 40px rgba(64, 156, 255, 0.3), 0 0 80px rgba(147, 51, 255, 0.2), 0 0 120px rgba(0, 255, 255, 0.1)",
                clipPath: "polygon(0 50%, 25% 0, 85% 0, 100% 50%, 85% 100%, 25% 100%)",
                transform: "rotate(-15deg)",
                animation: "flagshipPulse 4s ease-in-out infinite, quantumShield 6s linear infinite"
              }}
            />

            {/* Escorts */}
            {[...Array(3)].map((_, index) => (
              <div
                key={`guardian-${index}`}
                className="absolute animate-guardian-ship"
                style={{
                  left: `${30 + index * 20}%`,
                  top: `${35 + index * 10}%`,
                  width: "150px",
                  height: "50px",
                  background: "linear-gradient(45deg, rgba(147, 51, 255, 0.9) 0%, rgba(0, 255, 255, 0.8) 50%, rgba(64, 156, 255, 0.7) 100%)",
                  boxShadow: "0 0 30px rgba(147, 51, 255, 0.3), 0 0 60px rgba(0, 255, 255, 0.2)",
                  clipPath: "polygon(0 50%, 15% 0, 95% 0, 100% 50%, 95% 100%, 15% 100%)",
                  transform: "rotate(-15deg)",
                  animation: `guardianPulse${index + 1} ${3 + index}s ease-in-out infinite, forceField ${2 + index}s linear infinite`
                }}
              />
            ))}

            {/* Scouts */}
            {[...Array(5)].map((_, index) => (
              <div
                key={`scout-${index}`}
                className="absolute animate-scout-ship"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${45 + index * 8}%`,
                  width: "80px",
                  height: "30px",
                  background: "linear-gradient(45deg, rgba(0, 255, 255, 0.9) 0%, rgba(64, 156, 255, 0.8) 50%, rgba(147, 51, 255, 0.7) 100%)",
                  boxShadow: "0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(64, 156, 255, 0.2)",
                  clipPath: "polygon(0 50%, 10% 0, 98% 0, 100% 50%, 98% 100%, 10% 100%)",
                  transform: "rotate(-15deg)",
                  animation: `scoutPulse${index + 1} ${2 + index * 0.5}s ease-in-out infinite, biomimetic ${1.5 + index * 0.3}s linear infinite`
                }}
              />
            ))}
          </div>
          
          <style>
            {`
              @keyframes quantumField {
                0%, 100% {
                  opacity: 0.7;
                  transform: scale(1) rotate(0deg);
                }
                50% {
                  opacity: 0.9;
                  transform: scale(1.05) rotate(1deg);
                }
              }

              @keyframes temporalWake {
                0%, 100% {
                  transform: scale(1) rotate(0deg);
                  opacity: 0.8;
                }
                50% {
                  transform: scale(1.1) rotate(1deg);
                  opacity: 1;
                }
              }

              @keyframes flagshipPulse {
                0%, 100% {
                  opacity: 0.9;
                  transform: scale(1) rotate(-15deg);
                }
                50% {
                  opacity: 1;
                  transform: scale(1.05) rotate(-15deg);
                }
              }

              @keyframes quantumShield {
                0% {
                  filter: hue-rotate(0deg) brightness(1);
                }
                100% {
                  filter: hue-rotate(360deg) brightness(1.2);
                }
              }

              @keyframes forceField {
                0% {
                  filter: hue-rotate(0deg);
                }
                100% {
                  filter: hue-rotate(180deg);
                }
              }

              @keyframes biomimetic {
                0%, 100% {
                  transform: skewX(0deg) rotate(-15deg);
                }
                50% {
                  transform: skewX(2deg) rotate(-15deg);
                }
              }

              .animate-quantum-ship {
                animation: flagshipMove 30s linear infinite;
              }

              .animate-guardian-ship {
                animation: guardianMove 25s linear infinite;
              }

              .animate-scout-ship {
                animation: scoutMove 20s linear infinite;
              }

              @keyframes flagshipMove {
                0% { transform: translate(0, 0); }
                100% { transform: translate(-50px, 25px); }
              }

              @keyframes guardianMove {
                0% { transform: translate(0, 0); }
                100% { transform: translate(-40px, 20px); }
              }

              @keyframes scoutMove {
                0% { transform: translate(0, 0); }
                100% { transform: translate(-30px, 15px); }
              }
            `}
          </style>
        </div>
        
        <Nav />
        
        <div className="container mx-auto px-4 relative z-10">
          <IndexContent />
        </div>
      </div>
    </DynamicContextProvider>
  );
};

export default Index;
