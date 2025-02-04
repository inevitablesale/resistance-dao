
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { WalletInfo } from "@/components/WalletInfo";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";

const IndexContent = () => {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  const handleBoardShip = () => {
    setShowAuthFlow?.(true);
  };

  return (
    <>
      <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
          The future of accounting<br />belongs to you
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
        </p>

        <div className="max-w-md mx-auto relative">
          {/* Interactive Scout Ship */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -top-24 w-[200px] h-[60px] cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            onClick={handleBoardShip}
            style={{
              background: `
                linear-gradient(45deg, 
                  rgba(0, 255, 255, 0.9) 0%,
                  rgba(64, 156, 255, 0.8) 50%,
                  rgba(147, 51, 255, 0.7) 100%
                )
              `,
              boxShadow: `
                0 0 20px rgba(0, 255, 255, 0.3),
                0 0 40px rgba(64, 156, 255, 0.2)
              `,
              clipPath: 'polygon(0 50%, 10% 0, 98% 0, 100% 50%, 98% 100%, 10% 100%)',
              transform: 'rotate(-15deg)',
            }}
          >
            {/* Quantum Pulse Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `
                  radial-gradient(circle at center,
                    rgba(0, 255, 255, 0.4) 0%,
                    transparent 70%
                  )
                `,
                animation: 'pulse 2s infinite'
              }}
            />
            
            {/* Hover Text */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-cyan-300 text-lg font-semibold">
                Board Scout Ship Delta-7
              </span>
            </div>
          </motion.div>

          <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
            <div className="flex justify-center mb-8">
              <DynamicWidget />
            </div>
            <WalletInfo />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Check your eligibility to join the future of accounting
          </p>
        </div>
      </div>
    </>
  );
};

const zeroDevConfig = {
  bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
  paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
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
        {/* Enhanced Space Background with Advanced Ships */}
        <div className="absolute inset-0">
          {/* Deep space base with quantum field effects */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)',
              opacity: 0.98
            }}
          />
          
          {/* Quantum probability waves and temporal distortions */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)
              `,
              animation: 'quantumField 30s ease-in-out infinite'
            }}
          />
          
          {/* Advanced star field with temporal wake effects */}
          <div 
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(2px 2px at 20% 20%, rgba(0, 255, 255, 0.7) 100%, transparent),
                radial-gradient(1.5px 1.5px at 30% 30%, rgba(147, 51, 255, 0.8) 100%, transparent),
                radial-gradient(2px 2px at 40% 40%, rgba(64, 156, 255, 0.6) 100%, transparent),
                radial-gradient(1.5px 1.5px at 50% 50%, rgba(255, 255, 255, 0.7) 100%, transparent)
              `,
              backgroundSize: '400% 400%',
              animation: 'temporalWake 240s ease-in-out infinite'
            }}
          />
          
          {/* Advanced Spacecraft Fleet */}
          <div className="absolute inset-0">
            {/* The Ark - Flagship */}
            <div
              className="absolute animate-quantum-ship"
              style={{
                left: '50%',
                top: '40%',
                width: '300px',
                height: '100px',
                background: `
                  linear-gradient(45deg, 
                    rgba(64, 156, 255, 0.9) 0%,
                    rgba(147, 51, 255, 0.8) 50%,
                    rgba(0, 255, 255, 0.7) 100%
                  )
                `,
                boxShadow: `
                  0 0 40px rgba(64, 156, 255, 0.3),
                  0 0 80px rgba(147, 51, 255, 0.2),
                  0 0 120px rgba(0, 255, 255, 0.1)
                `,
                clipPath: 'polygon(0 50%, 25% 0, 85% 0, 100% 50%, 85% 100%, 25% 100%)',
                transform: 'rotate(-15deg)',
                animation: `
                  flagshipPulse 4s ease-in-out infinite,
                  quantumShield 6s linear infinite
                `
              }}
            />

            {/* Guardian Escorts */}
            {[...Array(3)].map((_, index) => (
              <div
                key={`guardian-${index}`}
                className="absolute animate-guardian-ship"
                style={{
                  left: `${30 + index * 20}%`,
                  top: `${35 + index * 10}%`,
                  width: '150px',
                  height: '50px',
                  background: `
                    linear-gradient(45deg, 
                      rgba(147, 51, 255, 0.9) 0%,
                      rgba(0, 255, 255, 0.8) 50%,
                      rgba(64, 156, 255, 0.7) 100%
                    )
                  `,
                  boxShadow: `
                    0 0 30px rgba(147, 51, 255, 0.3),
                    0 0 60px rgba(0, 255, 255, 0.2)
                  `,
                  clipPath: 'polygon(0 50%, 15% 0, 95% 0, 100% 50%, 95% 100%, 15% 100%)',
                  transform: 'rotate(-15deg)',
                  animation: `
                    guardianPulse${index + 1} ${3 + index}s ease-in-out infinite,
                    forceField ${2 + index}s linear infinite
                  `
                }}
              />
            ))}

            {/* Pathfinder Scouts */}
            {[...Array(5)].map((_, index) => (
              <div
                key={`scout-${index}`}
                className="absolute animate-scout-ship"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${45 + index * 8}%`,
                  width: '80px',
                  height: '30px',
                  background: `
                    linear-gradient(45deg, 
                      rgba(0, 255, 255, 0.9) 0%,
                      rgba(64, 156, 255, 0.8) 50%,
                      rgba(147, 51, 255, 0.7) 100%
                    )
                  `,
                  boxShadow: `
                    0 0 20px rgba(0, 255, 255, 0.3),
                    0 0 40px rgba(64, 156, 255, 0.2)
                  `,
                  clipPath: 'polygon(0 50%, 10% 0, 98% 0, 100% 50%, 98% 100%, 10% 100%)',
                  transform: 'rotate(-15deg)',
                  animation: `
                    scoutPulse${index + 1} ${2 + index * 0.5}s ease-in-out infinite,
                    biomimetic ${1.5 + index * 0.3}s linear infinite
                  `
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
