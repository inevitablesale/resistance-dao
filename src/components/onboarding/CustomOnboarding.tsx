
import { useState, useEffect } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { motion, AnimatePresence } from "framer-motion";
import { LinkedinIcon, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCustomWallet } from "@/hooks/useCustomWallet";

interface ValidationState {
  isValid: boolean;
  message: string;
}

export const CustomOnboarding = () => {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { isConnected } = useCustomWallet();
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false);
  const [validation, setValidation] = useState<{
    linkedin: ValidationState;
    subdomain: ValidationState;
  }>({
    linkedin: { isValid: false, message: "" },
    subdomain: { isValid: false, message: "" }
  });
  const { toast } = useToast();

  // Effect to handle metadata updates after auth flow completes
  useEffect(() => {
    const handleMetadataUpdate = async () => {
      if (isAwaitingVerification && user && primaryWallet) {
        try {
          console.log("Updating user metadata...");
          
          // Get the wallet client to interact with the blockchain
          const walletClient = await primaryWallet.getWalletClient();
          
          // Update the user metadata through Dynamic's auth flow
          setShowAuthFlow?.(true);
          
          // Store the data in local storage temporarily
          localStorage.setItem('pendingLinkedInUrl', linkedInUrl);
          localStorage.setItem('pendingSubdomain', subdomain);
          
          toast({
            title: "Profile Update Initiated",
            description: "Please complete the authentication to save your information",
            variant: "default"
          });
          
        } catch (error) {
          console.error("Error updating metadata:", error);
          toast({
            title: "Update Failed",
            description: "Failed to save your information. Please try again.",
            variant: "destructive"
          });
          setIsAwaitingVerification(false);
          setIsSubmitting(false);
        }
      }
    };

    handleMetadataUpdate();
  }, [isAwaitingVerification, user, primaryWallet, linkedInUrl, subdomain, toast, setShowAuthFlow]);

  // Skip if user already onboarded or not connected
  if (!isConnected || (user?.metadata?.["LinkedIn Profile URL"] && user?.metadata?.["name-service-subdomain-handle"])) {
    return null;
  }

  const validateLinkedIn = (url: string) => {
    const pattern = /^https:\/\/([\w-]+\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!url) {
      return { isValid: false, message: "LinkedIn profile URL is required" };
    }
    if (!pattern.test(url)) {
      return { isValid: false, message: "Please enter a valid LinkedIn profile URL" };
    }
    return { isValid: true, message: "Valid LinkedIn URL" };
  };

  const validateSubdomain = (name: string) => {
    const pattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!name) {
      return { isValid: false, message: "Subdomain is required" };
    }
    if (name.length < 1 || name.length > 32) {
      return { isValid: false, message: "Subdomain must be between 1 and 32 characters" };
    }
    if (!pattern.test(name)) {
      return { isValid: false, message: "Only lowercase letters, numbers, and hyphens allowed" };
    }
    return { isValid: true, message: "Valid subdomain" };
  };

  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLinkedInUrl(url);
    setValidation(prev => ({
      ...prev,
      linkedin: validateLinkedIn(url)
    }));
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.toLowerCase();
    setSubdomain(name);
    setValidation(prev => ({
      ...prev,
      subdomain: validateSubdomain(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.linkedin.isValid || !validation.subdomain.isValid) return;

    setIsSubmitting(true);
    setIsAwaitingVerification(true);
    
    try {
      // Trigger Dynamic's auth flow
      console.log("Starting auth flow for metadata update...");
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("Error in auth flow:", error);
      setIsAwaitingVerification(false);
      setIsSubmitting(false);
      toast({
        title: "Update Failed",
        description: "Failed to start the authentication flow. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      >
        <div className="w-full max-w-md p-6 bg-background rounded-lg shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Complete Your Profile</h2>
              <p className="text-muted-foreground">
                Please provide your LinkedIn profile and choose a subdomain for your ENS name
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="linkedin" className="text-sm font-medium text-foreground">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <Input
                    id="linkedin"
                    type="url"
                    value={linkedInUrl}
                    onChange={handleLinkedInChange}
                    className="pl-10"
                    placeholder="https://linkedin.com/in/username"
                  />
                  <LinkedinIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {linkedInUrl && (
                  <p className={`text-sm ${validation.linkedin.isValid ? 'text-green-500' : 'text-destructive'} flex items-center gap-1`}>
                    {validation.linkedin.isValid ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {validation.linkedin.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="subdomain" className="text-sm font-medium text-foreground">
                  ENS Subdomain
                </label>
                <Input
                  id="subdomain"
                  type="text"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  className="lowercase"
                  placeholder="your-name"
                />
                {subdomain && (
                  <p className={`text-sm ${validation.subdomain.isValid ? 'text-green-500' : 'text-destructive'} flex items-center gap-1`}>
                    {validation.subdomain.isValid ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {validation.subdomain.message}
                  </p>
                )}
                {validation.subdomain.isValid && (
                  <p className="text-sm text-muted-foreground">
                    Your ENS name will be: {subdomain}.resistancedao.eth
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!validation.linkedin.isValid || !validation.subdomain.isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
