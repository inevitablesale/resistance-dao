
import React, { useState } from "react";
import { NFTReferralBountyForm } from "@/components/marketplace/NFTReferralBountyForm";
import { ProposalTemplates } from "@/components/settlements/ProposalTemplates";
import { useNavigate } from "react-router-dom";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";

export default function BountyCreate() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const navigate = useNavigate();

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">Create Bounty</h1>
            <p className="mt-2 text-zinc-400 max-w-xl">
              Set up a new bounty to incentivize network growth and reward referrers.
            </p>
          </div>

          {selectedTemplate ? (
            <NFTReferralBountyForm template={selectedTemplate} onBack={handleBack} />
          ) : (
            <ProposalTemplates onSelectTemplate={handleSelectTemplate} type="bounty" />
          )}
        </div>
      </div>
    </div>
  );
}
