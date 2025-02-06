
import { Card } from "./ui/card";
import { Rocket, ChartLine, Milestone, Network, Infinity } from "lucide-react";

export const Roadmap = () => {
  return (
    <section id="roadmap" className="py-16 bg-black/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 animate-star-field"
          style={{
            background: "radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.95), rgba(0, 0, 0, 0)), radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)), radial-gradient(1px 1px at 50px 160px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)), radial-gradient(2px 2px at 90px 40px, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0)), radial-gradient(2px 2px at 130px 80px, rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0))",
            backgroundSize: "200px 200px"
          }}
        />
      </div>

      <div className="container px-4 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#0EA5E9] to-[#F97316] mb-4 text-center animate-gradient">
            LedgerFund Roadmap
          </h2>
          <p className="text-xl text-gray-300 mb-12 text-center opacity-90">
            Decentralized Accounting Firm Ownership
          </p>

          <div className="relative">
            {/* Connecting Lines */}
            <div className="absolute left-8 top-10 w-0.5 h-[calc(100%-4rem)] bg-gradient-to-b from-[#8B5CF6] via-[#0EA5E9] to-[#F97316] opacity-20" />

            <div className="space-y-8">
              {/* Phase 1 */}
              <div className="group relative animate-fade-in" style={{ animationDelay: "0ms" }}>
                <Card className="ml-16 p-6 bg-black/40 backdrop-blur-xl border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 transition-all duration-500 hover:translate-x-1">
                  <div className="absolute -left-8 top-6 w-16 h-16 flex items-center justify-center bg-black/60 rounded-full border border-[#8B5CF6]/20 group-hover:scale-110 transition-transform duration-500">
                    <Rocket className="w-8 h-8 text-[#8B5CF6] animate-bounce" style={{ animationDuration: "3s" }} />
                  </div>
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] mb-4">
                    Phase 1: Foundation (Q1 2025)
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span>Market Analysis & Strategic Partnerships</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span>Tokenomics Development & Whitepaper</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span>Smart Contract Development & Audit</span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Phase 2 */}
              <div className="group relative animate-fade-in" style={{ animationDelay: "200ms" }}>
                <Card className="ml-16 p-6 bg-black/40 backdrop-blur-xl border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all duration-500 hover:translate-x-1">
                  <div className="absolute -left-8 top-6 w-16 h-16 flex items-center justify-center bg-black/60 rounded-full border border-[#0EA5E9]/20 group-hover:scale-110 transition-transform duration-500">
                    <ChartLine className="w-8 h-8 text-[#0EA5E9] animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-[#F97316] mb-4">
                    Phase 2: Private Sale (Q2 2025)
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                      <span>Launch Private Token Sale</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                      <span>Investor Dashboard Development</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                      <span>Secondary Marketplace Launch</span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Phase 3 */}
              <div className="group relative animate-fade-in" style={{ animationDelay: "400ms" }}>
                <Card className="ml-16 p-6 bg-black/40 backdrop-blur-xl border border-[#F97316]/20 hover:border-[#F97316]/40 transition-all duration-500 hover:translate-x-1">
                  <div className="absolute -left-8 top-6 w-16 h-16 flex items-center justify-center bg-black/60 rounded-full border border-[#F97316]/20 group-hover:scale-110 transition-transform duration-500">
                    <Milestone className="w-8 h-8 text-[#F97316] animate-cosmic-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#8B5CF6] mb-4">
                    Phase 3: Public Sale (Q3 2025)
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                      <span>Launch Public Presale</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                      <span>Marketing Campaign Execution</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                      <span>Begin Acquisition Planning</span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Phase 4 */}
              <div className="group relative animate-fade-in" style={{ animationDelay: "600ms" }}>
                <Card className="ml-16 p-6 bg-black/40 backdrop-blur-xl border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 transition-all duration-500 hover:translate-x-1">
                  <div className="absolute -left-8 top-6 w-16 h-16 flex items-center justify-center bg-black/60 rounded-full border border-[#8B5CF6]/20 group-hover:scale-110 transition-transform duration-500">
                    <Network className="w-8 h-8 text-[#8B5CF6] animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] mb-4">
                    Phase 4: First Acquisition (Q4 2025)
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span>First Firm Acquisition</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span>Operational Transition</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span>Performance Metrics Sharing</span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Phase 5 */}
              <div className="group relative animate-fade-in" style={{ animationDelay: "800ms" }}>
                <Card className="ml-16 p-6 bg-black/40 backdrop-blur-xl border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all duration-500 hover:translate-x-1">
                  <div className="absolute -left-8 top-6 w-16 h-16 flex items-center justify-center bg-black/60 rounded-full border border-[#0EA5E9]/20 group-hover:scale-110 transition-transform duration-500">
                    <Infinity className="w-8 h-8 text-[#0EA5E9] animate-cosmic-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-[#F97316] mb-4">
                    Phase 5: Scaling (Q1-Q2 2026)
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                      <span>Secondary Market Expansion</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                      <span>Portfolio Growth</span>
                    </li>
                    <li className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                      <span>Profit Reinvestment</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
