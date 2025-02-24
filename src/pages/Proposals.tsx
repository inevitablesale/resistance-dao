
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
        {/* Circuit board background animation from Index page */}
        <div className="absolute inset-0">
          <div className="circuit-board opacity-20" />
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
              <Building2 className="w-16 h-16 mx-auto text-[#98FF98]" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-[#98FF98]" />
              </motion.div>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#98FF98] via-[#98FF98] to-[#98FF98]">
              Co-Investment Opportunities
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Pool resources with like-minded investors to acquire and grow accounting practices. 
              Share insights, combine capital, and participate in vetted opportunities.
            </p>
            
            <Button 
              onClick={() => navigate('/thesis')} 
              className="px-8 py-6 bg-[#98FF98] hover:bg-[#7AE07A] text-black rounded-lg font-bold text-xl transition-all duration-300 shadow-lg shadow-[#98FF98]/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Propose a Co-Investment
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#98FF98] mb-4">How Co-Investment Works</h2>
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
                    <Card className="cyber-box p-6 bg-black/40 border border-[#98FF98]/20 hover:border-[#98FF98]/40 h-full">
                      <div className="flex flex-col h-full">
                        <motion.div 
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#98FF98]/10 mb-6 mx-auto"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-6 h-6 text-[#98FF98]" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-[#98FF98] mb-3 text-center">{step.title}</h3>
                        <p className="text-white/60 mb-6 text-center">{step.description}</p>
                        <ul className="space-y-2 mt-auto">
                          {step.points.map((point, pointIndex) => (
                            <motion.li 
                              key={pointIndex}
                              className="flex items-center text-white/80"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 + pointIndex * 0.1 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#98FF98] mr-2" />
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
                <div className="w-10 h-10 rounded-lg bg-[#98FF98]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#98FF98]" />
                </div>
                <h2 className="text-2xl font-bold text-[#98FF98]">Current Co-Investment Opportunities</h2>
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
