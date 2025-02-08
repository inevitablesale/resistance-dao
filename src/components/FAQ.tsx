
import { HelpCircle, UserRound } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who manages the acquired accounting firms?",
    answer: "Experienced MSP (Managed Service Provider) partners integrated into our ecosystem manage the firms. They present detailed proposals that are put on the blockchain for community voting, ensuring transparent governance on a firm-by-firm basis.",
    icon: UserRound
  },
  {
    question: "What is LedgerFund DAO?",
    answer: "LedgerFund DAO is a decentralized autonomous organization that enables accounting professionals to collectively acquire, govern, and transform accounting practices through blockchain technology and democratic decision-making.",
    icon: HelpCircle
  },
  {
    question: "How does tokenized ownership work?",
    answer: "LGR tokens represent ownership rights in the LedgerFund protocol. Token holders earn reflections from accounting firm investments and participate in governance decisions.",
    icon: HelpCircle
  },
  {
    question: "How can I participate in governance?",
    answer: "As a token holder, you can vote on key protocol decisions, including firm acquisitions, operational changes, and future development initiatives.",
    icon: HelpCircle
  },
  {
    question: "What are reflection rights?",
    answer: "Reflection rights entitle token holders to receive 10% of all future firm distributions, creating a passive income stream from the success of acquired practices.",
    icon: HelpCircle
  },
  {
    question: "When does the presale start?",
    answer: "The presale begins on February 10, 2025. Early supporters can purchase tokens at a 90% discount and receive a 25% bonus allocation.",
    icon: HelpCircle
  },
  {
    question: "How are accounting firms selected?",
    answer: "Firms are identified and vetted by the DAO community. MSP partners conduct due diligence and present detailed proposals for community voting.",
    icon: HelpCircle
  }
];

export const FAQ = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group-hover:text-yellow-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <faq.icon className="w-5 h-5 text-teal-500" />
                    <span className="text-lg font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

