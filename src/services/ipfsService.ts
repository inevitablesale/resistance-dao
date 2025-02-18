
import { Buffer } from 'buffer';
import { ProposalMetadata } from '@/types/proposals';

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
];

let currentGatewayIndex = 0;

export const uploadToIPFS = async (content: ProposalMetadata): Promise<string> => {
  try {
    // For now, we'll use a mock implementation
    // In production, this would interact with actual IPFS nodes
    console.log('Uploading to IPFS:', content);
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    return mockHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const getFromIPFS = async (hash: string): Promise<ProposalMetadata> => {
  try {
    const gateway = IPFS_GATEWAYS[currentGatewayIndex];
    currentGatewayIndex = (currentGatewayIndex + 1) % IPFS_GATEWAYS.length;

    // For now, return mock data that matches ProposalMetadata type
    return {
      title: "Mock Proposal",
      firmCriteria: {
        size: 0, // FirmSize.BELOW_1M
        location: "New York",
        dealType: 0, // DealType.ACQUISITION
        geographicFocus: 0, // GeographicFocus.LOCAL
      },
      paymentTerms: [0], // PaymentTerm.CASH
      strategies: {
        operational: [0], // OperationalStrategy.TECH_MODERNIZATION
        growth: [0], // GrowthStrategy.GEOGRAPHIC_EXPANSION
        integration: [0], // IntegrationStrategy.MERGING_OPERATIONS
      },
      investment: {
        targetCapital: "1000",
        drivers: "Mock investment drivers",
        additionalCriteria: "Mock additional criteria"
      },
      votingDuration: 604800, // 7 days in seconds
      linkedInURL: "https://linkedin.com/mock",
      isTestMode: false,
      submissionTimestamp: Date.now(),
      submitter: "0x0000000000000000000000000000000000000000"
    };
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};
