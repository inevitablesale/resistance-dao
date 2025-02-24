
import { ProposalsHistory } from "@/components/proposals/ProposalsHistory";
import { Button } from "@/components/ui/button";
import { FileText, Plus, BrainCircuit, Layers, Network, Blocks } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { motion } from "framer-motion";

const Proposals = () => {
  const navigate = useNavigate();
  const processSteps = [{
    icon: Layers,
    title: "Initial Voting",
    description: "Support early-stage proposals with a minimal voting fee. Just 1 LGR to participate and show genuine interest.",
    points: [
      "Discover Web3 innovations",
      "Vote with LGR tokens",
      "Monitor proposal traction"
    ]
  }, {
    icon: Network,
    title: "Community Building",
    description: "Track how proposals gain DAO support. Each vote brings the project closer to its funding goal.",
    points: [
      "View community engagement",
      "Track voting progress",
      "Get milestone alerts"
    ]
  }, {
    icon: Blocks,
    title: "Token Launch",
    description: "When voting goals are met, creators work with the DAO community to launch their Web3 project.",
    points: [
      "Direct creator communication",
      "Token distribution planning",
      "Community-driven launch"
    ]
  }];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section with Asymmetrical Design */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent" />
          <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10" />
        </div>

        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12 pt-32 pb-20 px-4">
            {/* Left Column - Main Content */}
            <div className="flex-1 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center space-x-2 bg-purple-900/20 rounded-full px-4 py-2 mb-6">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">Resistance DAO Proposals</span>
                </div>
                <h1 className="text-5xl font-bold mb-6 text-white">
                  Shape the Future of 
                  <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Decentralized Innovation
                  </span>
                </h1>
                <p className="text-lg text-zinc-400 mb-8 max-w-xl">
                  Join the Resistance DAO community in discovering and supporting innovative Web3 projects. 
                  Vote on proposals, track progress, and participate in token launches.
                </p>
                <Button 
                  onClick={() => navigate('/thesis')} 
                  className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Proposal
                </Button>
              </motion.div>
            </div>

            {/* Right Column - Process Steps */}
            <div className="lg:w-[450px] space-y-4">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm p-6 hover:bg-zinc-900/70 transition-all duration-300">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-purple-400" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                          <p className="text-sm text-zinc-400 mb-3">{step.description}</p>
                          <ul className="space-y-1">
                            {step.points.map((point, i) => (
                              <li key={i} className="text-sm text-zinc-500 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-purple-400" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="bg-gradient-to-b from-zinc-900/50 to-transparent">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Active Proposals</h2>
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
