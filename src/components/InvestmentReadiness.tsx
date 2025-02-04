
import { Shield, DollarSign, Clock } from "lucide-react";
import { Card } from "./ui/card";

export const InvestmentReadiness = () => {
  return (
    <section className="py-16 bg-black/30 backdrop-blur-sm">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-white mb-8">Investment Readiness</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Requirements
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>Complete KYC Verification</li>
              <li>USDC Balance: $0</li>
            </ul>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Get Started
            </h3>
            <button className="w-full px-4 py-2 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-colors">
              Begin KYC Process
            </button>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              What to Expect
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Quick and secure KYC verification</li>
              <li>Purchase USDC with your preferred payment method</li>
              <li>Funds directly deposited to your connected wallet</li>
              <li>Access to investment opportunities</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};
