
import { Button } from "@/components/ui/button";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { Send, Plus } from "lucide-react";

export const WalletActions = () => {
  const { showBanxaDeposit, sendTransaction } = useCustomWallet();

  return (
    <div className="grid grid-cols-2 gap-4 pt-2">
      <Button 
        variant="outline" 
        className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
        onClick={() => {
          console.log("Opening deposit view");
          showBanxaDeposit();
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Deposit
      </Button>
      <Button 
        variant="outline" 
        className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
        onClick={() => {
          console.log("Opening send view");
          sendTransaction();
        }}
      >
        <Send className="w-4 h-4 mr-2" />
        Send
      </Button>
    </div>
  );
};
