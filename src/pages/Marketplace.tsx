
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { CreateClientListingOverlay } from "@/components/CreateClientListingOverlay";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";

export function Marketplace() {
  const [showCreateListing, setShowCreateListing] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Earn LGR Tokens</h1>
          <p className="text-xl text-white/60">Do accounting work, get paid in LGR</p>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="w-full mb-8 bg-white/5 border-b border-white/10">
            <TabsTrigger 
              value="available" 
              className="flex-1 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
            >
              Want to Earn LGR?
            </TabsTrigger>
            <TabsTrigger 
              value="post" 
              className="flex-1 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
            >
              Need Help? Pay with LGR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <MarketplaceListings />
          </TabsContent>

          <TabsContent value="post" className="flex justify-center items-center py-12">
            <div className="text-center space-y-4">
              <Button 
                onClick={() => setShowCreateListing(true)}
                className="bg-teal-500 hover:bg-teal-600 px-8 py-6 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post New Work Opportunity
              </Button>
              <p className="text-white/60">
                Lock LGR tokens and get help from qualified professionals
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <CreateClientListingOverlay 
          isOpen={showCreateListing} 
          onClose={() => setShowCreateListing(false)} 
        />
      </div>
    </div>
  );
}
