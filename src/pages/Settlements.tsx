
import { useState } from "react";
import { Link } from "react-router-dom";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { SettlementsHistory } from "@/components/settlements/SettlementsHistory";
import { SettlementsNavBar } from "@/components/settlements/SettlementsNavBar";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Building2, Users, Archive, Clock } from "lucide-react";

export default function Settlements() {
  // Mock data for the dashboard metrics
  const settlementStats = {
    activeCount: 8,
    totalSettlements: 12,
    totalInvestors: 156,
    totalFunding: 320, // ETH
    avgFundingRate: 67, // percent
  };
  
  // Data for pie chart
  const statusData = [
    { name: 'Active', value: 8, color: '#22c55e' },
    { name: 'Funded', value: 3, color: '#3b82f6' },
    { name: 'Failed', value: 1, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <SettlementsNavBar />
          
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Key metrics */}
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-[#111] border-white/5">
                <CardContent className="p-4 flex flex-col">
                  <span className="text-gray-400 text-sm mb-2">Active</span>
                  <div className="flex items-center">
                    <Building2 className="text-blue-400 mr-2 w-5 h-5" />
                    <span className="text-2xl font-bold">{settlementStats.activeCount}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#111] border-white/5">
                <CardContent className="p-4 flex flex-col">
                  <span className="text-gray-400 text-sm mb-2">Sentinels</span>
                  <div className="flex items-center">
                    <Users className="text-blue-400 mr-2 w-5 h-5" />
                    <span className="text-2xl font-bold">{settlementStats.totalInvestors}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#111] border-white/5">
                <CardContent className="p-4 flex flex-col">
                  <span className="text-gray-400 text-sm mb-2">Total ETH</span>
                  <div className="flex items-center">
                    <Archive className="text-blue-400 mr-2 w-5 h-5" />
                    <span className="text-2xl font-bold">{settlementStats.totalFunding}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#111] border-white/5">
                <CardContent className="p-4 flex flex-col">
                  <span className="text-gray-400 text-sm mb-2">Avg Funding</span>
                  <div className="flex items-center">
                    <Clock className="text-blue-400 mr-2 w-5 h-5" />
                    <span className="text-2xl font-bold">{settlementStats.avgFundingRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Status distribution */}
            <Card className="bg-[#111] border-white/5">
              <CardContent className="p-4">
                <h3 className="text-sm text-gray-400 mb-2">Settlement Status</h3>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value} Settlements`, 'Count']}
                        labelFormatter={(index: number) => statusData[index].name}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around text-xs text-gray-400 mt-2">
                  {statusData.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        style={{ backgroundColor: entry.color }} 
                        className="w-3 h-3 rounded-full mr-1"
                      />
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Settlement Grid */}
          <SettlementsHistory />
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
