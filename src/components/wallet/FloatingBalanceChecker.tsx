
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { WalletAssets } from "./WalletAssets";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const FloatingBalanceChecker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useCustomWallet();

  if (!isConnected) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsOpen(true)}
                className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 bg-black/10 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden group"
              >
                <img
                  src="https://i.postimg.cc/fT11C9CN/DALL-E-2025-02-13-08-20-18-A-modern-minimalist-logo-with-the-letters-LGR-inside-a-rounded-squar.png"
                  alt="LGR Balance"
                  className="w-10 h-10 object-cover group-hover:opacity-90 transition-opacity animate-in fade-in zoom-in duration-300"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/90 text-white border-white/10">
              <p>Check Balance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[340px] sm:w-[400px] bg-black/95 border-white/10">
          <SheetHeader className="pb-4 border-b border-white/10">
            <SheetTitle className="text-white">Your Balance</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <WalletAssets />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
