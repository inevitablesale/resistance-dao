
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToxicButton } from "@/components/ui/toxic-button";
import { FileText, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { supabase } from "@/integrations/supabase/client";

interface JournalEntryFormProps {
  onEntryAdded: () => void;
}

export function JournalEntryForm({ onEntryAdded }: JournalEntryFormProps) {
  const [entryText, setEntryText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { isConnected, address } = useCustomWallet();

  const saveJournalEntry = async () => {
    if (!entryText.trim()) {
      toast.error("Cannot save empty journal entry");
      return;
    }
    
    if (!isConnected || !address) {
      toast.error("Connect your wallet to save journal entries");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert([
          { 
            wallet_address: address,
            content: entryText,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      toast.success("Journal entry saved", {
        description: "Your wasteland experiences have been recorded"
      });
      
      setEntryText("");
      onEntryAdded();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("Failed to save journal entry", {
        description: "The network is unstable, try again later"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 border border-toxic-neon/30 bg-black/70 rounded-lg journal-paper">
      <div className="flex items-center mb-3 gap-2 text-toxic-neon">
        <FileText className="h-4 w-4" />
        <h3 className="text-sm font-mono uppercase tracking-wide">New Journal Entry</h3>
      </div>
      
      <Textarea 
        value={entryText}
        onChange={(e) => setEntryText(e.target.value)}
        placeholder="Record your wasteland experiences here..."
        className="bg-transparent border-toxic-neon/20 text-white/90 font-mono text-sm h-24 focus:border-toxic-neon/60"
        disabled={!isConnected || isSaving}
      />
      
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-white/50 font-mono">
          {isConnected ? (
            <>Connected: <span className="text-toxic-neon/70">{address?.slice(0, 6)}...{address?.slice(-4)}</span></>
          ) : (
            <span className="text-apocalypse-red/70">Connect wallet to save entries</span>
          )}
        </p>
        
        <ToxicButton 
          onClick={saveJournalEntry} 
          disabled={!isConnected || isSaving || !entryText.trim()}
          size="sm"
        >
          {isSaving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Record Entry</>
          )}
        </ToxicButton>
      </div>
    </div>
  );
}
