
import { Button } from "@/components/ui/button";
import { FileText, Image, Shield } from "lucide-react";

interface MintNFTFormProps {
  durationType: 'short-term' | 'long-term' | '';
}

export function MintNFTForm({ durationType }: MintNFTFormProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2">Mint Service NFT</h3>
        <p className="text-white/60">Create an NFT representing this service opportunity</p>
      </div>

      <div className="grid gap-8">
        {/* NFT Preview */}
        <div className="aspect-square max-w-sm mx-auto rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center">
          <div className="w-full aspect-square rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center mb-4">
            <Image className="h-12 w-12 text-white/40" />
          </div>
          <Button variant="outline" className="bg-white/5 border-white/10 text-white">
            Upload Cover Image
          </Button>
        </div>

        {/* NFT Details */}
        <div className="space-y-6">
          {/* Contract Details */}
          <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-teal-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white">Contract Details</h4>
              <p className="text-sm text-white/60">Review and approve service terms</p>
            </div>
            <Button variant="ghost" className="text-white/60 hover:text-white">
              Review
            </Button>
          </div>

          {/* Security Features */}
          <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-teal-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white">Security Features</h4>
              <p className="text-sm text-white/60">Configure access controls and permissions</p>
            </div>
            <Button variant="ghost" className="text-white/60 hover:text-white">
              Configure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
