
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
    title: "Soft Pledge Support",
    description: "Back promising proposals with soft pledges. No immediate investment required - just a 10 LGR voting fee to show genuine interest.",
    points: [
      "Discover potential investments",
      "Support with soft pledges", 
      "Track proposal progress"
    ]
  }, {
    icon: TrendingUp,
    title: "Watch Proposals Grow",
    description: "Monitor how proposals gain community support. Each pledge brings the proposal closer to its funding goal.",
    points: [
      "View funding progress",
      "See community backing",
      "Alerts about progress"
    ]
  }, {
    icon: MessageSquare,
    title: "Move to Investment",
    description: "When funding goals are met, proposal creators coordinate with supporters to complete the investment process.",
    points: [
      "Direct communication",
      "AML/KYC and Accredited investor",
      "SPV formation"
    ]
  }];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        {/* Enhanced animated gradient background */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-3xl -top-96 -left-48"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-3xl -bottom-96 -right-48"
          />
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
              className="mb-8 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Building2 className="w-20 h-20 mx-auto text-yellow-500" />
              <motion.div
                className="absolute -top-4 -right-4 transform rotate-12"
                animate={{ rotate: [12, -12, 12] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-8 h-8 text-teal-400" />
              </motion.div>
            </motion.div>
            
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient">
              Co-Investment Opportunities
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Pool resources with like-minded investors to acquire and grow accounting practices. 
              Share insights, combine capital, and participate in vetted opportunities.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Button 
                onClick={() => navigate('/thesis')} 
                className="px-8 py-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg font-bold text-xl shadow-lg shadow-yellow-500/20 transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Propose a Co-Investment
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
              <h2 className="text-3xl font-bold text-white mb-4">How Co-Investment Works</h2>
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
                  >
                    <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors h-full">
                      <div className="flex flex-col h-full">
                        <motion.div 
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-6 mx-auto"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-6 h-6 text-yellow-500" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white mb-3 text-center">{step.title}</h3>
                        <p className="text-white/60 mb-6 text-center leading-relaxed">{step.description}</p>
                        <ul className="space-y-2 mt-auto">
                          {step.points.map((point, pointIndex) => (
                            <motion.li 
                              key={pointIndex}
                              className="flex items-center text-white/80"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 + pointIndex * 0.1 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
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
            className="mb-16 relative z-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Current Co-Investment Opportunities</h2>
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
