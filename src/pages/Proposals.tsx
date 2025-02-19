
import { ProposalsHistory } from "@/components/proposals/ProposalsHistory";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trophy, Building2, Shield, Rocket } from "lucide-react";
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
              <Building2 className="w-20 h-20 mx-auto text-yellow-500" />
            </div>
            <h1 className="text-6xl font-bold mb-6 text-[#B3E6D9]">
              Investment Proposals
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Join a community of like-minded investors to propose and develop investment strategies for accounting practices.
            </p>
            <Button 
              onClick={() => navigate('/thesis')} 
              className="px-8 py-4 text-white rounded-lg font-bold text-xl bg-[#1F1F2D] hover:bg-[#2a2a3d] transition-all duration-300"
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
                <Card 
                  key={index} 
                  className="relative bg-gradient-to-br from-[#1F1F2D] to-[#1A1A27] border-none p-6 rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(50, 50, 70, 0.2) 0%, transparent 50%)'
                  }}
                >
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
