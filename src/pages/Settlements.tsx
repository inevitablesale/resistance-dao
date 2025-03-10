
import React, { useState } from 'react';
import { SettlementsNavBar } from '@/components/settlements/SettlementsNavBar';
import { SettlementsGrid } from '@/components/settlements/SettlementsGrid';
import { useSettlements } from '@/hooks/useSettlements';
import { ToxicCard } from '@/components/ui/toxic-card';
import { Users, TrendingUp, Building2, AlertCircle, Network, Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { DrippingSlime } from '@/components/ui/dripping-slime';
import { motion } from 'framer-motion';

const Settlements = () => {
  const { settlements, metrics, loading, error } = useSettlements();
  const [filter, setFilter] = useState<string | null>(null);

  const filteredSettlements = filter 
    ? settlements.filter(s => s.status === filter) 
    : settlements;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10 z-0"></div>
      <div className="fog-overlay"></div>
      <div className="dust-particles"></div>
      
      {/* Wasteland atmospheric effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70 z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 z-0 animate-pulse"></div>
      
      {/* Header Section */}
      <div className="relative pt-6 pb-6 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <SettlementsNavBar />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 text-toxic-neon animate-spin" />
          </div>
        ) : error ? (
          <ToxicCard className="p-4 mb-8 bg-red-900/20 border-red-500/30">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </ToxicCard>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ToxicCard className="p-4 bg-black/80 border-toxic-neon/30 relative overflow-hidden group hover:border-toxic-neon/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-toxic-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Active Settlements</p>
                        <h3 className="text-2xl font-mono text-toxic-neon">{metrics.activeSettlements}</h3>
                      </div>
                      <div className="p-2 rounded-full bg-toxic-neon/10">
                        <Building2 className="h-5 w-5 text-toxic-neon" />
                      </div>
                    </div>
                  </ToxicCard>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ToxicCard className="p-4 bg-black/80 border-toxic-neon/30 relative overflow-hidden group hover:border-toxic-neon/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-toxic-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Total Investors</p>
                        <h3 className="text-2xl font-mono text-toxic-neon">{metrics.totalInvestors}</h3>
                      </div>
                      <div className="p-2 rounded-full bg-toxic-neon/10">
                        <Users className="h-5 w-5 text-toxic-neon" />
                      </div>
                    </div>
                  </ToxicCard>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ToxicCard className="p-4 bg-black/80 border-toxic-neon/30 relative overflow-hidden group hover:border-toxic-neon/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-toxic-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">ETH Raised</p>
                        <h3 className="text-2xl font-mono text-toxic-neon">{parseFloat(metrics.totalRaised).toFixed(2)} ETH</h3>
                      </div>
                      <div className="p-2 rounded-full bg-toxic-neon/10">
                        <TrendingUp className="h-5 w-5 text-toxic-neon" />
                      </div>
                    </div>
                  </ToxicCard>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ToxicCard className="p-4 bg-black/80 border-toxic-neon/30 relative overflow-hidden group hover:border-toxic-neon/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-toxic-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Funding Rate</p>
                        <h3 className="text-2xl font-mono text-toxic-neon">{metrics.fundingRate.toFixed(0)}%</h3>
                      </div>
                      <div className="p-2 rounded-full bg-toxic-neon/10">
                        <TrendingUp className="h-5 w-5 text-toxic-neon" />
                      </div>
                    </div>
                  </ToxicCard>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <ToxicCard className="p-6 mb-8 bg-black/80 border-toxic-neon/30 relative overflow-hidden">
                <DrippingSlime position="top" dripsCount={4} toxicGreen={true} />
                <h3 className="text-lg font-mono text-toxic-neon mb-2 flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  Status Distribution
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">Active</span>
                      <span className="text-toxic-neon">{metrics.statusDistribution.active}</span>
                    </div>
                    <Progress value={metrics.statusDistribution.active / metrics.activeSettlements * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">Funding</span>
                      <span className="text-toxic-neon">{metrics.statusDistribution.funding}</span>
                    </div>
                    <Progress value={metrics.statusDistribution.funding / metrics.activeSettlements * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">Completed</span>
                      <span className="text-toxic-neon">{metrics.statusDistribution.completed}</span>
                    </div>
                    <Progress value={metrics.statusDistribution.completed / metrics.activeSettlements * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">Failed</span>
                      <span className="text-toxic-neon">{metrics.statusDistribution.failed}</span>
                    </div>
                    <Progress value={metrics.statusDistribution.failed / metrics.activeSettlements * 100} className="h-2" />
                  </div>
                </div>
              </ToxicCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-toxic-neon/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-toxic-neon" />
                </div>
                <h2 className="text-2xl font-bold text-white">Active Settlements</h2>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${filter === null ? 'bg-toxic-neon text-black' : 'bg-black/50 text-white/70 border border-toxic-neon/30'}`}
                  onClick={() => setFilter(null)}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${filter === 'active' ? 'bg-toxic-neon text-black' : 'bg-black/50 text-white/70 border border-toxic-neon/30'}`}
                  onClick={() => setFilter('active')}
                >
                  Active
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${filter === 'funding' ? 'bg-toxic-neon text-black' : 'bg-black/50 text-white/70 border border-toxic-neon/30'}`}
                  onClick={() => setFilter('funding')}
                >
                  Funding
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${filter === 'completed' ? 'bg-toxic-neon text-black' : 'bg-black/50 text-white/70 border border-toxic-neon/30'}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${filter === 'failed' ? 'bg-toxic-neon text-black' : 'bg-black/50 text-white/70 border border-toxic-neon/30'}`}
                  onClick={() => setFilter('failed')}
                >
                  Failed
                </button>
              </div>
              
              <SettlementsGrid settlements={filteredSettlements} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settlements;
