
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is LedgerFund DAO?",
    answer: "LedgerFund DAO is a decentralized autonomous organization that will be formally established in Wyoming (Q2 2025). It enables accounting professionals to collectively acquire, govern, and transform accounting practices through blockchain technology and democratic decision-making.",
  },
  {
    question: "When does the presale start and what are the caps?",
    answer: "The presale launches in Q1 2025 with a soft cap of $250K. Early supporters can participate in the initial phase, followed by a hard cap target of $500K in Q2 2025. The project aims for a $5M targeted raise in Q3 2025 for infrastructure development.",
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
    question: "When can I participate in governance?",
    answer: "Community governance launches in Phase 3 (Q3 2025). As a token holder, you'll be able to vote on key protocol decisions, including firm acquisitions, operational changes, and future development initiatives through our DAO structure.",
  },
  {
    question: "What is the Deal Thesis Framework?",
    answer: "The Deal Thesis Framework, launching in Phase 3, is our systematic approach to evaluating and acquiring accounting firms. It establishes clear criteria for acquisitions and ensures transparent governance on investment decisions.",
  },
  {
    question: "How are accounting firms managed post-acquisition?",
    answer: "Experienced MSP (Managed Service Provider) partners integrated into our ecosystem manage the firms. They present detailed proposals through our Deal Thesis Framework that are put on the blockchain for community voting.",
  },
  {
    question: "What are reflection rights?",
    answer: "Reflection rights entitle token holders to receive 10% of all future firm distributions through our liquidity pools, creating a passive income stream from the success of acquired practices.",
  }
];

export const FAQ = () => {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const handleFaqClick = (index: number) => {
    setSelectedFaq(selectedFaq === index ? null : index);
  };

  return (
    <section className="py-16 min-h-screen bg-black/90" id="faq">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isSelected = selectedFaq === index;
            
            return (
              <div
                key={index}
                className="border border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500/60 transition-colors"
              >
                <button
                  onClick={() => handleFaqClick(index)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
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
                  className={`transition-all duration-200 ease-in-out ${
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
