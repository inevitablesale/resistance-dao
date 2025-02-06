
import { Coins, Wallet, BadgeCheck, UsersRound, GanttChartSquare, Building2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const presaleData = [
  { name: 'Presale Stake', value: 100, color: '#14b8a6', description: 'Reserved for early supporters who believe in the future of decentralized accounting acquisitions. 5M tokens available. 1 yr hold term.' }
];

const publicSaleData = [
  { name: 'Treasury', value: 40, color: '#14b8a6', description: 'Reserved tokens from presale phase, managed by protocol Treasury.' },
  { name: 'Public Sale', value: 40, color: '#0d9488', description: 'For protocol growth and sustainability. Collects voting fees, proposal fees, advertising revenue, and 5% from acquisitions and annual returns.' },
  { name: 'Community Rewards', value: 5, color: '#0f766e', description: 'Allocated for community incentives, governance participation, and ecosystem development initiatives.' },
  { name: 'Team', value: 10, color: '#0f766e', description: 'Supporting the core team building and maintaining the protocol.' },
  { name: 'Partners', value: 5, color: '#115e59', description: 'Reserved for strategic partnerships and ecosystem development.' }
];

export const WhatWeBuilding = () => {
  return (
    <section className="py-16 relative">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6 text-center">
          LGR Token Distribution
        </h2>

        <Tabs defaultValue="presale" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mx-auto mb-8 bg-black/40 relative z-10">
            <TabsTrigger 
              value="presale" 
              className="data-[state=active]:bg-yellow-500/20 text-white relative z-10 hover:text-white/90"
            >
              Presale (5M Supply)
            </TabsTrigger>
            <TabsTrigger 
              value="public" 
              className="data-[state=active]:bg-teal-500/20 text-white relative z-10 hover:text-white/90"
            >
              Public Sale (10M Supply)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presale">
            <p className="text-xl text-white/80 mb-12 text-center max-w-3xl mx-auto">
              Presale Total Supply: 5,000,000 LGR
            </p>
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="h-[400px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={presaleData}
                      cx="50%"
                      cy="50%"
                      outerRadius={160}
                      innerRadius={100}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {presaleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse blur-2xl" />
                </div>
              </div>

              <div className="space-y-6">
                {presaleData.map((segment, index) => (
                  <div 
                    key={segment.name}
                    className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
                      <h3 className="text-xl font-semibold text-white">
                        {segment.name} ({segment.value}%)
                      </h3>
                    </div>
                    <p className="text-gray-300">
                      {segment.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="public">
            <p className="text-xl text-white/80 mb-12 text-center max-w-3xl mx-auto">
              Public Sale Total Supply: 10,000,000 LGR
            </p>
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="h-[400px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={publicSaleData}
                      cx="50%"
                      cy="50%"
                      outerRadius={160}
                      innerRadius={100}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {publicSaleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent animate-pulse blur-2xl" />
                </div>
              </div>

              <div className="space-y-6">
                {publicSaleData.map((segment, index) => (
                  <div 
                    key={segment.name}
                    className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
                      <h3 className="text-xl font-semibold text-white">
                        {segment.name} ({segment.value}%)
                      </h3>
                    </div>
                    <p className="text-gray-300">
                      {segment.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Token Utility Section */}
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* LGR Token Section */}
              <div className="space-y-8">
                <div className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Coins className="w-8 h-8 text-yellow-400" />
                  <span>LGR Token (Liquidity)</span>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <Wallet className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Liquidity Provision</h3>
                    <p className="text-gray-300">
                      Provide liquidity to the protocol and earn rewards from platform fees and transactions.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <UsersRound className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Platform Access</h3>
                    <p className="text-gray-300">
                      View available deals and bid on service contracts within the ecosystem. Note: Platform access does not include participation in rewards or governance.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <BadgeCheck className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Service Bidding</h3>
                    <p className="text-gray-300">
                      Submit competitive bids for service contracts and professional opportunities within the network.
                    </p>
                  </div>
                </div>
              </div>

              {/* LP Token Section */}
              <div className="space-y-8">
                <div className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-teal-400" />
                  <span>LP Token (Ownership)</span>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <Coins className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Real Asset Backing</h3>
                    <p className="text-gray-300">
                      Represents direct fractional ownership in acquired firms, with value tied to firm performance.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <GanttChartSquare className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Structured Liquidity</h3>
                    <p className="text-gray-300">
                      Annual redemption windows after 3-year lock-up period, ensuring stability while providing exit options.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <Coins className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Profit Distribution</h3>
                    <p className="text-gray-300">
                      Receive proportional distributions from firm profits, creating passive income streams.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
