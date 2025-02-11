import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { PenSquare, Plus, Loader2, EyeIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  status: string;
  last_updated: string;
  published_at: string | null;
  slug: string;
}

export default function KnowledgeAdmin() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchArticles();
  }, []);

  async function checkAdminStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { error } = await supabase.auth.getSession();
      if (error || !session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to access the admin panel."
        });
        setLoading(false);
        return;
      }
    }

    const { data: roleCheck, error: roleError } = await supabase
      .rpc('is_admin', { user_id: session.user.id });

    if (roleError || !roleCheck) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page."
      });
      navigate('/');
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  }

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      setArticles(data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load articles"
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateArticleStatus(articleId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('knowledge_articles')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', articleId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Article ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`
      });

      fetchArticles();
    } catch (err) {
      console.error('Error updating article status:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update article status"
      });
    }
  }

  async function deleteArticle(articleId: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      toast({
        title: "Article Deleted",
        description: "Article has been deleted successfully"
      });

      fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete article"
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-md mx-auto mt-20">
          <Card className="p-6 bg-gray-900/50 border-white/10">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                className="bg-white/5 border-white/10"
                onChange={(e) => {
                  // We'll implement login functionality next
                }}
              />
              <Input
                type="password"
                placeholder="Password"
                className="bg-white/5 border-white/10"
                onChange={(e) => {
                  // We'll implement login functionality next
                }}
              />
              <Button 
                className="w-full bg-yellow-500 hover:bg-yellow-600"
                onClick={async () => {
                  // We'll implement login functionality next
                }}
              >
                Sign In
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-teal-400 to-yellow-400 text-transparent bg-clip-text">
            Knowledge Base Admin
          </h1>
          <Button onClick={() => navigate('/knowledge/new')} className="bg-yellow-500 hover:bg-yellow-600">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>

        <Card className="bg-gray-900/50 border-white/10">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={article.status}
                        onValueChange={(value) => updateArticleStatus(article.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(article.last_updated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/knowledge/edit/${article.id}`)}
                        >
                          <PenSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/knowledge/${article.category}/${article.slug}`)}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => deleteArticle(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
