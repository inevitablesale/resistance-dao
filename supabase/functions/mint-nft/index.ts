import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ethers } from 'https://esm.sh/ethers@5.7.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CONTRACT_ADDRESS = "0x3dC25640b1B7528Dca23BeFcDAD835C5Bf4e5360";
const CONTRACT_ABI = [
  "function safeMint(address to, string memory governancePower) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, governancePower, metadata } = await req.json();
    console.log('Received minting request:', { address, governancePower });

    if (!address || !governancePower || !metadata) {
      throw new Error('Missing required parameters');
    }

    // Get ZeroDev credentials from environment variables
    const ZERODEV_PROJECT_ID = Deno.env.get('ZERODEV_PROJECT_ID');
    const ZERODEV_AA_KEY = Deno.env.get('ZERODEV_AA_KEY');

    if (!ZERODEV_PROJECT_ID || !ZERODEV_AA_KEY) {
      throw new Error('ZeroDev credentials not configured');
    }

    console.log('Initializing provider and contract...');
    
    // Initialize provider (Polygon Mainnet)
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    
    // Create wallet with ZeroDev AA key
    const wallet = new ethers.Wallet(ZERODEV_AA_KEY, provider);
    
    // Initialize contract
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    console.log('Minting NFT...');
    const tx = await contract.safeMint(address, governancePower);
    console.log('Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    // Get token ID from event logs
    const mintEvent = receipt.events?.find(e => e.event === 'Transfer');
    const tokenId = mintEvent?.args?.tokenId;

    return new Response(
      JSON.stringify({ 
        success: true, 
        tokenId: tokenId?.toString(),
        transactionHash: tx.hash,
        metadata 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in mint-nft function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});