
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { X, DollarSign, Users, Clock, Building2, FileText, Briefcase, Calendar, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface CreateClientListingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_TYPES = [
  "Tax Preparation",
  "Monthly Bookkeeping",
  "Payroll",
  "Advisory Services",
  "Audit",
  "CFO Services"
];

const CLIENT_INDUSTRIES = [
  "Professional Services",
  "Real Estate",
  "Construction",
  "Healthcare",
  "Manufacturing",
  "Technology",
  "Retail"
];

const SERVICE_PERIODS = [
  "Tax Season Only",
  "Year-Round",
  "Quarterly",
  "Monthly",
  "Project-Based"
];

const SERVICE_LOCATIONS = [
  "Remote Only",
  "On-Site Required",
  "Hybrid",
  "Flexible"
];

const BILLING_ARRANGEMENTS = [
  "Original Firm Bills Client",
  "Service Provider Bills Client",
  "Split Billing"
];

export function CreateClientListingOverlay({ isOpen, onClose }: CreateClientListingOverlayProps) {
  const [step, setStep] = useState(1);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[85vh] bg-black/95 border-white/10 text-white rounded-xl flex flex-col overflow-hidden">
        <DialogTitle className="sr-only">List Service Opportunity</DialogTitle>
        
        <div className="absolute right-4 top-4 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white/60 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col h-full">
          <div className="shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-teal-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">List Service Opportunity</h2>
                <p className="text-sm text-white/60">Specify service needs and terms for client servicing arrangement</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="max-w-2xl mx-auto space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Service Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white/90">Service Requirements</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Service Opportunity Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Tax Season Support - Manufacturing Clients"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="annual-value">Annual Service Value</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                          <Input
                            id="annual-value"
                            placeholder="100,000"
                            className="pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Primary Service Type</Label>
                        <Select>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_TYPES.map((service) => (
                              <SelectItem key={service} value={service.toLowerCase()}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Client Industry</Label>
                        <Select>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {CLIENT_INDUSTRIES.map((industry) => (
                              <SelectItem key={industry} value={industry.toLowerCase()}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Service Period</Label>
                        <Select>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select service period" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_PERIODS.map((period) => (
                              <SelectItem key={period} value={period.toLowerCase()}>
                                {period}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Service Location</Label>
                        <Select>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select location preference" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_LOCATIONS.map((location) => (
                              <SelectItem key={location} value={location.toLowerCase()}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Service Terms */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white/90">Service Terms</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fee Split Percentage</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="70"
                            min="0"
                            max="100"
                            className="bg-white/5 border-white/10 text-white"
                          />
                          <span className="absolute right-3 top-2.5 text-white/40">%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                          <Input
                            type="date"
                            className="pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Client Count</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                          <Input
                            type="number"
                            placeholder="10"
                            min="1"
                            className="pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Billing Arrangement</Label>
                        <Select>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select billing arrangement" />
                          </SelectTrigger>
                          <SelectContent>
                            {BILLING_ARRANGEMENTS.map((arrangement) => (
                              <SelectItem key={arrangement} value={arrangement.toLowerCase()}>
                                {arrangement}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Service Scope */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white/90">Service Scope & Requirements</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Service Deliverables</Label>
                        <Textarea
                          placeholder="List key deliverables and deadlines..."
                          className="min-h-[100px] bg-white/5 border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Quality Control Requirements</Label>
                        <Textarea
                          placeholder="Specify quality control processes and standards..."
                          className="min-h-[100px] bg-white/5 border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Communication Protocol</Label>
                        <Textarea
                          placeholder="Outline expected communication frequency and methods..."
                          className="min-h-[100px] bg-white/5 border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Staff Requirements</Label>
                        <Input
                          placeholder="e.g., Senior Accountant with 5+ years experience"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 p-4 bg-black/50">
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button className="bg-teal-500 hover:bg-teal-600">
                Create Service Listing
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

