import { Card } from "./ui/card";
import { Milestone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

export const Roadmap = () => {
  const [blackHoleScale, setBlackHoleScale] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate visibility percentage as section enters viewport
      const visibilityPercent = Math.max(0, Math.min(1, 
        1 - (rect.top / windowHeight)
      ));
      
      // When scrolling back up, scale back down
      const scrollUpAdjustment = Math.max(0, Math.min(1,
        1 - (Math.abs(rect.bottom) / windowHeight)
      ));
      
      // Use the minimum of both values to ensure proper scaling in both directions
      const scale = Math.min(visibilityPercent, scrollUpAdjustment);
      setBlackHoleScale(1 + (scale * 0.5)); // Scale from 1x to 1.5x
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phases = [
    {
      title: "Phase 1: Foundation",
      subtitle: "Q1 2025",
      items: [
        "Website Development",
        "Token Contract Development",
        "Presale Contract Development",
        "Listed on top100token.com and coinmooner.com",
        "Applied for Polygon Community Grant",
        "Developed Litepaper",
        "Launched Presale",
        "Onboard Partners into Ecosystem",
        "Soft Cap: $250K"
      ]
    },
    {
      title: "Phase 2: Growth & Integration",
      subtitle: "Q2 2025",
      items: [
        "Apply for Direct Listing with Banxa",
        "Launch LedgerFren NFT Platform",
        "Form DAO in Wyoming",
        "Launch Community",
        "Apply to CoinGeko and CoinMarketCap for listings",
        "Release Deal Thesis and Firm Bounties",
        "Hard Cap: $500K"
      ]
    },
    {
      title: "Phase 3: Infrastructure & Deal Flow",
      subtitle: "Q3 2025",
      items: [
        "Integrate flowinc.com for SPV Management",
        "Deploy Deal Thesis Framework",
        "Deploy Liquidity Pool UI",
        "Launch Community Governance",
        "First Liquidity Pool Acquisitions Begin",
        "Launch Decentralized Marketplace",
        "Targeted Raise: $5M"
      ]
    }
  ];

  return (
    <section ref={sectionRef} id="roadmap" className="py-16 relative overflow-hidden">
      {/* Black Hole Effect Background */}
      <div className="absolute inset-0 opacity-90">
        <div 
          className="absolute inset-0 bg-[#000000e6] animate-singularity transition-transform duration-300"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, #000000e6 70%)',
            transform: `scale(${blackHoleScale})`
          }}
        />
        {/* Event Horizon Glow */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{
            background: 'radial-gradient(circle at center, rgba(234,179,8,0.15) 0%, rgba(45,212,191,0.1) 30%, transparent 70%)',
            animation: 'cosmic-pulse 4s ease-in-out infinite',
            transform: `scale(${blackHoleScale * 0.9})`
          }}
        />
        {/* Accretion Disk */}
        <div 
          className="absolute inset-0 opacity-20 transition-transform duration-300"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #eab308 0%, #2dd4bf 25%, #eab308 50%, #2dd4bf 75%, #eab308 100%)',
            animation: 'orbit 20s linear infinite',
            transform: `scale(${blackHoleScale * 1.1})`
          }}
        />
      </div>

      <div className="container px-4 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-400 to-yellow-300 mb-4 text-center animate-gradient">
            LedgerFund Roadmap
          </h2>
          <p className="text-xl text-gray-300 mb-12 text-center opacity-90">
            Decentralized Accounting Firm Ownership
          </p>

          {/* Desktop Timeline (Horizontal Scroll) */}
          <div className="hidden md:block overflow-x-auto pb-8">
            <div className="flex gap-6 min-w-max px-4">
              {phases.map((phase, index) => (
                <div 
                  key={phase.title}
                  className="group relative perspective-3000"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    transform: `perspective(3000px) translateZ(${index * 5}px)`
                  }}
                >
                  <Card className={cn(
                    "w-[300px] p-6 bg-black/40 backdrop-blur-xl border transition-all duration-500",
                    "hover:translate-y-[-4px] hover:rotate-y-[-5deg] animate-fade-in",
                    "border-yellow-500/20 hover:border-yellow-500/40",
                    "group-hover:shadow-[0_0_25px_rgba(234,179,8,0.2)]",
                    "after:absolute after:inset-0 after:bg-gradient-to-r after:from-yellow-500/5 after:via-teal-400/5 after:to-yellow-500/5 after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:opacity-100"
                  )}>
                    {/* Gravitational Lensing Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/30 to-teal-400/30 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                    
                    <div className="absolute -left-3 top-6 w-12 h-12 flex items-center justify-center bg-black/60 rounded-full border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                      <Milestone className="w-6 h-6 text-yellow-500 animate-cosmic-pulse" />
                    </div>
                    <div className="ml-8">
                      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-400 mb-2">
                        {phase.title}
                      </h3>
                      <div className="text-sm text-yellow-500/80 mb-4">{phase.subtitle}</div>
                      <ul className="space-y-2">
                        {phase.items.map((item, i) => (
                          <li 
                            key={i} 
                            className="flex items-center space-x-2 text-gray-300 opacity-90 hover:opacity-100 transition-opacity duration-300"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-teal-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                  
                  {/* Curved Connection Line with Particle Effect */}
                  {index < phases.length - 1 && (
                    <div className="absolute top-1/2 -right-6 w-6">
                      <div className="h-0.5 w-full bg-gradient-to-r from-yellow-500/40 to-teal-400/40 relative overflow-hidden">
                        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-500/60 to-teal-400/60" 
                             style={{
                               animation: 'cosmic-pulse 2s ease-in-out infinite'
                             }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline (Vertical Stack) */}
          <div className="md:hidden space-y-6">
            {phases.map((phase, index) => (
              <div 
                key={phase.title}
                className="group relative animate-fade-in"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <Card className="p-6 bg-black/40 backdrop-blur-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500 hover:translate-x-1">
                  {/* Gravitational Lensing Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/30 to-teal-400/30 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                  
                  <div className="absolute -left-3 top-6 w-12 h-12 flex items-center justify-center bg-black/60 rounded-full border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Milestone className="w-6 h-6 text-yellow-500 animate-cosmic-pulse" />
                  </div>
                  <div className="ml-8">
                    <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-400 mb-2">
                      {phase.title}
                    </h3>
                    <div className="text-sm text-yellow-500/80 mb-4">{phase.subtitle}</div>
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li 
                          key={i}
                          className="flex items-center space-x-2 text-gray-300 opacity-90 hover:opacity-100 transition-opacity duration-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-teal-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
                
                {/* Curved Connection Line with Particle Effect */}
                {index < phases.length - 1 && (
                  <div className="absolute left-[21px] top-[72px] w-0.5 h-[calc(100%+24px)]">
                    <div className="h-full w-full bg-gradient-to-b from-yellow-500/40 to-teal-400/40 relative overflow-hidden">
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-yellow-500/60 to-teal-400/60"
                           style={{
                             animation: 'cosmic-pulse 2s ease-in-out infinite'
                           }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
