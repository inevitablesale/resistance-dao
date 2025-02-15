
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Nav from "@/components/Nav";
import { FileText, DollarSign, Clock, AlertTriangle, Send } from "lucide-react";

interface ThesisFormData {
  title: string;
  description: string;
  targetPrice: string;
  timeline: string;
  supportingLinks: string;
  riskAssessment: string;
}

const ThesisSubmission = () => {
  const { isConnected, address } = useCustomWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ThesisFormData>({
    title: "",
    description: "",
    targetPrice: "",
    timeline: "",
    supportingLinks: "",
    riskAssessment: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit a thesis.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement thesis submission logic
      // 1. Check LGR balance
      // 2. Process $5 LGR payment
      // 3. Upload thesis to IPFS
      // 4. Mint NFT (to be implemented)
      
      toast({
        title: "Coming Soon",
        description: "Thesis submission will be available soon!",
      });
    } catch (error) {
      console.error("Thesis submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit thesis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            background: 'radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)',
            animation: 'quantumField 30s ease-in-out infinite' 
          }} 
        />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Submit Investment Thesis
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Share your investment analysis and insights with the community. Each thesis is minted as a unique NFT on the Polygon chain.
            </p>
          </div>

          <Card className="p-6 bg-black/50 border border-white/10 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-200 mb-1 block">
                    Thesis Title
                  </label>
                  <Input
                    placeholder="Enter a clear, concise title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-200 mb-1 block">
                    Analysis & Description
                  </label>
                  <Textarea
                    placeholder="Provide detailed analysis and supporting arguments"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10 min-h-[200px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-1 block">
                      Target Price/Return
                    </label>
                    <Input
                      placeholder="Expected return or price target"
                      name="targetPrice"
                      value={formData.targetPrice}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-1 block">
                      Timeline
                    </label>
                    <Input
                      placeholder="Expected investment timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="bg-black/50 border-white/10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-200 mb-1 block">
                    Supporting Links & Resources
                  </label>
                  <Textarea
                    placeholder="Add links to supporting research or resources"
                    name="supportingLinks"
                    value={formData.supportingLinks}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-200 mb-1 block">
                    Risk Assessment
                  </label>
                  <Textarea
                    placeholder="Describe potential risks and mitigation strategies"
                    name="riskAssessment"
                    value={formData.riskAssessment}
                    onChange={handleInputChange}
                    className="bg-black/50 border-white/10"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex flex-col space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <FileText className="w-4 h-4 mr-2" />
                    Thesis will be stored on IPFS and minted as an NFT
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Submission requires $5 worth of LGR tokens
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    Transaction will be processed without gas fees
                  </div>
                  <div className="flex items-center text-sm text-yellow-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Make sure all information is accurate before submitting
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !isConnected}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Thesis
                    </>
                  )}
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
