
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Publication, fetchPublications } from '../services/graphService';
import { getFromIPFS, IPFSContent } from '../services/ipfsService';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, BookOpen, Briefcase, User } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { VotingSection } from '@/components/nft-card/VotingSection';

export default function KnowledgeBase() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useWalletConnection();
  const { toast } = useToast();
  const [isExampleOpen, setIsExampleOpen] = useState(true);

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

  // Filter articles based on search query
  const filteredArticles = publications.filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchQuery.toLowerCase())
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
        return <BookOpen className="w-5 h-5 text-yellow-500" />;
      case 'job':
        return <Briefcase className="w-5 h-5 text-teal-500" />;
      case 'resume':
        return <User className="w-5 h-5 text-purple-500" />;
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-teal-400 to-yellow-400 text-transparent bg-clip-text">
            Attention Marketplace
          </h1>
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="text-sm text-white/60">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-10 bg-white/5 border-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="mt-2 text-sm text-white/60">Browse through our example content below to see what's possible in the marketplace.</p>
        </div>

        <Collapsible
          open={isExampleOpen}
          onOpenChange={setIsExampleOpen}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white/90">Example Content</h2>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="bg-black/40 border-white/10">
                {isExampleOpen ? 'Hide Examples' : 'Show Examples'}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categorizedArticles).map(([category, categoryArticles]) => (
                <Card key={category} className="p-6 bg-gray-900/50 border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500 rounded-bl">
                    Example Content
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    {getContentTypeIcon(category)}
                    <h2 className="text-xl font-semibold">{getContentTypeLabel(category)}</h2>
                  </div>
                  <ScrollArea className="h-[300px] mb-4">
                    <ul className="space-y-2">
                      {categoryArticles.map((article) => (
                        <li key={article.id}>
                          <Link
                            to={`/marketplace/${article.contentType}/${article.id}`}
                            className="text-white/80 hover:text-white transition-colors block py-2 px-3 rounded-md hover:bg-white/5"
                          >
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  <VotingSection tokenId={category} owner={categoryArticles[0].publisher} />
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
