import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Building2, DollarSign, Users, ChevronRight, Handshake, Clock, Shield, MapPin } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from "@/hooks/use-toast";
import { VotingSection } from '@/components/nft-card/VotingSection';
import { motion } from "framer-motion";
import { CreateClientListingOverlay } from "@/components/CreateClientListingOverlay";

// Mock data for client listings
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Manufacturing Client Portfolio',
    publisher: '0x1234567890123456789012345678901234567890',
    category: 'Manufacturing',
    contentType: 'client',
    annual_revenue: '$2.5M - $5M',
    location: 'Northeast US',
    client_since: '2018',
    service_mix: ['Tax Planning', 'Audit', 'Advisory'],
    royalty_terms: '5% Year 1, 3% Year 2',
    transition_period: '6 months'
  },
  {
    id: '2',
    title: 'Healthcare Practice Group',
    publisher: '0x1234567890123456789012345678901234567890',
    category: 'Healthcare',
    contentType: 'client',
    annual_revenue: '$1M - $2.5M',
    location: 'West Coast',
    client_since: '2019',
    service_mix: ['Tax Compliance', 'CFO Services'],
    royalty_terms: '7% Year 1, 4% Year 2',
    transition_period: '4 months'
  },
  {
    id: '3',
    title: 'Technology Startup Portfolio',
    publisher: '0x1234567890123456789012345678901234567890',
    category: 'Technology',
    contentType: 'client',
    annual_revenue: '$500K - $1M',
    location: 'Southeast US',
    client_since: '2021',
    service_mix: ['Bookkeeping', 'Tax Planning'],
    royalty_terms: '5% Year 1',
    transition_period: '3 months'
  }
];

export default function KnowledgeBase() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useWalletConnection();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showListingOverlay, setShowListingOverlay] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('has_visited_marketplace');
    if (!hasVisited) {
      startOnboarding();
      localStorage.setItem('has_visited_marketplace', 'true');
    }
  }, []);

  const startOnboarding = () => {
    setTimeout(() => {
      toast({
        title: "Welcome to the Client Transfer Marketplace! 👋",
        description: "Securely buy and sell accounting clients with built-in royalties and smooth transitions.",
        duration: 5000,
      });
    }, 1000);

    setTimeout(() => {
      toast({
        title: "Smart Contracts & Royalties",
        description: "Our platform uses smart contracts to ensure secure transfers and automated royalty payments.",
        duration: 5000,
      });
    }, 6000);

    setTimeout(() => {
      toast({
        title: "Getting Started",
        description: "Browse available clients or list your own for transfer. Each listing includes detailed information and terms.",
        duration: 5000,
      });
    }, 11000);
  };

  const filteredListings = MOCK_LISTINGS.filter(listing =>
    (searchQuery === '' || 
     listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     listing.category?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === null || listing.category === selectedCategory)
  );

  const categories = Array.from(new Set(MOCK_LISTINGS.map(listing => listing.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, #00ff87 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-6xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 text-transparent bg-clip-text mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Client Portfolio Marketplace
            </motion.h1>
            <motion.p 
              className="text-xl text-white/60 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Buy and sell accounting clients with built-in royalties and secure transfers. Smart contracts ensure smooth transitions and protect both parties.
            </motion.p>
          </div>

          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <Input
                type="search"
                placeholder="Search by industry, revenue range, or location..."
                className="w-full pl-12 py-6 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/40 hover:border-white/20 transition-colors focus:border-teal-500/50 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl font-bold text-teal-400 mb-2">{MOCK_LISTINGS.length}</div>
              <div className="text-sm text-white/60">Available Clients</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl font-bold text-emerald-400 mb-2">12</div>
              <div className="text-sm text-white/60">Successful Transfers</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">{categories.length}</div>
              <div className="text-sm text-white/60">Industries</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8">
          <ScrollArea className="w-full">
            <div className="flex items-center space-x-2 py-4">
              <Button
                variant="ghost"
                className={`whitespace-nowrap rounded-xl px-6 ${!selectedCategory ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'}`}
                onClick={() => setSelectedCategory(null)}
              >
                <Building2 className="w-4 h-4 mr-2" />
                All Industries
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className={`whitespace-nowrap rounded-xl px-6 ${selectedCategory === category ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>{category}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-white/80 mb-4">List Your Clients for Transfer</h3>
          <p className="text-white/60 mb-8">Set your terms, royalties, and transition period.</p>
          
          <div className="max-w-3xl mx-auto">
            <div onClick={() => setShowListingOverlay(true)} className="cursor-pointer">
              <Card className="p-6 bg-white/5 border-white/10 hover:border-teal-400/50 transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-teal-400/10 rounded-xl flex items-center justify-center mx-auto">
                    <Handshake className="w-6 h-6 text-teal-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Create Client Listing</h4>
                  <p className="text-sm text-white/60">
                    Specify client details, revenue, service mix, and transfer terms
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/marketplace/client/${listing.id}`}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-gray-800/50 border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden backdrop-blur-xl group-hover:transform group-hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <Building2 className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-teal-400 transition-colors line-clamp-2">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-white/60 mt-1">
                          {listing.category}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <DollarSign className="w-4 h-4" />
                        <span>{listing.annual_revenue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Clock className="w-4 h-4" />
                        <span>Since {listing.client_since}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Shield className="w-4 h-4" />
                        <span>{listing.transition_period}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Royalty Terms:</span>
                        <span className="text-teal-400 font-medium">{listing.royalty_terms}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 text-white/40 group-hover:text-white/60 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <CreateClientListingOverlay 
        isOpen={showListingOverlay}
        onClose={() => setShowListingOverlay(false)}
      />
    </div>
  );
}
