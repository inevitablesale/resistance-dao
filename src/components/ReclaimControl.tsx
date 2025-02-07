
import { Crown, Coins, Vote } from "lucide-react";
import { useEffect, useRef } from "react";

export const ReclaimControl = () => {
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const calculateTiltAndEnergy = () => {
      const blackHoleCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };

      boxRefs.current.forEach((box, index) => {
        if (!box) return;

        const rect = box.getBoundingClientRect();
        const boxCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        // Calculate angle to black hole
        const angleRad = Math.atan2(
          blackHoleCenter.y - boxCenter.y,
          blackHoleCenter.x - boxCenter.x
        );
        const angleDeg = (angleRad * 180) / Math.PI;

        // Calculate distance for energy intensity
        const distance = Math.sqrt(
          Math.pow(blackHoleCenter.x - boxCenter.x, 2) +
          Math.pow(blackHoleCenter.y - boxCenter.y, 2)
        );
        const normalizedDistance = Math.min(1, distance / 1000);
        
        // Calculate tilt based on position relative to black hole
        const tiltX = (boxCenter.x - blackHoleCenter.x) / 30;
        const tiltY = (boxCenter.y - blackHoleCenter.y) / 30;

        // Apply transformations
        box.style.setProperty('--tilt-x', `${tiltX}deg`);
        box.style.setProperty('--tilt-y', `${tiltY}deg`);
        box.style.setProperty('--angle', `${angleDeg}deg`);
        box.style.setProperty('--flow-distance', `${distance / 5}px`);
        box.style.setProperty('--flow-x', `${Math.cos(angleRad) * 100}px`);
        box.style.setProperty('--flow-y', `${Math.sin(angleRad) * 100}px`);
        box.style.setProperty('--energy-opacity', `${1 - normalizedDistance}`);

        // Add active class for energy effects
        box.classList.add('active');
      });
    };

    window.addEventListener('scroll', calculateTiltAndEnergy);
    window.addEventListener('resize', calculateTiltAndEnergy);
    calculateTiltAndEnergy(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', calculateTiltAndEnergy);
      window.removeEventListener('resize', calculateTiltAndEnergy);
    };
  }, []);

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-4">
            Reclaim What's Yours
          </h2>
          <p className="text-xl text-gray-300">
            It's time to rewrite the rules. LedgerFund is creating a system designed for accounting professionals, by accounting professionals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div 
            ref={el => boxRefs.current[0] = el}
            className="cosmic-box yellow-energy left-drain p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
          >
            <Crown className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Own the Value</h3>
            <p className="text-gray-300">
              Tokenized ownership rewards those who do the work.
            </p>
          </div>

          <div 
            ref={el => boxRefs.current[1] = el}
            className="cosmic-box teal-energy left-drain p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300"
          >
            <Coins className="w-8 h-8 text-teal-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Share the Wealth</h3>
            <p className="text-gray-300">
              Dividends from firm profits go to the professionals, not outsiders.
            </p>
          </div>

          <div 
            ref={el => boxRefs.current[2] = el}
            className="cosmic-box yellow-energy left-drain p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
          >
            <Vote className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Make the Decisions</h3>
            <p className="text-gray-300">
              Every token holder has a voice in the future of the firm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
