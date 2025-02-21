
import { Trophy, Award, Star, Rocket, Users, Shield, Orbit, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        <div className="mt-20 pt-20">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
            Ecosystem & Partnerships
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-lg bg-black/30 border border-white/10 hover:bg-black/40 transition-all duration-300 group">
              <div className="relative w-12 h-12 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-teal-500/20 rounded-full animate-cosmic-pulse" />
                <div className="absolute inset-0 bg-black/40 rounded-full backdrop-blur-sm" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-400 animate-cosmic-pulse">
                  $25
                </span>
                <div className="absolute inset-0 rounded-full glow-border" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Launch Your Token</h3>
              <p className="text-gray-300">
                Start your crypto journey with just $25. No fancy pitch decks or VC connections needed - just your vision and our platform.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black/30 border border-white/10 hover:bg-black/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-6">
                <Orbit className="w-6 h-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community Network</h3>
              <p className="text-gray-300">
                Join our thriving community of innovators and supporters. Connect, collaborate, and grow together.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black/30 border border-white/10 hover:bg-black/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Safe & Transparent</h3>
              <p className="text-gray-300">
                Every vote and commitment is tracked on-chain. Build trust through transparency.
              </p>
            </div>
          </div>

          {/* Partner Network Showcase */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-white mb-8">Our Partner Network</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { category: "Financial Services", items: ["Banking Solutions", "Payment Processing", "Investment Management"] },
                { category: "Technology", items: ["Cloud Infrastructure", "Practice Management", "Security Solutions"] },
                { category: "Professional Services", items: ["Legal Advisory", "Compliance Support", "Industry Research"] },
                { category: "Support Services", items: ["Training Programs", "Technical Support", "Community Management"] }
              ].map((network, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg bg-black/20 border border-white/10 text-left"
                >
                  <h4 className="text-lg font-semibold text-yellow-500 mb-4">{network.category}</h4>
                  <ul className="space-y-2">
                    {network.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
