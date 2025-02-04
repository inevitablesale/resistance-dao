
import { Eye, Users, HandshakeIcon } from "lucide-react";

export const AlternativeToEquity = () => {
  return (
    <section className="py-16">
      <div className="container px-4">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          The Alternative to Private Equity
        </h2>
        
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Private equity is moving fast, buying up firms, consolidating control, and reshaping our profession. But we don't have to let them win.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-[#8247E5]/20">
            <Eye className="w-8 h-8 text-[#8247E5] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Transparency</h3>
            <p className="text-gray-300">
              Blockchain-backed ownership ensures every decision is clear and fair.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-[#8247E5]/20">
            <Users className="w-8 h-8 text-[#8247E5] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Ownership</h3>
            <p className="text-gray-300">
              The power stays with the professionals—not the investors.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-[#8247E5]/20">
            <HandshakeIcon className="w-8 h-8 text-[#8247E5] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Collaboration</h3>
            <p className="text-gray-300">
              Together, we can create a future where the value we build stays in our hands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
