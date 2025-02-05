
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AttributeBoxProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export const AttributeBox = ({ icon: Icon, label, value, className }: AttributeBoxProps) => {
  const attributeBoxStyle = cn(
    "bg-black/40 backdrop-blur-xl rounded-xl p-4",
    "flex flex-col h-full",
    "transform hover:scale-105 transition-all duration-300",
    "border border-white/5 hover:border-polygon-primary/20",
    className
  );

  return (
    <div className="h-full">
      <div className={attributeBoxStyle}>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Icon className="w-4 h-4 text-polygon-primary flex-shrink-0" />
          {label}
        </div>
        <div className="flex-grow">
          <p className="text-base font-medium text-white break-words">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};
