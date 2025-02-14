
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const handleKeyPress = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFaqClick(index);
    }
  };

  return (
    <section className="py-16 relative overflow-hidden min-h-screen" id="faq">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/90" />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(234,179,8,0.1) 0%, rgba(45,212,191,0.05) 30%, transparent 70%)',
            animation: 'cosmic-pulse 4s ease-in-out infinite'
          }}
        />
      </div>

      <div className="container px-4 relative">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isSelected = selectedFaq === index;
            
            return (
              <div
                key={index}
                className="relative group"
              >
                <button
                  onClick={() => handleFaqClick(index)}
                  onKeyDown={(e) => handleKeyPress(index, e)}
                  className="w-full text-left focus:outline-none focus:ring-2 focus:ring-yellow-500/50 rounded-lg"
                  aria-expanded={isSelected}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="relative bg-black/60 backdrop-blur-sm border border-yellow-500/30 p-6 rounded-lg group-hover:border-yellow-500/60 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-medium text-white group-hover:text-yellow-500 transition-colors pr-8">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: isSelected ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-6 top-6"
                      >
                        <ChevronDown className="w-5 h-5 text-yellow-500" />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          id={`faq-answer-${index}`}
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-yellow-500/20 pt-4">
                            <p className="text-gray-300 text-base">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
