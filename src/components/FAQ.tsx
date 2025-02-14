
import { HelpCircle, UserRound, Coins, Vote, Building2, Calendar, Users, Wallet, LineChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    question: "What is LedgerFund DAO?",
    answer: "LedgerFund DAO is a decentralized autonomous organization that will be formally established in Wyoming (Q2 2025). It enables accounting professionals to collectively acquire, govern, and transform accounting practices through blockchain technology and democratic decision-making.",
    icon: HelpCircle,
    orbitDuration: 25
  },
  {
    question: "When does the presale start and what are the caps?",
    answer: "The presale launches in Q1 2025 with a soft cap of $250K. Early supporters can participate in the initial phase, followed by a hard cap target of $500K in Q2 2025. The project aims for a $5M targeted raise in Q3 2025 for infrastructure development.",
    icon: Calendar,
    orbitDuration: 20
  },
  {
    question: "How do LedgerFund's liquidity pools work?",
    answer: "Liquidity pools are launched in Phase 3 (Q3 2025) as part of our infrastructure development. These pools enable collective investment in accounting firm acquisitions, with the first acquisitions beginning after the deployment of our Deal Thesis Framework.",
    icon: LineChart,
    orbitDuration: 30
  },
  {
    question: "How does tokenized ownership work?",
    answer: "LGR tokens represent ownership rights in the LedgerFund protocol. Token holders earn reflections from accounting firm investments made through our liquidity pools and participate in governance decisions.",
    icon: Coins,
    orbitDuration: 35
  },
  {
    question: "When can I participate in governance?",
    answer: "Community governance launches in Phase 3 (Q3 2025). As a token holder, you'll be able to vote on key protocol decisions, including firm acquisitions, operational changes, and future development initiatives through our DAO structure.",
    icon: Vote,
    orbitDuration: 40
  },
  {
    question: "What is the Deal Thesis Framework?",
    answer: "The Deal Thesis Framework, launching in Phase 3, is our systematic approach to evaluating and acquiring accounting firms. It establishes clear criteria for acquisitions and ensures transparent governance on investment decisions.",
    icon: Building2,
    orbitDuration: 45
  },
  {
    question: "How are accounting firms managed post-acquisition?",
    answer: "Experienced MSP (Managed Service Provider) partners integrated into our ecosystem manage the firms. They present detailed proposals through our Deal Thesis Framework that are put on the blockchain for community voting.",
    icon: Users,
    orbitDuration: 50
  },
  {
    question: "What are reflection rights?",
    answer: "Reflection rights entitle token holders to receive 10% of all future firm distributions through our liquidity pools, creating a passive income stream from the success of acquired practices.",
    icon: Wallet,
    orbitDuration: 55
  }
];

export const FAQ = () => {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((e.clientY - rect.top) / rect.height) * 2 - 1
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 100);
    
    return () => clearInterval(rotateInterval);
  }, []);

  const getOrbitalPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 + (rotation * Math.PI / 180);
    const radius = 300;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  const handleFaqClick = (index: number) => {
    setSelectedFaq(selectedFaq === index ? null : index);
  };

  return (
    <section className="py-16 relative overflow-hidden min-h-screen" id="faq">
      <div className="absolute inset-0">
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

        <div 
          ref={containerRef}
          className="relative max-w-6xl mx-auto min-h-[800px] perspective-3000"
        >
          {/* Knowledge Core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="absolute inset-2 bg-black rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 rounded-full animate-cosmic-pulse" />
            </div>
          </div>

          {!isMobile ? (
            <div className="absolute inset-0">
              {faqs.map((faq, index) => {
                const position = getOrbitalPosition(index, faqs.length);
                const isSelected = selectedFaq === index;
                const Icon = faq.icon;
                const angleInDegrees = (index / faqs.length * 360 + rotation) % 360;

                return (
                  <motion.div
                    key={index}
                    className="absolute left-1/2 top-1/2 cursor-pointer"
                    animate={{
                      x: isSelected ? 0 : position.x,
                      y: isSelected ? 0 : position.y,
                      scale: isSelected ? 1.2 : 1,
                      zIndex: isSelected ? 10 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      duration: isSelected ? 1 : 0.3
                    }}
                    onClick={() => handleFaqClick(index)}
                  >
                    <motion.div
                      className="relative -translate-x-1/2 -translate-y-1/2"
                      whileHover={{ scale: 1.1 }}
                      style={{ transform: `rotate(${angleInDegrees}deg)` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 rounded-full blur-xl" />
                      <div className="relative bg-black/80 backdrop-blur-sm border border-yellow-500/30 p-4 rounded-full h-16 w-16 flex items-center justify-center group hover:border-yellow-500/60 transition-colors">
                        <Icon className="w-8 h-8 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                      </div>
                      <div 
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
                        style={{ transform: `rotate(-${angleInDegrees}deg)` }}
                      >
                        <span className="text-yellow-500 text-sm font-medium bg-black/80 px-2 py-1 rounded cursor-pointer hover:bg-black/90 transition-colors">
                          {faq.question.split('?')[0]}?
                        </span>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 rounded-lg blur-xl" />
                            <div className="relative bg-black/80 backdrop-blur-sm border border-yellow-500/30 p-6 rounded-lg">
                              <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                              <p className="text-gray-300 text-sm">{faq.answer}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 pt-20">
              {faqs.map((faq, index) => {
                const Icon = faq.icon;
                const isSelected = selectedFaq === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <button
                      onClick={() => handleFaqClick(index)}
                      className="w-full text-left"
                    >
                      <div className="relative bg-black/60 backdrop-blur-sm border border-yellow-500/30 p-4 rounded-lg group hover:border-yellow-500/60 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-yellow-500/10 rounded-full">
                            <Icon className="w-5 h-5 text-yellow-500" />
                          </div>
                          <h3 className="text-lg font-medium text-white group-hover:text-yellow-500 transition-colors">
                            {faq.question}
                          </h3>
                        </div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="text-gray-300 pl-10">{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
