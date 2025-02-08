
import { FileText, MessageCircle } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 rounded-lg blur-xl opacity-50" />
            <div className="relative bg-black/80 backdrop-blur-sm border border-yellow-500/30 px-6 py-4 rounded-lg">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-500">
                Governance Applications Coming Soon
              </h3>
              <p className="text-white/80 mt-2">
                Applications and voting will begin when $100,000 of funding goal is met
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
