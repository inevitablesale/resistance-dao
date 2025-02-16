import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Nav from "@/components/Nav";
import { FileText, AlertTriangle, Info, Clock, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const ThesisSubmission = () => {
  const [thesisTitle, setThesisTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [targetMetrics, setTargetMetrics] = useState("");
  const [growthPlan, setGrowthPlan] = useState("");
  const [riskAssessment, setRiskAssessment] = useState("");
  const [financialProjections, setFinancialProjections] = useState("");
  const [teamComposition, setTeamComposition] = useState("");
  const [tokenAllocation, setTokenAllocation] = useState("");
  const [timeline, setTimeline] = useState("");
  const [legalConsiderations, setLegalConsiderations] = useState("");
  const [communityInvolvement, setCommunityInvolvement] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [thesisCategory, setThesisCategory] = useState("acquisition");
  const [isPublic, setIsPublic] = useState(false);
  const [fundingRequired, setFundingRequired] = useState(50);
  const { toast } = useToast();
  const { primaryWallet, setShowAuthFlow } = useWalletConnection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryWallet?.address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      setShowAuthFlow?.(true);
      return;
    }
    // Handle thesis submission logic here
    console.log("Submitting thesis:", {
      thesisTitle,
      problemStatement,
      proposedSolution,
      targetMetrics,
      growthPlan,
      riskAssessment,
      financialProjections,
      teamComposition,
      tokenAllocation,
      timeline,
      legalConsiderations,
      communityInvolvement,
      additionalNotes,
      thesisCategory,
      isPublic,
      fundingRequired,
    });
    toast({
      title: "Thesis Submitted",
      description: "Your investment thesis has been submitted for review.",
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Nav />
      <div className="container mx-auto px-4 pt-32">
        <h1 className="text-4xl font-bold text-white mb-8">Submit Investment Thesis</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-black/50 backdrop-blur-md border border-white/10 text-white">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Thesis Information</h2>
              <div>
                <Label htmlFor="thesisTitle">Thesis Title</Label>
                <Input
                  type="text"
                  id="thesisTitle"
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  placeholder="e.g., Acquisition of a Boutique Accounting Firm"
                />
              </div>
              <div>
                <Label htmlFor="problemStatement">Problem Statement</Label>
                <Textarea
                  id="problemStatement"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe the problem or opportunity"
                />
              </div>
              <div>
                <Label htmlFor="proposedSolution">Proposed Solution</Label>
                <Textarea
                  id="proposedSolution"
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  placeholder="Explain your proposed solution"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-black/50 backdrop-blur-md border border-white/10 text-white">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Financial & Strategic Details</h2>
              <div>
                <Label htmlFor="targetMetrics">Target Metrics</Label>
                <Input
                  type="text"
                  id="targetMetrics"
                  value={targetMetrics}
                  onChange={(e) => setTargetMetrics(e.target.value)}
                  placeholder="e.g., 20% revenue growth in 2 years"
                />
              </div>
              <div>
                <Label htmlFor="growthPlan">Growth Plan</Label>
                <Textarea
                  id="growthPlan"
                  value={growthPlan}
                  onChange={(e) => setGrowthPlan(e.target.value)}
                  placeholder="Outline your growth strategy"
                />
              </div>
              <div>
                <Label htmlFor="riskAssessment">Risk Assessment</Label>
                <Textarea
                  id="riskAssessment"
                  value={riskAssessment}
                  onChange={(e) => setRiskAssessment(e.target.value)}
                  placeholder="Identify potential risks and mitigation strategies"
                />
              </div>
              <div>
                <Label htmlFor="financialProjections">Financial Projections</Label>
                <Textarea
                  id="financialProjections"
                  value={financialProjections}
                  onChange={(e) => setFinancialProjections(e.target.value)}
                  placeholder="Provide financial forecasts and projections"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-black/50 backdrop-blur-md border border-white/10 text-white">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Team & Tokenomics</h2>
              <div>
                <Label htmlFor="teamComposition">Team Composition</Label>
                <Textarea
                  id="teamComposition"
                  value={teamComposition}
                  onChange={(e) => setTeamComposition(e.target.value)}
                  placeholder="Describe the team and their expertise"
                />
              </div>
              <div>
                <Label htmlFor="tokenAllocation">Token Allocation</Label>
                <Textarea
                  id="tokenAllocation"
                  value={tokenAllocation}
                  onChange={(e) => setTokenAllocation(e.target.value)}
                  placeholder="Explain the token allocation strategy"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-black/50 backdrop-blur-md border border-white/10 text-white">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Additional Information</h2>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  type="text"
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="Provide a timeline for the project"
                />
              </div>
              <div>
                <Label htmlFor="legalConsiderations">Legal Considerations</Label>
                <Textarea
                  id="legalConsiderations"
                  value={legalConsiderations}
                  onChange={(e) => setLegalConsiderations(e.target.value)}
                  placeholder="Outline any legal considerations"
                />
              </div>
              <div>
                <Label htmlFor="communityInvolvement">Community Involvement</Label>
                <Textarea
                  id="communityInvolvement"
                  value={communityInvolvement}
                  onChange={(e) => setCommunityInvolvement(e.target.value)}
                  placeholder="Describe how the community will be involved"
                />
              </div>
              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional information"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-black/50 backdrop-blur-md border border-white/10 text-white">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Preferences</h2>
              <div>
                <Label htmlFor="thesisCategory">Thesis Category</Label>
                <RadioGroup value={thesisCategory} onValueChange={setThesisCategory}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="acquisition" id="r1" />
                    <Label htmlFor="r1">Acquisition</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="growth" id="r2" />
                    <Label htmlFor="r2">Growth</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="restructuring" id="r3" />
                    <Label htmlFor="r3">Restructuring</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
                <Label htmlFor="isPublic">Make this thesis public</Label>
              </div>
              <div>
                <Label htmlFor="fundingRequired">Funding Required: {fundingRequired}%</Label>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  min={0}
                  step={1}
                  onValueChange={(value) => setFundingRequired(value[0])}
                />
              </div>
            </div>
          </Card>

          <Button type="submit">Submit Thesis</Button>
        </form>
      </div>
    </div>
  );
};

export default ThesisSubmission;
