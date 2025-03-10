
import React, { useState } from 'react';
import { SettlementsNavBar } from '@/components/settlements/SettlementsNavBar';
import { SettlementsGrid } from '@/components/settlements/SettlementsGrid';
import { useSettlements } from '@/hooks/useSettlements';
import { ToxicCard } from '@/components/ui/toxic-card';
import { Users, TrendingUp, Building2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

const Settlements = () => {
  const { settlements, metrics, loading, error } = useSettlements();
  const [filter, setFilter] = useState<string | null>(null);

  const filteredSettlements = filter 
    ? settlements.filter(s => s.status === filter) 
    : settlements;

  return (
    <div className="container mx-auto px-4 py-6">
      <SettlementsNavBar />
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ToxicCard className="p-4 bg-black/80 border-toxic-neon/30">
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
            
            <ToxicCard className="p-4 bg-black/80 border-toxic-neon/30">
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
            
            <ToxicCard className="p-4 bg-black/80 border-toxic-neon/30">
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
            
            <ToxicCard className="p-4 bg-black/80 border-toxic-neon/30">
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
          </div>
          
          <ToxicCard className="p-4 mb-8 bg-black/80 border-toxic-neon/30">
            <h3 className="text-lg font-mono text-toxic-neon mb-2">Status Distribution</h3>
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
        </>
      )}
    </div>
  );
};

export default Settlements;
