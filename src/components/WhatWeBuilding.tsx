
import { Coins, Wallet, BadgeCheck, UsersRound, GanttChartSquare, Building2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Presale', value: 30, color: '#14b8a6', description: 'Reserved for early supporters who believe in the future of decentralized accounting.' },
  { name: 'Treasury', value: 30, color: '#0d9488', description: 'For protocol growth, development, and sustainability of the ecosystem.' },
  { name: 'Marketing', value: 20, color: '#0f766e', description: 'Allocated for community growth and awareness initiatives to expand the LedgerFund ecosystem.' },
  { name: 'Team', value: 10, color: '#0f766e', description: 'Supporting the core team building and maintaining the protocol.' },
  { name: 'Partners', value: 10, color: '#115e59', description: 'Reserved for strategic partnerships and ecosystem development.' }
];

export const WhatWeBuilding = () => {
  return (
    <section className="py-16 relative">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6 text-center">
          LGR Token Distribution
        </h2>
        
        <p className="text-xl text-white/80 mb-12 text-center max-w-3xl mx-auto">
          Total Supply: 1,510,000,000 LGR
        </p>

        {/* Token Distribution Chart */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="h-[400px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={160}
                  innerRadius={100}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {data.map((entry, index) => (
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
            {data.map((segment, index) => (
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
                  Access platform features and participate in the tokenized accounting firm ecosystem.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                <div className="mb-4">
                  <BadgeCheck className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Reward Distribution</h3>
                <p className="text-gray-300">
                  Earn rewards from platform activities and contribute to the ecosystem's growth.
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
      </div>
    </section>
  );
};
