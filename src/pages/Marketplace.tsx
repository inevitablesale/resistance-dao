
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateClientListingOverlay } from "@/components/CreateClientListingOverlay";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";

export function Marketplace() {
  const [showCreateListing, setShowCreateListing] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">LGR Marketplace</h1>
            <p className="text-white/60">Find work opportunities and earn LGR tokens</p>
          </div>
          <Button 
            onClick={() => setShowCreateListing(true)}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Opportunity
          </Button>
        </div>

        <MarketplaceListings />

        <CreateClientListingOverlay 
          isOpen={showCreateListing} 
          onClose={() => setShowCreateListing(false)} 
        />
      </div>
    </div>
  );
}
