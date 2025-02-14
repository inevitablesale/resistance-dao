
import { useNavigate } from "react-router-dom";
import { FileText, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomWallet } from "@/hooks/useCustomWallet";

export const CallToAction = () => {
  const navigate = useNavigate();
  const { showBanxaDeposit } = useCustomWallet();

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex gap-4 justify-center relative z-20">
            <Button
              onClick={() => showBanxaDeposit()}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
            >
              <Coins className="mr-2 h-4 w-4" />
              Join the Presale
            </Button>
            <Button
              onClick={() => navigate('/litepaper')}
              variant="outline"
              className="bg-white hover:bg-white/90 text-black border-white/20"
            >
              <FileText className="mr-2 h-4 w-4" />
              Read Litepaper
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

