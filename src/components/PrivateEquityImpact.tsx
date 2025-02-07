
import { AlertTriangle, TrendingDown, UserMinus, XCircle } from "lucide-react";

export const PrivateEquityImpact = () => {
  return (
    <section id="private-equity-impact" className="py-16 bg-black/30">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          What Happens When Private Equity Takes Over?
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="cosmic-box yellow-energy right-drain p-6 rounded-lg bg-black/40 backdrop-blur border border-red-500/20 hover:border-red-500/30 transition-all duration-300">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Culture Shifts</h3>
            <p className="text-gray-300">
              A close-knit team becomes a cog in a profit-driven machine.
            </p>
          </div>

          <div className="cosmic-box yellow-energy right-drain p-6 rounded-lg bg-black/40 backdrop-blur border border-red-500/20 hover:border-red-500/30 transition-all duration-300">
            <TrendingDown className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Short-term Profits</h3>
            <p className="text-gray-300">
              Long-term stability and values are traded for quick gains.
            </p>
          </div>

          <div className="cosmic-box yellow-energy right-drain p-6 rounded-lg bg-black/40 backdrop-blur border border-red-500/20 hover:border-red-500/30 transition-all duration-300">
            <UserMinus className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Layoffs and Cutbacks</h3>
            <p className="text-gray-300">
              Survivors take on more work with fewer resources.
            </p>
          </div>

          <div className="cosmic-box yellow-energy right-drain p-6 rounded-lg bg-black/40 backdrop-blur border border-red-500/20 hover:border-red-500/30 transition-all duration-300">
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
