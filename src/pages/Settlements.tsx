
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SettlementsHistory } from "@/components/settlements/SettlementsHistory";
import { SettlementsNavBar } from "@/components/settlements/SettlementsNavBar";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Building2, Users, Archive, Clock, Shield, Gavel, User } from "lucide-react";

export default function Settlements() {
  const location = useLocation();
  const currentPath = location.pathname;
  
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

  // Customize view based on current route
  const renderPageTitle = () => {
    switch (currentPath) {
      case "/governance":
        return {
          title: "Governance",
          description: "Participate in governance decisions for settlements you've contributed to as a Sentinel.",
          icon: <Gavel className="w-8 h-8 text-blue-400 mb-3" />
        };
      case "/my-settlements":
        return {
          title: "My Contributions",
          description: "View and manage all the settlements you've contributed to as a Sentinel.",
          icon: <User className="w-8 h-8 text-blue-400 mb-3" />
        };
      default:
        return {
          title: "Settlements",
          description: "Discover and support settlements being built in the wasteland.",
          icon: <Shield className="w-8 h-8 text-blue-400 mb-3" />
        };
    }
  };

  const { title, description, icon } = renderPageTitle();

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col space-y-8">
          {/* Custom Header for different routes */}
          {currentPath !== "/settlements" && (
            <div className="text-center mb-8">
              {icon}
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">{description}</p>
            </div>
          )}
          
          {/* Regular NavBar for the main settlements page */}
          {currentPath === "/settlements" && <SettlementsNavBar />}
          
          {/* Dashboard Overview - only show on main settlements page */}
          {currentPath === "/settlements" && (
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
                          contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-around text-xs text-gray-300 mt-2">
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
          )}
          
          {/* Settlement Grid */}
          <SettlementsHistory />
        </div>
      </div>
    </div>
  );
}
