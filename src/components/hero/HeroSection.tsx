
import { useEffect, useRef, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";

export const HeroSection = ({ scrollProgress }: { scrollProgress: number }) => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!primaryWallet) {
        console.log("[Toast] Showing welcome toast - no wallet detected");
        toast({
          title: "Welcome to LedgerFund",
          description: "Connect your wallet to participate in the token presale",
          duration: 5000,
        });
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const parallaxStyle = {
    '--scroll-progress': scrollProgress,
    transform: `scale(${1 + scrollProgress * 0.5})`,
    opacity: 1 - scrollProgress * 0.6
  } as React.CSSProperties;

  return (
    <div className="text-center mb-8 max-w-6xl mx-auto pt-32 relative z-10 min-h-[120vh] flex flex-col items-center justify-start">
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 animate-parallax-slow"
          style={{
            background: `
              radial-gradient(2px 2px at 20% 20%, rgba(234, 179, 8, 0.95) 100%, transparent),
              radial-gradient(2px 2px at 40% 40%, rgba(234, 179, 8, 0.92) 100%, transparent),
              radial-gradient(3px 3px at 60% 60%, rgba(234, 179, 8, 0.90) 100%, transparent)
            `,
            backgroundSize: "240px 240px",
            opacity: Math.max(0.1, 0.85 - scrollProgress)
          }}
        />
      </div>

      <div 
        className="fixed inset-0 z-2 perspective-3000" 
        style={{
          ...parallaxStyle,
          transform: `scale(${1 + scrollProgress * 1.5})`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-[800px] h-[800px] relative"
            style={{
              transform: `translateZ(${scrollProgress * 200}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            <div 
              className={`absolute inset-0 rounded-full bg-black transition-all duration-1000 ${isLoaded ? 'scale-100' : 'scale-0'}`}
              style={{
                boxShadow: `
                  0 0 ${100 + scrollProgress * 200}px ${20 + scrollProgress * 40}px rgba(234, 179, 8, 0.4),
                  0 0 ${200 + scrollProgress * 400}px ${40 + scrollProgress * 80}px rgba(20, 184, 166, 0.3),
                  0 0 ${300 + scrollProgress * 600}px ${60 + scrollProgress * 120}px rgba(234, 179, 8, 0.2)
                `,
                transform: `scale(${0.2 + scrollProgress * 1.8})`,
              }}
            />
            
            <div 
              className={`absolute inset-0 rounded-full animate-cosmic-pulse transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{
                background: `
                  radial-gradient(circle at center,
                    rgba(0, 0, 0, 1) 0%,
                    rgba(234, 179, 8, ${0.3 + scrollProgress * 0.7}) 30%,
                    rgba(20, 184, 166, ${0.2 + scrollProgress * 0.6}) 50%,
                    rgba(234, 179, 8, ${0.1 + scrollProgress * 0.5}) 70%,
                    transparent 90%
                  )
                `,
                transform: `scale(${0.5 + scrollProgress * 1.5}) rotate(${scrollProgress * 360}deg)`,
              }}
            />
            
            <div 
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${isLoaded ? 'scale-100' : 'scale-0'}`}
              style={{
                background: `
                  radial-gradient(circle at center,
                    rgba(0, 0, 0, 0.9) 0%,
                    rgba(234, 179, 8, ${0.1 + scrollProgress * 0.4}) 40%,
                    rgba(20, 184, 166, ${0.1 + scrollProgress * 0.3}) 60%,
                    rgba(234, 179, 8, ${0.05 + scrollProgress * 0.25}) 80%,
                    transparent 90%
                  )
                `,
                border: '2px solid rgba(234, 179, 8, 0.5)',
                transform: `scale(${0.8 + scrollProgress * 1.7})`,
              }}
            />
          </div>
        </div>
      </div>

      <div 
        className="relative z-3 mt-[30vh]" 
        style={{
          ...parallaxStyle,
          transform: `scale(${1 - scrollProgress * 0.3}) translateY(${scrollProgress * -50}px)`
        }}
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
          From Service to<br />Sovereignty
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
          Support Web3's first protocol where token holders elect the board, vote on MSP partners, and power an unstoppable acquisition engine. LedgerFund DAO unites elite accountants, trusted managed service providers, and networked capital to revolutionize practice ownership.
        </p>
      </div>
    </div>
  );
};
