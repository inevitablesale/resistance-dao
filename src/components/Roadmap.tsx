import { Card } from "./ui/card";

export const Roadmap = () => {
  return (
    <section id="roadmap" className="py-16 bg-black/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">LedgerFund Roadmap</h2>
          <p className="text-xl text-gray-300 mb-12 text-center">
            Decentralized Accounting Firm Ownership
          </p>

          <div className="space-y-6">
            <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
              <h3 className="text-xl font-semibold text-[#8247E5] mb-4">Phase 1: Foundation (Q1 2025)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Market Analysis & Strategic Partnerships</li>
                <li>Tokenomics Development & Whitepaper</li>
                <li>Smart Contract Development & Audit</li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
              <h3 className="text-xl font-semibold text-[#8247E5] mb-4">Phase 2: Private Sale (Q2 2025)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Launch Private Token Sale</li>
                <li>Investor Dashboard Development</li>
                <li>Secondary Marketplace Launch</li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
              <h3 className="text-xl font-semibold text-[#8247E5] mb-4">Phase 3: Public Sale (Q3 2025)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Launch Public Presale</li>
                <li>Marketing Campaign Execution</li>
                <li>Begin Acquisition Planning</li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
              <h3 className="text-xl font-semibold text-[#8247E5] mb-4">Phase 4: First Acquisition (Q4 2025)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>First Firm Acquisition</li>
                <li>Operational Transition</li>
                <li>Performance Metrics Sharing</li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
              <h3 className="text-xl font-semibold text-[#8247E5] mb-4">Phase 5: Scaling (Q1-Q2 2026)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Secondary Market Expansion</li>
                <li>Portfolio Growth</li>
                <li>Profit Reinvestment</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
