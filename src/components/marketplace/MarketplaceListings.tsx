
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Briefcase, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";

// Mock data for demonstration
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Tax Return Review Needed',
    description: 'Need experienced CPA to review 25 individual tax returns before filing deadline.',
    category: 'tax_prep',
    lgrAmount: 500,
    durationType: 'short-term',
    timeframe: '2 weeks',
    skills: ['Tax Review', '1040 Forms', 'Individual Returns']
  },
  {
    id: '2',
    title: 'Monthly Bank Reconciliation',
    description: 'Looking for help with QuickBooks bank reconciliation for small retail business.',
    category: 'bookkeeping',
    lgrAmount: 200,
    durationType: 'short-term',
    timeframe: '3 days',
    skills: ['QuickBooks', 'Bank Reconciliation']
  },
  {
    id: '3',
    title: 'Audit Support - Manufacturing',
    description: 'Need assistance with preparing audit documentation for manufacturing client.',
    category: 'audit_support',
    lgrAmount: 1000,
    durationType: 'short-term',
    timeframe: '1 week',
    skills: ['Audit Prep', 'Manufacturing', 'Documentation']
  }
];

export function MarketplaceListings() {
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
  const { isConnected, connect } = useWalletConnection();

  const handleInterested = (listingId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to express interest in opportunities",
        variant: "destructive"
      });
      connect();
      return;
    }

    toast({
      title: "Interest Registered",
      description: "The client will be notified of your interest",
    });
  };

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
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-2">{listing.title}</h3>
                <p className="text-white/60 text-lg mb-4">{listing.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2 ml-8">
                <div className="flex items-center gap-2 text-2xl font-bold text-teal-400">
                  <DollarSign className="w-6 h-6" />
                  <span>{listing.lgrAmount} LGR</span>
                </div>
                <Button 
                  onClick={() => handleInterested(listing.id)}
                  className="bg-teal-500 hover:bg-teal-600 w-full"
                >
                  I'm Interested
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-4 text-lg">
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-5 h-5" />
                <span>{listing.durationType === 'short-term' ? 'Short Term' : 'Long Term'}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-5 h-5" />
                <span>{listing.timeframe}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Briefcase className="w-5 h-5" />
                <span>{listing.category.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {listing.skills.map(skill => (
                <Badge 
                  key={skill} 
                  variant="secondary"
                  className="bg-teal-500/10 text-teal-400 border-none text-sm"
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
