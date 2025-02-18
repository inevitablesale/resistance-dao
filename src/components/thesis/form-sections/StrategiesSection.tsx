
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2, TrendingUp, UsersRound, Globe, Layers, Users, Building, Network, ArrowLeftRight, Users2, ScrollText, Database } from "lucide-react";
import { ProposalMetadata, OperationalStrategy, GrowthStrategy, IntegrationStrategy } from "@/types/proposals";

export interface StrategiesSectionProps {
  formData: ProposalMetadata;
  formErrors: Record<string, string[]>;
  onChange: (category: "operational" | "growth" | "integration", value: (OperationalStrategy | GrowthStrategy | IntegrationStrategy)[]) => void;
}

type StrategyType = OperationalStrategy | GrowthStrategy | IntegrationStrategy;

export const StrategiesSection = ({ formData, formErrors, onChange }: StrategiesSectionProps) => {
  const handleStrategyChange = (
    category: keyof typeof formData.strategies, 
    value: StrategyType, 
    checked: boolean
  ) => {
    const currentStrategies = [...formData.strategies[category]];
    let updatedStrategies: StrategyType[];
    
    if (checked) {
      updatedStrategies = [...currentStrategies, value];
    } else {
      updatedStrategies = currentStrategies.filter(s => s !== value);
    }
    
    onChange(category, updatedStrategies);
  };

  const strategies = {
    operational: [
      { id: OperationalStrategy.TECH_MODERNIZATION, label: 'Technology Modernization', icon: Settings2 },
      { id: OperationalStrategy.PROCESS_STANDARDIZATION, label: 'Process Standardization', icon: ScrollText },
      { id: OperationalStrategy.STAFF_RETENTION, label: 'Staff Retention/Development', icon: UsersRound }
    ],
    growth: [
      { id: GrowthStrategy.GEOGRAPHIC_EXPANSION, label: 'Geographic Expansion', icon: Globe },
      { id: GrowthStrategy.SERVICE_EXPANSION, label: 'Service Line Expansion', icon: Layers },
      { id: GrowthStrategy.CLIENT_GROWTH, label: 'Client Base Growth', icon: TrendingUp }
    ],
    integration: [
      { id: IntegrationStrategy.MERGING_OPERATIONS, label: 'Merging Operations', icon: ArrowLeftRight },
      { id: IntegrationStrategy.CULTURE_INTEGRATION, label: 'Culture Integration', icon: Users2 },
      { id: IntegrationStrategy.SYSTEMS_CONSOLIDATION, label: 'Systems Consolidation', icon: Database }
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
                      id={String(id)}
                      className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white" 
                      checked={formData.strategies[category as keyof typeof formData.strategies].includes(id)}
                      onCheckedChange={(checked) => {
                        handleStrategyChange(
                          category as keyof typeof formData.strategies,
                          id,
                          checked as boolean
                        );
                      }}
                    />
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-purple-400/70" />
                      <Label 
                        htmlFor={String(id)}
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
