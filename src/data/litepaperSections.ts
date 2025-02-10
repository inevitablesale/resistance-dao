
import { Section } from "@/types/litepaper";

export const sections: Section[] = [
  { id: "introduction", title: "1.0 Introduction" },
  { id: "how-it-works", title: "2.0 How LedgerFund DAO Works" },
  { id: "purpose", title: "3.0 Purpose" },
  { id: "audience", title: "4.0 Target Audience" },
  { id: "executive-summary", title: "5.0 Executive Summary" },
  { id: "industry-landscape", title: "6.0 Industry Landscape",
    subsections: [
      { id: "succession-crisis", title: "The Succession Crisis" },
      { id: "pe-problem", title: "The Private Equity Problem" },
      { id: "barriers", title: "Barriers to Traditional M&A" }
    ]
  },
  { id: "market-opportunity", title: "7.0 Market Opportunity for Decentralized Solutions",
    subsections: [
      { id: "tokenized-ownership", title: "Tokenized Ownership" },
      { id: "efficient-ma", title: "Efficient M&A" },
      { id: "investment-models", title: "Investment Models" },
      { id: "pe-alternative", title: "PE Alternative" },
      { id: "next-wave", title: "Next Wave of Growth" }
    ]
  },
  { id: "dao-framework", title: "8.0 DAO Framework",
    subsections: [
      { id: "structure", title: "DAO Structure" },
      { id: "governance", title: "Governance Process" }
    ]
  },
  { id: "tokenomics", title: "9.0 Tokenomics",
    subsections: [
      { id: "lgr-token", title: "LGR Token" },
      { id: "lgr-lp", title: "LGR LP Tokens" }
    ]
  },
  { id: "blockchain", title: "10.0 Blockchain & Smart Contracts",
    subsections: [
      { id: "transparent-acquisitions", title: "Transparent Acquisitions" },
      { id: "governance-execution", title: "Governance Execution" },
      { id: "revenue-distribution", title: "Revenue Distribution" },
      { id: "legal-compliance", title: "Legal Compliance" }
    ]
  },
  { id: "investment-strategy", title: "11.0 Investment Strategy",
    subsections: [
      { id: "selection-criteria", title: "Selection Criteria" },
      { id: "lp-pools", title: "LP-Funded Pools" },
      { id: "investment-theses", title: "Investment Theses" },
      { id: "pool-benefits", title: "Pool Benefits" }
    ]
  },
  { id: "risk-assessment", title: "12.0 Risk Assessment",
    subsections: [
      { id: "deal-structure", title: "Deal Structure" },
      { id: "regulatory-risks", title: "Regulatory Risks" },
      { id: "operational-risks", title: "Operational Risks" },
      { id: "exit-planning", title: "Exit Planning" }
    ]
  },
  { id: "acquisition-process", title: "13.0 Acquisition Process",
    subsections: [
      { id: "sourcing", title: "Sourcing Strategy" },
      { id: "due-diligence", title: "Due Diligence" },
      { id: "financial-review", title: "Financial Review" },
      { id: "tech-assessment", title: "Tech Assessment" },
      { id: "legal-review", title: "Legal Review" }
    ]
  },
  { id: "post-acquisition", title: "14.0 Post-Acquisition",
    subsections: [
      { id: "leadership", title: "Leadership Transition" },
      { id: "tech-enhancements", title: "Tech Enhancements" },
      { id: "performance", title: "Performance Tracking" }
    ]
  },
  { id: "token-benefits", title: "15.0 Token Benefits",
    subsections: [
      { id: "governance-rights", title: "Governance Rights" },
      { id: "revenue-sharing", title: "Revenue Sharing" },
      { id: "liquidity", title: "Liquidity & Exit" }
    ]
  },
  { id: "regulatory", title: "16.0 Regulatory Compliance",
    subsections: [
      { id: "legal-structure", title: "Legal Structure" },
      { id: "fundraising", title: "Fundraising Compliance" },
      { id: "kyc-aml", title: "KYC/AML Compliance" }
    ]
  },
  { id: "roadmap", title: "17.0 Roadmap & Milestones" }
];
