
import { useState } from 'react';
import { SettlementCard } from './SettlementCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Settlement {
  id: string;
  name: string;
  description: string;
  totalRaised: string;
  targetAmount: string;
  remainingTime: string;
  status: string;
  image?: string;
}

interface SettlementsGridProps {
  settlements: Settlement[];
  isLoading?: boolean;
}

export const SettlementsGrid = ({ settlements, isLoading = false }: SettlementsGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = settlement.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          settlement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-900 rounded-xl h-[350px]">
              <div className="h-36 bg-gray-800 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                <div className="mt-6 h-2 bg-gray-800 rounded w-full"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-gray-800 rounded"></div>
                  <div className="h-10 bg-gray-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search settlements..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#111] border-white/10 pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-[#111] border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Funded</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredSettlements.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center bg-blue-900/20 h-20 w-20 rounded-full mb-4">
            <Search className="h-10 w-10 text-blue-400/70" />
          </div>
          <h3 className="text-lg font-medium mb-1">No settlements found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSettlements.map((settlement) => (
            <SettlementCard key={settlement.id} settlement={settlement} />
          ))}
        </div>
      )}
    </div>
  );
};
