
import { motion } from "framer-motion";
import { Rocket, DollarSign, Users, Share2, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-3xl -top-48 -left-24 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -bottom-48 -right-24 animate-pulse" />
        </div>
        
        <div className="container px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
              Join the Resistance for $25
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Got a vision to challenge the status quo? Don't let it remain just an idea. Mint a proposal NFT and tap into our community of revolutionaries.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/thesis')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Mint Your Proposal NFT
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/proposals')}
                className="border-white/20 hover:bg-white/10"
              >
                <Share2 className="w-5 h-5 mr-2" />
                View Active Proposals
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: DollarSign, label: "Mint a Proposal", value: "$25" },
              { icon: Users, label: "Community Members", value: "2,550+" },
              { icon: Share2, label: "Newsletter Subscribers", value: "1,500+" },
              { icon: Zap, label: "Vote on Projects", value: "$1" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-teal-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur border border-white/10 group-hover:border-yellow-500/50 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-yellow-500 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/60">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12">
            Why Join the Resistance?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-xl bg-black/30 backdrop-blur border border-white/10 hover:border-yellow-500/50 transition-all duration-300"
            >
              <Shield className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Non-Custodial</h3>
              <p className="text-white/70">
                Your wallet, your control. Create and manage your proposal NFT directly—no intermediaries needed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-xl bg-black/30 backdrop-blur border border-white/10 hover:border-teal-500/50 transition-all duration-300"
            >
              <Users className="w-8 h-8 text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Decentralized</h3>
              <p className="text-white/70">
                No central authority—our community members vote with $1 each to show their support.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-xl bg-black/30 backdrop-blur border border-white/10 hover:border-yellow-500/50 transition-all duration-300"
            >
              <Share2 className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Transparent</h3>
              <p className="text-white/70">
                Track every proposal, vote, and commitment on-chain through your proposal NFT.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
