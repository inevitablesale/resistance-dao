
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JournalEntryForm } from "@/components/ui/journal-entry-form";
import { UserJournalEntries } from "@/components/ui/user-journal-entries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PenSquare } from "lucide-react";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { useCustomWallet } from "@/hooks/useCustomWallet";

interface JournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JournalDialog({ open, onOpenChange }: JournalDialogProps) {
  const [activeTab, setActiveTab] = useState("entries");
  const { isConnected } = useCustomWallet();
  
  const handleEntryAdded = () => {
    // Switch to entries tab after adding a new entry
    setActiveTab("entries");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-toxic-neon/40 max-w-3xl w-[90vw] rounded-md p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-toxic-neon/30 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-toxic-neon" />
            <DialogTitle className="text-toxic-neon font-mono text-lg tracking-tight">WASTELAND SURVIVOR JOURNAL</DialogTitle>
          </div>
          
          <div className="flex items-center">
            <WalletConnectButton size="sm" variant="outline" />
          </div>
        </DialogHeader>
        
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-black/50 border border-toxic-neon/20 w-full">
              <TabsTrigger 
                value="entries" 
                className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Entries
              </TabsTrigger>
              <TabsTrigger 
                value="add"
                className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon"
              >
                <PenSquare className="h-4 w-4 mr-2" />
                New Entry
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="entries" className="mt-0">
                <div className="h-[50vh]">
                  <UserJournalEntries />
                </div>
              </TabsContent>
              
              <TabsContent value="add" className="mt-0">
                <JournalEntryForm onEntryAdded={handleEntryAdded} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
