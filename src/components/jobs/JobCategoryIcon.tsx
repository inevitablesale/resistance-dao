
import { Building, Briefcase, Shield, Cpu, GalleryVertical, Target, BarChart4, Code, FileText, MessageSquare, HelpCircle } from "lucide-react";

export type JobCategory = 
  | 'nft-referrals' 
  | 'talent-acquisition' 
  | 'protocol-development' 
  | 'community-growth' 
  | 'content-creation' 
  | 'governance-support' 
  | 'business-development' 
  | 'settlement-building' 
  | 'resource-gathering' 
  | 'security' 
  | 'technology' 
  | 'governance' 
  | 'scouting' 
  | 'trading' 
  | 'protocol-development' 
  | 'waste-management' 
  | 'other';

interface JobCategoryIconProps {
  category: JobCategory;
  className?: string;
}

export const JobCategoryIcon = ({ category, className = "w-4 h-4" }: JobCategoryIconProps) => {
  let Icon;
  
  switch (category) {
    // New categories
    case 'nft-referrals':
      Icon = Target;
      break;
    case 'talent-acquisition':
      Icon = Briefcase;
      break;
    case 'protocol-development':
      Icon = Code;
      break;
    case 'community-growth':
      Icon = MessageSquare;
      break;
    case 'content-creation':
      Icon = FileText;
      break;
    case 'governance-support':
      Icon = GalleryVertical;
      break;
    case 'business-development':
      Icon = BarChart4;
      break;
      
    // Legacy categories
    case 'settlement-building':
      Icon = Building;
      break;
    case 'resource-gathering':
      Icon = Briefcase;
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
      Icon = Target;
      break;
    case 'trading':
      Icon = BarChart4;
      break;
    case 'waste-management':
      Icon = Briefcase;
      break;
    default:
      Icon = HelpCircle;
  }
  
  return <Icon className={className} />;
};
