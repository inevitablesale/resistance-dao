
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FirmSize, DealType, GeographicFocus } from "@/types/proposals";
import { US_STATES } from "@/lib/constants/states";
import { motion } from "framer-motion";
import { Building2, Globe2, MapPin, Briefcase } from "lucide-react";

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
    console.log("Initializing firm criteria values...");
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Target Firm Criteria
        </h2>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-yellow-500" />
          <Label className="text-lg font-medium text-white">Preferred Firm Size (Revenue)</Label>
        </div>
        <RadioGroup 
          value={String(formData.firmCriteria.size)}
          onValueChange={(value) => onChange('firmCriteria.size', Number(value))}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {[
            { value: FirmSize.BELOW_1M, label: "Below $1M" },
            { value: FirmSize.ONE_TO_FIVE_M, label: "$1M–$5M" },
            { value: FirmSize.FIVE_TO_TEN_M, label: "$5M–$10M" },
            { value: FirmSize.TEN_PLUS, label: "$10M+" }
          ].map((option) => (
            <Label
              key={option.value}
              className={`
                flex items-center gap-2 p-4 rounded-lg border border-white/10 bg-black/20 
                cursor-pointer transition-all duration-200
                data-[state=checked]:border-yellow-500/50 data-[state=checked]:bg-yellow-500/10
                hover:bg-white/5
                ${String(formData.firmCriteria.size) === String(option.value) ? 'border-yellow-500/50 bg-yellow-500/10' : ''}
              `}
            >
              <RadioGroupItem 
                value={String(option.value)} 
                id={`size-${option.value}`}
                className="text-yellow-500 border-white/30"
              />
              <span className="text-white">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
        {formErrors['firmCriteria.size'] && (
          <p className="mt-2 text-sm text-red-400">{formErrors['firmCriteria.size'][0]}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Globe2 className="h-5 w-5 text-teal-500" />
          <Label className="text-lg font-medium text-white">Geographic Focus</Label>
        </div>
        <RadioGroup 
          value={String(formData.firmCriteria.geographicFocus)}
          onValueChange={(value) => onChange('firmCriteria.geographicFocus', Number(value))}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {[
            { value: GeographicFocus.LOCAL, label: "Local" },
            { value: GeographicFocus.REGIONAL, label: "Regional" },
            { value: GeographicFocus.NATIONAL, label: "National" },
            { value: GeographicFocus.REMOTE, label: "Remote" }
          ].map((option) => (
            <Label
              key={option.value}
              className={`
                flex items-center gap-2 p-4 rounded-lg border border-white/10 bg-black/20 
                cursor-pointer transition-all duration-200
                data-[state=checked]:border-teal-500/50 data-[state=checked]:bg-teal-500/10
                hover:bg-white/5
                ${String(formData.firmCriteria.geographicFocus) === String(option.value) ? 'border-teal-500/50 bg-teal-500/10' : ''}
              `}
            >
              <RadioGroupItem 
                value={String(option.value)} 
                id={`geo-${option.value}`}
                className="text-teal-500 border-white/30"
              />
              <span className="text-white">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
        {formErrors['firmCriteria.geographicFocus'] && (
          <p className="mt-2 text-sm text-red-400">{formErrors['firmCriteria.geographicFocus'][0]}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-purple-500" />
          <Label className="text-lg font-medium text-white">Primary State (Optional)</Label>
        </div>
        <Select 
          value={formData.firmCriteria.location}
          onValueChange={(value) => onChange('firmCriteria.location', value)}
        >
          <SelectTrigger className="bg-black/20 border-white/10 text-white h-12">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-black/90 border-white/10">
            {US_STATES.map(state => (
              <SelectItem 
                key={state} 
                value={state}
                className="text-white focus:bg-white/10 focus:text-white"
              >
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors['firmCriteria.location'] && (
          <p className="mt-2 text-sm text-red-400">{formErrors['firmCriteria.location'][0]}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-rose-500" />
          <Label className="text-lg font-medium text-white">Deal Type</Label>
        </div>
        <RadioGroup 
          value={String(formData.firmCriteria.dealType)}
          onValueChange={(value) => onChange('firmCriteria.dealType', Number(value))}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {[
            { value: DealType.ACQUISITION, label: "Acquisition" },
            { value: DealType.MERGER, label: "Merger" },
            { value: DealType.EQUITY_BUYOUT, label: "Equity Buyout" },
            { value: DealType.FRANCHISE, label: "Franchise" },
            { value: DealType.SUCCESSION, label: "Succession" }
          ].map((option) => (
            <Label
              key={option.value}
              className={`
                flex items-center gap-2 p-4 rounded-lg border border-white/10 bg-black/20 
                cursor-pointer transition-all duration-200
                data-[state=checked]:border-rose-500/50 data-[state=checked]:bg-rose-500/10
                hover:bg-white/5
                ${String(formData.firmCriteria.dealType) === String(option.value) ? 'border-rose-500/50 bg-rose-500/10' : ''}
              `}
            >
              <RadioGroupItem 
                value={String(option.value)} 
                id={`deal-${option.value}`}
                className="text-rose-500 border-white/30"
              />
              <span className="text-white">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
        {formErrors['firmCriteria.dealType'] && (
          <p className="mt-2 text-sm text-red-400">{formErrors['firmCriteria.dealType'][0]}</p>
        )}
      </motion.div>
    </motion.div>
  );
};
