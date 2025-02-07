
import { AlertTriangle, TrendingDown, UserMinus, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

export const PrivateEquityImpact = () => {
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
    <section id="private-equity-impact" className="py-16 bg-black/30">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          What Happens When Private Equity Takes Over?
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div 
            ref={el => boxRefs.current[0] = el}
            className="cosmic-box yellow-energy right-drain p-6 rounded-lg bg-black/40 backdrop-blur border border-red-500/20 hover:border-red-500/30 transition-all duration-300"
          >
            <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Culture Shifts</h3>
            <p className="text-gray-300">
              A close-knit team becomes a cog in a profit-driven machine.
            </p>
          </div>

          <div 
            ref={el => boxRefs.current[1] = el}
            className="cosmic-box yellow-energy right-drain p-6 rounded-lg bg-black/40 backdrop-blur border border-red-500/20 hover:border-red-500/30 transition-all duration-300"
          >
            <TrendingDown className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Short-term Profits</h3>
            <p className="text-gray-300">
              Long-term stability and values are traded for quick gains.
            </p>
          </div>

          <div 
            ref={el => boxRefs.current[2] = el}
            className="cosmic-box yellow-energy right-drain p-6 rounded-lg bg-black/40 backdrop-blur border border-red-500/20 hover:border-red-500/30 transition-all duration-300"
          >
            <UserMinus className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Layoffs and Cutbacks</h3>
            <p className="text-gray-300">
              Survivors take on more work with fewer resources.
            </p>
          </div>

          <div 
            ref={el => boxRefs.current[3] = el}
            className="cosmic-box yellow-energy right-drain p-6 rounded-lg bg-black/40 backdrop-blur border border-red-500/20 hover:border-red-500/30 transition-all duration-300"
          >
            <XCircle className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Lost Trust</h3>
            <p className="text-gray-300">
              The personal touch clients relied on is replaced by cold efficiency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
