
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
type StrategyCategory = "operational" | "growth" | "integration";

export const StrategiesSection = ({ formData, formErrors, onChange }: StrategiesSectionProps) => {
  // Debug logs
  console.log("Current strategies:", formData.strategies);

  const handleCheckboxClick = (
    category: StrategyCategory,
    value: StrategyType
  ) => {
    console.log(`Checkbox clicked for ${category}:`, value);
    const currentStrategies = formData.strategies[category] || [];
    console.log("Current strategies for category:", currentStrategies);
    
    let updatedStrategies: StrategyType[];
    if (currentStrategies.includes(value)) {
      updatedStrategies = currentStrategies.filter(s => s !== value);
    } else {
      updatedStrategies = [...currentStrategies, value];
    }
    
    console.log("Updated strategies:", updatedStrategies);
    onChange(category, updatedStrategies);
  };

  const isStrategySelected = (category: StrategyCategory, strategyId: StrategyType) => {
    return formData.strategies[category]?.includes(strategyId) || false;
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
                {items.map(({ id, label, icon: Icon }) => {
                  const isChecked = isStrategySelected(category as StrategyCategory, id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleCheckboxClick(category as StrategyCategory, id)}
                      className={`flex items-center gap-2 p-3 rounded-lg transition-all cursor-pointer text-left
                        ${isChecked ? 'bg-white/10 border-purple-400/50' : 'bg-black/20 hover:bg-white/5'}
                        border border-white/10 hover:border-purple-400/30`}
                    >
                      <Checkbox 
                        checked={isChecked}
                        className="border-white/70 text-black data-[state=checked]:bg-white data-[state=checked]:border-white"
                        onCheckedChange={() => handleCheckboxClick(category as StrategyCategory, id)}
                      />
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-purple-400/70" />
                        <span className="text-sm text-gray-200">
                          {label}
                        </span>
                      </div>
                    </button>
                  );
                })}
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
