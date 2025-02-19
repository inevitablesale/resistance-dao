
import { useParams, useNavigate } from "react-router-dom";
import { Building2, ChevronLeft, FileText, Target, Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { ProposalDetailsCard } from "@/components/proposals/ProposalDetailsCard";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProposalDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-teal-500/5 to-yellow-500/5 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
        
        <div className="container mx-auto px-4 pt-24 pb-20 relative z-10 max-w-6xl">
          {/* Back Button with enhanced animation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
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

          {/* Hero Section with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 blur-xl" />
              <Building2 className="w-16 h-16 mx-auto text-yellow-500 relative animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient">
              Proposal Details
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Review complete investment strategy and firm criteria
            </p>
          </motion.div>

          {/* Enhanced Tabs Navigation */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-black/40 border border-white/10 backdrop-blur-sm mx-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
                Overview
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white/10">
                Details
              </TabsTrigger>
              <TabsTrigger value="investment" className="data-[state=active]:bg-white/10">
                Investment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center backdrop-blur-sm">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Overview</h2>
                </div>
                
                <ProposalDetailsCard tokenId={tokenId} />
              </motion.div>
            </TabsContent>

            <TabsContent value="details">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center backdrop-blur-sm">
                    <Target className="w-5 h-5 text-teal-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Firm Details</h2>
                </div>
                
                <ProposalDetailsCard tokenId={tokenId} view="details" />
              </motion.div>
            </TabsContent>

            <TabsContent value="investment">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Investment Information</h2>
                </div>
                
                <ProposalDetailsCard tokenId={tokenId} view="investment" />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <LGRFloatingWidget />
    </div>
  );
};

export default ProposalDetails;
