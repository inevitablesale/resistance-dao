
import { Card } from "./ui/card";
import { Milestone } from "lucide-react";
import { cn } from "@/lib/utils";

export const Roadmap = () => {
  const phases = [
    {
      title: "Phase 1: Foundation",
      subtitle: "Q1 2025",
      items: [
        "Market Analysis & Strategic Partnerships",
        "Tokenomics Development & Whitepaper",
        "Smart Contract Development & Audit"
      ]
    },
    {
      title: "Phase 2: Private Sale",
      subtitle: "Q2 2025",
      items: [
        "Launch Private Token Sale",
        "Investor Dashboard Development",
        "Secondary Marketplace Launch"
      ]
    },
    {
      title: "Phase 3: Public Sale",
      subtitle: "Q3 2025",
      items: [
        "Launch Public Presale",
        "Marketing Campaign Execution",
        "Begin Acquisition Planning"
      ]
    },
    {
      title: "Phase 4: First Acquisition",
      subtitle: "Q4 2025",
      items: [
        "First Firm Acquisition",
        "Operational Transition",
        "Performance Metrics Sharing"
      ]
    },
    {
      title: "Phase 5: Scaling",
      subtitle: "Q1-Q2 2026",
      items: [
        "Secondary Market Expansion",
        "Portfolio Growth",
        "Profit Reinvestment"
      ]
    }
  ];

  return (
    <section id="roadmap" className="py-16 relative overflow-hidden">
      {/* Black Hole Effect Background */}
      <div className="absolute inset-0 opacity-90">
        <div 
          className="absolute inset-0 bg-[#000000e6] animate-singularity"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, #000000e6 70%)',
          }}
        />
        {/* Event Horizon Glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(234,179,8,0.15) 0%, rgba(45,212,191,0.1) 30%, transparent 70%)',
            animation: 'cosmic-pulse 4s ease-in-out infinite'
          }}
        />
        {/* Accretion Disk */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #eab308 0%, #2dd4bf 25%, #eab308 50%, #2dd4bf 75%, #eab308 100%)',
            animation: 'orbit 20s linear infinite'
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
