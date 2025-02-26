
import { useParams, useNavigate } from "react-router-dom";
import { Building2, ChevronLeft, FileText, Target, Users, Info, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { ProposalDetailsCard } from "@/components/proposals/ProposalDetailsCard";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProposal } from "@/hooks/useProposal";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const ProposalDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { isConnected, connect } = useWalletConnection();
  const { data: proposal, isLoading, error } = useProposal(tokenId);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl text-white mb-4">Connect your wallet to view proposal details</h1>
          <Button onClick={connect} className="bg-blue-600 hover:bg-blue-700">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10" />
        </div>
        
        <div className="container mx-auto px-4 pt-24 pb-20 relative z-10 max-w-6xl">
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

          {/* Web3 Designer Feature - New Prominent Position */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/30">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Web3 Designer Available</h2>
                <p className="text-purple-200/80">Enhance your proposal with professional design services</p>
              </div>
              <Button 
                className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25"
              >
                Connect with Designer
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 blur-xl" />
              <Building2 className="w-16 h-16 mx-auto text-blue-400 relative" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
              Support This Project
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Make a soft commitment to help Web3 innovators bring their vision to life
            </p>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-black/40 border border-white/10 backdrop-blur-sm mx-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">
                Overview
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">
                Details
              </TabsTrigger>
              <TabsTrigger value="investment" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">
                Investment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ProposalDetailsCard tokenId={tokenId} />
            </TabsContent>

            <TabsContent value="details">
              <ProposalDetailsCard tokenId={tokenId} view="details" />
            </TabsContent>

            <TabsContent value="investment">
              <ProposalDetailsCard tokenId={tokenId} view="investment" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <ResistanceWalletWidget />
    </div>
  );
};

export default ProposalDetails;
