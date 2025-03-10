
import { useState } from "react";
import { Link } from "react-router-dom";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { SettlementsHistory } from "@/components/settlements/SettlementsHistory";
import { SettlementsNavBar } from "@/components/settlements/SettlementsNavBar";

export default function Settlements() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <SettlementsNavBar />
          
          {/* Settlement Grid */}
          <SettlementsHistory />
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
