import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const CONTRACT_ADDRESS = "0x3dC25640b1B7528Dca23BeFcDAD835C5Bf4e5360";
const CONTRACT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

const zeroDevConfig = {
  bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
  paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
};

const GovernanceContent = () => {
  const { primaryWallet, user } = useDynamicContext();
  const navigate = useNavigate();
  const [hasNFT, setHasNFT] = useState(false);
  const [governancePower, setGovernancePower] = useState("");
  const [nftImage, setNftImage] = useState("");

  useEffect(() => {
    const checkNFTOwnership = async () => {
      if (primaryWallet?.address) {
        try {
          const provider = new ethers.providers.Web3Provider(await primaryWallet.getWalletClient());
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const balance = await contract.balanceOf(primaryWallet.address);
          
          if (balance.gt(0)) {
            setHasNFT(true);
            const tokenId = await contract.tokenOfOwnerByIndex(primaryWallet.address, 0);
            const tokenURI = await contract.tokenURI(tokenId);
            const response = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'));
            const metadata = await response.json();
            
            setNftImage(metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'));
            const governancePowerAttr = metadata.attributes.find(
              (attr: { trait_type: string; value: string }) => 
              attr.trait_type === "Governance Power"
            );
            if (governancePowerAttr) {
              setGovernancePower(governancePowerAttr.value);
            }
          } else {
            setHasNFT(false);
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking NFT ownership:', error);
          setHasNFT(false);
          navigate('/');
        }
      } else {
        setHasNFT(false);
        navigate('/');
      }
    };

    checkNFTOwnership();
  }, [primaryWallet, navigate]);

  if (!hasNFT) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
            LedgerFren Governance
          </h1>
          <p className="text-lg text-gray-300">
            Shape the future of decentralized accounting
          </p>
        </div>

        <Card className="p-8 bg-white/5 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {nftImage && (
              <div className="w-32 h-32 relative">
                <img 
                  src={nftImage} 
                  alt="Your LedgerFren NFT" 
                  className="rounded-full w-full h-full object-cover border-4 border-polygon-primary/20"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Welcome, LedgerFren!</h2>
              <p className="text-gray-400 mb-4">
                Your Governance Power: {governancePower.replace("Governance-Power-", "")}
              </p>
              <div className="flex gap-4">
                <Button className="bg-polygon-primary hover:bg-polygon-primary/90">
                  View Active Proposals
                </Button>
                <Button variant="outline">
                  Create Proposal
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-400">No recent governance activity</p>
          </Card>
          <Card className="p-6 bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Your Voting Power</h3>
            <p className="text-gray-400">Details coming soon</p>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

const GovernanceVoting = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "2b74d425-6827-4ff1-af57-f9543d71cca0",
        walletConnectors: [
          EthereumWalletConnectors,
          ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
        ],
      }}
    >
      <div className="min-h-screen bg-black text-white">
        <GovernanceContent />
      </div>
    </DynamicContextProvider>
  );
};

export default GovernanceVoting;