
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Nav from "@/components/Nav";
import { FileText, Upload, AlertTriangle } from "lucide-react";

interface ThesisFormData {
  thesisTitle: string;
  fullName: string;
  companyName: string;
  linkedinUrl: string;
  industryFocus: string;
  industryOther: string;
  firmSize: string;
  geographicFocus: string;
  dealType: string;
  paymentTerms: string[];
  complexStructures: boolean;
  targetCapital: string;
  timeline: string;
  postStrategy: string[];
  investorRole: string;
  investmentDrivers: string;
  additionalCriteria: string;
}

const ThesisSubmission = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ThesisFormData>({
    thesisTitle: "",
    fullName: "",
    companyName: "",
    linkedinUrl: "",
    industryFocus: "",
    industryOther: "",
    firmSize: "",
    geographicFocus: "",
    dealType: "",
    paymentTerms: [],
    complexStructures: false,
    targetCapital: "",
    timeline: "",
    postStrategy: [],
    investorRole: "",
    investmentDrivers: "",
    additionalCriteria: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Thesis submission will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)', 
            opacity: 0.98 
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)'
          }} 
        />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              LedgerFund DAO – Investment Thesis Submission
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Share your investment analysis and insights with the community
            </p>
          </div>

          <Card className="p-8 bg-black/50 border border-white/10 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Thesis Title */}
              <div>
                <label className="text-lg font-medium text-white mb-2 block">
                  Thesis Title
                </label>
                <p className="text-sm text-gray-400 mb-2">
                  📌 Provide a concise name for the investment strategy (e.g., "Regional CPA Roll-Up Strategy" or "Boutique Tax Firm Acquisition")
                </p>
                <Input
                  placeholder="Enter thesis title"
                  className="bg-black/50 border-white/10"
                  required
                />
              </div>

              {/* Investor Profile */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Investor Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-200">Full Name</Label>
                    <Input
                      placeholder="Your full name"
                      className="bg-black/50 border-white/10 mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-200">Company Name</Label>
                    <Input
                      placeholder="Your company name"
                      className="bg-black/50 border-white/10 mt-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-200">LinkedIn Profile URL</Label>
                  <Input
                    placeholder="https://linkedin.com/in/your-profile"
                    className="bg-black/50 border-white/10 mt-1"
                    type="url"
                    required
                  />
                </div>
              </div>

              {/* Target Firm Criteria */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Target Firm Criteria</h2>
                
                <div>
                  <Label className="text-gray-200 mb-2 block">Industry Focus</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="accounting" />
                      <label htmlFor="accounting" className="text-gray-200">
                        Accounting
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="professional-services" />
                      <label htmlFor="professional-services" className="text-gray-200">
                        Professional Services
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other" />
                      <label htmlFor="other" className="text-gray-200">
                        Other
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-200 mb-2 block">Preferred Firm Size (Revenue)</Label>
                  <RadioGroup defaultValue="below-1m" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="below-1m" id="below-1m" />
                      <Label htmlFor="below-1m">Below $1M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1m-5m" id="1m-5m" />
                      <Label htmlFor="1m-5m">$1M–$5M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5m-10m" id="5m-10m" />
                      <Label htmlFor="5m-10m">$5M–$10M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10m-plus" id="10m-plus" />
                      <Label htmlFor="10m-plus">$10M+</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-gray-200 mb-2 block">Geographic Focus</Label>
                  <RadioGroup defaultValue="local" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="local" id="local" />
                      <Label htmlFor="local">Local</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regional" id="regional" />
                      <Label htmlFor="regional">Regional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="national" id="national" />
                      <Label htmlFor="national">National</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="remote" id="remote" />
                      <Label htmlFor="remote">Remote/Digital</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Investment Structure */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Investment Structure</h2>
                
                <div>
                  <Label className="text-gray-200 mb-2 block">Target Capital Raise ($LGR Tokens)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="bg-black/50 border-white/10"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-200 mb-2 block">Complex Deal Structures?</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="complex-structures" />
                    <label htmlFor="complex-structures" className="text-gray-200">
                      Willing to consider complex deal structures
                    </label>
                  </div>
                </div>
              </div>

              {/* Key Investment Drivers */}
              <div>
                <label className="text-lg font-medium text-white mb-2 block">
                  Key Investment Drivers
                </label>
                <p className="text-sm text-gray-400 mb-2">
                  📌 Outline the primary factors that make this acquisition compelling
                </p>
                <Textarea
                  placeholder="Describe earnings stability, strong client base, scalability, cultural fit, technology adoption, etc."
                  className="bg-black/50 border-white/10 min-h-[150px]"
                  required
                />
              </div>

              {/* Additional Investment Criteria */}
              <div>
                <label className="text-lg font-medium text-white mb-2 block">
                  Additional Investment Criteria or Notes
                </label>
                <p className="text-sm text-gray-400 mb-2">
                  📌 Specify any must-have requirements or deal preferences
                </p>
                <Textarea
                  placeholder="EBITDA thresholds, firm specialization, geographic limitations, integration plans, etc."
                  className="bg-black/50 border-white/10 min-h-[150px]"
                />
              </div>

              {/* File Upload */}
              <div className="border border-dashed border-white/20 rounded-lg p-6">
                <div className="flex flex-col items-center text-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-white">Supporting Documents</h3>
                  <p className="text-sm text-gray-400">
                    Attach relevant financial models, due diligence reports, or supporting research
                  </p>
                  <Button variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* Submit Section */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center text-sm text-yellow-400 mb-6">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  All submissions will be reviewed by the LedgerFund DAO community, with investment allocations determined by LGR token holders
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  Submit Investment Thesis
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
