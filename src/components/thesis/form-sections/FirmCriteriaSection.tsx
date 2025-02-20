import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FirmSize, DealType, GeographicFocus } from "@/types/proposals";
import { US_STATES } from "@/lib/constants/states";

export interface FirmCriteriaSectionProps {
  formData: {
    firmCriteria: {
      size: FirmSize | null;
      location: string;
      dealType: DealType | null;
      geographicFocus: GeographicFocus | null;
    };
  };
  formErrors: Record<string, string[]>;
  onChange: (field: string, value: any) => void;
}

export const FirmCriteriaSection = ({ formData, formErrors, onChange }: FirmCriteriaSectionProps) => {
  // Debug logs to track state changes
  console.log("Current firm criteria:", formData.firmCriteria);

  const handleRadioChange = (field: string, value: string) => {
    console.log(`Handling radio change for ${field}:`, value);
    const numericValue = Number(value);
    console.log("Converting to numeric value:", numericValue);
    
    // Directly set the value in the formData structure
    onChange(`firmCriteria.${field}`, numericValue);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Target Firm Criteria</h2>
      
      <div>
        <Label className="text-white mb-2 block">Preferred Firm Size (Revenue)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { value: FirmSize.BELOW_1M, label: 'Below $1M' },
            { value: FirmSize.ONE_TO_FIVE_M, label: '$1M–$5M' },
            { value: FirmSize.FIVE_TO_TEN_M, label: '$5M–$10M' },
            { value: FirmSize.TEN_PLUS, label: '$10M+' }
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRadioChange('size', String(value))}
              className={`flex items-center gap-2 p-3 rounded-lg transition-all cursor-pointer text-left
                ${formData.firmCriteria.size === value ? 'bg-white/10 border-purple-400/50' : 'bg-black/20 hover:bg-white/5'}
                border border-white/10 hover:border-purple-400/30`}
            >
              <RadioGroupItem 
                checked={formData.firmCriteria.size === value}
                value={String(value)}
                className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white"
              />
              <span className="text-sm text-gray-200">{label}</span>
            </button>
          ))}
        </div>
        {formErrors['firmCriteria.size'] && (
          <p className="mt-1 text-sm text-red-500">{formErrors['firmCriteria.size'][0]}</p>
        )}
      </div>

      <div>
        <Label className="text-white mb-2 block">Geographic Focus</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { value: GeographicFocus.LOCAL, label: 'Local' },
            { value: GeographicFocus.REGIONAL, label: 'Regional' },
            { value: GeographicFocus.NATIONAL, label: 'National' },
            { value: GeographicFocus.REMOTE, label: 'Remote' }
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRadioChange('geographicFocus', String(value))}
              className={`flex items-center gap-2 p-3 rounded-lg transition-all cursor-pointer text-left
                ${formData.firmCriteria.geographicFocus === value ? 'bg-white/10 border-purple-400/50' : 'bg-black/20 hover:bg-white/5'}
                border border-white/10 hover:border-purple-400/30`}
            >
              <RadioGroupItem 
                checked={formData.firmCriteria.geographicFocus === value}
                value={String(value)}
                className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white"
              />
              <span className="text-sm text-gray-200">{label}</span>
            </button>
          ))}
        </div>
        {formErrors['firmCriteria.geographicFocus'] && (
          <p className="mt-1 text-sm text-red-500">{formErrors['firmCriteria.geographicFocus'][0]}</p>
        )}
      </div>

      <div>
        <Label className="text-white mb-2 block">Primary State (Optional)</Label>
        <Select 
          value={formData.firmCriteria.location}
          onValueChange={(value) => onChange('firmCriteria.location', value)}
        >
          <SelectTrigger className="bg-black/50 border-white/10 text-white">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            {US_STATES.map(state => (
              <SelectItem 
                key={state} 
                value={state}
                className="text-white hover:bg-white/10"
              >
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white mb-2 block">Deal Type</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { value: DealType.ACQUISITION, label: 'Acquisition' },
            { value: DealType.MERGER, label: 'Merger' },
            { value: DealType.EQUITY_BUYOUT, label: 'Equity Buyout' },
            { value: DealType.FRANCHISE, label: 'Franchise' },
            { value: DealType.SUCCESSION, label: 'Succession' }
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRadioChange('dealType', String(value))}
              className={`flex items-center gap-2 p-3 rounded-lg transition-all cursor-pointer text-left
                ${formData.firmCriteria.dealType === value ? 'bg-white/10 border-purple-400/50' : 'bg-black/20 hover:bg-white/5'}
                border border-white/10 hover:border-purple-400/30`}
            >
              <RadioGroupItem 
                checked={formData.firmCriteria.dealType === value}
                value={String(value)}
                className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white"
              />
              <span className="text-sm text-gray-200">{label}</span>
            </button>
          ))}
        </div>
        {formErrors['firmCriteria.dealType'] && (
          <p className="mt-1 text-sm text-red-500">{formErrors['firmCriteria.dealType'][0]}</p>
        )}
      </div>
    </div>
  );
};
