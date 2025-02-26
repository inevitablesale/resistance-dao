
import React from "react";
import { SystemWeDeserve } from "@/components/SystemWeDeserve";
import { WhatWeBuilding } from "@/components/WhatWeBuilding";
import { ReclaimControl } from "@/components/ReclaimControl";
import { AlternativeToEquity } from "@/components/AlternativeToEquity";
import { HowItWorks } from "@/components/HowItWorks";
import { CallToAction } from "@/components/CallToAction";
import { Partners } from "@/components/Partners";
import { LedgerFrens } from "@/components/LedgerFrens";
import { BuyRDTokens } from "@/components/BuyRDTokens";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-16">
        <SystemWeDeserve />
        <WhatWeBuilding />
        <BuyRDTokens /> {/* Added the new component here */}
        <ReclaimControl />
        <AlternativeToEquity />
        <HowItWorks />
        <Partners />
        <LedgerFrens />
        <CallToAction />
      </div>
    </div>
  );
};

export default Index;
