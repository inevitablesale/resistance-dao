
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
        {[
          { id: PaymentTerm.CASH, label: 'Cash' },
          { id: PaymentTerm.SELLER_FINANCING, label: 'Seller Financing' },
          { id: PaymentTerm.EARNOUT, label: 'Earnout' },
          { id: PaymentTerm.EQUITY_ROLLOVER, label: 'Equity Rollover' },
          { id: PaymentTerm.BANK_FINANCING, label: 'Bank Financing' }
        ].map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-white/5">
            <Checkbox 
              id={id.toString()} 
              className="border-white/70 data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.paymentTerms.includes(id)}
              onCheckedChange={(checked) => handleTermChange(id, checked as boolean)}
            />
            <Label 
              htmlFor={id.toString()} 
              className="text-gray-200 cursor-pointer select-none"
            >
              {label}
            </Label>
          </div>
        ))}
      </div>

      {formErrors.paymentTerms && (
        <p className="mt-1 text-sm text-red-500">{formErrors.paymentTerms[0]}</p>
      )}
    </div>
  );
};
