
import React from 'react';
import { motion } from 'framer-motion';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { BarChart, Coins, TrendingUp, Zap, ArrowUpRight, Database } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResourceFlowProps {
  currentRadiation: number;
  totalHolders: number;
}

export const ResourceFlow = ({ currentRadiation, totalHolders }: ResourceFlowProps) => {
  // Data generation based on radiation level and holders
  const generateResourceData = () => {
    const baseProduction = Math.max(0, 100 - currentRadiation);
    const multiplier = 1 + (totalHolders * 0.1);
    
    return [
      { name: 'Knowledge', value: baseProduction * multiplier * 1.2, color: '#39FF14' },
      { name: 'Technology', value: baseProduction * multiplier * 0.9, color: '#5E5CE6' },
      { name: 'Agriculture', value: baseProduction * multiplier * 1.1, color: '#34C759' },
      { name: 'Medical', value: baseProduction * multiplier * 0.8, color: '#FF2D55' },
      { name: 'Energy', value: baseProduction * multiplier * 1.0, color: '#FF9500' }
    ];
  };
  
  const generateEfficiencyData = () => {
    // Efficiency increases as radiation decreases
    const efficiency = Math.max(0, 100 - currentRadiation) / 100;
    
    // Dynamic data based on efficiency
    return [
      { name: 'Day 1', efficiency: 10 * efficiency },
      { name: 'Day 2', efficiency: 12 * efficiency },
      { name: 'Day 3', efficiency: 18 * efficiency },
      { name: 'Day 4', efficiency: 22 * efficiency },
      { name: 'Day 5', efficiency: 26 * efficiency },
      { name: 'Day 6', efficiency: 32 * efficiency },
      { name: 'Day 7', efficiency: 38 * efficiency },
    ];
  };
  
  const resourceData = generateResourceData();
  const efficiencyData = generateEfficiencyData();
  
  // Calculate overall economic activity (0-100)
  const calculateEconomicActivity = () => {
    // Base calculation from radiation level
    const baseActivity = Math.max(0, 100 - currentRadiation);
    // Activity multiplier based on holder count
    const activityMultiplier = 1 + (totalHolders * 0.05);
    // Final calculation with cap at 100
    return Math.min(100, baseActivity * activityMultiplier);
  };
  
  const economicActivity = calculateEconomicActivity();
  
  // Generate resource flow metrics
  const getResourceGrowthRate = () => {
    const baseGrowth = 0.5 + (Math.max(0, 100 - currentRadiation) / 20);
    return baseGrowth.toFixed(1);
  };
  
  const getKnowledgeRecoveryRate = () => {
    return Math.max(0, Math.min(100, 5 + (100 - currentRadiation) * 0.9)).toFixed(1);
  };
  
  const getTotalRecoveredData = () => {
    const baseData = 100 * (100 - currentRadiation) * (1 + totalHolders * 0.1);
    return (baseData / 100).toFixed(1);
  };
  
  return (
    <div className="bg-black/80 border border-toxic-neon/20 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-5 w-5 text-toxic-neon" />
        <h2 className="text-toxic-neon font-mono text-lg">Economic Activity</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70">System Efficiency</span>
            <span className="text-toxic-neon font-mono">{economicActivity.toFixed(1)}%</span>
          </div>
          <ToxicProgress value={economicActivity} variant="radiation" className="h-3 mb-5" />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-black/50 rounded p-3 border border-toxic-neon/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-toxic-neon" />
                <span className="text-xs text-white/60">Growth Rate</span>
              </div>
              <div className="text-toxic-neon font-mono text-lg">+{getResourceGrowthRate()}%</div>
              <div className="text-white/40 text-xs">per day</div>
            </div>
            
            <div className="bg-black/50 rounded p-3 border border-toxic-neon/10">
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-4 w-4 text-toxic-neon" />
                <span className="text-xs text-white/60">Knowledge Recovery</span>
              </div>
              <div className="text-toxic-neon font-mono text-lg">{getKnowledgeRecoveryRate()}%</div>
              <div className="text-white/40 text-xs">of archive</div>
            </div>
          </div>
          
          <div className="bg-black/50 rounded p-3 border border-toxic-neon/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-white/60">Net Resource Production</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-amber-400 font-mono text-2xl">{getTotalRecoveredData()}</div>
                <div className="text-white/40 text-xs">archive units per hour</div>
              </div>
              <div className="text-toxic-neon flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+{(economicActivity / 10).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[230px]">
          <div className="text-white/60 text-sm mb-2">Production Efficiency Trend</div>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={efficiencyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(57,255,20,0.3)',
                  borderRadius: '4px'
                }} 
              />
              <Bar dataKey="efficiency" fill="#39FF14" opacity={0.8} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <div className="text-white/60 text-sm mb-3">Resource Production</div>
        <div className="space-y-3">
          {resourceData.map((resource) => (
            <div key={resource.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">{resource.name}</span>
                <span className="text-white/70">{resource.value.toFixed(1)} units/h</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: resource.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(resource.value / resourceData[0].value) * 100}%` }}
                  transition={{ duration: 1, delay: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
