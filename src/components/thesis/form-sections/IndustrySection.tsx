
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface IndustrySectionProps {
  formData: {
    industry: {
      focus: string;
      other?: string;
    };
  };
  formErrors: Record<string, string[]>;
  onChange: (field: string, value: any) => void;
}

export const IndustrySection = ({ formData, formErrors, onChange }: IndustrySectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Industry Focus</h2>
      
      <div>
        <Label className="text-white mb-2 block">Primary Industry</Label>
        <RadioGroup 
          defaultValue={formData.industry.focus}
          onValueChange={(value) => onChange('industry.focus', value)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="technology" 
              id="technology" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="technology" className="text-white">Technology</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="healthcare" 
              id="healthcare" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="healthcare" className="text-white">Healthcare</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="manufacturing" 
              id="manufacturing" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="manufacturing" className="text-white">Manufacturing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="other" 
              id="other" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
            />
            <Label htmlFor="other" className="text-white">Other</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.industry.focus === 'other' && (
        <div>
          <Label className="text-white mb-2 block">Specify Industry</Label>
          <Input
            placeholder="Enter industry"
            className={cn(
              "bg-black/50 border-white/10 text-white placeholder:text-gray-500",
              formErrors['industry.other'] ? "border-red-500" : ""
            )}
            value={formData.industry.other}
            onChange={(e) => onChange('industry.other', e.target.value)}
          />
          {formErrors['industry.other'] && (
            <p className="mt-1 text-sm text-red-500">{formErrors['industry.other'][0]}</p>
          )}
        </div>
      )}
    </div>
  );
};
