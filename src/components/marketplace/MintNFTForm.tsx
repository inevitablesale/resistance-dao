
import { Button } from "@/components/ui/button";
import { FileText, Image, Shield, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useToast } from "@/hooks/use-toast";
import { mintNFT } from "@/services/contractService";
import { useNavigate } from "react-router-dom";
import { uploadMetadataToPinata } from "@/services/pinataService";

interface MintNFTFormProps {
  durationType: 'short-term' | 'long-term' | '';
}

export function MintNFTForm({ durationType }: MintNFTFormProps) {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [isMinting, setIsMinting] = useState(false);
  const { getWalletState, validateNetwork } = useDynamicUtils();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const imageUrl = URL.createObjectURL(file);
      setCoverImageUrl(imageUrl);
    }
  }, []);

  const handleMint = async () => {
    try {
      setIsMinting(true);
      
      // First validate network
      await validateNetwork();
      
      // Get wallet state
      const walletState = await getWalletState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }

      // Create NFT metadata
      const metadata = {
        name: "Professional Services NFT",
        description: `Professional services NFT for ${durationType} engagement`,
        image: coverImageUrl || "https://example.com/placeholder.png",
        attributes: [
          {
            trait_type: "Service Type",
            value: durationType
          },
          {
            trait_type: "Status",
            value: "Active"
          }
        ]
      };

      // Upload metadata to IPFS via Pinata
      console.log('Uploading metadata to Pinata...');
      const metadataUri = await uploadMetadataToPinata(metadata);
      console.log('Metadata uploaded:', metadataUri);

      // Get wallet client for minting
      const { primaryWallet } = await import('@dynamic-labs/sdk-react-core').then(m => m.useDynamicContext());
      if (!primaryWallet) {
        throw new Error('Wallet not initialized');
      }

      const walletClient = await primaryWallet.getWalletClient();
      
      // Mint NFT
      console.log('Minting NFT...');
      const result = await mintNFT(walletClient, walletState.address, metadata);
      console.log('Minting result:', result);

      toast({
        title: "NFT Minted Successfully!",
        description: "Your Professional Services NFT has been minted.",
      });

      // Navigate to marketplace after successful mint
      setTimeout(() => navigate('/marketplace'), 2000);
    } catch (error) {
      console.error('Minting error:', error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Failed to mint NFT. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2">Mint Service NFT</h3>
        <p className="text-white/60">Create an NFT representing this service opportunity</p>
      </div>

      <div className="grid gap-8">
        {/* NFT Preview */}
        <div className="aspect-square max-w-sm mx-auto rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center">
          <div className="w-full aspect-square rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center mb-4 overflow-hidden">
            {coverImageUrl ? (
              <img src={coverImageUrl} alt="NFT Preview" className="w-full h-full object-cover" />
            ) : (
              <Image className="h-12 w-12 text-white/40" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="cover-image-upload"
          />
          <label htmlFor="cover-image-upload">
            <Button variant="outline" className="bg-white/5 border-white/10 text-white cursor-pointer">
              Upload Cover Image
            </Button>
          </label>
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
              <p className="text-sm text-white/60">Service type: {durationType}</p>
            </div>
          </div>

          {/* Security Features */}
          <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-teal-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white">Security Features</h4>
              <p className="text-sm text-white/60">Secured by Polygon Network</p>
            </div>
          </div>

          {/* Mint Button */}
          <Button 
            onClick={handleMint} 
            disabled={isMinting}
            className="w-full py-6 bg-polygon-primary hover:bg-polygon-primary/90 text-white"
          >
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              'Mint NFT'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
