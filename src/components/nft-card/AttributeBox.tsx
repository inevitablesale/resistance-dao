
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AttributeBoxProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export const AttributeBox = ({ icon: Icon, label, value, className }: AttributeBoxProps) => {
  const attributeBoxStyle = cn(
    "relative overflow-hidden",
    "backdrop-blur-xl rounded-2xl p-4",
    "bg-gradient-to-br from-black/60 to-black/40",
    "transform hover:scale-105 transition-all duration-500",
    "border border-white/5 hover:border-polygon-primary/30",
    "group",
    className
  );

  return (
    <motion.div 
      className="h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={attributeBoxStyle}>
        {/* Glowing background effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-polygon-primary/5 to-polygon-secondary/5 blur-xl" />
        </div>
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Icon className="w-4 h-4 text-polygon-primary" />
            <span className="font-medium">{label}</span>
          </div>
          <div className="mt-1">
            <p className="text-base font-semibold text-white break-words">
              {value}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
