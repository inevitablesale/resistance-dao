import { useState } from "react";
import Nav from "@/components/Nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Litepaper = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const sections = [
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
    { id: "market-opportunity", title: "7.0 Market Opportunity",
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

  return (
    <div className="min-h-screen bg-black">
      <Nav />
      
      <div className="pt-20 flex">
        <div className="w-64 fixed left-0 top-20 h-[calc(100vh-5rem)] border-r border-white/10 bg-black/50 backdrop-blur-lg">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm font-medium transition-colors text-left",
                      activeSection === section.id 
                        ? "bg-white/10 text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                    onClick={() => scrollToSection(section.id)}
                  >
                    {section.subsections ? (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    ) : (
                      <div className="w-4 mr-2" />
                    )}
                    {section.title}
                  </Button>
                  
                  {section.subsections && (
                    <div className="ml-4 space-y-1">
                      {section.subsections.map((subsection) => (
                        <Button
                          key={subsection.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-sm font-medium transition-colors text-left pl-6",
                            activeSection === subsection.id 
                              ? "bg-white/10 text-white" 
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          )}
                          onClick={() => scrollToSection(subsection.id)}
                        >
                          {subsection.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="pl-64 w-full">
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="container max-w-4xl mx-auto px-8 py-12">
              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400">
                    LedgerFund Litepaper
                  </h1>
                  <p className="text-lg text-gray-400">
                    Version 1.0 - February 2024
                  </p>
                </div>

                <section id="introduction" className="space-y-6">
                  <h2 className="text-2xl font-bold text-yellow-500">1.0 Introduction</h2>
                  <p className="text-gray-300 leading-relaxed">
                    LedgerFund DAO is a decentralized acquisition platform designed to buy, govern, 
                    and scale accounting firms through blockchain-powered investment strategies. 
                    Unlike traditional private equity roll-ups that focus on short-term profits 
                    and aggressive cost-cutting, LedgerFund DAO is investor-led, ensuring sustainable 
                    growth, operational efficiency, and long-term value creation in firm ownership.
                  </p>
                </section>

                <section id="how-it-works" className="space-y-6">
                  <h2 className="text-2xl font-bold text-yellow-500">2.0 How LedgerFund DAO Acquires & Optimizes Firms</h2>
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
                </section>

                <section id="purpose" className="space-y-6">
                  <h2 className="text-2xl font-bold text-yellow-500">3.0 Purpose of This Whitepaper</h2>
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
                </section>

                <section id="audience" className="space-y-6">
                  <h2 className="text-2xl font-bold text-yellow-500">4.0 Who This Whitepaper Is For</h2>
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
                </section>

                <section id="executive-summary" className="space-y-6">
                  <h2 className="text-2xl font-bold text-yellow-500">5.0 Executive Summary</h2>
                  <p className="text-gray-300 leading-relaxed">
                    LedgerFund DAO is a decentralized acquisition platform designed to buy, govern, 
                    and scale accounting firms through blockchain-powered investment strategies. 
                    Unlike traditional private equity roll-ups that focus on short-term profits 
                    and aggressive cost-cutting, LedgerFund DAO is investor-led, ensuring sustainable 
                    growth, operational efficiency, and long-term value creation in firm ownership.
                  </p>
                </section>

                <section id="industry-landscape" className="space-y-6">
                  <h2 className="text-2xl font-bold text-yellow-500">6.0 Industry Landscape</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                      <h3 className="text-xl font-semibold mb-2 text-teal-400">Smart Contracts</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Built on Polygon for scalability and efficiency, our smart contracts 
                        ensure transparent and secure operations with minimal gas fees.
                      </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                      <h3 className="text-xl font-semibold mb-2 text-teal-400">Governance</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Decentralized governance through LGR tokens enables community-driven 
                        decision-making and protocol evolution.
                      </p>
                    </div>
                  </div>

                  <div id="succession-crisis" className="space-y-4">
                    <h3 className="text-xl font-semibold text-teal-400">The Succession Crisis</h3>
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

                  <div id="pe-problem" className="space-y-4">
                    <h3 className="text-xl font-semibold text-teal-400">The Private Equity Problem</h3>
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

                  <div id="barriers" className="space-y-4">
                    <h3 className="text-xl font-semibold text-teal-400">Barriers to Traditional M&A</h3>
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
                </section>

                <section id="market-opportunity" className="space-y-6">
                  <h2 className="text-2xl font-bold text-yellow-500">7.0 Market Opportunity</h2>
                  <p className="text-gray-300 leading-relaxed">
                    The accounting firm acquisition market is ripe for disruption, with 
                    traditional private equity roll-ups facing challenges in scaling 
                    and maintaining operational efficiency. LedgerFund DAO offers a 
                    more sustainable and scalable solution that aligns with the 
                    needs of modern businesses.
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
                </section>

                <section id="dao-framework" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">8.0 DAO Framework</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our framework is designed to facilitate the acquisition, 
                    governance, and scaling of accounting firms through 
                    blockchain-powered investment strategies. We leverage 
                    decentralized governance to ensure transparency and 
                    accountability, while also providing a platform for 
                    investors to participate in the decision-making process.
                  </p>
                </section>

                <section id="tokenomics" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">9.0 Tokenomics</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our tokenomics are designed to incentivize participation 
                    in the acquisition process and ensure the long-term 
                    sustainability of the platform. We use a combination of 
                    staking, governance, and liquidity rewards to create 
                    a robust ecosystem that supports the growth and 
                    development of the platform.
                  </p>
                </section>

                <section id="blockchain" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">10.0 Blockchain & Smart Contracts</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our smart contracts are built on Polygon for scalability and efficiency, 
                    ensuring transparent and secure operations with minimal gas fees. 
                    Decentralized governance through LGR tokens enables community-driven 
                    decision-making and protocol evolution.
                  </p>
                </section>

                <section id="investment-strategy" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">11.0 Investment Strategy</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our investment strategy is focused on identifying and 
                    acquiring accounting firms that have the potential to 
                    generate long-term value through strategic acquisitions 
                    and operational improvements. We use a combination of 
                    financial analysis, market research, and industry 
                    expertise to make informed investment decisions.
                  </p>
                </section>

                <section id="risk-assessment" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">12.0 Risk Assessment</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We take a comprehensive approach to risk assessment 
                    throughout the acquisition process, including 
                    financial, operational, and regulatory risks. We 
                    use a combination of due diligence, market analysis, 
                    and industry expertise to identify and mitigate 
                    potential risks.
                  </p>
                </section>

                <section id="acquisition-process" className="space-y-4">
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
                </section>

                <section id="post-acquisition" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">14.0 Post-Acquisition</h2>
                  <p className="text-gray-300 leading-relaxed">
                    After the acquisition, we provide leadership transition 
                    support, tech enhancements, and performance tracking 
                    to ensure the successful integration of the acquired 
                    firm into the LedgerFund DAO ecosystem.
                  </p>
                </section>

                <section id="token-benefits" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">15.0 Token Benefits</h2>
                  <p className="text-gray-300 leading-relaxed">
                    As a token holder, you will have the opportunity to 
                    participate in the decision-making process, receive 
                    staking rewards, and benefit from liquidity 
                    rewards. You will also have the ability to 
                    participate in the governance of the platform 
                    through the use of LGR tokens.
                  </p>
                </section>

                <section id="revenue-sharing" className="space-y-4">
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
                </section>

                <section id="regulatory" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">16.0 Regulatory Compliance</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We are committed to regulatory compliance and 
                    adhere to all relevant laws and regulations. We 
                    have implemented a robust compliance framework 
                    to ensure that our platform is operated in a 
                    legal and ethical manner.
                  </p>
                </section>

                <section id="roadmap" className="space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-500">17.0 Roadmap & Milestones</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our roadmap is designed to ensure the long-term 
                    sustainability and growth of the platform. We 
                    have identified several key milestones, including 
                    the launch of the platform, the acquisition of 
                    the first accounting firm, and the development 
                    of new investment strategies.
                  </p>
                </section>

                <div className="flex justify-between items-center pt-8 mt-12 border-t border-white/10">
                  <Button 
                    variant="ghost" 
                    className="text-white/60 hover:text-white"
                  >
                    ← Previous
                  </Button>
                  <Button 
                    variant="ghost"
                    className="text-white/60 hover:text-white"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Litepaper;
