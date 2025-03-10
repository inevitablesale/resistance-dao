
import { JobCategory } from '@/services/jobService';
import { 
  Building2, 
  ShoppingBag, 
  Shield, 
  Cpu, 
  Scale, 
  Binoculars, 
  Coins, 
  Code, 
  Trash2, 
  HelpCircle 
} from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface JobCategoryIconProps extends LucideProps {
  category: JobCategory;
}

export const JobCategoryIcon = ({ category, ...props }: JobCategoryIconProps) => {
  switch (category) {
    case 'settlement-building':
      return <Building2 {...props} />;
    case 'resource-gathering':
      return <ShoppingBag {...props} />;
    case 'security':
      return <Shield {...props} />;
    case 'technology':
      return <Cpu {...props} />;
    case 'governance':
      return <Scale {...props} />;
    case 'scouting':
      return <Binoculars {...props} />;
    case 'trading':
      return <Coins {...props} />;
    case 'protocol-development':
      return <Code {...props} />;
    case 'waste-management':
      return <Trash2 {...props} />;
    case 'other':
    default:
      return <HelpCircle {...props} />;
  }
};
