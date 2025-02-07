import { Coins, Wallet, BadgeCheck, UsersRound, GanttChartSquare, Building2, ChartPie, ArrowDownToLine, BarChart3, Building } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";

const presaleData = [
  { 
    name: 'Protocol Investment', 
    value: 100, 
    color: '#9b87f5',
    description: 'Two distinct investment tracks within the protocol enable diverse participation in accounting firm acquisitions.',
    className: 'col-span-2 text-center'
  }
];

const publicSaleData = [
  { 
    name: 'Treasury', 
    value: 30, 
    color: '#14b8a6',
    description: 'Strategic treasury management by third-party vault provider ensures secure and transparent fund management for accounting firm acquisitions.',
    className: 'col-span-1'
  },
  { 
    name: 'Firm Investment', 
    value: 50, 
    color: '#14b8a6',
    description: 'Dedicated allocation for accountants to invest in practices identified and vetted by the DAO community.',
    className: 'col-span-1'
  },
  { 
    name: 'Community Rewards', 
    value: 10, 
    color: '#14b8a6',
    description: 'Incentives for active DAO participation including practice identification, due diligence, and community growth initiatives.',
    className: 'col-span-1'
  },
  { 
    name: 'Partners', 
    value: 10, 
    color: '#14b8a6',
    description: 'Strategic partnerships with banks, staffing agencies, technology providers supporting practice acquisitions.',
    className: 'col-span-1'
  }
];

const investmentOptions = [
  {
    name: 'Passive Investment',
    description: 'Hold LGR tokens to earn passive reflections from all accounting firm investments and protocol fees.',
    color: '#F2FCE2',
    icon: ChartPie,
    energyColor: '#9b87f5'
  },
  {
    name: 'Active Investment',
    description: 'Participate in firm acquisitions, due diligence, and governance while earning enhanced rewards.',
    color: '#F2FCE2',
    icon: UsersRound,
    energyColor: '#14b8a6'
  }
];

