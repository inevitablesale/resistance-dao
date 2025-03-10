
import { Building, Pickaxe, Shield, Cpu, GalleryVertical, Crosshair, BarChart4, Code, Trash2, HelpCircle } from "lucide-react";
import { JobCategory } from "@/services/jobService";

interface JobCategoryIconProps {
  category: JobCategory;
  className?: string;
}

export const JobCategoryIcon = ({ category, className = "w-4 h-4" }: JobCategoryIconProps) => {
  let Icon;
  
  switch (category) {
    case 'settlement-building':
      Icon = Building;
      break;
    case 'resource-gathering':
      Icon = Pickaxe;
      break;
    case 'security':
      Icon = Shield;
      break;
    case 'technology':
      Icon = Cpu;
      break;
    case 'governance':
      Icon = GalleryVertical;
      break;
    case 'scouting':
      Icon = Crosshair;
      break;
    case 'trading':
      Icon = BarChart4;
      break;
    case 'protocol-development':
      Icon = Code;
      break;
    case 'waste-management':
      Icon = Trash2;
      break;
    default:
      Icon = HelpCircle;
  }
  
  return <Icon className={className} />;
};
