
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FirmSize, DealType, GeographicFocus } from "@/types/proposals";
import { US_STATES } from "@/lib/constants/states";

interface FirmCriteriaSectionProps {
  formData: {
    firmCriteria: {
      size: FirmSize;
      location: string;
      dealType: DealType;
      geographicFocus: GeographicFocus;
    };
  };
  formErrors: Record<string, string[]>;
  onChange: (field: string, value: any) => void;
}

export const FirmCriteriaSection = ({ formData, formErrors, onChange }: FirmCriteriaSectionProps) => {
  useEffect(() => {
    if (formData.firmCriteria.size === undefined) {
      onChange('firmCriteria.size', FirmSize.BELOW_1M);
    }
    if (formData.firmCriteria.dealType === undefined) {
      onChange('firmCriteria.dealType', DealType.ACQUISITION);
    }
    if (formData.firmCriteria.geographicFocus === undefined) {
      onChange('firmCriteria.geographicFocus', GeographicFocus.LOCAL);
    }
  }, []);

  return (
    <div>
      <h2>Target Firm Criteria</h2>

      <div>
        <Label>Preferred Firm Size (Revenue)</Label>
        <RadioGroup 
          value={String(formData.firmCriteria.size)}
          onValueChange={(value) => onChange('firmCriteria.size', Number(value))}
        >
          {[
            { value: FirmSize.BELOW_1M, label: "Below $1M" },
            { value: FirmSize.ONE_TO_FIVE_M, label: "$1M–$5M" },
            { value: FirmSize.FIVE_TO_TEN_M, label: "$5M–$10M" },
            { value: FirmSize.TEN_PLUS, label: "$10M+" }
          ].map((option) => (
            <div key={option.value}>
              <RadioGroupItem 
                value={String(option.value)} 
                id={`size-${option.value}`}
              />
              <Label htmlFor={`size-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {formErrors['firmCriteria.size'] && (
          <p>{formErrors['firmCriteria.size'][0]}</p>
        )}
      </div>

      <div>
        <Label>Geographic Focus</Label>
        <RadioGroup 
          value={String(formData.firmCriteria.geographicFocus)}
          onValueChange={(value) => onChange('firmCriteria.geographicFocus', Number(value))}
        >
          {[
            { value: GeographicFocus.LOCAL, label: "Local" },
            { value: GeographicFocus.REGIONAL, label: "Regional" },
            { value: GeographicFocus.NATIONAL, label: "National" },
            { value: GeographicFocus.REMOTE, label: "Remote" }
          ].map((option) => (
            <div key={option.value}>
              <RadioGroupItem 
                value={String(option.value)} 
                id={`geo-${option.value}`}
              />
              <Label htmlFor={`geo-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {formErrors['firmCriteria.geographicFocus'] && (
          <p>{formErrors['firmCriteria.geographicFocus'][0]}</p>
        )}
      </div>

      <div>
        <Label>Primary State (Optional)</Label>
        <Select 
          value={formData.firmCriteria.location}
          onValueChange={(value) => onChange('firmCriteria.location', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map(state => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors['firmCriteria.location'] && (
          <p>{formErrors['firmCriteria.location'][0]}</p>
        )}
      </div>

      <div>
        <Label>Deal Type</Label>
        <RadioGroup 
          value={String(formData.firmCriteria.dealType)}
          onValueChange={(value) => onChange('firmCriteria.dealType', Number(value))}
        >
          {[
            { value: DealType.ACQUISITION, label: "Acquisition" },
            { value: DealType.MERGER, label: "Merger" },
            { value: DealType.EQUITY_BUYOUT, label: "Equity Buyout" },
            { value: DealType.FRANCHISE, label: "Franchise" },
            { value: DealType.SUCCESSION, label: "Succession" }
          ].map((option) => (
            <div key={option.value}>
              <RadioGroupItem 
                value={String(option.value)} 
                id={`deal-${option.value}`}
              />
              <Label htmlFor={`deal-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {formErrors['firmCriteria.dealType'] && (
          <p>{formErrors['firmCriteria.dealType'][0]}</p>
        )}
      </div>
    </div>
  );
};
