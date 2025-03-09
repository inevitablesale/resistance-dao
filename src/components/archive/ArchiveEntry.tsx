
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Calendar, Clock, FileText, Globe, User } from 'lucide-react';
import { ToxicBadge } from '@/components/ui/toxic-badge';

export interface ArchiveEntryData {
  id: string;
  title: string;
  date: string;
  category: 'historical' | 'technical' | 'survivor' | 'economic';
  excerpt: string;
  content: string;
  location?: string;
  author?: string;
  radiationLevel: number;
}

interface ArchiveEntryProps {
  entry: ArchiveEntryData;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export const ArchiveEntry = ({ entry, expanded = false, onToggleExpand }: ArchiveEntryProps) => {
  const getCategoryIcon = () => {
    switch (entry.category) {
      case 'historical':
        return <Book className="h-4 w-4 text-amber-400" />;
      case 'technical':
        return <FileText className="h-4 w-4 text-toxic-neon" />;
      case 'survivor':
        return <User className="h-4 w-4 text-purple-400" />;
      case 'economic':
        return <Globe className="h-4 w-4 text-blue-400" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };
  
  const getCategoryName = () => {
    switch (entry.category) {
      case 'historical': return 'Historical Record';
      case 'technical': return 'Technical Manual';
      case 'survivor': return 'Survivor Log';
      case 'economic': return 'Economic Analysis';
      default: return 'Archive Entry';
    }
  };
  
  return (
    <motion.div 
      className="bg-black/70 border border-toxic-neon/20 rounded-lg overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-toxic-neon font-mono text-lg">{entry.title}</h3>
          <ToxicBadge variant="outline" className="flex items-center gap-1">
            {getCategoryIcon()}
            <span>{getCategoryName()}</span>
          </ToxicBadge>
        </div>
        
        <div className="flex items-center text-xs text-white/60 mb-3 gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{entry.date}</span>
          </div>
          
          {entry.location && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{entry.location}</span>
            </div>
          )}
          
          {entry.author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{entry.author}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Recovered at {entry.radiationLevel}% radiation</span>
          </div>
        </div>
        
        <div className="terminal-output font-mono text-sm">
          {expanded ? entry.content : entry.excerpt}
        </div>
        
        <button 
          className="w-full text-center mt-3 text-toxic-neon hover:text-toxic-neon/80 text-sm"
          onClick={onToggleExpand}
        >
          {expanded ? "Show Less" : "Read Full Entry"}
        </button>
      </div>
    </motion.div>
  );
};
