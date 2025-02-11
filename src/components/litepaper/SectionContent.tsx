import React from "react";
import { SectionContentProps } from "@/types/litepaper";

const SectionContent: React.FC<SectionContentProps> = ({ sectionId }) => {
  const sectionContent: Record<string, React.ReactNode> = {
    "introduction": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">1.0 Introduction</h2>
        <p className="text-gray-300 leading-relaxed">
          LedgerFund DAO is a decentralized acquisition platform designed to buy, govern, 
          and scale accounting firms through blockchain-powered investment strategies. 
          Unlike traditional private equity roll-ups that focus on short-term profits 
          and aggressive cost-cutting, LedgerFund DAO is investor-led, ensuring sustainable 
          growth, operational efficiency, and long-term value creation in firm ownership.
        </p>
      </div>
    ),
    "how-it-works": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">2.0 How LedgerFund DAO Works</h2>
        <div className="grid gap-4">
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 className="text-xl font-semibold mb-4 text-teal-400">Key Strategies</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">1️⃣</span>
                <span>Growth Capital – Fund firm expansion, hiring, and new service lines.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2️⃣</span>
                <span>Exit Liquidity – Provide structured buyouts for retiring firm owners.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3️⃣</span>
                <span>Turnarounds – Acquire underperforming firms and optimize operations.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4️⃣</span>
                <span>Revenue-Based Financing – Offer non-dilutive capital tied to firm revenue.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">5️⃣</span>
                <span>Strategic M&A – Consolidate firms into scalable, high-performing groups.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">6️⃣</span>
                <span>Tokenized Firm Ownership – Enable investor exposure to firm revenues.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">7️⃣</span>
                <span>Liquidity Solutions – Provide structured exit pathways via buybacks & sales.</span>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed">
          By focusing on long-term scalability and operational efficiency, LedgerFund DAO 
          creates value for investors while transforming acquired firms into modern, 
          technology-driven operations.
        </p>
      </div>
    ),
    "purpose": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">3.0 Purpose</h2>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Problems in Traditional Firm Acquisitions – Why legacy accounting M&A is inefficient.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>The LedgerFund DAO Model – How blockchain and decentralized governance create a superior investment framework.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Investment Process & Tokenomics – How $LGR tokens drive governance, revenue-sharing, and investment participation.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Roadmap & Future Expansion – How LedgerFund DAO plans to scale firm acquisitions.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Technology & Compliance – The role of smart contracts, tokenized assets, and regulatory alignment in firm ownership.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "audience": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">4.0 Target Audience</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          LedgerFund DAO is designed for those looking to redefine firm acquisitions through blockchain-enabled investment strategies.
        </p>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Investors & Asset Managers – Seeking exposure to cash-flowing, real-world assets via blockchain.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>M&A Specialists – Exploring tokenized firm acquisitions and decentralized investment models.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Accounting Professionals – Interested in next-gen ownership models and firm scaling strategies.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Crypto & RWA Investors – Looking for a compliant, transparent way to invest in tokenized real-world assets.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "executive-summary": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">5.0 Executive Summary</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Key Objectives & Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              LedgerFund DAO is a strategic acquisition engine focused on buying, governing, and optimizing 
              accounting firms at scale. Our mission is to modernize firm ownership through blockchain-driven 
              investment models that prioritize long-term value creation over short-term profit extraction.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Core Objectives</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Acquire Profitable Firms – Targeting under-optimized firms with strong fundamentals and growth potential.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Enhance Operational Efficiency – Deploying technology, automation, and streamlined management for value growth.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Tokenized Ownership – Enabling exposure to real-world assets (RWAs) through governance and revenue-sharing.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Transparent, Investor-Led Governance – Utilizing on-chain voting and smart contracts to drive acquisitions and operations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "industry-landscape": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">6.0 Industry Landscape</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          The accounting industry faces several critical challenges that create opportunities for innovative solutions.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">The Succession Crisis</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>70% of accounting firm owners are over 50, with many nearing retirement.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Limited succession options force firms to sell at a discount or struggle with leadership transitions.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Internal buyouts fail because younger CPAs lack the capital or risk tolerance to acquire firms.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Private equity roll-ups aggressively strip firms of independence through rapid consolidation.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">The Private Equity Problem</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>PE firms focus on aggressive cost-cutting and rapid fee increases, often harming firm culture.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>High-leverage models leave firms overburdened with debt once PE firms exit.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Short-term exit cycles (3-5 years) prioritize financial engineering over sustainable growth.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Barriers to Traditional M&A</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Opaque valuations create pricing inconsistencies and risk for buyers.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>High transaction costs limit M&A accessibility for smaller firms.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Slow, inefficient deal structures discourage independent investors.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Regulatory complexities create costly and time-consuming acquisition processes.</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed">
            LedgerFund DAO provides a modern, decentralized alternative—eliminating inefficiencies, 
            increasing transparency, and giving investors direct control over firm ownership.
          </p>
        </div>
      </div>
    ),
    "succession-crisis": (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-400">The Succession Crisis</h3>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h4 className="text-xl font-semibold text-yellow-500 mb-4">Critical Industry Challenge</h4>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Over 75% of accounting firm owners are approaching retirement age within the next decade.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Less than 10% of firms have a formal succession plan in place.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Traditional succession options are limited and often result in undervalued sales.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Next-gen leaders lack capital access for internal buyouts.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "pe-problem": (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-400">The Private Equity Problem</h3>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>PE firms prioritize aggressive cost-cutting over sustainable growth.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Short investment horizons (3-5 years) create misaligned incentives.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>High leverage models burden firms with unsustainable debt.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Client relationships suffer from rapid consolidation tactics.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "barriers": (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-400">Barriers to Traditional M&A</h3>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Complex valuation processes create pricing uncertainty.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>High transaction costs limit deal accessibility.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Lengthy due diligence periods drain resources.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Regulatory compliance adds significant complexity.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "market-opportunity": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">7.0 Market Opportunity for Decentralized Solutions</h2>
        <p className="text-gray-300 leading-relaxed">
          The $140B+ accounting industry is ripe for disruption. Blockchain-based investment models provide a scalable, transparent, and investor-driven approach to firm ownership.
        </p>

        <div id="tokenized-ownership" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">Tokenized Firm Ownership & Fractional Investment</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>LedgerFund DAO enables tokenized ownership, making firm M&A accessible to a broader investor base.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>$LGR tokens provide exposure to a diversified portfolio of acquired firms.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Decentralized investment pools lower capital barriers, increasing participation in firm acquisitions.</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="efficient-ma" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">Efficient, Transparent & Scalable M&A</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Smart contracts eliminate middlemen, reducing costs and accelerating deal flow.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>On-chain governance ensures transparency—investors vote directly on acquisitions and firm decisions.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Standardized deal structuring enables scalable and repeatable firm acquisitions.</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="investment-models" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">Passive & Active Investment Models</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Passive $LGR holders earn revenue-sharing from firm acquisitions.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Active investors participate in governance, voting on acquisitions, leadership, and strategic direction.</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="pe-alternative" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">A Better Alternative to Private Equity</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>No forced cost-cutting for short-term exits—LedgerFund DAO prioritizes long-term firm growth.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Investor-aligned governance prevents misaligned incentives common in PE roll-ups.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Expanded access to M&A beyond traditional private equity acquisition targets.</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="next-wave" className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">Unlocking the Next Wave of Firm Growth</h3>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Tech-driven acquisitions integrate AI, automation, and digital-first workflows.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Decentralized ownership attracts new investors and next-gen firm operators.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔹</span>
                <span>Optimized capital deployment ensures sustainable firm growth without excessive debt financing.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
    "dao-framework": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">8.0 DAO Framework</h2>
        <div className="space-y-8">
          <p className="text-gray-300 leading-relaxed">
            LedgerFund DAO is a decentralized, permissionless network, where governance and investment 
            decisions are executed via smart contracts and community voting.
          </p>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Key Governance Components</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>$LGR Token Holders – Vote on acquisitions, firm operations, and governance decisions.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Governance Board – Elected to oversee deal sourcing, acquisitions, and operational strategy.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Special Purpose Vehicles (SPVs) – Each acquired firm is structured under an SPV for legal compliance and financial separation.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>On-Chain Proposal & Voting System – Ensures fully transparent, investor-driven decision-making.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Governance Process</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">📌</span>
                  <span>1. Proposal Submission – Investors and stakeholders submit acquisition and operational proposals.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📌</span>
                  <span>2. On-Chain Voting – $LGR holders vote on:</span>
                  <ul className="ml-8 mt-2 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Firm acquisitions & due diligence approvals.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Operational improvements & leadership decisions.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔</span>
                      <span>Revenue allocation & governance updates.</span>
                    </li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📌</span>
                  <span>3. Smart Contract Execution – Approved votes trigger automated, immutable smart contract execution.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "tokenomics": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">9.0 Tokenomics</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          LedgerFund DAO operates with two token models, offering governance rights, revenue-sharing, and liquidity incentives.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">$LGR Token (Governance)</h3>
            <p className="text-gray-300 mb-4">
              $LGR is the core governance token, granting holders:
            </p>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Voting Rights – Influence acquisitions, firm decisions, and DAO operations.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>DAO Revenue Sharing – Earn token reflections from firm-generated revenue.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Exclusive Access – Only $LGR holders can participate in DAO-backed firm acquisitions.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Token Distribution Model</h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Presale Allocation: 5,000,000 $LGR tokens.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Liquidity & Operations: 20% for DAO operations and firm scaling.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Staking & Governance Rewards: Incentives for long-term participation.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✔</span>
                  <span>Treasury Reserve: Capital for future acquisitions and growth.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">$LGR LP Tokens (Liquidity Pool & Passive Income)</h3>
            <p className="text-gray-300 mb-4">
              LGR LP represents liquidity pool shares and provides passive income exposure to firm acquisitions.
            </p>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Earn from firm revenues – A portion of acquisition fees and profits is distributed to LP holders.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Liquidity pool stability – Supports on-chain trading and enhances market depth.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔹</span>
                  <span>Staking & Yield Farming – LP holders stake tokens for additional rewards.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "blockchain": (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-500">10.0 Blockchain & Smart Contracts</h2>
        <p className="text-gray-300 leading-relaxed">
          Our smart contracts are built on Polygon for scalability and efficiency, 
          ensuring transparent and secure operations with minimal gas fees. 
          Decentralized governance through LGR tokens enables community-driven 
          decision-making and protocol evolution.
        </p>
      </div>
    ),
    "investment-strategy": (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-500">11.0 Investment Strategy</h2>
        <p className="text-gray-300 leading-relaxed">
          Our investment strategy is focused on identifying and 
          acquiring accounting firms that have the potential to 
          generate long-term value through strategic acquisitions 
          and operational improvements. We use a combination of 
          financial analysis, market research, and industry 
          expertise to make informed investment decisions.
        </p>
      </div>
    ),
    "risk-assessment": (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-500">12.0 Risk Assessment</h2>
        <p className="text-gray-300 leading-relaxed">
          We take a comprehensive approach to risk assessment 
          throughout the acquisition process, including 
          financial, operational, and regulatory risks. We 
          use a combination of due diligence, market analysis, 
          and industry expertise to identify and mitigate 
          potential risks.
        </p>
      </div>
    ),
    "acquisition-process": (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-500">13.0 Acquisition Process</h2>
        <p className="text-gray-300 leading-relaxed">
          Our acquisition process is designed to be efficient 
          and transparent, with a focus on minimizing 
          operational costs and maximizing value creation. We 
          use a combination of blockchain technology, 
          decentralized governance, and investor-led 
          decision-making to ensure a smooth and successful 
          acquisition process.
        </p>
      </div>
    ),
    "post-acquisition": (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-500">14.0 Post-Acquisition</h2>
        <p className="text-gray-300 leading-relaxed">
          After the acquisition, we provide leadership transition 
          support, tech enhancements, and performance tracking 
          to ensure the successful integration of the acquired 
          firm into the LedgerFund DAO ecosystem.
        </p>
      </div>
    ),
    "token-benefits": (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-500">15.0 Token Benefits</h2>
        <p className="text-gray-300 leading-relaxed">
          As a token holder, you will have the opportunity to 
          participate in the decision-making process, receive 
          staking rewards, and benefit from liquidity 
          rewards. You will also have the ability to 
          participate in the governance of the platform 
          through the use of LGR tokens.
        </p>
      </div>
    ),
    "revenue-sharing": (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-400">Revenue Sharing</h3>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>The DAO distributes a portion of firm revenues to active $LGR token holders.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>On-chain, automated distributions ensure full transparency and fairness.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Revenue Breakdown:</span>
            </li>
            <li className="flex items-start ml-6">
              <span className="mr-2">✔</span>
              <span>50% reinvested into future acquisitions & DAO expansion.</span>
            </li>
            <li className="flex items-start ml-6">
              <span className="mr-2">✔</span>
              <span>40% distributed to token holders via staking rewards.</span>
            </li>
            <li className="flex items-start ml-6">
              <span className="mr-2">✔</span>
              <span>10% allocated to DAO operations & legal compliance.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    "regulatory": (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-500">16.0 Regulatory Compliance</h2>
        <p className="text-gray-300 leading-relaxed">
          We are committed to regulatory compliance and 
          adhere to all relevant laws and regulations. We 
          have implemented a robust compliance framework 
          to ensure that our platform is operated in a 
          legal and ethical manner.
        </p>
      </div>
    ),
    "roadmap": (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-yellow-500">17.0 Roadmap & Milestones</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Phased Development Plan</h3>
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h4 className="text-lg font-semibold text-yellow-400 mb-4">🚀 Phase 1: Foundation & Infrastructure (Q1 2025)</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">✔</span>
                    <span>Presale launch & governance onboarding.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✔</span>
                    <span>Legal structuring (SPVs, compliance frameworks).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✔</span>
                    <span>Smart contract audits & DAO voting system deployment.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✔</span>
                    <span>LP-funded pool structuring & early investor participation.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h4 className="text-lg font-semibold text-yellow-400 mb-4">🏗 Phase 2: Private Token Sale & Community Growth (Q2 2025)</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">✔</span>
                    <span>Private sale for accredited investors.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✔</span>
                    <span>LP-funded acquisition pools go live.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✔</span>
                    <span>First batch of target firm sourcing & due diligence.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return sectionContent[sectionId] || null;
};

export default SectionContent;
