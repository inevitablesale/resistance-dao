
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Save, PenTool, ArrowLeft } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { GovernanceProposal } from "@/services/partyProtocolService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalTemplates, ProposalTemplate } from "./ProposalTemplates";

const proposalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must not exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  transactions: z.array(z.object({
    target: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
    value: z.string().default("0"),
    calldata: z.string().default("0x"),
    signature: z.string().optional(),
    description: z.string().optional()
  })).min(1, "At least one transaction is required")
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

export const ProposalForm = ({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (proposal: GovernanceProposal) => void;
  onCancel: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<"templates" | "custom">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplate | null>(null);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      description: "",
      transactions: [{ target: "", value: "0", calldata: "0x" }]
    }
  });

  useEffect(() => {
    if (selectedTemplate) {
      form.reset({
        title: selectedTemplate.defaultTitle,
        description: selectedTemplate.defaultDescription,
        transactions: selectedTemplate.defaultTransactions
      });
      setActiveTab("custom");
    }
  }, [selectedTemplate, form]);

  const handleAddTransaction = () => {
    const transactions = form.getValues().transactions;
    form.setValue("transactions", [
      ...transactions, 
      { target: "", value: "0", calldata: "0x" }
    ]);
  };

  const handleRemoveTransaction = (index: number) => {
    const transactions = form.getValues().transactions;
    if (transactions.length > 1) {
      form.setValue("transactions", transactions.filter((_, i) => i !== index));
    }
  };

  const handleSelectTemplate = (template: ProposalTemplate) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="space-y-6">
      {activeTab === "custom" && selectedTemplate && (
        <button 
          onClick={() => setActiveTab("templates")}
          className="text-toxic-neon hover:text-toxic-neon/80 flex items-center gap-1 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to templates
        </button>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "templates" | "custom")}>
        <TabsList className="bg-black/40 border border-toxic-neon/10 w-full mb-6">
          <TabsTrigger 
            value="templates"
            className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon flex-1"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="custom"
            className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon flex-1"
          >
            {selectedTemplate ? "Customize Proposal" : "Custom Proposal"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4 mt-4">
          <ProposalTemplates onSelectTemplate={handleSelectTemplate} />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Settlement fund allocation" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what this proposal will accomplish and why it should be supported..."
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Transactions</h3>
                  <ToxicButton
                    type="button"
                    variant="tertiary"
                    size="sm"
                    onClick={handleAddTransaction}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </ToxicButton>
                </div>

                {form.watch("transactions").map((transaction, index) => (
                  <div key={index} className="space-y-4 p-4 border border-toxic-neon/20 rounded-md bg-black/30">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm text-white/70">Transaction {index + 1}</h4>
                      <ToxicButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTransaction(index)}
                        disabled={form.watch("transactions").length <= 1}
                      >
                        <X className="w-4 h-4" />
                      </ToxicButton>
                    </div>

                    <FormField
                      control={form.control}
                      name={`transactions.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Send ETH to treasury" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`transactions.${index}.target`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Address</FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`transactions.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value (ETH)</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`transactions.${index}.calldata`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calldata</FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`transactions.${index}.signature`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Function Signature (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="transfer(address,uint256)" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <ToxicButton type="button" variant="tertiary" onClick={onCancel}>
                  Cancel
                </ToxicButton>
                <ToxicButton type="submit" variant="primary" className="gap-2">
                  <Save className="w-4 h-4" />
                  Create Proposal
                </ToxicButton>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
