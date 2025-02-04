import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Award, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CONTRACT_ADDRESS = "0x3dC25640b1B7528Dca23BeFcDAD835C5Bf4e5360";
const CONTRACT_ABI = [
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function totalSupply() public view returns (uint256)",
  "function tokenByIndex(uint256 index) public view returns (uint256)",
];

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

const GovernanceVoting = () => {
  const { primaryWallet, isAuthenticated } = useDynamicContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nfts, setNfts] = useState<(NFTMetadata & { tokenId: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkWallet = async () => {
      if (!isAuthenticated || !primaryWallet) {
        toast({
          title: "Wallet Connection Required",
          description: "Please connect your wallet to access governance voting.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
    };
    checkWallet();
  }, [primaryWallet, isAuthenticated, navigate, toast]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!primaryWallet?.provider) return;

      try {
        const provider = new ethers.providers.Web3Provider(primaryWallet.provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const totalSupply = await contract.totalSupply();
        const fetchedNFTs = [];

        for (let i = 0; i < totalSupply.toNumber(); i++) {
          const tokenId = await contract.tokenByIndex(i);
          const tokenURI = await contract.tokenURI(tokenId);
          
          // Remove ipfs:// prefix if present
          const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
          
          const response = await fetch(url);
          const metadata: NFTMetadata = await response.json();
          
          fetchedNFTs.push({
            ...metadata,
            tokenId: tokenId.toString(),
          });
        }

        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        toast({
          title: "Error",
          description: "Failed to load NFTs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [primaryWallet, toast]);

  const getAttributeValue = (nft: NFTMetadata, traitType: string) => {
    return nft.attributes.find(attr => attr.trait_type === traitType)?.value || "N/A";
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-polygon-primary bg-clip-text text-transparent">
            Governance Board Elections
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            As a LedgerFren NFT holder, you can vote for members to join the governance board.
            Click on an NFT to cast your vote when voting begins.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-pulse-slow">Loading NFTs...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <Card 
                key={nft.tokenId}
                className="overflow-hidden hover:border-polygon-primary transition-colors duration-300 animate-fade-in"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-polygon-primary">
                      <AvatarImage src={nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")} />
                      <AvatarFallback>
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{nft.name.replace("'s Professional NFT", "")}</h3>
                      <p className="text-sm text-muted-foreground">Token #{nft.tokenId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-polygon-primary" />
                      <span className="text-sm">
                        {getAttributeValue(nft, "Governance Power")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-polygon-primary" />
                      <span className="text-sm">
                        {getAttributeValue(nft, "Experience Level")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernanceVoting;