import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FirmSize, DealType, GeographicFocus } from "@/types/proposals";
import { US_STATES } from "@/lib/constants/states";

export interface FirmCriteriaSectionProps {
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
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-6" onClick={handleClick}>
      <h2 className="text-xl font-semibold text-white">Target Firm Criteria</h2>
      
      <div>
        <Label className="text-white mb-2 block">Preferred Firm Size (Revenue)</Label>
        <RadioGroup 
          value={String(formData.firmCriteria.size)}
          onValueChange={(value) => onChange('size', Number(value))}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(FirmSize.BELOW_1M)}
              id="below-1m" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="below-1m" className="text-white">Below $1M</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(FirmSize.ONE_TO_FIVE_M)}
              id="1m-5m" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="1m-5m" className="text-white">$1M–$5M</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(FirmSize.FIVE_TO_TEN_M)}
              id="5m-10m" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="5m-10m" className="text-white">$5M–$10M</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(FirmSize.TEN_PLUS)}
              id="10m-plus" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="10m-plus" className="text-white">$10M+</Label>
          </div>
        </RadioGroup>
        {formErrors['firmCriteria.size'] && (
          <p className="mt-1 text-sm text-red-500">{formErrors['firmCriteria.size'][0]}</p>
        )}
      </div>

      <div>
        <Label className="text-white mb-2 block">Geographic Focus</Label>
        <RadioGroup 
          value={String(formData.firmCriteria.geographicFocus)}
          onValueChange={(value) => onChange('geographicFocus', Number(value))}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(GeographicFocus.LOCAL)}
              id="local" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="local" className="text-white">Local</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(GeographicFocus.REGIONAL)}
              id="regional" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="regional" className="text-white">Regional</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(GeographicFocus.NATIONAL)}
              id="national" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="national" className="text-white">National</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(GeographicFocus.REMOTE)}
              id="remote" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="remote" className="text-white">Remote</Label>
          </div>
        </RadioGroup>
        {formErrors['firmCriteria.geographicFocus'] && (
          <p className="mt-1 text-sm text-red-500">{formErrors['firmCriteria.geographicFocus'][0]}</p>
        )}
      </div>

      <div>
        <Label className="text-white mb-2 block">Primary State (Optional)</Label>
        <Select 
          value={formData.firmCriteria.location}
          onValueChange={(value) => onChange('location', value)}
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
          value={String(formData.firmCriteria.dealType)}
          onValueChange={(value) => onChange('dealType', Number(value))}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(DealType.ACQUISITION)}
              id="acquisition" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="acquisition" className="text-white">Acquisition</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(DealType.MERGER)}
              id="merger" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="merger" className="text-white">Merger</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(DealType.EQUITY_BUYOUT)}
              id="equity-buyout" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="equity-buyout" className="text-white">Equity Buyout</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(DealType.FRANCHISE)}
              id="franchise" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="franchise" className="text-white">Franchise</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value={String(DealType.SUCCESSION)}
              id="succession" 
              className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="succession" className="text-white">Succession</Label>
          </div>
        </RadioGroup>
        {formErrors['firmCriteria.dealType'] && (
          <p className="mt-1 text-sm text-red-500">{formErrors['firmCriteria.dealType'][0]}</p>
        )}
      </div>
    </div>
  );
};
