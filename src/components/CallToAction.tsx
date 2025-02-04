
import { FileText, MessageCircle } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Are You Ready to Reclaim Your Industry?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Take back control of your profession. Own the future of accounting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-colors text-lg font-medium flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Join Community
            </button>
            <button className="px-8 py-3 bg-white hover:bg-white/90 text-[#8247E5] rounded-lg transition-colors text-lg font-medium flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Read Whitepaper
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
