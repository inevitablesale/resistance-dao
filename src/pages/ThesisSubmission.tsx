
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { TransactionStatus } from "@/components/thesis/TransactionStatus";
import { LGRWalletDisplay } from "@/components/thesis/LGRWalletDisplay";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { executeTransaction } from "@/services/transactionManager";
import { getThesisContract } from "@/services/thesisContractService";

const SUBMISSION_FEE = ethers.utils.parseUnits("250", 18);

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  link: z.string().url({ message: "Please enter a valid URL." }),
});

export default function ThesisSubmission() {
  const { isConnected, approveLGR } = useWalletConnection();
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
    },
  });

  const handleRentAdSpace = async (duration: 'week' | 'month') => {
    try {
      // 10 LGR per week, 35 LGR per month
      const amount = ethers.utils.parseUnits(duration === 'week' ? "10" : "35", 18);
      await approveLGR(amount.toString());
      
      toast({
        title: "Success",
        description: `Ad space rented for 1 ${duration}! Our team will contact you shortly.`,
      });
    } catch (error) {
      toast({
        title: "Failed to rent ad space",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!primaryWallet?.address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit a thesis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tx = await executeTransaction(
        async () => {
          const thesisContract = await getThesisContract();
          return thesisContract.submitThesis(
            values.title,
            values.description,
            values.link,
            { value: SUBMISSION_FEE }
          );
        },
        {
          type: 'contract',
          description: 'Submitting Thesis',
          timeout: 300000,
          maxRetries: 3,
          backoffMs: 5000
        }
      );

      setTransactionId(tx.hash);
      setSubmissionError(null);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmissionError(error.message || "An unexpected error occurred");
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
          <div className="lg:col-span-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-3xl md:text-4xl font-bold text-white mb-8"
            >
              Submit Your Investment Thesis
            </motion.h1>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-yellow-500/10 p-1"
              >
                <Card className="relative overflow-hidden bg-black/60 backdrop-blur-xl border-white/10">
                  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/20 rounded-full">
                    <p className="text-xs text-yellow-500 font-medium">Premium Ad Space</p>
                  </div>
                  <div className="relative z-10 p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <p className="text-sm text-white/60">Available for Booking</p>
                        </div>
                        <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-yellow-400">
                          M&A Transaction Ecosystem Ad Space
                        </h3>
                        <p className="text-sm text-white/60 max-w-md">
                          Reach accounting firms, M&A advisors, and transaction service providers. 
                          Perfect for software vendors, consultants, and service providers in the M&A ecosystem.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 items-start md:items-end">
                        <div>
                          <p className="text-sm text-white/60 mb-1">Weekly rate</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-white">10 LGR</p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                              onClick={() => handleRentAdSpace('week')}
                              disabled={!isConnected}
                            >
                              Rent Week
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-white/60 mb-1">Monthly rate</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-white">35 LGR</p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                              onClick={() => handleRentAdSpace('month')}
                              disabled={!isConnected}
                            >
                              Rent Month
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t border-white/5 bg-white/5">
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <p>Accounting Firms</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <p>M&A Advisors</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <p>Transaction Services</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <LGRWalletDisplay
                submissionFee={SUBMISSION_FEE.toString()}
                currentBalance={primaryWallet?.address ? "0" : undefined} // We'll fetch the actual balance in the component
                walletAddress={primaryWallet?.address}
              />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thesis Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter thesis title" className="bg-white/5 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thesis Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter thesis description"
                            className="bg-white/5 border-white/10 text-white min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link to Thesis</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter link to thesis" className="bg-white/5 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={!isConnected} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                    Submit Thesis
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {transactionId && (
                <TransactionStatus
                  transactionId={transactionId}
                  onComplete={() => {
                    toast({
                      title: "Submission Successful",
                      description: "Your thesis has been submitted successfully!",
                    });
                    setTransactionId(null);
                  }}
                  onError={(error) => {
                    toast({
                      title: "Submission Failed",
                      description: `There was an error submitting your thesis: ${error}`,
                      variant: "destructive",
                    });
                    setSubmissionError(error);
                    setTransactionId(null);
                  }}
                />
              )}
              {submissionError && (
                <p className="text-red-500">{submissionError}</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
