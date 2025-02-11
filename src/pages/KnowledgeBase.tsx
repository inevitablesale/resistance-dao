import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Publication, fetchPublications } from '../services/graphService';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, BookOpen, Briefcase, User, Users, ChevronRight, Star, Clock, Shield, Eye } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from "@/hooks/use-toast";
import { VotingSection } from '@/components/nft-card/VotingSection';
import { motion } from "framer-motion";
import { CreateArticleOverlay } from "@/components/CreateArticleOverlay";
import { CreateResumeOverlay } from "@/components/CreateResumeOverlay";

export default function KnowledgeBase() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useWalletConnection();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [showArticleOverlay, setShowArticleOverlay] = useState(false);
  const [showResumeOverlay, setShowResumeOverlay] = useState(false);

  useEffect(() => {
    fetchArticles();
    
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('has_visited_marketplace');
    if (!hasVisited) {
      startOnboarding();
      localStorage.setItem('has_visited_marketplace', 'true');
    }
  }, []);

  const startOnboarding = () => {
    // Welcome message
    setTimeout(() => {
      toast({
        title: "Welcome to the Attention Marketplace! 👋",
        description: "This is where value meets attention. Let's show you around.",
        duration: 5000,
      });
    }, 1000);

    // Explain the content types
    setTimeout(() => {
      toast({
        title: "Example Content",
        description: "We've prepared some example content to show you what's possible. Browse through articles, job postings, and professional resumes.",
        duration: 5000,
      });
    }, 6000);

    // Search functionality
    setTimeout(() => {
      toast({
        title: "Easy Search",
        description: "Use the search bar to find specific content across all categories.",
        duration: 5000,
      });
    }, 11000);
  };

  async function fetchArticles() {
    try {
      const { publications: newPubs } = await fetchPublications(1, 50);
      setPublications(newPubs);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="w-5 h-5 text-teal-400" />;
      case 'job':
        return <Briefcase className="w-5 h-5 text-yellow-400" />;
      case 'resume':
        return <User className="w-5 h-5 text-purple-400" />;
      default:
        return null;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'article':
        return 'Articles';
      case 'job':
        return 'Job Postings';
      case 'resume':
        return 'Resumes';
      default:
        return type;
    }
  };

  const filteredArticles = publications.filter(article =>
    (searchQuery === '' || 
     article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     article.category?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === null || article.contentType === selectedCategory) &&
    (showExamples)
  );

  const categorizedArticles = filteredArticles.reduce((acc, article) => {
    if (!acc[article.contentType]) {
      acc[article.contentType] = [];
    }
    acc[article.contentType].push(article);
    return acc;
  }, {} as Record<string, Publication[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, #00ff87 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-6xl font-bold bg-gradient-to-r from-teal-400 via-yellow-400 to-purple-400 text-transparent bg-clip-text mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Professional Services Marketplace
            </motion.h1>
            <motion.p 
              className="text-xl text-white/60 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Connect with verified accounting professionals and access premium services through our decentralized marketplace.
            </motion.p>
          </div>

          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <Input
                type="search"
                placeholder="Search for services or professionals..."
                className="w-full pl-12 py-6 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/40 hover:border-white/20 transition-colors focus:border-teal-500/50 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl font-bold text-teal-400 mb-2">{publications.length}</div>
              <div className="text-sm text-white/60">Total Services</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {new Set(publications.map(p => p.publisher)).size}
              </div>
              <div className="text-sm text-white/60">Active Professionals</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {Object.keys(categorizedArticles).length}
              </div>
              <div className="text-sm text-white/60">Categories</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8">
          <ScrollArea className="w-full">
            <div className="flex items-center space-x-2 py-4">
              <Button
                variant="ghost"
                className={`whitespace-nowrap rounded-xl px-6 ${!selectedCategory ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'}`}
                onClick={() => setSelectedCategory(null)}
              >
                <Users className="w-4 h-4 mr-2" />
                All Categories
              </Button>
              {Object.keys(categorizedArticles).map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className={`whitespace-nowrap rounded-xl px-6 ${selectedCategory === category ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {getContentTypeIcon(category)}
                  <span className="ml-2">{getContentTypeLabel(category)}</span>
                </Button>
              ))}
              <Button
                variant={showExamples ? "default" : "outline"}
                className={`ml-auto whitespace-nowrap rounded-xl px-6 ${showExamples ? 'text-white' : 'text-black hover:text-white'}`}
                onClick={() => setShowExamples(!showExamples)}
              >
                <Eye className={`w-4 h-4 mr-2 ${showExamples ? 'text-white' : 'text-black'}`} />
                {showExamples ? 'Hide Examples' : 'View Examples'}
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {!showExamples ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-white/80 mb-4">Create Your Professional NFT</h3>
            <p className="text-white/60 mb-8">Choose the type of NFT you want to create or view examples for inspiration.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div onClick={() => setShowArticleOverlay(true)} className="cursor-pointer">
                <Card className="p-6 bg-white/5 border-white/10 hover:border-teal-400/50 transition-all duration-300">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-teal-400/10 rounded-xl flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6 text-teal-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">Article</h4>
                    <p className="text-sm text-white/60">Share your knowledge and insights with the community</p>
                  </div>
                </Card>
              </div>

              <Link to="/mint-nft?type=job" className="group">
                <Card className="p-6 bg-white/5 border-white/10 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center mx-auto">
                      <Briefcase className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">Job Posting</h4>
                    <p className="text-sm text-white/60">List opportunities and find talented professionals</p>
                  </div>
                </Card>
              </Link>

              <div onClick={() => setShowResumeOverlay(true)} className="cursor-pointer">
                <Card className="p-6 bg-white/5 border-white/10 hover:border-purple-400/50 transition-all duration-300">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-purple-400/10 rounded-xl flex items-center justify-center mx-auto">
                      <User className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">Resume</h4>
                    <p className="text-sm text-white/60">Showcase your skills and professional experience</p>
                  </div>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="whitespace-nowrap rounded-xl px-6 text-black hover:text-white"
                  onClick={() => setShowExamples(true)}
                >
                  <Eye className="w-4 h-4 mr-2 text-black" />
                  View Examples
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categorizedArticles).map(([category, categoryArticles]) => (
              categoryArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/marketplace/${article.contentType}/${article.id}`}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full bg-gray-800/50 border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden backdrop-blur-xl group-hover:transform group-hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                      <div className="relative p-6">
                        <div className="absolute -right-12 top-8 px-12 py-1 rotate-45 text-xs font-medium bg-white/10 text-teal-400 backdrop-blur-sm border-y border-white/10 w-48 text-center">
                          {getContentTypeLabel(category)}
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                            {getContentTypeIcon(category)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-teal-400 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-white/60 mt-1">
                              {article.category}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Shield className="w-4 h-4" />
                            <span>Verified Pro</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Star className="w-4 h-4" />
                            <span>Top Rated</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Clock className="w-4 h-4" />
                            <span>Quick Response</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <User className="w-4 h-4" />
                            <span>{article.publisher.slice(0, 6)}...{article.publisher.slice(-4)}</span>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                          <VotingSection tokenId={article.id} owner={article.publisher} />
                        </div>
                        <div className="absolute bottom-4 right-4 text-white/40 group-hover:text-white/60 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              ))
            ))}
          </div>
        )}
      </div>

      <CreateArticleOverlay 
        isOpen={showArticleOverlay}
        onClose={() => setShowArticleOverlay(false)}
      />

      <CreateResumeOverlay 
        isOpen={showResumeOverlay}
        onClose={() => setShowResumeOverlay(false)}
      />
    </div>
  );
}
