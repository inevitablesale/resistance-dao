
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export function SimpleListingForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [lgrAmount, setLgrAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  
  const { toast } = useToast();
  const { isConnected, connect } = useWalletConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to post opportunities",
        variant: "destructive"
      });
      connect();
      return;
    }

    // TODO: Implement on-chain listing creation
    toast({
      title: "Success",
      description: "Your work opportunity has been posted",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-white">What needs to be done?</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Review Q4 Tax Returns"
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about the work required..."
          className="bg-white/5 border-white/10 text-white min-h-[100px]"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Category</Label>
          <Select
            value={category}
            onValueChange={setCategory}
            required
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tax_prep">Tax Preparation</SelectItem>
              <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
              <SelectItem value="advisory">Advisory</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">LGR Token Payment</Label>
          <Input
            type="number"
            value={lgrAmount}
            onChange={(e) => setLgrAmount(e.target.value)}
            placeholder="Amount of LGR tokens"
            className="bg-white/5 border-white/10 text-white"
            required
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Deadline</Label>
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600"
        >
          Post Opportunity
        </Button>
      </div>
    </form>
  );
}
