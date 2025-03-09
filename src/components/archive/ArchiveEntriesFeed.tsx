
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Filter, Search } from 'lucide-react';
import { ArchiveEntry, ArchiveEntryData } from './ArchiveEntry';
import { ToxicBadge } from '@/components/ui/toxic-badge';

interface ArchiveEntriesFeedProps {
  currentRadiation: number;
  entries: ArchiveEntryData[];
}

export const ArchiveEntriesFeed = ({ currentRadiation, entries }: ArchiveEntriesFeedProps) => {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get available entries based on radiation level
  const getAvailableEntries = () => {
    return entries.filter(entry => entry.radiationLevel >= currentRadiation);
  };
  
  // Filter entries by category and search query
  const filteredEntries = getAvailableEntries().filter(entry => {
    const matchesCategory = categoryFilter ? entry.category === categoryFilter : true;
    const matchesSearch = searchQuery 
      ? entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });
  
  // Toggle entry expansion
  const toggleExpand = (id: string) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };
  
  return (
    <div className="bg-black/80 border border-toxic-neon/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-toxic-neon" />
          <h2 className="text-toxic-neon font-mono text-lg">Archive Entries</h2>
          <ToxicBadge variant="default" className="ml-2">
            {getAvailableEntries().length} Records
          </ToxicBadge>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search records..."
            className="w-full bg-black border border-toxic-neon/20 rounded py-2 pl-9 pr-3 text-white/80 text-sm focus:outline-none focus:border-toxic-neon/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 border ${
              categoryFilter === null 
                ? 'bg-toxic-neon/20 border-toxic-neon/50 text-toxic-neon' 
                : 'bg-transparent border-white/20 text-white/60 hover:bg-black/50'
            }`}
            onClick={() => setCategoryFilter(null)}
          >
            <Filter className="h-3 w-3" /> All
          </button>
          
          <button
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 border ${
              categoryFilter === 'historical' 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                : 'bg-transparent border-white/20 text-white/60 hover:bg-black/50'
            }`}
            onClick={() => setCategoryFilter('historical')}
          >
            <Book className="h-3 w-3" /> Historical
          </button>
          
          <button
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 border ${
              categoryFilter === 'technical' 
                ? 'bg-toxic-neon/20 border-toxic-neon/50 text-toxic-neon' 
                : 'bg-transparent border-white/20 text-white/60 hover:bg-black/50'
            }`}
            onClick={() => setCategoryFilter('technical')}
          >
            <FileText className="h-3 w-3" /> Technical
          </button>
        </div>
      </div>
      
      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <ArchiveEntry 
              key={entry.id}
              entry={entry}
              expanded={expandedEntryId === entry.id}
              onToggleExpand={() => toggleExpand(entry.id)}
            />
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-8 text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {getAvailableEntries().length === 0 ? (
            <div>
              <p className="mb-2">No archive entries have been recovered yet.</p>
              <p className="text-sm">Radiation levels must decrease to unlock archived knowledge.</p>
            </div>
          ) : (
            <div>
              <p className="mb-2">No entries match your search criteria.</p>
              <p className="text-sm">Try adjusting your filters or search query.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
