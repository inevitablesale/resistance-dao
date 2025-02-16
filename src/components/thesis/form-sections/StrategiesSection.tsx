
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface StrategiesSectionProps {
  formData: {
    strategies: {
      operational: string[];
      growth: string[];
      integration: string[];
    };
  };
  formErrors: Record<string, string[]>;
  onChange: (category: "operational" | "growth" | "integration", value: string[]) => void;
}

export const StrategiesSection = ({ formData, formErrors, onChange }: StrategiesSectionProps) => {
  const handleStrategyChange = (category: keyof typeof formData.strategies, value: string, checked: boolean) => {
    const currentStrategies = [...formData.strategies[category]];
    const updatedStrategies = checked
      ? [...currentStrategies, value]
      : currentStrategies.filter(s => s !== value);
    onChange(category, updatedStrategies);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Post-Acquisition Strategy</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Operational Strategies</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="tech-modernization" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.operational.includes('tech-modernization')}
              onCheckedChange={(checked) => {
                handleStrategyChange('operational', 'tech-modernization', checked as boolean);
              }}
            />
            <Label htmlFor="tech-modernization" className="text-gray-200">Technology Modernization</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="process-standardization" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.operational.includes('process-standardization')}
              onCheckedChange={(checked) => {
                handleStrategyChange('operational', 'process-standardization', checked as boolean);
              }}
            />
            <Label htmlFor="process-standardization" className="text-gray-200">Process Standardization</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="staff-retention" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.operational.includes('staff-retention')}
              onCheckedChange={(checked) => {
                handleStrategyChange('operational', 'staff-retention', checked as boolean);
              }}
            />
            <Label htmlFor="staff-retention" className="text-gray-200">Staff Retention/Development</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Growth Strategies</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="geographic-expansion" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.growth.includes('geographic-expansion')}
              onCheckedChange={(checked) => {
                handleStrategyChange('growth', 'geographic-expansion', checked as boolean);
              }}
            />
            <Label htmlFor="geographic-expansion" className="text-gray-200">Geographic Expansion</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="service-expansion" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.growth.includes('service-expansion')}
              onCheckedChange={(checked) => {
                handleStrategyChange('growth', 'service-expansion', checked as boolean);
              }}
            />
            <Label htmlFor="service-expansion" className="text-gray-200">Service Line Expansion</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="client-growth" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.growth.includes('client-growth')}
              onCheckedChange={(checked) => {
                handleStrategyChange('growth', 'client-growth', checked as boolean);
              }}
            />
            <Label htmlFor="client-growth" className="text-gray-200">Client Base Growth</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Integration Strategies</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="merging-operations" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.integration.includes('merging-operations')}
              onCheckedChange={(checked) => {
                handleStrategyChange('integration', 'merging-operations', checked as boolean);
              }}
            />
            <Label htmlFor="merging-operations" className="text-gray-200">Merging Operations</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="culture-integration" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.integration.includes('culture-integration')}
              onCheckedChange={(checked) => {
                handleStrategyChange('integration', 'culture-integration', checked as boolean);
              }}
            />
            <Label htmlFor="culture-integration" className="text-gray-200">Culture Integration</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="systems-consolidation" 
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              checked={formData.strategies.integration.includes('systems-consolidation')}
              onCheckedChange={(checked) => {
                handleStrategyChange('integration', 'systems-consolidation', checked as boolean);
              }}
            />
            <Label htmlFor="systems-consolidation" className="text-gray-200">Systems Consolidation</Label>
          </div>
        </div>
      </div>

      {Object.entries(formData.strategies).map(([category, strategies]) => (
        formErrors[`strategies.${category}`] && (
          <p key={category} className="mt-1 text-sm text-red-500">
            {formErrors[`strategies.${category}`][0]}
          </p>
        )
      ))}
    </div>
  );
};
