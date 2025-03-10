
import { useState } from "react";
import { 
  Gift, 
  Shield, 
  Landmark, 
  AlertTriangle, 
  Check, 
  X, 
  ArrowRight,
  Coins,
  UserPlus,
  Target
} from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { ToxicCard } from "@/components/ui/toxic-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DrippingSlime } from "@/components/ui/dripping-slime";

export type ProposalTemplateType = 
  | "rewardDistribution" 
  | "resourceAllocation" 
  | "membershipRules" 
  | "emergencyAction" 
  | "nftReferral"
  | "talentBounty"
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
  defaultTransactions?: ProposalTransaction[];
  defaultTitle: string;
  defaultDescription: string;
  isEmergency?: boolean;
  isRecommended?: boolean;
  type?: "proposal" | "bounty";
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
    ],
    type: "proposal"
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
    ],
    type: "proposal"
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
    ],
    type: "proposal"
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
    ],
    type: "proposal"
  },
  // New Bounty Templates
  {
    id: "nftReferral",
    title: "NFT Referral Bounty",
    description: "Reward hunters for referring new NFT minters",
    icon: <Gift className="w-6 h-6 text-toxic-neon" />,
    isRecommended: true,
    defaultTitle: "NFT Referral Bounty",
    defaultDescription: "Set up a bounty that rewards community members for bringing in new NFT minters.",
    type: "bounty"
  },
  {
    id: "talentBounty",
    title: "Talent Acquisition",
    description: "Find and recruit talent for the network",
    icon: <UserPlus className="w-6 h-6 text-blue-400" />,
    defaultTitle: "Talent Acquisition Bounty",
    defaultDescription: "Create a bounty to attract developers, designers, and other talent to the network.",
    type: "bounty"
  }
];

interface ProposalTemplatesProps {
  onSelectTemplate: (template: ProposalTemplate) => void;
  type?: "proposal" | "bounty" | "all";
}

export const ProposalTemplates = ({ onSelectTemplate, type = "all" }: ProposalTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplateType | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<ProposalTemplateType | null>(null);

  // Filter templates based on type
  const filteredTemplates = type === "all" 
    ? PROPOSAL_TEMPLATES 
    : PROPOSAL_TEMPLATES.filter(template => template.type === type || template.type === undefined);

  const handleSelectTemplate = (template: ProposalTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6 relative">
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-toxic-neon toxic-glow mb-2">
          {type === "bounty" ? "Choose a Bounty Template" : "Choose a Proposal Template"}
        </h2>
        <p className="text-white/60">
          {type === "bounty" 
            ? "Select a template to create a bounty program"
            : "Select a template to create a governance proposal"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <DrippingSlime position="both" dripsCount={6} className="absolute inset-0 pointer-events-none" />
        
        {filteredTemplates.map((template) => (
          <ToxicCard
            key={template.id}
            className={cn(
              "relative border cursor-pointer transition-all duration-200 hover:border-toxic-neon/70 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] bg-black/60",
              selectedTemplate === template.id 
                ? "border-toxic-neon shadow-[0_0_20px_rgba(57,255,20,0.3)]" 
                : "border-white/10",
              template.isEmergency ? "border-red-500/30 hover:border-red-500/70" : "",
              hoveredTemplate === template.id ? "transform scale-[1.02] transition-transform duration-300" : ""
            )}
            onClick={() => handleSelectTemplate(template)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            {template.isRecommended && (
              <div className="absolute -top-3 -right-3 bg-toxic-neon text-black text-xs font-bold py-1 px-3 rounded-full animate-pulse">
                Recommended
              </div>
            )}
            {template.isEmergency && (
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full flash-beacon">
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
                {template.defaultTransactions ? (
                  <>
                    <p className="text-sm text-white/80">Default transactions:</p>
                    {template.defaultTransactions.map((tx, index) => (
                      <div key={index} className="text-sm text-white/70 flex items-center gap-2">
                        <Check className="w-4 h-4 text-toxic-neon/70" />
                        <span>{tx.description || `Transaction ${index + 1}`}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-white/80">Benefits:</p>
                    <div className="text-sm text-white/70 flex items-center gap-2">
                      <Check className="w-4 h-4 text-toxic-neon/70" />
                      <span>Automated reward distribution</span>
                    </div>
                    <div className="text-sm text-white/70 flex items-center gap-2">
                      <Check className="w-4 h-4 text-toxic-neon/70" />
                      <span>Transparent referral tracking</span>
                    </div>
                    <div className="text-sm text-white/70 flex items-center gap-2">
                      <Check className="w-4 h-4 text-toxic-neon/70" />
                      <span>Customizable success criteria</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ToxicCard>
        ))}
      </div>

      <div className="flex justify-end">
        <ToxicButton
          className="bg-toxic-neon hover:bg-toxic-neon/90 text-black font-medium gap-2"
          disabled={!selectedTemplate}
          onClick={() => {
            const template = PROPOSAL_TEMPLATES.find(t => t.id === selectedTemplate);
            if (template) onSelectTemplate(template);
          }}
        >
          Continue with Template <ArrowRight className="w-4 h-4" />
        </ToxicButton>
      </div>
    </div>
  );
};
