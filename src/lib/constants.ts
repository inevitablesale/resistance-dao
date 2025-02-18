
import { ethers } from "ethers";

export const FACTORY_ADDRESS = "0x624dFf6455FBE2f569571fba31c7D020b905b745";
export const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
export const LGR_PRICE_USD = 0.10; // $0.10 per LGR token

// Contract-specific constants
export const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
export const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
export const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000"); // 1,000 LGR
export const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000"); // 25,000,000 LGR
export const SUBMISSION_FEE = ethers.utils.parseEther("250"); // 250 LGR
export const VOTING_FEE = ethers.utils.parseEther("10"); // 10 LGR
export const TEST_TARGET_CAPITAL = "1000"; // 1,000 LGR for test mode

// Contract addresses
export const AUTHORIZED_TEST_MODE_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";
