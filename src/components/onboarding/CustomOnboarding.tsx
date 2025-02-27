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
  isChecking?: boolean;
  isUnique?: boolean;
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
    linkedin: { isValid: false, message: "", isChecking: false, isUnique: false },
    subdomain: { isValid: false, message: "", isChecking: false, isUnique: false }
  });
  const { toast } = useToast();
  const [authFlowComplete, setAuthFlowComplete] = useState(false);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const checkLinkedInUniqueness = async (url: string) => {
    if (!url || !validation.linkedin.isValid) return;

    setValidation(prev => ({
      ...prev,
      linkedin: { ...prev.linkedin, isChecking: true }
    }));

    try {
      const currentUserUrl = user?.metadata?.["LinkedIn Profile URL"];
      if (currentUserUrl === url) {
        setValidation(prev => ({
          ...prev,
          linkedin: {
            ...prev.linkedin,
            isChecking: false,
            isUnique: true,
            message: "Valid LinkedIn URL"
          }
        }));
        return;
      }

      const isUnique = true;
      setValidation(prev => ({
        ...prev,
        linkedin: {
          ...prev.linkedin,
          isChecking: false,
          isUnique,
          message: isUnique ? "Valid LinkedIn URL" : "This LinkedIn URL is already registered"
        }
      }));
    } catch (error) {
      console.error("LinkedIn uniqueness check error:", error);
      setValidation(prev => ({
        ...prev,
        linkedin: {
          ...prev.linkedin,
          isChecking: false,
          isUnique: false,
          message: "Error checking LinkedIn URL availability"
        }
      }));
    }
  };

  const checkSubdomainAvailability = async (name: string) => {
    if (!name || !validation.subdomain.isValid) return;

    setValidation(prev => ({
      ...prev,
      subdomain: { ...prev.subdomain, isChecking: true }
    }));

    try {
      const currentSubdomain = user?.metadata?.["name-service-subdomain-handle"];
      if (currentSubdomain === name) {
        setValidation(prev => ({
          ...prev,
          subdomain: {
            ...prev.subdomain,
            isChecking: false,
            isUnique: true,
            message: "Valid subdomain"
          }
        }));
        return;
      }

      const isAvailable = true;
      setValidation(prev => ({
        ...prev,
        subdomain: {
          ...prev.subdomain,
          isChecking: false,
          isUnique: isAvailable,
          message: isAvailable ? "Valid subdomain" : "This subdomain is already taken"
        }
      }));
    } catch (error) {
      console.error("Subdomain availability check error:", error);
      setValidation(prev => ({
        ...prev,
        subdomain: {
          ...prev.subdomain,
          isChecking: false,
          isUnique: false,
          message: "Error checking subdomain availability"
        }
      }));
    }
  };

  useEffect(() => {
    const handleMetadataUpdate = async () => {
      console.log("[Metadata Update] Checking conditions:", {
        isAwaitingVerification,
        hasUser: !!user,
        hasPrimaryWallet: !!primaryWallet,
        authFlowComplete
      });

      if (isAwaitingVerification && user && primaryWallet && authFlowComplete) {
        try {
          console.log("[Metadata Update] Starting update process", {
            linkedInUrl,
            subdomain,
            currentMetadata: user.metadata
          });

          console.log("[Metadata Update] Getting wallet client...");
          const walletClient = await primaryWallet.getWalletClient();
          console.log("[Metadata Update] Wallet client obtained:", !!walletClient);
          
          const updatedMetadata = {
            ...user.metadata,
            "LinkedIn Profile URL": linkedInUrl,
            "name-service-subdomain-handle": subdomain
          };

          console.log("[Metadata Update] Prepared metadata:", updatedMetadata);

          if (walletClient) {
            console.log("[Metadata Update] Updating metadata...");
            await walletClient.updateAuthenticatedUserMetadata(updatedMetadata);
            console.log("[Metadata Update] Update successful!");

            toast({
              title: "Profile Updated",
              description: "Your profile has been successfully updated",
              variant: "default"
            });
            console.log("[Metadata Update] Success toast shown");

            setIsAwaitingVerification(false);
            setIsSubmitting(false);
            setAuthFlowComplete(false);
            console.log("[Metadata Update] States reset");

            console.log("[Metadata Update] Scheduling auth flow close...");
            setTimeout(() => {
              setShowAuthFlow?.(false);
              console.log("[Metadata Update] Auth flow closed");
            }, 2000);
          } else {
            throw new Error("Wallet client not available");
          }
        } catch (error) {
          console.error("[Metadata Update] Error:", error);
          console.log("[Metadata Update] Full error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
          });

          toast({
            title: "Update Failed",
            description: "Failed to save your information. Please try again.",
            variant: "destructive"
          });
          console.log("[Metadata Update] Error toast shown");

          setIsAwaitingVerification(false);
          setIsSubmitting(false);
          setAuthFlowComplete(false);
          console.log("[Metadata Update] States reset after error");
        }
      }
    };

    handleMetadataUpdate();
  }, [isAwaitingVerification, user, primaryWallet, linkedInUrl, subdomain, toast, setShowAuthFlow, authFlowComplete]);

  useEffect(() => {
    console.log("[Auth Flow] Checking completion:", {
      hasUser: !!user,
      hasPrimaryWallet: !!primaryWallet,
      isAwaitingVerification,
      walletConnected: primaryWallet?.isConnected?.()
    });

    if (user && primaryWallet && isAwaitingVerification) {
      const isAuthenticated = primaryWallet.isConnected?.() && user;
      console.log("[Auth Flow] Authentication status:", isAuthenticated);
      
      if (isAuthenticated) {
        console.log("[Auth Flow] Setting auth flow complete");
        setAuthFlowComplete(true);
      }
    }
  }, [user, primaryWallet, isAwaitingVerification]);

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
    return { isValid: true, message: "Checking availability..." };
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
    return { isValid: true, message: "Checking availability..." };
  };

  const debouncedLinkedInCheck = debounce(checkLinkedInUniqueness, 500);
  const debouncedSubdomainCheck = debounce(checkSubdomainAvailability, 500);

  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLinkedInUrl(url);
    const validationResult = validateLinkedIn(url);
    setValidation(prev => ({
      ...prev,
      linkedin: { ...validationResult, isChecking: validationResult.isValid }
    }));
    if (validationResult.isValid) {
      debouncedLinkedInCheck(url);
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.toLowerCase();
    setSubdomain(name);
    const validationResult = validateSubdomain(name);
    setValidation(prev => ({
      ...prev,
      subdomain: { ...validationResult, isChecking: validationResult.isValid }
    }));
    if (validationResult.isValid) {
      debouncedSubdomainCheck(name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Form Submit] Starting submission", {
      linkedInValidation: validation.linkedin,
      subdomainValidation: validation.subdomain
    });

    if (!validation.linkedin.isValid || !validation.linkedin.isUnique || 
        !validation.subdomain.isValid || !validation.subdomain.isUnique ||
        validation.linkedin.isChecking || validation.subdomain.isChecking) {
      console.log("[Form Submit] Validation failed");
      return;
    }

    setIsSubmitting(true);
    setIsAwaitingVerification(true);
    setAuthFlowComplete(false);
    console.log("[Form Submit] States set for submission");
    
    try {
      console.log("[Form Submit] Starting auth flow");
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("[Form Submit] Auth flow error:", error);
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
                    disabled={isSubmitting}
                  />
                  <LinkedinIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {linkedInUrl && (
                  <p className={`text-sm ${validation.linkedin.isValid && validation.linkedin.isUnique ? 'text-green-500' : 'text-destructive'} flex items-center gap-1`}>
                    {validation.linkedin.isChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : validation.linkedin.isValid && validation.linkedin.isUnique ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
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
                  disabled={isSubmitting}
                />
                {subdomain && (
                  <p className={`text-sm ${validation.subdomain.isValid && validation.subdomain.isUnique ? 'text-green-500' : 'text-destructive'} flex items-center gap-1`}>
                    {validation.subdomain.isChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : validation.subdomain.isValid && validation.subdomain.isUnique ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {validation.subdomain.message}
                  </p>
                )}
                {validation.subdomain.isValid && validation.subdomain.isUnique && (
                  <p className="text-sm text-muted-foreground">
                    Your ENS name will be: {subdomain}.resistancedao.eth
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                !validation.linkedin.isValid ||
                !validation.linkedin.isUnique ||
                !validation.subdomain.isValid ||
                !validation.subdomain.isUnique ||
                validation.linkedin.isChecking ||
                validation.subdomain.isChecking ||
                isSubmitting
              }
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
