import { Coins, Wallet, BadgeCheck, UsersRound, GanttChartSquare, Building2, ChartPie, ArrowDownToLine, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const presaleData = [
  { name: 'Presale Stake', value: 100, color: '#14b8a6', description: 'Reserved for early platform supporters. 5M tokens available at $0.10, with 1-year lock period and projected growth to $1.00.' }
];

const publicSaleData = [
  { name: 'Treasury', value: 30, color: '#14b8a6', description: 'Management company operations, collecting 2% management fee on acquisitions and 20% performance fee on distributions.' },
  { name: 'Public Sale', value: 50, color: '#0d9488', description: 'Trading liquidity pool ensuring market stability and token accessibility.' },
  { name: 'Community Rewards', value: 10, color: '#0f766e', description: 'Core team compensation for ongoing platform development and operations.' },
  { name: 'Partners', value: 10, color: '#115e59', description: 'Strategic partnerships and ecosystem growth initiatives.' }
];

export const WhatWeBuilding = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6 text-center">
          Investment Structure & Token Distribution
        </h2>

        <Tabs defaultValue="presale" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mx-auto mb-8 bg-black/40">
            <TabsTrigger 
              value="presale" 
              className="data-[state=active]:bg-yellow-500/20 text-white hover:text-white/90"
            >
              Platform Investment
            </TabsTrigger>
            <TabsTrigger 
              value="public" 
              className="data-[state=active]:bg-teal-500/20 text-white hover:text-white/90"
            >
              Professional Investment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presale">
            <p className="text-xl text-white/80 mb-12 text-center max-w-3xl mx-auto">
              Platform Investment: 5,000,000 LGR at $0.10
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
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {presaleData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="hover:opacity-80"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
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
              Professional Investment: 4,000,000 LGR for Accountant Acquisition Pool
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
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {publicSaleData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="hover:opacity-80"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
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

            {/* Management Fee Structure Section */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Management Fee Structure</h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <ArrowDownToLine className="w-8 h-8 text-yellow-400" />
                    <h4 className="text-xl font-semibold text-white">2% Management Fee</h4>
                  </div>
                  <p className="text-gray-300">
                    Applied at time of acquisition:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>2% of capital raised for each acquisition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Supports deal sourcing and due diligence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Funds platform operations and team</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-teal-400" />
                    <h4 className="text-xl font-semibold text-white">20% Performance Fee</h4>
                  </div>
                  <p className="text-gray-300">
                    Applied at time of distribution:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>20% of profits after return of capital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Incentivizes platform performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Aligns with traditional PE structures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Investment Flow Section */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Investment Flow</h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <ChartPie className="w-8 h-8 text-yellow-400" />
                    <h4 className="text-xl font-semibold text-white">Initial Investment</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>98% goes to acquisition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>2% management fee to treasury</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-teal-400" />
                    <h4 className="text-xl font-semibold text-white">Profit Distribution</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>70% to RWA token holders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>20% performance fee to management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>10% reflections to LGR holders</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Token Benefits Section */}
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* LGR Token Section */}
              <div className="space-y-8">
                <div className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Coins className="w-8 h-8 text-yellow-400" />
                  <span>LGR Token Benefits</span>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <Wallet className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Price Appreciation</h3>
                    <p className="text-gray-300">
                      Potential growth from $0.10 to $1.00 through platform development and adoption.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <UsersRound className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Reflection Rewards</h3>
                    <p className="text-gray-300">
                      Earn 10% of all firm distributions, creating passive income from platform success.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <BadgeCheck className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Platform Growth</h3>
                    <p className="text-gray-300">
                      Participate in the overall success of the platform through token value appreciation.
                    </p>
                  </div>
                </div>
              </div>

              {/* RWA Token Section */}
              <div className="space-y-8">
                <div className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-teal-400" />
                  <span>RWA Token Benefits</span>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <Coins className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Direct Ownership</h3>
                    <p className="text-gray-300">
                      Receive 70% of firm profits through direct fractional ownership.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <GanttChartSquare className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Professional Control</h3>
                    <p className="text-gray-300">
                      Maintain industry standards through accountant-led governance and operations.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                    <div className="mb-4">
                      <Coins className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Network Access</h3>
                    <p className="text-gray-300">
                      Join a professional network of accountant-owners with shared interests.
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
