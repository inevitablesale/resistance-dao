
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { ToxicButton } from './toxic-button';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { supabase } from '@/integrations/supabase/client';
import { Radiation, Send, MessageSquare, ClipboardList } from 'lucide-react';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

// Define the interface locally to avoid importing from types.ts
interface JournalEntry {
  id: string;
  wallet_address: string;
  content: string;
  created_at: string;
}

export function JournalDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useCustomWallet();
  
  // Fetch journal entries when dialog opens
  React.useEffect(() => {
    if (isOpen && address) {
      fetchJournalEntries();
    }
  }, [isOpen, address]);
  
  const fetchJournalEntries = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Use type assertion to handle the data
      setJournalEntries(data as JournalEntry[]);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast.error('Failed to load survivor messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  const submitJournalEntry = async () => {
    if (!address || !journalEntry.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Use type assertion when inserting data
      const { error } = await supabase
        .from('journal_entries')
        .insert([
          {
            wallet_address: address,
            content: journalEntry.trim()
          }
        ] as any);
        
      if (error) throw error;
      
      toast.success('Survivor message recorded');
      setJournalEntry('');
      fetchJournalEntries();
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      toast.error('Failed to record message');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 border-toxic-neon/30 text-white max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-toxic-neon flex items-center gap-2">
            <Radiation className="h-5 w-5" />
            Survivor Network Terminal
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Leave messages for other survivors or view the resistance network communications
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="bg-black/60 border border-toxic-neon/20">
            <TabsTrigger value="view" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
              <MessageSquare className="h-4 w-4 mr-2" />
              View Messages
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
              <Send className="h-4 w-4 mr-2" /> 
              Send Message
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="border border-toxic-neon/20 bg-black/60 p-4 mt-4 rounded-md">
            <div className="space-y-4 max-h-[400px] overflow-y-auto terminal-scrollbar pr-2">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="h-6 w-6 border-2 border-toxic-neon border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : journalEntries.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <ClipboardList className="h-10 w-10 mx-auto mb-2 text-toxic-neon/40" />
                  <p>No survivor messages found</p>
                </div>
              ) : (
                journalEntries.map((entry) => (
                  <div key={entry.id} className="border border-toxic-neon/20 p-3 rounded-md bg-black/40">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-toxic-neon text-xs font-mono bg-toxic-neon/10 px-2 py-1 rounded">
                        {entry.wallet_address.substring(0, 6)}...{entry.wallet_address.substring(entry.wallet_address.length - 4)}
                      </div>
                      <div className="text-white/50 text-xs">
                        {new Date(entry.created_at).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-white/90 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="create" className="border border-toxic-neon/20 bg-black/60 p-4 mt-4 rounded-md">
            <div className="space-y-4">
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Enter your message for other survivors..."
                className="w-full h-32 bg-black/80 border border-toxic-neon/30 rounded-md p-3 text-white placeholder:text-white/40 focus:ring-toxic-neon/30 focus:border-toxic-neon/50 terminal-scrollbar"
              />
              
              <div className="flex justify-end">
                <ToxicButton 
                  onClick={submitJournalEntry}
                  disabled={isSubmitting || !journalEntry.trim()}
                  variant="glowing"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-toxic-neon border-t-transparent rounded-full animate-spin mr-2"></div>
                      Recording...
                    </>
                  ) : (
                    <>
                      <Radiation className="h-4 w-4 mr-2" />
                      Broadcast Message
                    </>
                  )}
                </ToxicButton>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="border-toxic-neon/40 text-toxic-neon hover:bg-toxic-neon/10"
          >
            Close Terminal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
