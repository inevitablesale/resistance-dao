
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, DollarSign, Users, Clock, Building2, 
  FileText, Briefcase, Calendar, MapPin, 
  MessageSquare, ArrowLeft, ArrowRight 
} from "lucide-react";
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

interface FormData {
  durationType: 'short-term' | 'long-term' | '';
  title: string;
  annualValue: string;
  serviceType: string;
  industry: string;
  servicePeriod: string;
  location: string;
  feeSplit: string;
  startDate: string;
  clientCount: string;
  billingArrangement: string;
  deliverables: string;
  qualityControl: string;
  communication: string;
  staffRequirements: string;
}

export function CreateClientListingOverlay({ isOpen, onClose }: CreateClientListingOverlayProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    durationType: '',
    title: '',
    annualValue: '',
    serviceType: '',
    industry: '',
    servicePeriod: '',
    location: '',
    feeSplit: '',
    startDate: '',
    clientCount: '',
    billingArrangement: '',
    deliverables: '',
    qualityControl: '',
    communication: '',
    staffRequirements: ''
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderDurationTypeStep = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
      <h3 className="text-2xl font-semibold text-white text-center">
        What type of service arrangement are you looking for?
      </h3>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
        <Button
          variant={formData.durationType === 'short-term' ? 'default' : 'outline'}
          className={`h-40 flex flex-col items-center justify-center space-y-4 p-6 ${
            formData.durationType === 'short-term' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-white/5'
          }`}
          onClick={() => updateField('durationType', 'short-term')}
        >
          <Clock className="w-12 h-12" />
          <div className="text-center">
            <div className="font-semibold mb-2">Short-Term</div>
            <div className="text-sm opacity-80">Project-based or seasonal work with defined end dates</div>
          </div>
        </Button>

        <Button
          variant={formData.durationType === 'long-term' ? 'default' : 'outline'}
          className={`h-40 flex flex-col items-center justify-center space-y-4 p-6 ${
            formData.durationType === 'long-term' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-white/5'
          }`}
          onClick={() => updateField('durationType', 'long-term')}
        >
          <Calendar className="w-12 h-12" />
          <div className="text-center">
            <div className="font-semibold mb-2">Long-Term</div>
            <div className="text-sm opacity-80">Ongoing service relationship with recurring work</div>
          </div>
        </Button>
      </div>
    </div>
  );

  const renderServiceRequirements = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white/90">Service Requirements</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Service Opportunity Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
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
              value={formData.annualValue}
              onChange={(e) => updateField('annualValue', e.target.value)}
              placeholder="100,000"
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Primary Service Type</Label>
          <Select value={formData.serviceType} onValueChange={(value) => updateField('serviceType', value)}>
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
          <Select value={formData.industry} onValueChange={(value) => updateField('industry', value)}>
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
      </div>
    </div>
  );

  const renderServiceTerms = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white/90">Service Terms</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Service Period</Label>
          <Select value={formData.servicePeriod} onValueChange={(value) => updateField('servicePeriod', value)}>
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
          <Select value={formData.location} onValueChange={(value) => updateField('location', value)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select location" />
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

        <div className="space-y-2">
          <Label>Fee Split Percentage</Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.feeSplit}
              onChange={(e) => updateField('feeSplit', e.target.value)}
              placeholder="70"
              min="0"
              max="100"
              className="bg-white/5 border-white/10 text-white"
            />
            <span className="absolute right-3 top-2.5 text-white/40">%</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Billing Arrangement</Label>
          <Select value={formData.billingArrangement} onValueChange={(value) => updateField('billingArrangement', value)}>
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
  );

  const renderScopeAndRequirements = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white/90">Service Scope & Requirements</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Service Deliverables</Label>
          <Textarea
            value={formData.deliverables}
            onChange={(e) => updateField('deliverables', e.target.value)}
            placeholder="List key deliverables and deadlines..."
            className="min-h-[100px] bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label>Quality Control Requirements</Label>
          <Textarea
            value={formData.qualityControl}
            onChange={(e) => updateField('qualityControl', e.target.value)}
            placeholder="Specify quality control processes and standards..."
            className="min-h-[100px] bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label>Communication Protocol</Label>
          <Textarea
            value={formData.communication}
            onChange={(e) => updateField('communication', e.target.value)}
            placeholder="Outline expected communication frequency and methods..."
            className="min-h-[100px] bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label>Staff Requirements</Label>
          <Input
            value={formData.staffRequirements}
            onChange={(e) => updateField('staffRequirements', e.target.value)}
            placeholder="e.g., Senior Accountant with 5+ years experience"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderDurationTypeStep();
      case 2:
        return renderServiceRequirements();
      case 3:
        return renderServiceTerms();
      case 4:
        return renderScopeAndRequirements();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.durationType !== '';
      case 2:
        return formData.title && formData.serviceType && formData.industry;
      case 3:
        return formData.servicePeriod && formData.location && formData.feeSplit;
      case 4:
        return formData.deliverables && formData.qualityControl;
      default:
        return false;
    }
  };

  const totalSteps = 4;

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
                <p className="text-sm text-white/60">Step {step} of {totalSteps}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 p-4 bg-black/50">
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                onClick={() => setStep(prev => prev - 1)}
                disabled={step === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <div className="flex items-center gap-2">
                {step < totalSteps ? (
                  <Button 
                    onClick={() => setStep(prev => prev + 1)}
                    disabled={!canProceed()}
                    className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    className="bg-teal-500 hover:bg-teal-600"
                    disabled={!canProceed()}
                  >
                    Create Service Listing
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
