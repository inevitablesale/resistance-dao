
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

const NFT_CONTRACT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
const NFT_ABI = ["function balanceOf(address owner) view returns (uint256)"];

export const useNFTBalance = (address?: string) => {
  return useQuery({
    queryKey: ['nftBalance', address],
    queryFn: async () => {
      if (!address) return 0;
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
      const balance = await contract.balanceOf(address);
      return Number(balance);
    },
    enabled: !!address,
  });
};
