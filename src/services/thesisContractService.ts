
import { ethers } from "ethers";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";

export async function getThesisContract() {
  const { getProvider } = useDynamicUtils();
  const provider = await getProvider();
  const signer = provider.getSigner();
  
  // This would be your actual thesis contract address
  const THESIS_CONTRACT_ADDRESS = "0x..."; // Replace with actual contract address
  
  const THESIS_ABI = [
    "function submitThesis(string title, string description, string link) payable",
  ];

  return new ethers.Contract(THESIS_CONTRACT_ADDRESS, THESIS_ABI, signer);
}