export const WhatWeBuilding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const blackholeRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 });
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollPercentage = Math.max(0, Math.min(1, 
        1 - (rect.top / window.innerHeight)
      ));
      
      setScrollProgress(scrollPercentage);

      if (blackholeRef.current) {
        const bhRect = blackholeRef.current.getBoundingClientRect();
        setCenterPoint({
          x: bhRect.left + bhRect.width / 2,
          y: bhRect.top + bhRect.height / 2
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateEnergyStyles = (element: HTMLElement | null, energyColor: string) => {
    if (!element || !blackholeRef.current) return {};
    
    const rect = element.getBoundingClientRect();
    const elementCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const angle = Math.atan2(
      centerPoint.y - elementCenter.y,
      centerPoint.x - elementCenter.x
    );

    const distance = Math.sqrt(
      Math.pow(centerPoint.x - elementCenter.x, 2) +
      Math.pow(centerPoint.y - elementCenter.y, 2)
    );

    const normalizedDistance = Math.min(1, distance / 500);
    const intensity = (1 - normalizedDistance) * scrollProgress;

    return {
      '--flow-x': `${Math.cos(angle) * 100}px`,
      '--flow-y': `${Math.sin(angle) * 100}px`,
      '--energy-opacity': intensity,
      '--energy-color': energyColor,
    } as React.CSSProperties;
  };

  return (
    <section ref={sectionRef} className="py-16 relative overflow-hidden min-h-screen perspective-3000">
      <div className="absolute inset-0 opacity-90">
        <div 
          ref={blackholeRef}
          className="absolute inset-0 transition-transform duration-300"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, #000000e6 70%)',
            transform: `scale(${1 + scrollProgress * 0.5})`
          }}
        />
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{
            background: 'radial-gradient(circle at center, rgba(234,179,8,0.15) 0%, rgba(45,212,191,0.1) 30%, transparent 70%)',
            animation: 'cosmic-pulse 4s ease-in-out infinite',
            transform: `scale(${1 + scrollProgress * 0.3})`
          }}
        />
      </div>

      <div className="container px-4 relative z-10">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6 text-center">
          Token Distribution & Governance
        </h2>

        <div className="text-center mb-16">
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Carefully designed tokenomics that align protocol growth with token holder value, enabling decentralized governance of the world's first accountant-owned practice acquisition engine.
          </p>
        </div>

        <Tabs defaultValue="platform" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mx-auto mb-8 bg-gradient-to-r from-yellow-950/50 to-teal-950/50 backdrop-blur-sm">
            <TabsTrigger 
              value="platform" 
              className="data-[state=active]:bg-gradient-to-r from-yellow-500/90 to-yellow-600/90 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/80 hover:text-white transition-all duration-300"
            >
              Protocol Investment
            </TabsTrigger>
            <TabsTrigger 
              value="professional" 
              className="data-[state=active]:bg-gradient-to-r from-teal-500/90 to-teal-600/90 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/80 hover:text-white transition-all duration-300"
            >
              Firm Investment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="relative">
            <p className="text-xl text-white/80 mb-12 text-center max-w-3xl mx-auto">
              Presale Allocation: 5,000,000 LGR
            </p>
            <div className="flex flex-col items-center mb-20">
              <div className="grid grid-cols-1 gap-6 max-w-2xl mb-12">
                {presaleData.map((segment, index) => {
                  const orbitRadius = 20 + index * 10;
                  const orbitDuration = 20 + index * 5;
                  const offsetX = mousePosition.x * (10 + index * 5);
                  const offsetY = mousePosition.y * (10 + index * 5);

                  return (
                    <div 
                      key={segment.name}
                      className={`relative group animate-cosmic-pulse astral-energy ${segment.className}`}
                      style={{
                        ...calculateEnergyStyles(sectionRef.current, segment.color),
                        '--energy-color': segment.color,
                        animation: `orbit ${orbitDuration}s linear infinite`,
                        transform: `translate(${offsetX}px, ${offsetY}px)`,
                        transition: 'transform 0.3s ease-out'
                      } as React.CSSProperties}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 to-teal-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                      
                      <div 
                        className="p-6 rounded-lg backdrop-blur border transition-all duration-500 relative z-10
                                 bg-black/30 border-yellow-500/20 hover:border-yellow-500/40
                                 hover:translate-y-[-4px] hover:rotate-1
                                 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.2)]"
                      >
                        <div className="flex items-center gap-3 mb-2 justify-center">
                          <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: segment.color }} />
                          <h3 className="text-xl font-semibold text-white">
                            {segment.name}
                          </h3>
                        </div>
                        <p className="text-gray-300 text-center">
                          {segment.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-white text-center mb-8">Investment Options</h3>
                  {investmentOptions.map((option, index) => (
                    <div 
                      key={option.name}
                      ref={el => optionRefs.current[index] = el}
                      className="relative group astral-energy"
                      style={calculateEnergyStyles(optionRefs.current[index], option.energyColor)}
                    >
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at center, ${option.energyColor}20 0%, transparent 70%)`,
                          animation: 'cosmic-pulse 4s ease-in-out infinite',
                        }}
                      />
                      
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 to-teal-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                      
                      <div className="p-6 rounded-lg backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 relative bg-black/30 hover:translate-y-[-4px]">
                        <option.icon className="w-8 h-8 text-yellow-400 mb-4" />
                        <h4 className="text-xl font-semibold text-white mb-2">{option.name}</h4>
                        <p className="text-gray-300">{option.description}</p>
                        
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at center, ${option.energyColor}10 0%, transparent 70%)`,
                            animation: 'particle-flow 2s ease-out infinite',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professional" className="relative">
            <p className="text-xl text-white/80 mb-12 text-center max-w-3xl mx-auto">
              Firm Investment: 4,000,000 LGR at $1.00
            </p>
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="grid grid-cols-2 gap-6 relative col-span-2">
                {publicSaleData.map((segment, index) => {
                  const orbitRadius = 20 + index * 10;
                  const orbitDuration = 20 + index * 5;
                  const offsetX = mousePosition.x * (10 + index * 5);
                  const offsetY = mousePosition.y * (10 + index * 5);

                  return (
                    <div 
                      key={segment.name}
                      className={`relative group animate-cosmic-pulse ${segment.className}`}
                      style={{
                        animation: `orbit ${orbitDuration}s linear infinite`,
                        transform: `translate(${offsetX}px, ${offsetY}px)`,
                        transition: 'transform 0.3s ease-out'
                      }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/30 to-yellow-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                      
                      <div 
                        className="p-6 rounded-lg backdrop-blur border transition-all duration-500 relative z-10
                                 bg-black/30 border-teal-500/20 hover:border-teal-500/40
                                 hover:translate-y-[-4px] hover:rotate-1
                                 group-hover:shadow-[0_0_25px_rgba(45,212,191,0.2)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: segment.color }} />
                          <h3 className="text-xl font-semibold text-white">
                            {segment.name} ({segment.value}%)
                          </h3>
                        </div>
                        <p className="text-gray-300">
                          {segment.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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

            <div className="mb-20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Firm Management Structure</h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-8 h-8 text-yellow-400" />
                    <h4 className="text-xl font-semibold text-white">Management Services Company</h4>
                  </div>
                  <p className="text-gray-300">
                    Day-to-day operations are handled by a dedicated management services company that:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Provides operational oversight and strategic guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Implements best practices across acquired firms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Manages staffing, technology, and growth initiatives</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <UsersRound className="w-8 h-8 text-teal-400" />
                    <h4 className="text-xl font-semibold text-white">LP Governance Rights</h4>
                  </div>
                  <p className="text-gray-300">
                    RWA token holders (Limited Partners) participate in key decisions through:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Quarterly voting on management company performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Approval of major strategic initiatives and acquisitions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Input on service expansion and technology investments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Ability to propose and vote on management changes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
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
                    <h3 className="text-xl font-semibold text-white mb-2">Platform Governance</h3>
                    <p className="text-gray-300">
                      LGR holders participate in platform governance decisions and contribute to the development of the ecosystem.
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
                    <h3 className="text-xl font-semibold text-white mb-2">Platform Development</h3>
                    <p className="text-gray-300">
                      Support the growth of decentralized accounting firm ownership and professional control.
                    </p>
                  </div>
                </div>
              </div>

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
                    <h3 className="text-xl font-semibold text-white mb-2">Voting Rights</h3>
                    <p className="text-gray-300">
                      Participate in governance decisions for the firm (resourcing, budgeting, processes)
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
