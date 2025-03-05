
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ReferralRedirect = () => {
  const { referrerAddress } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Store the referrer address in localStorage if it's valid
    if (referrerAddress && referrerAddress.length > 0) {
      console.log("Storing referrer address:", referrerAddress);
      localStorage.setItem("referrer_address", referrerAddress);
      
      toast({
        title: "Welcome!",
        description: "You've been referred by a community member.",
      });
    }

    // Redirect to the homepage after a brief delay
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 300);

    return () => clearTimeout(redirectTimer);
  }, [referrerAddress, navigate, toast]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-300 mb-4">Welcome to Resistance DAO</h1>
          <p className="text-white mb-2">We're redirecting you to our homepage...</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralRedirect;
