
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, Briefcase, AlertCircle } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { analyzeLinkedInProfile } from "@/services/linkedinService";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

interface CreateResumeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateResumeOverlay({ isOpen, onClose }: CreateResumeOverlayProps) {
  const { isConnected, address } = useWalletConnection();
  const { user, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const linkedInUrl = user?.metadata?.["LinkedIn Profile URL"];

  const handleImportFromLinkedIn = async () => {
    if (!linkedInUrl) {
      toast({
        title: "LinkedIn Profile Required",
        description: "Please add your LinkedIn profile URL in your wallet settings.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const metadata = await analyzeLinkedInProfile(linkedInUrl);
      console.log('LinkedIn profile analyzed:', metadata);
      setProfileData(metadata);
      toast({
        title: "Profile Imported",
        description: "Your LinkedIn profile has been successfully imported.",
      });
    } catch (error) {
      console.error('Error analyzing LinkedIn profile:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze your LinkedIn profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] bg-black/95 border-white/10 text-white p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Create Resume NFT</h2>
                <p className="text-sm text-white/60">Showcase your professional experience as an NFT</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {!user ? (
                  <div className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-500">Authentication Required</h3>
                        <p className="text-sm text-white/60 mt-1">
                          Please log in or sign up to create a Resume NFT.
                        </p>
                        <div className="mt-4">
                          <DynamicWidget />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : !linkedInUrl ? (
                  <div className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-500">LinkedIn Profile Required</h3>
                        <p className="text-sm text-white/60 mt-1">
                          Please add your LinkedIn profile URL in your wallet settings to create a Resume NFT.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 border-yellow-500/20 hover:border-yellow-500/40 text-yellow-500"
                          onClick={() => {
                            document.querySelector('[data-dynamic-settings-button]')?.dispatchEvent(
                              new MouseEvent('click', { bubbles: true })
                            );
                          }}
                        >
                          Open Wallet Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : profileData ? (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium text-center">Review Your Resume NFT</h3>
                      <div className="bg-white/5 rounded-lg p-6 space-y-6">
                        <div>
                          <h4 className="text-lg font-medium mb-2">{profileData.name}</h4>
                          <p className="text-white/60">{profileData.description}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white/80 mb-2">Experience</h4>
                          <div className="space-y-4">
                            {profileData.experiences.map((exp: any, index: number) => (
                              <div key={index} className="bg-white/5 p-4 rounded-lg">
                                <h5 className="font-medium">{exp.title}</h5>
                                <p className="text-sm text-white/60">{exp.company}</p>
                                <p className="text-sm text-white/40">{exp.duration} • {exp.location}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white/80 mb-2">Education</h4>
                          <div className="space-y-2">
                            {profileData.education.map((edu: any, index: number) => (
                              <div key={index} className="bg-white/5 p-4 rounded-lg">
                                <h5 className="font-medium">{edu.degree}</h5>
                                <p className="text-sm text-white/60">{edu.school}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white/80 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {profileData.skills.map((skill: string, index: number) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1 bg-transparent border border-white/10 hover:bg-white/5"
                        onClick={() => setProfileData(null)}
                      >
                        Start Over
                      </Button>
                      <Button
                        className="flex-1 bg-purple-500 hover:bg-purple-600"
                        onClick={() => {
                          toast({
                            title: "NFT Created",
                            description: "Your Resume NFT has been successfully created!",
                          });
                          onClose();
                        }}
                      >
                        Create NFT
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 text-center">
                      <Briefcase className="w-12 h-12 mx-auto text-purple-400" />
                      <h3 className="text-xl font-medium">Import Your Professional Experience</h3>
                      <p className="text-white/60 max-w-md mx-auto">
                        We'll analyze your LinkedIn profile to create a comprehensive Resume NFT that showcases your professional journey.
                      </p>
                    </div>

                    <Button
                      className="w-full h-16 text-lg bg-purple-500 hover:bg-purple-600"
                      onClick={handleImportFromLinkedIn}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing Your Profile...
                        </>
                      ) : (
                        <>
                          Import from LinkedIn
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-white/40 text-center">
                      Using LinkedIn URL: {linkedInUrl}
                    </p>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
