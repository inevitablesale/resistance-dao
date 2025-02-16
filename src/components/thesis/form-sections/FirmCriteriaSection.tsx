
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

interface FirmCriteriaSectionProps {
  formData: {
    firmCriteria: {
      size: string;
      location: string;
      dealType: string;
    };
  };
  formErrors: Record<string, string[]>;
  onChange: (field: string, value: any) => void;
}

export const FirmCriteriaSection = ({ formData, formErrors, onChange }: FirmCriteriaSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Target Firm Criteria</h2>
      
      <div>
        <Label className="text-white mb-2 block">Preferred Firm Size (Revenue)</Label>
        <RadioGroup 
          value={formData.firmCriteria.size}
          onValueChange={(value) => onChange('firmCriteria.size', value)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="below-1m" 
              id="below-1m" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="below-1m" className="text-white">Below $1M</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="1m-5m" 
              id="1m-5m" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="1m-5m" className="text-white">$1M–$5M</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="5m-10m" 
              id="5m-10m" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="5m-10m" className="text-white">$5M–$10M</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="10m-plus" 
              id="10m-plus" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="10m-plus" className="text-white">$10M+</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-white mb-2 block">Primary State</Label>
        <Select 
          value={formData.firmCriteria.location}
          onValueChange={(value) => onChange('firmCriteria.location', value)}
        >
          <SelectTrigger className="bg-black/50 border-white/10 text-white">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors['firmCriteria.location'] && (
          <p className="mt-1 text-sm text-red-500">{formErrors['firmCriteria.location'][0]}</p>
        )}
      </div>

      <div>
        <Label className="text-white mb-2 block">Deal Type</Label>
        <RadioGroup 
          value={formData.firmCriteria.dealType}
          onValueChange={(value) => onChange('firmCriteria.dealType', value)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="full-acquisition" 
              id="full-acquisition" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="full-acquisition" className="text-white">Full Acquisition</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="partial-acquisition" 
              id="partial-acquisition" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="partial-acquisition" className="text-white">Partial Acquisition</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="merger" 
              id="merger" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="merger" className="text-white">Merger</Label>
          </div>
        </RadioGroup>
        {formErrors['firmCriteria.dealType'] && (
          <p className="mt-1 text-sm text-red-500">{formErrors['firmCriteria.dealType'][0]}</p>
        )}
      </div>
    </div>
  );
};
