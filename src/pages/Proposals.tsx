
import { ProposalsHistory } from "@/components/proposals/ProposalsHistory";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trophy, Building2, Users, Shield, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";

const Proposals = () => {
  const navigate = useNavigate();

  const boardMembers = [
    { 
      role: "Managing Partners",
      description: "Led multiple successful accounting firms through growth and acquisition phases.",
      icon: Trophy
    },
    { 
      role: "Operations Experts",
      description: "Streamlined practice operations across multiple firms.",
      icon: Shield
    },
    { 
      role: "Technology Leaders",
      description: "Transformed practices through strategic technology adoption.",
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with gradients matching index page */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="text-center mb-12">
            <div className="mb-8">
              <Building2 className="w-20 h-20 mx-auto text-yellow-500 animate-cosmic-pulse" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient">
              Investment Proposals
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Join a community of like-minded investors to propose and develop investment strategies for accounting practices.
            </p>
            <Button 
              onClick={() => navigate('/thesis')} 
              className="px-8 py-6 bg-white/10 text-white rounded-lg font-bold text-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit New Proposal
            </Button>
          </div>

          {/* Board Members Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {boardMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <Card key={index} className="relative group bg-black/40 backdrop-blur-sm border border-white/10 p-6">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000" />
                  <div className="relative">
                    <div className="p-2 bg-yellow-500/10 rounded-lg inline-block mb-4">
                      <Icon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{member.role}</h3>
                    <p className="text-white/70">{member.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Proposals List Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Active Proposals</h2>
          </div>
          <Button 
            onClick={() => navigate('/thesis')} 
            className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Proposal
          </Button>
        </div>
        <ProposalsHistory />
      </div>

      {/* LGR Floating Widget */}
      <LGRFloatingWidget />
    </div>
  );
};

export default Proposals;
