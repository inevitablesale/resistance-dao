import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { LGRWalletDisplay } from "@/components/thesis/LGRWalletDisplay";
import { TransactionStatus } from "@/components/thesis/TransactionStatus";
import { PaymentTermsSection } from "@/components/thesis/form-sections/PaymentTermsSection";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  dealType: z.string().min(2, {
    message: "Deal type must be at least 2 characters.",
  }),
  transactionSize: z.string().min(2, {
    message: "Transaction size must be at least 2 characters.",
  }),
  paymentTerms: z.string().array().min(1, {
    message: "You must select at least one payment term.",
  }).max(5, {
    message: "You can select a maximum of 5 payment terms.",
  }),
  thesis: z.string().min(10, {
    message: "Thesis must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const SUBMISSION_FEE = ethers.utils.parseUnits("250", 18);

const ThesisSubmission = () => {
  const { isConnected, approveLGR } = useWalletConnection();
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address;
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const tokenContracts = [{ symbol: "LGR" }];
  const { tokenBalances } = useTokenBalances(tokenContracts);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      country: "",
      dealType: "",
      transactionSize: "",
      paymentTerms: [],
      thesis: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  const handleRentAdSpace = async () => {
    try {
      // 15 LGR per month (equivalent to roughly $999)
      const amount = ethers.utils.parseUnits("15", 18);
      await approveLGR(amount.toString());
      
      toast({
        title: "Success",
        description: "Ad space rental confirmed! Our team will contact you shortly.",
      });
    } catch (error) {
      toast({
        title: "Failed to rent ad space",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

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
                          Premium Billboard Space
                        </h3>
                        <p className="text-sm text-white/60 max-w-md">
                          Reach M&A professionals, accountants, and deal-makers directly.
                          Pay with LGR tokens for immediate booking.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-start md:items-end">
                        <p className="text-sm text-white/60">Monthly rate</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-white">15 LGR</p>
                          <p className="text-sm text-white/60">≈ $999</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                          onClick={handleRentAdSpace}
                          disabled={!isConnected}
                        >
                          {isConnected ? "Rent Ad Space" : "Connect Wallet to Rent"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t border-white/5 bg-white/5">
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <p>100k+ Monthly Views</p>
                      <p>Premium Placement</p>
                      <p>Verified Audience</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <LGRWalletDisplay
                submissionFee={SUBMISSION_FEE.toString()}
                currentBalance={tokenBalances?.find(token => token.symbol === "LGR")?.balance?.toString()}
                walletAddress={address}
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-12"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/5 border-white/10 text-white" 
                            placeholder="Enter company name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Industry</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/5 border-white/10 text-white" 
                            placeholder="e.g., Technology, Healthcare" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Country</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/5 border-white/10 text-white" 
                            placeholder="e.g., United States, Canada" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dealType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Deal Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Select a deal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black/80 border-white/10 text-white">
                            <SelectItem value="Acquisition">Acquisition</SelectItem>
                            <SelectItem value="Merger">Merger</SelectItem>
                            <SelectItem value="Divestiture">Divestiture</SelectItem>
                            <SelectItem value="Joint Venture">Joint Venture</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transactionSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Transaction Size</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/5 border-white/10 text-white" 
                            placeholder="e.g., $10M - $50M" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <PaymentTermsSection 
                    formData={{
                      paymentTerms: form.getValues().paymentTerms || []
                    }}
                    formErrors={{
                      paymentTerms: form.formState.errors.paymentTerms
                        ? [form.formState.errors.paymentTerms.message || '']
                        : []
                    }}
                    onChange={(field, value) => {
                      if (field === 'paymentTerms') {
                        form.setValue('paymentTerms', value);
                      }
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="thesis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Investment Thesis</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your investment thesis"
                            className="bg-white/5 border-white/10 text-white resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </motion.div>
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
};

export default ThesisSubmission;
