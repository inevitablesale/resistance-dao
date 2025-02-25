
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { ContractStatus } from "./proposalContractService";

export const validateProposalFields = async (
  title: string,
  description: string,
  targetCapital: string,
  votingDuration: number,
  contractStatus: ContractStatus
): Promise<void> => {
  // Title validation
  if (!title) {
    throw new ProposalError({
      category: "validation",
      message: "Title is required",
      field: "title"
    });
  }

  if (title.length < 10 || title.length > 100) {
    throw new ProposalError({
      category: "validation",
      message: "Title must be between 10 and 100 characters",
      field: "title"
    });
  }

  // Description validation
  if (!description) {
    throw new ProposalError({
      category: "validation",
      message: "Description is required",
      field: "description"
    });
  }

  if (description.length < 100 || description.length > 5000) {
    throw new ProposalError({
      category: "validation",
      message: "Description must be between 100 and 5000 characters",
      field: "description"
    });
  }

  // Target capital validation
  const targetCapitalBN = ethers.utils.parseEther(targetCapital);

  if (targetCapitalBN.lt(contractStatus.minTargetCapital)) {
    throw new ProposalError({
      category: "validation",
      message: `Target capital must be at least ${ethers.utils.formatEther(contractStatus.minTargetCapital)} ETH`,
      field: "targetCapital"
    });
  }

  if (targetCapitalBN.gt(contractStatus.maxTargetCapital)) {
    throw new ProposalError({
      category: "validation",
      message: `Target capital must not exceed ${ethers.utils.formatEther(contractStatus.maxTargetCapital)} ETH`,
      field: "targetCapital"
    });
  }

  // Voting duration validation
  if (votingDuration < contractStatus.minVotingDuration) {
    throw new ProposalError({
      category: "validation",
      message: `Voting duration must be at least ${contractStatus.minVotingDuration} days`,
      field: "votingDuration"
    });
  }

  if (votingDuration > contractStatus.maxVotingDuration) {
    throw new ProposalError({
      category: "validation",
      message: `Voting duration must not exceed ${contractStatus.maxVotingDuration} days`,
      field: "votingDuration"
    });
  }
};
