
import { ProposalsHistory } from "@/components/proposals/ProposalsHistory";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Building2, HandCoins, TrendingUp, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { Link } from "react-router-dom";

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
        {/* Gradient overlay - now with pointer-events-none */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-pink-500/10 animate-gradient pointer-events-none" />
        
        {/* Main content - now with proper z-index */}
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="text-center mb-12">
            <div className="mb-8">
              <Building2 className="w-20 h-20 mx-auto text-yellow-500 animate-cosmic-pulse" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient">
              Co-Investment Opportunities
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Pool resources with like-minded investors to acquire and grow accounting practices. Share insights, combine capital, and participate in vetted opportunities.
            </p>
            <Button onClick={() => navigate('/thesis')} className="px-8 py-6 bg-white/10 text-white rounded-lg font-bold text-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <Plus className="w-5 h-5 mr-2" />
              Propose a Co-Investment
            </Button>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">How Co-Investment Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="p-6 bg-black/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-6 mx-auto">
                        <Icon className="w-6 h-6 text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 text-center">{step.title}</h3>
                      <p className="text-white/60 mb-6 text-center">{step.description}</p>
                      <ul className="space-y-2 mt-auto">
                        {step.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-center text-white/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="mb-16 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Current Co-Investment Opportunities</h2>
              </div>
            </div>
            <ProposalsHistory />
          </div>
        </div>
      </div>

      <LGRFloatingWidget />
    </div>
  );
};

export default Proposals;
