
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is LedgerFund DAO?",
    answer: "LedgerFund DAO is a decentralized autonomous organization that will be formally established in Wyoming (Q2 2025). It enables accounting professionals to collectively acquire, govern, and transform accounting practices through blockchain technology and democratic decision-making.",
  },
  {
    question: "When does the presale start and what are the caps?",
    answer: "The presale launches in Q1 2025 with a soft cap of $250K. Early supporters can participate in the initial phase, followed by a hard cap target of $500K in Q2 2025. The project aims for $5M AUM in Q3 2025 for infrastructure development.",
  },
  {
    question: "Can I participate if I am not an accredited investor?",
    answer: "As a member, you will have access to Regulation D 506(b) raises on the platform that will accept an unlimited number of accredited investors and up to 35 unaccredited investors per firm investment. This structure ensures inclusive participation while maintaining regulatory compliance.",
  },
  {
    question: "What are the benefits of participating in the pre-sale?",
    answer: "Early supporters who participate in the pre-sale stage will receive priority access to future investment opportunities on the platform, subject to meeting KYC/AML and eligibility requirements. This early participation establishes your status as a qualified member for accessing private capital raising opportunities once the platform launches.",
  },
  {
    question: "When can I participate in governance?",
    answer: "Community governance launches in Phase 3 (Q3 2025). As a token holder who has completed self-attestation of accreditation status, you'll be able to vote on key protocol decisions, including firm acquisitions, operational changes, and future development initiatives through our DAO structure. This attestation process ensures compliant participation in investment decisions.",
  },
  {
    question: "What is the Deal Thesis Framework?",
    answer: "The Deal Thesis Framework, launching in Phase 3, is a member-driven system where LGR token holders can submit and evaluate proposals for accounting firm acquisitions. Members create and submit detailed investment proposals to attract capital from fellow members, with clear criteria and transparent governance ensuring collective decision-making on all investments.",
  },
  {
    question: "How do LedgerFund's liquidity pools work?",
    answer: "Liquidity pools are launched in Phase 3 (Q3 2025) as part of our infrastructure development. These pools enable collective investment in accounting firm acquisitions, with the first acquisitions beginning after the deployment of our Deal Thesis Framework.",
  },
  {
    question: "How does tokenized ownership work?",
    answer: "LGR tokens represent ownership rights in the LedgerFund protocol. Token holders earn reflections from accounting firm investments made through our liquidity pools and participate in governance decisions.",
  },
  {
    question: "What are reflection rights?",
    answer: "Reflection rights entitle token holders to receive 10% of all future firm distributions through our liquidity pools, creating a passive income stream from the success of acquired practices.",
  },
  {
    question: "What's the difference between LGR reflections and LP investment returns?",
    answer: "There are two distinct ways to earn with LedgerFund: 1) All LGR token holders automatically receive 10% of firm distributions as reflections, simply for holding the token. 2) LGR LP holders who actively invest in specific firm acquisitions through our liquidity pools receive 70% of net profits from those specific firms, represented by RWA tokens. This means you can earn both passive reflections as a token holder and direct profits as an LP investor.",
  },
  {
    question: "How are accounting firms managed post-acquisition?",
    answer: "Experienced MSP (Managed Service Provider) partners integrated into our ecosystem manage the firms. They present detailed proposals through our Deal Thesis Framework that are put on the blockchain for community voting.",
  }
];

export const FAQ = () => {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const handleFaqClick = (index: number) => {
    setSelectedFaq(selectedFaq === index ? null : index);
  };

  return (
    <section className="relative z-50 py-16 min-h-screen bg-black/90" id="faq">
      <div className="container relative z-50 px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="relative z-50 max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isSelected = selectedFaq === index;
            
            return (
              <div
                key={index}
                className="relative bg-black/80 backdrop-blur-sm border border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500/60 transition-colors"
              >
                <button
                  onClick={() => handleFaqClick(index)}
                  className="relative z-10 w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 hover:bg-yellow-500/10 transition-colors"
                  aria-expanded={isSelected}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-yellow-500 transition-transform duration-200 ${
                        isSelected ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                <div
                  id={`faq-answer-${index}`}
                  className={`relative z-10 transition-all duration-200 ease-in-out ${
                    isSelected ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6 border-t border-yellow-500/20 pt-4">
                    <p className="text-gray-300 text-base">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
