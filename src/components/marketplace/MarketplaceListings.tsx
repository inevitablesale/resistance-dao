
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Briefcase, DollarSign } from "lucide-react";

// Mock data for demonstration
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Tax Season Support Needed',
    description: 'Looking for experienced CPA to help with tax preparation during busy season.',
    category: 'tax_prep',
    lgrAmount: 1000,
    durationType: 'short-term',
    timeframe: '3 months',
    skills: ['Tax Preparation', 'CPA', 'Individual Returns']
  },
  {
    id: '2',
    title: 'Monthly Bookkeeping Assistant',
    description: 'Need ongoing support with bookkeeping and monthly reconciliations.',
    category: 'bookkeeping',
    lgrAmount: 500,
    durationType: 'long-term',
    timeframe: 'Ongoing',
    skills: ['QuickBooks', 'Reconciliation', 'Financial Reports']
  }
];

export function MarketplaceListings() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select 
          value={filter} 
          onValueChange={setFilter}
        >
          <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="tax_prep">Tax Preparation</SelectItem>
            <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
            <SelectItem value="audit_support">Audit Support</SelectItem>
            <SelectItem value="consulting">Consulting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {MOCK_LISTINGS.filter(listing => 
          filter === 'all' || listing.category === filter
        ).map(listing => (
          <div 
            key={listing.id}
            className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{listing.title}</h3>
                <p className="text-white/60 mb-4">{listing.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-400" />
                <span className="text-lg font-semibold text-teal-400">{listing.lgrAmount} LGR</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-4 h-4" />
                <span>{listing.durationType === 'short-term' ? 'Short Term' : 'Long Term'}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-4 h-4" />
                <span>{listing.timeframe}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Briefcase className="w-4 h-4" />
                <span>{listing.category.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {listing.skills.map(skill => (
                <Badge 
                  key={skill} 
                  variant="secondary"
                  className="bg-teal-500/10 text-teal-400 border-none"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
