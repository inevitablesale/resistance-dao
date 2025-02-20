
import { motion } from "framer-motion";
import { FileText, Activity, Users } from "lucide-react";

export const NetworkContext = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8"
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-white/60">Active Proposals</p>
            <p className="text-2xl font-bold text-white">247</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <p className="text-sm text-white/60">Network Activity</p>
            <p className="text-2xl font-bold text-white">High</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-white/60">Total Investors</p>
            <p className="text-2xl font-bold text-white">1.2K</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
