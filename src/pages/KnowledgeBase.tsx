
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Publication, fetchPublications } from '../services/graphService';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, BookOpen, Briefcase, User, Users, ChevronRight } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from "@/hooks/use-toast";
import { VotingSection } from '@/components/nft-card/VotingSection';

export default function KnowledgeBase() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useWalletConnection();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Filter articles based on search query and category
  const filteredArticles = publications.filter(article =>
    (searchQuery === '' || 
     article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     article.category?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === null || article.contentType === selectedCategory)
  );

  // Group articles by category
  const categorizedArticles = filteredArticles.reduce((acc, article) => {
    if (!acc[article.contentType]) {
      acc[article.contentType] = [];
    }
    acc[article.contentType].push(article);
    return acc;
  }, {} as Record<string, Publication[]>);

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
        return 'Example Articles';
      case 'job':
        return 'Example Job Postings';
      case 'resume':
        return 'Example Resumes';
      default:
        return type;
    }
  };

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
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 via-yellow-400 to-purple-400 text-transparent bg-clip-text mb-4">
              Professional Services Marketplace
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Connect with verified accounting professionals and access premium services through our decentralized marketplace.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <Input
                type="search"
                placeholder="Search for services or professionals..."
                className="w-full pl-12 py-3 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">{publications.length}</div>
              <div className="text-sm text-white/60">Total Services</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {new Set(publications.map(p => p.publisher)).size}
              </div>
              <div className="text-sm text-white/60">Active Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {Object.keys(categorizedArticles).length}
              </div>
              <div className="text-sm text-white/60">Categories</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8">
          <ScrollArea className="w-full">
            <div className="flex space-x-2 py-4">
              <Button
                variant="ghost"
                className={`whitespace-nowrap ${!selectedCategory ? 'bg-white/10' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                <Users className="w-4 h-4 mr-2" />
                All Categories
              </Button>
              {Object.keys(categorizedArticles).map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className={`whitespace-nowrap ${selectedCategory === category ? 'bg-white/10' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {getContentTypeIcon(category)}
                  <span className="ml-2">{getContentTypeLabel(category)}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categorizedArticles).map(([category, categoryArticles]) => (
            categoryArticles.map((article) => (
              <Link
                key={article.id}
                to={`/marketplace/${article.contentType}/${article.id}`}
                className="group"
              >
                <Card className="h-full p-6 bg-gray-800/50 border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden backdrop-blur-xl">
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-500/10 via-yellow-500/10 to-purple-500/10 px-3 py-1 text-xs text-white/60 rounded-bl">
                    {getContentTypeLabel(category)}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white/5">
                      {getContentTypeIcon(category)}
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-teal-400 transition-colors">
                      {article.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="text-sm text-white/60">
                      {article.category}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-white/40">
                        <User className="w-4 h-4 mr-2" />
                        {article.publisher.slice(0, 6)}...{article.publisher.slice(-4)}
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <VotingSection tokenId={article.id} owner={article.publisher} />
                  </div>
                </Card>
              </Link>
            ))
          ))}
        </div>
      </div>
    </div>
  );
}
