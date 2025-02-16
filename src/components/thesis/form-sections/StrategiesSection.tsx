
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
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Network className="w-6 h-6 text-purple-400" />
          Post-Acquisition Strategy
        </h2>
        <p className="text-gray-400">Select the strategies you plan to implement post-acquisition</p>
      </div>
      
      <div className="grid gap-8">
        {Object.entries(strategies).map(([category, items]) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <CategoryIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white capitalize">
                  {category} Strategies
                </h3>
              </div>
              
              <div className="grid gap-4 pl-2">
                {items.map(({ id, label, icon: Icon }) => (
                  <div 
                    key={id}
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-white/5"
                  >
                    <Checkbox 
                      id={id} 
                      className="border-purple-400 data-[state=checked]:bg-purple-400 data-[state=checked]:text-black"
                      checked={formData.strategies[category as keyof typeof formData.strategies].includes(id)}
                      onCheckedChange={(checked) => {
                        handleStrategyChange(category as keyof typeof formData.strategies, id, checked as boolean);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-purple-400/70" />
                      <Label 
                        htmlFor={id} 
                        className="text-gray-200 cursor-pointer hover:text-white transition-colors"
                      >
                        {label}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              {formErrors[`strategies.${category}`] && (
                <p className="text-sm text-red-500 mt-2">
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
