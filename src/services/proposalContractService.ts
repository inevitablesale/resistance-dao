
import { ethers } from "ethers";
import { DynamicContext } from "@dynamic-labs/sdk-react-core";
import { IPFSContent } from "@/types/content";
import { ContractProposal, ProposalConfig, ProposalInput } from "@/types/proposals";
import { uploadToIPFS } from "./ipfsService";
import { executeTransaction, TransactionConfig } from "./transactionManager";
import { RD_TOKEN_ADDRESS, FACTORY_ADDRESS } from "@/lib/constants";
import { checkTokenAllowance } from "./tokenService";

export const createProposal = async (
  metadata: any,
  wallet: DynamicContext["primaryWallet"]
): Promise<ethers.ContractTransaction> => {
  try {
    if (!wallet) throw new Error("No wallet connected");

    const walletClient = await wallet.getWalletClient();
    if (!walletClient) throw new Error("No wallet client available");

    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    // Upload metadata to IPFS
    const ipfsHash = await uploadToIPFS(metadata);
    const metadataURI = `ipfs://${ipfsHash}`;

    // Convert target capital to wei
    const targetCapitalWei = ethers.utils.parseEther(metadata.investment.targetCapital);

    const proposalData: ProposalInput = {
      title: metadata.title,
      metadataURI,
      targetCapital: targetCapitalWei,
      votingDuration: metadata.votingDuration
    };

    // Check allowance before proceeding
    const submissionFee = ethers.utils.parseEther("25");
    const hasAllowance = await checkTokenAllowance(
      provider,
      RD_TOKEN_ADDRESS,
      signerAddress,
      FACTORY_ADDRESS,
      submissionFee
    );

    if (!hasAllowance) {
      throw new Error("Insufficient token allowance");
    }

    const transactionConfig: TransactionConfig = {
      type: 'proposal',
      description: 'Creating proposal',
      timeout: 180000,
      maxRetries: 3,
      backoffMs: 5000,
      tokenConfig: {
        tokenAddress: RD_TOKEN_ADDRESS,
        spenderAddress: FACTORY_ADDRESS,
        amount: submissionFee,
        isTestMode: metadata.isTestMode
      }
    };

    return await executeTransaction(
      async () => {
        const factoryContract = new ethers.Contract(
          FACTORY_ADDRESS,
          [
            "function createProposal(string memory _title, string memory _metadataURI, uint256 _targetCapital, uint256 _votingDuration) external payable"
          ],
          signer
        );

        return await factoryContract.createProposal(
          proposalData.title,
          proposalData.metadataURI,
          proposalData.targetCapital,
          proposalData.votingDuration,
          { value: ethers.utils.parseEther("0") }
        );
      },
      transactionConfig,
      provider
    );
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
};
