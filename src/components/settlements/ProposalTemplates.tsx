
import { useState } from "react";
import { 
  Gift, 
  Shield, 
  Landmark, 
  AlertTriangle, 
  Check, 
  X, 
  ArrowRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type ProposalTemplateType = 
  | "rewardDistribution" 
  | "resourceAllocation" 
  | "membershipRules" 
  | "emergencyAction" 
  | "custom";

export interface ProposalTransaction {
  target: string;
  value: string;
  calldata: string;
  signature?: string;
  description?: string;
}

export interface ProposalTemplate {
  id: ProposalTemplateType;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultTransactions: ProposalTransaction[];
  defaultTitle: string;
  defaultDescription: string;
  isEmergency?: boolean;
  isRecommended?: boolean;
}

const PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  {
    id: "rewardDistribution",
    title: "Reward Distribution",
    description: "Distribute rewards to settlement members and referrers",
    icon: <Gift className="w-6 h-6 text-green-400" />,
    isRecommended: true,
    defaultTitle: "Monthly Reward Distribution",
    defaultDescription: "Distribute accumulated rewards to settlement members and referrers based on contribution and referral activity.",
    defaultTransactions: [
      {
        target: "0x0000000000000000000000000000000000000000", // Will be replaced with actual addresses
        value: "0.5",
        calldata: "0x",
        signature: "transfer(address,uint256)",
        description: "Send rewards to top referrers"
      },
      {
        target: "0x0000000000000000000000000000000000000000", // Will be replaced with actual addresses
        value: "0.3",
        calldata: "0x",
        signature: "transfer(address,uint256)",
        description: "Send rewards to settlement treasury"
      }
    ]
  },
  {
    id: "resourceAllocation",
    title: "Resource Allocation",
    description: "Allocate resources for settlement operations and infrastructure",
    icon: <Landmark className="w-6 h-6 text-blue-400" />,
    defaultTitle: "Infrastructure Fund Allocation",
    defaultDescription: "Allocate ETH for settlement infrastructure improvements and maintenance.",
    defaultTransactions: [
      {
        target: "0x0000000000000000000000000000000000000000", // Will be replaced with actual addresses
        value: "1.0",
        calldata: "0x",
        signature: "transfer(address,uint256)",
        description: "Fund infrastructure improvement"
      }
    ]
  },
  {
    id: "membershipRules",
    title: "Membership Rules",
    description: "Update settlement membership requirements and privileges",
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    defaultTitle: "Update Membership Requirements",
    defaultDescription: "Modify the settlement governance rules to adjust membership requirements and voting power.",
    defaultTransactions: [
      {
        target: "0x0000000000000000000000000000000000000000", // Will be replaced with party address
        value: "0",
        calldata: "0x",
        signature: "updateVotingSettings(uint256)",
        description: "Update voting threshold"
      }
    ]
  },
  {
    id: "emergencyAction",
    title: "Emergency Action",
    description: "Quick response to urgent settlement matters",
    icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
    isEmergency: true,
    defaultTitle: "Emergency Response Action",
    defaultDescription: "Take immediate action to address a critical security issue with reduced voting period.",
    defaultTransactions: [
      {
        target: "0x0000000000000000000000000000000000000000", // Will be replaced with actual addresses
        value: "0",
        calldata: "0x",
        signature: "executeEmergencyAction(bytes)",
        description: "Execute emergency protocol"
      }
    ]
  }
];

interface ProposalTemplatesProps {
  onSelectTemplate: (template: ProposalTemplate) => void;
}

export const ProposalTemplates = ({ onSelectTemplate }: ProposalTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplateType | null>(null);

  const handleSelectTemplate = (template: ProposalTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Choose a Proposal Template</h2>
        <p className="text-white/60">Select a template to create a governance proposal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROPOSAL_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "relative border cursor-pointer transition-all duration-200 hover:border-toxic-neon/70 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] bg-black/60",
              selectedTemplate === template.id 
                ? "border-toxic-neon shadow-[0_0_20px_rgba(57,255,20,0.3)]" 
                : "border-white/10",
              template.isEmergency ? "border-red-500/30 hover:border-red-500/70" : ""
            )}
            onClick={() => handleSelectTemplate(template)}
          >
            {template.isRecommended && (
              <div className="absolute -top-3 -right-3 bg-toxic-neon text-black text-xs font-bold py-1 px-3 rounded-full">
                Recommended
              </div>
            )}
            {template.isEmergency && (
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                Emergency
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start">
                <div className="mr-4">
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{template.title}</h3>
                  <p className="text-sm text-white/60 mt-1">{template.description}</p>
                </div>
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="space-y-3">
                <p className="text-sm text-white/80">Default transactions:</p>
                {template.defaultTransactions.map((tx, index) => (
                  <div key={index} className="text-sm text-white/70 flex items-center gap-2">
                    <Check className="w-4 h-4 text-toxic-neon/70" />
                    <span>{tx.description || `Transaction ${index + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-toxic-neon hover:bg-toxic-neon/90 text-black font-medium gap-2"
          disabled={!selectedTemplate}
          onClick={() => {
            const template = PROPOSAL_TEMPLATES.find(t => t.id === selectedTemplate);
            if (template) onSelectTemplate(template);
          }}
        >
          Continue with Template <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
