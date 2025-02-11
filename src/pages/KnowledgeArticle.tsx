
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Loader2, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  helpful_votes: number;
  total_votes: number;
  last_updated: string;
}

export default function KnowledgeArticle() {
  const { category, slug } = useParams();
  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data, error } = await supabase
          .from('knowledge_articles')
          .select('*')
          .eq('category', category)
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load the article"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [category, slug]);

  const handleVote = async (helpful: boolean) => {
    if (!article) return;
    
    setVoting(true);
    try {
      const { error } = await supabase
        .from('knowledge_article_votes')
        .insert([
          {
            article_id: article.id,
            helpful,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: helpful ? "We're glad this was helpful!" : "We'll work on improving this article.",
      });

      // Refresh the article to get updated vote counts
      const { data: updatedArticle } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('id', article.id)
        .single();

      if (updatedArticle) {
        setArticle(updatedArticle);
      }
    } catch (err) {
      console.error('Error voting:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your vote"
      });
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Link to="/knowledge">
              <Button variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8 flex items-center text-sm">
          <Link to="/knowledge" className="text-white/60 hover:text-white flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Knowledge Base
          </Link>
          <span className="mx-2 text-white/40">/</span>
          <span className="text-white/60">{article.category}</span>
        </nav>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-500 via-teal-400 to-yellow-400 text-transparent bg-clip-text">
            {article.title}
          </h1>
          
          <div className="mb-8 text-sm text-white/60">
            Last updated: {new Date(article.last_updated).toLocaleDateString()}
          </div>

          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          <Card className="mt-12 p-6 bg-gray-900/50 border-white/10">
            <h3 className="text-lg font-semibold mb-4">Was this article helpful?</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-white/10"
                onClick={() => handleVote(true)}
                disabled={voting}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Yes
              </Button>
              <Button
                variant="outline"
                className="border-white/10"
                onClick={() => handleVote(false)}
                disabled={voting}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                No
              </Button>
            </div>
          </Card>
        </article>
      </div>
    </div>
  );
}
