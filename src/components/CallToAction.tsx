
import { FileText, MessageCircle } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
            Are You Ready to Reclaim Your Industry?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Take back control of your profession. Own the future of accounting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-3 bg-gradient-to-r from-yellow-600 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                <MessageCircle className="w-5 h-5" />
                Join Community
              </div>
            </button>
            <button className="group relative px-8 py-3 bg-black/30 hover:bg-black/40 border border-yellow-500/30 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-teal-300/10 blur-sm group-hover:blur-lg transition-all duration-300" />
              <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                <FileText className="w-5 h-5" />
                Read Whitepaper
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

