import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x123..."; // Replace with your actual contract address
const CONTRACT_ABI = [
  "function mint(address to, uint256 governancePowerLevel) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

export const mintNFT = async (walletClient: any, address: string, governancePowerLevel: number) => {
  try {
    const provider = new ethers.providers.Web3Provider(walletClient);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.mint(address, governancePowerLevel);
    console.log('Minting transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Minting confirmed:', receipt);
    
    // Get the token ID from the event logs
    const mintEvent = receipt.events?.find(e => e.event === 'Transfer');
    const tokenId = mintEvent?.args?.tokenId;
    
    return { success: true, tokenId };
  } catch (error) {
    console.error('Minting failed:', error);
    throw error;
  }
};