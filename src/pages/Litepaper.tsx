
import Nav from "@/components/Nav";
import { ScrollArea } from "@/components/ui/scroll-area";

const Litepaper = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      
      <ScrollArea className="h-[calc(100vh-5rem)] mt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400">
                LedgerFund Litepaper
              </h1>
              <p className="text-lg text-gray-400">
                Version 1.0 - February 2024
              </p>
            </div>

            {/* Introduction */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-500">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                LedgerFund represents a paradigm shift in decentralized asset management, 
                combining the principles of DeFi with traditional investment strategies. 
                Our platform enables transparent, efficient, and accessible investment 
                opportunities for all participants in the digital economy.
              </p>
            </section>

            {/* Vision & Mission */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-500">2. Vision & Mission</h2>
              <div className="space-y-4">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 text-teal-400">Vision</h3>
                  <p className="text-gray-300 leading-relaxed">
                    To democratize access to sophisticated investment strategies and create 
                    a more inclusive financial ecosystem through blockchain technology.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 text-teal-400">Mission</h3>
                  <p className="text-gray-300 leading-relaxed">
                    To build a transparent, efficient, and accessible platform that enables 
                    anyone to participate in and benefit from professional asset management 
                    strategies.
                  </p>
                </div>
              </div>
            </section>

            {/* Technology */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-500">3. Technology</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 text-teal-400">Smart Contracts</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Built on Polygon for scalability and efficiency, our smart contracts 
                    ensure transparent and secure operations with minimal gas fees.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 text-teal-400">Governance</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Decentralized governance through LGR tokens enables community-driven 
                    decision-making and protocol evolution.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-500">Contact</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <a 
                  href="https://x.com/LedgerFundDAO" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <span>Follow us on X</span>
                </a>
                <a 
                  href="https://www.linkedin.com/company/ledgerfund-dao/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Litepaper;
