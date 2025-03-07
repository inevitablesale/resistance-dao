
import React, { useState, useEffect } from "react";
import { FileText, CalendarDays, RefreshCw } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ToxicButton } from "@/components/ui/toxic-button";

interface JournalEntry {
  id: number;
  wallet_address: string;
  content: string;
  created_at: string;
}

export function UserJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, address } = useCustomWallet();

  const fetchEntries = async () => {
    if (!isConnected || !address) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('wallet_address', address)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch entries when wallet connects or changes
  useEffect(() => {
    fetchEntries();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="p-4 border border-toxic-neon/20 bg-black/70 rounded-lg h-full flex flex-col items-center justify-center">
        <FileText className="h-10 w-10 text-toxic-neon/30 mb-3" />
        <p className="text-white/50 text-center font-mono text-sm">
          Connect your wallet to view your journal entries
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-toxic-neon/30 bg-black/70 rounded-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-toxic-neon" />
          <h3 className="text-sm font-mono uppercase tracking-wide text-toxic-neon">Your Journal Entries</h3>
        </div>
        
        <ToxicButton 
          variant="outline" 
          size="sm" 
          onClick={fetchEntries}
          disabled={isLoading}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </ToxicButton>
      </div>
      
      <div className="flex-1 overflow-y-auto terminal-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw className="h-6 w-6 text-toxic-neon/50 animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-white/50 font-mono text-sm">
              No journal entries found
            </p>
            <p className="text-white/30 font-mono text-xs mt-2">
              Record your first wasteland experience
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-toxic-neon/20 p-3 rounded journal-entry">
                <div className="flex items-center text-xs text-toxic-neon/60 mb-2">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  <span className="font-mono">
                    {format(new Date(entry.created_at), "MMM dd, yyyy • HH:mm")}
                  </span>
                </div>
                <p className="text-white/90 font-mono text-sm whitespace-pre-wrap journal-handwritten">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
