
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2, TrendingUp, UsersRound, Globe, Layers, Users, Building, Network, ArrowLeftRight, Users2, ScrollText, Database } from "lucide-react";

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

  const strategies = {
    operational: [
      { id: 'tech-modernization', label: 'Technology Modernization', icon: Settings2 },
      { id: 'process-standardization', label: 'Process Standardization', icon: ScrollText },
      { id: 'staff-retention', label: 'Staff Retention/Development', icon: UsersRound }
    ],
    growth: [
      { id: 'geographic-expansion', label: 'Geographic Expansion', icon: Globe },
      { id: 'service-expansion', label: 'Service Line Expansion', icon: Layers },
      { id: 'client-growth', label: 'Client Base Growth', icon: TrendingUp }
    ],
    integration: [
      { id: 'merging-operations', label: 'Merging Operations', icon: ArrowLeftRight },
      { id: 'culture-integration', label: 'Culture Integration', icon: Users2 },
      { id: 'systems-consolidation', label: 'Systems Consolidation', icon: Database }
    ]
  };

  const categoryIcons = {
    operational: Settings2,
    growth: TrendingUp,
    integration: Building
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Post-Acquisition Strategy</h2>
        </div>
      </div>
      
      <div className="grid gap-4">
        {Object.entries(strategies).map(([category, items]) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <CategoryIcon className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-medium text-gray-200 capitalize">
                  {category} Strategies
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {items.map(({ id, label, icon: Icon }) => (
                  <div 
                    key={id}
                    className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-white/5"
                  >
                    <Checkbox 
                      id={id} 
                      className="border-purple-400 data-[state=checked]:bg-purple-400 data-[state=checked]:text-black"
                      checked={formData.strategies[category as keyof typeof formData.strategies].includes(id)}
                      onCheckedChange={(checked) => {
                        handleStrategyChange(category as keyof typeof formData.strategies, id, checked as boolean);
                      }}
                    />
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-purple-400/70" />
                      <Label 
                        htmlFor={id} 
                        className="text-sm text-gray-200 cursor-pointer hover:text-white transition-colors"
                      >
                        {label}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              {formErrors[`strategies.${category}`] && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors[`strategies.${category}`][0]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
