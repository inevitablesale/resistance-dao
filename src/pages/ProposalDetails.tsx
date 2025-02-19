
import { useParams, useNavigate } from "react-router-dom";
import { Building2, ChevronLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { ProposalDetailsCard } from "@/components/proposals/ProposalDetailsCard";
import { motion } from "framer-motion";

const ProposalDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-teal-500/5 to-yellow-500/5 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
        
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          {/* Back Button with animation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/proposals')}
              className="text-white/60 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Proposals
            </Button>
          </motion.div>

          {/* Hero Section with animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="mb-8">
              <Building2 className="w-20 h-20 mx-auto text-yellow-500 animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient">
              Proposal Details
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Review complete investment strategy and firm criteria
            </p>
          </motion.div>

          {/* Proposal Details Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Proposal Information</h2>
            </div>
            
            <ProposalDetailsCard tokenId={tokenId} />
          </motion.div>
        </div>
      </div>
      
      <LGRFloatingWidget />
    </div>
  );
};

export default ProposalDetails;
