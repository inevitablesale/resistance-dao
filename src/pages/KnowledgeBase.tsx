
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Settings } from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  status: string;
}

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchArticles();
  }, []);

  async function checkAdminStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: roleCheck } = await supabase
      .rpc('is_admin', { user_id: session.user.id });

    setIsAdmin(roleCheck || false);
  }

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('status', 'published')
        .order('category');

      if (error) throw error;
      setArticles(data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }

  // Filter articles based on search query
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group articles by category
  const categorizedArticles = filteredArticles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, KnowledgeArticle[]>);

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
            Knowledge Base
          </h1>
          {isAdmin && (
            <Link to="/knowledge/admin">
              <Button variant="outline" className="border-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-10 bg-white/5 border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categorizedArticles).map(([category, categoryArticles]) => (
            <Card key={category} className="p-6 bg-gray-900/50 border-white/10">
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <ScrollArea className="h-[300px]">
                <ul className="space-y-2">
                  {categoryArticles.map((article) => (
                    <li key={article.id}>
                      <Link
                        to={`/knowledge/${article.category}/${article.slug}`}
                        className="text-white/80 hover:text-white transition-colors block py-2 px-3 rounded-md hover:bg-white/5"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
