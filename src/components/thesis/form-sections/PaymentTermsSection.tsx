import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProposalMetadata, PaymentTerm } from "@/types/proposals";

export interface PaymentTermsSectionProps {
  formData: ProposalMetadata;
  formErrors: Record<string, string[]>;
  onChange: (field: string, value: PaymentTerm[]) => void;
}

export const PaymentTermsSection = ({ formData, formErrors, onChange }: PaymentTermsSectionProps) => {
  const handleTermChange = (term: PaymentTerm, checked: boolean) => {
    const newTerms = checked 
      ? [...formData.paymentTerms, term]
      : formData.paymentTerms.filter(t => t !== term);
    onChange('paymentTerms', newTerms);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Payment Terms</h2>
        <span className="text-sm text-gray-400">
          Select 1-5 terms
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="cash" 
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            checked={formData.paymentTerms.includes(PaymentTerm.CASH)}
            onCheckedChange={(checked) => handleTermChange(PaymentTerm.CASH, checked as boolean)}
          />
          <Label htmlFor="cash" className="text-gray-200">Cash</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="seller-financing" 
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            checked={formData.paymentTerms.includes(PaymentTerm.SELLER_FINANCING)}
            onCheckedChange={(checked) => handleTermChange(PaymentTerm.SELLER_FINANCING, checked as boolean)}
          />
          <Label htmlFor="seller-financing" className="text-gray-200">Seller Financing</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="earnout" 
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            checked={formData.paymentTerms.includes(PaymentTerm.EARNOUT)}
            onCheckedChange={(checked) => handleTermChange(PaymentTerm.EARNOUT, checked as boolean)}
          />
          <Label htmlFor="earnout" className="text-gray-200">Earnout</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="equity-rollover" 
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            checked={formData.paymentTerms.includes(PaymentTerm.EQUITY_ROLLOVER)}
            onCheckedChange={(checked) => handleTermChange(PaymentTerm.EQUITY_ROLLOVER, checked as boolean)}
          />
          <Label htmlFor="equity-rollover" className="text-gray-200">Equity Rollover</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="bank-financing" 
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            checked={formData.paymentTerms.includes(PaymentTerm.BANK_FINANCING)}
            onCheckedChange={(checked) => handleTermChange(PaymentTerm.BANK_FINANCING, checked as boolean)}
          />
          <Label htmlFor="bank-financing" className="text-gray-200">Bank Financing</Label>
        </div>
      </div>

      {formErrors.paymentTerms && (
        <p className="mt-1 text-sm text-red-500">{formErrors.paymentTerms[0]}</p>
      )}
    </div>
  );
};
