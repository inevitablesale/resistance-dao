
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqCategories = [
  {
    category: "Platform Basics",
    questions: [
      {
        question: "What is LedgerFren Proposal Factory?",
        answer: "LedgerFren Proposal Factory is a decentralized platform that helps you launch your Web3 ideas. By minting a proposal NFT, you can showcase your token, NFT, DeFi, or AI project to our community of 1,500+ subscribers and 2,500+ LinkedIn members to gauge interest before committing significant resources.",
      },
      {
        question: "How does the proposal system work?",
        answer: "When you create a proposal, you mint an NFT that represents your project idea. This NFT contains all the details about your vision, including the type of project, target goals, and implementation strategy. Community members can then show their support through soft commitments, helping you validate your idea before full development.",
      },
      {
        question: "What can I propose on the platform?",
        answer: "You can propose any Web3-related project, including but not limited to: tokens, NFT collections, DeFi protocols, AI integrations, DAOs, and other blockchain-based innovations. The platform is designed to support a wide range of Web3 initiatives.",
      },
    ],
  },
  {
    category: "Proposal Creation",
    questions: [
      {
        question: "How do I create a proposal?",
        answer: "Creating a proposal is simple: 1) Connect your wallet, 2) Click 'Mint Your Proposal NFT' button, 3) Fill out the proposal form with your project details, 4) Pay the $25 minting fee, and 5) Your proposal NFT will be created and listed for community review.",
      },
      {
        question: "What should I include in my proposal?",
        answer: "A strong proposal should include: your project's vision and goals, target market, technical approach, revenue model, and implementation timeline. The more detailed and well-thought-out your proposal is, the better chance it has of gaining community support.",
      },
      {
        question: "Do I need technical knowledge to create a proposal?",
        answer: "No technical knowledge is required to create a proposal. The platform is designed to be accessible to anyone with a Web3 vision. You can focus on describing your idea and goals, while the technical implementation can be figured out later with community support.",
      },
    ],
  },
  {
    category: "Community & Support",
    questions: [
      {
        question: "How does community support work?",
        answer: "Community members can review your proposal and show their support through soft commitments. These commitments help gauge genuine interest in your project without requiring immediate financial investment. Strong community support can help validate your idea and attract potential collaborators.",
      },
      {
        question: "What are soft commitments?",
        answer: "Soft commitments are expressions of interest from community members who believe in your project. While they don't represent binding financial commitments, they help demonstrate market validation and potential user adoption for your idea.",
      },
      {
        question: "How do I engage with the community?",
        answer: "Once your proposal is live, you can interact with community members through comments, updates, and our Discord channel. Regular engagement and transparency about your project's progress can help build trust and support.",
      },
    ],
  },
  {
    category: "Next Steps",
    questions: [
      {
        question: "What happens after my proposal gains support?",
        answer: "Once your proposal gains significant community support, you can move forward with development. The platform provides resources and connections to help you transform your idea into reality, whether that's through technical partnerships, funding opportunities, or community collaboration.",
      },
      {
        question: "How long do proposals stay active?",
        answer: "Proposals remain active on the platform indefinitely, allowing time for community discovery and support. However, we recommend actively promoting your proposal and engaging with the community in the first few weeks after minting to maximize visibility.",
      },
      {
        question: "Can I update my proposal after minting?",
        answer: "While the core NFT data remains immutable, you can add updates and additional information to your proposal through the platform's update mechanism. This allows you to share progress, respond to community feedback, and refine your project details.",
      },
    ],
  },
  {
    category: "Technical & Security",
    questions: [
      {
        question: "How secure is the platform?",
        answer: "Our platform is built on blockchain technology, ensuring transparency and security. All proposals are minted as NFTs on the blockchain, and all community interactions are recorded transparently. We use industry-standard security practices to protect user data and transactions.",
      },
      {
        question: "What blockchain does the platform use?",
        answer: "The platform operates on the Polygon network, chosen for its low transaction costs, fast confirmation times, and environmental sustainability. This ensures creating and interacting with proposals remains accessible and affordable.",
      },
      {
        question: "Do I need my own wallet?",
        answer: "Yes, you'll need a Web3 wallet (like MetaMask) to interact with the platform. The wallet is used to mint your proposal NFT, make soft commitments, and participate in the community. If you don't have a wallet, we provide guidance on setting one up.",
      },
    ],
  },
];

export const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<{category: number, question: number} | null>(null);

  const handleCategoryClick = (categoryIndex: number) => {
    setSelectedCategory(selectedCategory === categoryIndex ? null : categoryIndex);
    setSelectedFaq(null);
  };

  const handleFaqClick = (categoryIndex: number, questionIndex: number) => {
    setSelectedFaq(
      selectedFaq?.category === categoryIndex && selectedFaq?.question === questionIndex
        ? null
        : { category: categoryIndex, question: questionIndex }
    );
  };

  return (
    <section className="relative z-50 py-16 min-h-screen bg-black/90" id="faq">
      <div className="container relative z-50 px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="relative z-50 max-w-4xl mx-auto space-y-6">
          {faqCategories.map((category, categoryIndex) => {
            const isCategorySelected = selectedCategory === categoryIndex;
            
            return (
              <div
                key={categoryIndex}
                className="relative bg-black/80 backdrop-blur-sm border border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500/60 transition-colors"
              >
                <button
                  onClick={() => handleCategoryClick(categoryIndex)}
                  className="relative z-10 w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 hover:bg-yellow-500/10 transition-colors"
                  aria-expanded={isCategorySelected}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium text-yellow-500">
                      {category.category}
                    </h3>
                    <ChevronDown 
                      className={`w-6 h-6 text-yellow-500 transition-transform duration-200 ${
                        isCategorySelected ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                <div
                  className={`relative z-10 transition-all duration-200 ease-in-out ${
                    isCategorySelected ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6 space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const isQuestionSelected = selectedFaq?.category === categoryIndex && selectedFaq?.question === questionIndex;
                      
                      return (
                        <div
                          key={questionIndex}
                          className="bg-black/50 rounded-lg border border-yellow-500/20"
                        >
                          <button
                            onClick={() => handleFaqClick(categoryIndex, questionIndex)}
                            className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                            aria-expanded={isQuestionSelected}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-medium text-white">
                                {faq.question}
                              </h4>
                              <ChevronDown 
                                className={`w-5 h-5 text-yellow-500/70 transition-transform duration-200 ${
                                  isQuestionSelected ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>
                          
                          <div
                            className={`transition-all duration-200 ease-in-out ${
                              isQuestionSelected ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                          >
                            <div className="px-4 pb-4 pt-2 border-t border-yellow-500/20">
                              <p className="text-gray-300 text-base">{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
