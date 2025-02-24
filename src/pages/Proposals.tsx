
import { ProposalsHistory } from "@/components/proposals/ProposalsHistory";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Building2, HandCoins, TrendingUp, MessageSquare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { motion } from "framer-motion";

const Proposals = () => {
  const navigate = useNavigate();
  const processSteps = [{
    icon: HandCoins,
    title: "Initial Voting",
    description: "Support early-stage proposals with a minimal voting fee. Just 1 LGR to participate and show genuine interest.",
    points: [
      "Discover Web3 innovations",
      "Vote with LGR tokens",
      "Monitor proposal traction"
    ]
  }, {
    icon: TrendingUp,
    title: "Community Building",
    description: "Track how proposals gain DAO support. Each vote brings the project closer to its funding goal.",
    points: [
      "View community engagement",
      "Track voting progress",
      "Get milestone alerts"
    ]
  }, {
    icon: MessageSquare,
    title: "Token Launch",
    description: "When voting goals are met, creators work with the DAO community to launch their Web3 project.",
    points: [
      "Direct creator communication",
      "Token distribution planning",
      "Community-driven launch"
    ]
  }];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0">
          <div className="circuit-board opacity-20" />
          <div className="absolute inset-0">
            {/* Animated grid lines */}
            <motion.div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '40px 40px']
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Floating orbs */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl"
              animate={{
                x: ['-25%', '25%'],
                y: ['-15%', '15%']
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                yoyo: true,
                ease: "easeInOut"
              }}
              style={{
                top: '20%',
                left: '60%'
              }}
            />
            
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full bg-blue-400/5 blur-2xl"
              animate={{
                x: ['25%', '-25%'],
                y: ['15%', '-15%']
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                yoyo: true,
                ease: "easeInOut"
              }}
              style={{
                top: '50%',
                left: '30%'
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div 
              className="mb-8 relative cyber-box p-8 inline-block"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{
                  rotateY: [0, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Building2 className="w-16 h-16 mx-auto text-blue-400" />
              </motion.div>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute -top-2 -right-2"
                  animate={{
                    rotate: [0, 360],
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </motion.div>
              ))}
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <motion.span 
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300"
                animate={{
                  backgroundPosition: ['0% center', '200% center']
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% auto'
                }}
              >
                DeFi-Powered Launch Platform
              </motion.span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Join the Resistance DAO community in discovering and supporting innovative Web3 projects. 
              Vote on proposals, track progress, and participate in token launches.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => navigate('/thesis')} 
                className="relative px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-bold text-xl transition-all duration-300 shadow-lg shadow-blue-500/20 overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Submit Proposal
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-300 mb-4">How Proposal Voting Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="cyber-box p-6 bg-black/40 border border-blue-500/20 hover:border-blue-500/40 h-full relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0"
                        animate={{
                          x: ['-200%', '200%']
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      />
                      <div className="flex flex-col h-full relative">
                        <motion.div 
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-6 mx-auto"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-blue-300 mb-3 text-center group-hover:text-blue-200 transition-colors">{step.title}</h3>
                        <p className="text-white/60 mb-6 text-center">{step.description}</p>
                        <ul className="space-y-2 mt-auto">
                          {step.points.map((point, pointIndex) => (
                            <motion.li 
                              key={pointIndex}
                              className="flex items-center text-white/80 group-hover:text-white/90 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 + pointIndex * 0.1 }}
                            >
                              <motion.div 
                                className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"
                                animate={{
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: pointIndex * 0.3
                                }}
                              />
                              {point}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative z-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-300">Active Proposals</h2>
              </div>
            </div>
            <ProposalsHistory />
          </motion.div>
        </div>
      </div>

      <ResistanceWalletWidget />
    </div>
  );
};

export default Proposals;
