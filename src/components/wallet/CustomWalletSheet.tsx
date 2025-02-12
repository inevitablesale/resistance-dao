
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { WalletAssets } from "./WalletAssets";
import { WalletActions } from "./WalletActions";
import { Wallet, LogOut } from "lucide-react";

export const CustomWalletSheet = () => {
  const { 
    isConnected, 
    connect, 
    disconnect, 
    address, 
    currentView, 
    setCurrentView 
  } = useCustomWallet();

  if (!isConnected) {
    return (
      <Button 
        onClick={connect}
        variant="outline" 
        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-[#1A1F2C] border-white/10 text-white">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle className="text-white">Wallet</SheetTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={disconnect}
              className="text-white hover:text-red-400 hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="assets" className="mt-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger 
              value="assets"
              onClick={() => setCurrentView('assets')}
              className="data-[state=active]:bg-white/10"
            >
              Assets
            </TabsTrigger>
            <TabsTrigger 
              value="actions"
              onClick={() => setCurrentView('actions')}
              className="data-[state=active]:bg-white/10"
            >
              Actions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assets" className="mt-4">
            <WalletAssets />
          </TabsContent>
          
          <TabsContent value="actions" className="mt-4">
            <WalletActions />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
