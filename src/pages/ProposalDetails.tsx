
import { useParams, useNavigate } from "react-router-dom";
import { Building2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { ProposalDetailsCard } from "@/components/proposals/ProposalDetailsCard";
import { Card } from "@/components/ui/card";

const ProposalDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        
        <div className="container mx-auto px-4 pt-32 pb-20">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/proposals')}
            className="mb-8 text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Proposals
          </Button>

          <div className="text-center mb-12">
            <div className="mb-8">
              <Building2 className="w-20 h-20 mx-auto text-yellow-500 animate-cosmic-pulse" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient">
              Proposal Details
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Review investment strategy and firm criteria
            </p>
          </div>

          {/* Proposal Details Card */}
          <ProposalDetailsCard tokenId={tokenId} />
        </div>
      </div>
      
      <LGRFloatingWidget />
    </div>
  );
};

export default ProposalDetails;
