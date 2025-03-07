
import React, { useState, useEffect } from 'react';
import { ToxicCard } from "@/components/ui/toxic-card";
import { Target, Shield, Radiation, Coins, Users, Scale, Zap, Clock, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { ToxicProgress } from "@/components/ui/toxic-progress";

interface WastelandEconomyDashboardProps {
  role: "bounty-hunter" | "survivor" | null;
  className?: string;
}

type EconomyMetric = {
  name: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  max?: number;
};

type CommunityActivity = {
  id: number;
  type: "bounty" | "project" | "trade" | "settlement";
  title: string;
  amount: number;
  user: string;
  timeAgo: string;
  role: "bounty-hunter" | "survivor";
};

export function WastelandEconomyDashboard({ role, className }: WastelandEconomyDashboardProps) {
  const [metrics, setMetrics] = useState<EconomyMetric[]>([]);
  const [communityActivities, setCommunityActivities] = useState<CommunityActivity[]>([]);
  const [resourcePriority, setResourcePriority] = useState<string[]>([
    "Clean Water", "Ammunition", "Medical Supplies", "Building Materials", "Tech Components"
  ]);
  const [selectedMetric, setSelectedMetric] = useState<EconomyMetric | null>(null);
  const [impactSimulation, setImpactSimulation] = useState<{
    before: number;
    after: number;
    difference: number;
  } | null>(null);
  
  // Simulated data generation
  useEffect(() => {
    // Generate appropriate metrics based on role
    const roleMetrics: EconomyMetric[] = role === "bounty-hunter" 
      ? [
          { 
            name: "Active Bounties", 
            value: 147, 
            change: 12, 
            icon: <Target className="h-5 w-5" />,
            color: "text-apocalypse-red"
          },
          { 
            name: "Criminals Captured", 
            value: 68, 
            change: 5, 
            icon: <Radiation className="h-5 w-5" />,
            color: "text-toxic-neon"
          },
          { 
            name: "Recovered Assets", 
            value: 240482, 
            change: 24500, 
            icon: <Coins className="h-5 w-5" />,
            color: "text-toxic-neon"
          },
          { 
            name: "Network Security", 
            value: 72, 
            max: 100,
            change: 3, 
            icon: <Shield className="h-5 w-5" />,
            color: "text-toxic-neon"
          }
        ]
      : [
          { 
            name: "Active Settlements", 
            value: 37, 
            change: 2, 
            icon: <Users className="h-5 w-5" />,
            color: "text-toxic-neon"
          },
          { 
            name: "Community Projects", 
            value: 84, 
            change: 7, 
            icon: <Shield className="h-5 w-5" />,
            color: "text-toxic-neon"
          },
          { 
            name: "Resource Stability", 
            value: 68, 
            max: 100,
            change: 4, 
            icon: <Scale className="h-5 w-5" />,
            color: "text-toxic-neon"
          },
          { 
            name: "RD Circulation", 
            value: 1456822, 
            change: 45000, 
            icon: <Coins className="h-5 w-5" />,
            color: "text-toxic-neon"
          }
        ];
    
    setMetrics(roleMetrics);
    
    // Generate appropriate community activities
    const roleCommunityActivities: CommunityActivity[] = [
      {
        id: 1,
        type: "bounty",
        title: "High-value target captured in Sector 7",
        amount: 35000,
        user: "HunterX42",
        timeAgo: "12 min ago",
        role: "bounty-hunter"
      },
      {
        id: 2,
        type: "project",
        title: "Water purification system deployed",
        amount: 25000,
        user: "MedicUnit12",
        timeAgo: "34 min ago",
        role: "survivor"
      },
      {
        id: 3,
        type: "trade",
        title: "Resource exchange between settlements",
        amount: 15700,
        user: "TradeRoute7",
        timeAgo: "1 hr ago",
        role: "survivor"
      },
      {
        id: 4,
        type: "bounty",
        title: "Stolen protocol assets recovered",
        amount: 22400,
        user: "Tracker19",
        timeAgo: "2 hr ago",
        role: "bounty-hunter"
      },
      {
        id: 5,
        type: "settlement",
        title: "New outpost established in Toxic Zone",
        amount: 42000,
        user: "Builder_K7",
        timeAgo: "3 hr ago",
        role: "survivor"
      }
    ];
    
    // Filter activities to show more of the user's role
    const filteredActivities = role
      ? [...roleCommunityActivities.filter(a => a.role === role), ...roleCommunityActivities.filter(a => a.role !== role).slice(0, 2)]
      : roleCommunityActivities;
    
    setCommunityActivities(filteredActivities);
  }, [role]);
  
  // Format number for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // Format currency
  const formatCurrency = (num: number) => {
    return formatNumber(num) + ' RD';
  };
  
  // Handle simulating impact
  const simulateImpact = (amount: number) => {
    if (!selectedMetric) return;
    
    // Simple simulation - can be made more complex in the future
    const impact = {
      before: selectedMetric.value,
      after: selectedMetric.value + Math.floor(amount * 0.1),
      difference: Math.floor(amount * 0.1)
    };
    
    setImpactSimulation(impact);
  };
  
  return (
    <div className={`wasteland-economy-dashboard ${className || ''}`}>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Radiation className="h-5 w-5 mr-2 text-toxic-neon" />
          <h3 className="text-lg font-mono text-toxic-neon">Wasteland Economy Dashboard</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <ToxicCard 
              key={index} 
              className={`relative bg-black/70 border-toxic-neon/30 hover:border-toxic-neon/60 transition-all cursor-pointer ${selectedMetric === metric ? 'border-toxic-neon bg-toxic-neon/5' : ''}`}
              onClick={() => setSelectedMetric(metric === selectedMetric ? null : metric)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-2 ${metric.color}`}>
                    {metric.icon}
                    <span className="text-sm">{metric.name}</span>
                  </div>
                  <div className={`text-xs ${metric.change > 0 ? 'text-toxic-neon flex items-center' : 'text-apocalypse-red flex items-center'}`}>
                    {metric.change > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {metric.change}%
                  </div>
                </div>
                
                <div className="text-xl font-semibold text-white">
                  {metric.name.includes("Captured") || metric.name.includes("Bounties") || metric.name.includes("Settlements") || metric.name.includes("Projects")
                    ? formatNumber(metric.value)
                    : metric.name.includes("Assets") || metric.name.includes("Circulation")
                      ? formatCurrency(metric.value)
                      : metric.max
                        ? `${metric.value}%`
                        : formatNumber(metric.value)
                  }
                </div>
                
                {metric.max && (
                  <div className="mt-2">
                    <ToxicProgress value={metric.value} max={metric.max} className="h-1" />
                  </div>
                )}
              </div>
            </ToxicCard>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Resource allocation priorities */}
        <ToxicCard className="bg-black/70 border-toxic-neon/30">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <Scale className="h-5 w-5 mr-2 text-toxic-neon" />
              <h4 className="text-sm font-mono text-toxic-neon">Resource Allocation Priorities</h4>
            </div>
            
            <div className="space-y-3">
              {resourcePriority.map((resource, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-sm">{resource}</span>
                    <span className="text-toxic-neon text-xs">{90 - index * 15}%</span>
                  </div>
                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden group-hover:bg-black/40 transition-colors">
                    <div 
                      className="h-full bg-toxic-neon/70 rounded-full"
                      style={{ width: `${90 - index * 15}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-2 border border-toxic-neon/20 rounded bg-black/40">
              <div className="text-xs text-white/70 flex items-center">
                <Clock className="h-3 w-3 mr-1 text-toxic-neon" />
                Next reallocation voting: <span className="text-toxic-neon ml-1">12h 34m</span>
              </div>
            </div>
          </div>
        </ToxicCard>
        
        {/* Community activities feed */}
        <ToxicCard className="bg-black/70 border-toxic-neon/30">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-toxic-neon" />
                <h4 className="text-sm font-mono text-toxic-neon">Community Activity</h4>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-toxic-neon/70">
                <div className="w-2 h-2 bg-toxic-neon rounded-full animate-pulse" />
                Live Feed
              </div>
            </div>
            
            <div className="space-y-3">
              {communityActivities.map(activity => (
                <div key={activity.id} className="border-b border-toxic-neon/10 last:border-0 pb-2 last:pb-0">
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.role === "bounty-hunter" ? 'bg-apocalypse-red/20' : 'bg-toxic-neon/20'
                    }`}>
                      {activity.type === "bounty" && <Target className="h-4 w-4 text-apocalypse-red" />}
                      {activity.type === "project" && <Shield className="h-4 w-4 text-toxic-neon" />}
                      {activity.type === "trade" && <Coins className="h-4 w-4 text-toxic-neon" />}
                      {activity.type === "settlement" && <Users className="h-4 w-4 text-toxic-neon" />}
                    </div>
                    
                    <div>
                      <div className="text-white/90 text-sm">{activity.title}</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-toxic-neon text-xs">{formatCurrency(activity.amount)}</div>
                        <div className="text-white/50 text-xs flex items-center gap-1">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ToxicCard>
        
        {/* Impact Simulation Panel */}
        <ToxicCard className="bg-black/70 border-toxic-neon/30">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <Zap className="h-5 w-5 mr-2 text-toxic-neon" />
              <h4 className="text-sm font-mono text-toxic-neon">Impact Simulator</h4>
            </div>
            
            {!selectedMetric ? (
              <div className="text-center py-6">
                <div className="text-white/50 text-sm mb-2">Select a metric to simulate impact</div>
                <div className="text-xs text-white/30">Click any card in the dashboard</div>
              </div>
            ) : (
              <div>
                <div className="mb-4 p-2 border border-toxic-neon/20 bg-black/40 rounded">
                  <div className="text-white/70 text-sm mb-1">Selected Metric:</div>
                  <div className="flex items-center gap-2 text-toxic-neon">
                    {selectedMetric.icon}
                    <span>{selectedMetric.name}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-white/70 text-sm mb-2">Simulate contribution:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1000, 5000, 10000].map(amount => (
                      <button 
                        key={amount}
                        className="p-2 bg-black/60 border border-toxic-neon/30 rounded text-toxic-neon text-sm hover:bg-toxic-neon/10 transition-colors"
                        onClick={() => simulateImpact(amount)}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {impactSimulation && (
                  <div className="p-3 bg-toxic-neon/5 border border-toxic-neon/20 rounded">
                    <div className="text-white/70 text-xs mb-2">Predicted Impact:</div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="text-center">
                        <div className="text-xs text-white/50">Before</div>
                        <div className="text-toxic-neon">
                          {selectedMetric.max 
                            ? `${impactSimulation.before}%` 
                            : selectedMetric.name.includes("Assets") || selectedMetric.name.includes("Circulation")
                              ? formatCurrency(impactSimulation.before)
                              : formatNumber(impactSimulation.before)
                          }
                        </div>
                      </div>
                      
                      <div className="text-center flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-toxic-neon" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-white/50">After</div>
                        <div className="text-toxic-neon">
                          {selectedMetric.max 
                            ? `${impactSimulation.after}%` 
                            : selectedMetric.name.includes("Assets") || selectedMetric.name.includes("Circulation")
                              ? formatCurrency(impactSimulation.after)
                              : formatNumber(impactSimulation.after)
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center p-1 bg-toxic-neon/10 rounded text-xs text-toxic-neon">
                      +{impactSimulation.difference} ({(impactSimulation.difference / impactSimulation.before * 100).toFixed(1)}% increase)
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ToxicCard>
      </div>
    </div>
  );
}
