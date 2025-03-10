
import { useState } from 'react';
import { Briefcase, Search, Plus, Clock, Zap, ClipboardList, Users, ChevronRight, Layers, Calendar, ArrowRight, Filter, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicCard, ToxicCardHeader, ToxicCardTitle, ToxicCardContent, ToxicCardFooter } from '@/components/ui/toxic-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useJobs } from '@/hooks/useJobs';
import { JobListing, JobCategory } from '@/services/jobService';
import { format, formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';
import { JobCategoryIcon } from './JobCategoryIcon';
import { useNavigate } from 'react-router-dom';

const jobCategoryLabels: Record<JobCategory, string> = {
  'settlement-building': 'Settlement Building',
  'resource-gathering': 'Resource Gathering',
  'security': 'Security',
  'technology': 'Technology',
  'governance': 'Governance',
  'scouting': 'Scouting',
  'trading': 'Trading',
  'protocol-development': 'Protocol Development',
  'waste-management': 'Waste Management',
  'other': 'Other'
};

export const JobsDashboard = () => {
  const {
    availableJobs,
    isLoadingJobs,
    createdJobs,
    isLoadingCreatedJobs,
    myApplications,
    isLoadingMyApplications,
    myReferrals,
    isLoadingMyReferrals,
    canCreateJob,
    primaryRole
  } = useJobs();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | 'all'>('all');
  
  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleCreateJob = () => {
    navigate('/jobs/create');
  };
  
  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };
  
  const renderJobCard = (job: JobListing) => (
    <ToxicCard 
      key={job.id}
      className="cursor-pointer hover:border-toxic-neon/50 transition-all"
      onClick={() => handleJobClick(job.id)}
    >
      <ToxicCardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <ToxicBadge variant="outline" className="flex items-center gap-1">
            <JobCategoryIcon category={job.category} className="w-3 h-3" />
            {jobCategoryLabels[job.category]}
          </ToxicBadge>
          
          <ToxicBadge variant={job.status === 'open' ? 'success' : 'default'}>
            {job.status === 'open' ? 'Open' : job.status}
          </ToxicBadge>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-white mb-1">{job.title}</h3>
          <p className="text-sm text-white/70 line-clamp-2">{job.description}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-white/60">Reward</span>
            <span className="font-mono text-toxic-neon">{job.reward} ETH</span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-sm text-white/60">Deadline</span>
            <span className="text-white/80 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(job.deadline * 1000, { addSuffix: true })}
            </span>
          </div>
        </div>
        
        {job.requiredRole && (
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-sm text-white/60">Required Role</span>
            <ToxicBadge>{job.requiredRole}</ToxicBadge>
          </div>
        )}
      </ToxicCardContent>
    </ToxicCard>
  );
  
  const renderEmptyState = (message: string, canCreate: boolean = false) => (
    <div className="bg-black/20 rounded-xl border border-white/5 p-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-toxic-neon/10 flex items-center justify-center mb-4">
        <Briefcase className="w-8 h-8 text-toxic-neon" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">{message}</h3>
      <p className="text-white/60 max-w-md mx-auto mb-6">
        {canCreate 
          ? "Create your first job to find talented individuals in the wasteland." 
          : "Check back soon for new opportunities in the wasteland."}
      </p>
      
      {canCreate && (
        <ToxicButton onClick={handleCreateJob} className="gap-1">
          <Plus className="w-4 h-4" />
          Create Job
        </ToxicButton>
      )}
    </div>
  );
  
  return (
    <div className="p-6 bg-black/60 border border-toxic-neon/30 rounded-xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-mono text-toxic-neon mb-1">Wasteland Jobs</h2>
          <p className="text-white/60 text-sm">
            Find opportunities or post jobs in the post-apocalyptic economy
          </p>
        </div>
        
        {canCreateJob && (
          <ToxicButton onClick={handleCreateJob} className="gap-1">
            <Plus className="w-4 h-4" />
            Post Job
          </ToxicButton>
        )}
      </div>
      
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="bg-black/40 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-toxic-neon/20">All Jobs</TabsTrigger>
            <TabsTrigger value="my-posts" className="data-[state=active]:bg-toxic-neon/20">My Postings</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-toxic-neon/20">My Applications</TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-toxic-neon/20">My Referrals</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
              <Input
                placeholder="Search jobs..."
                className="pl-9 bg-black/30 border-white/10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="bg-black/30 border border-white/10 rounded-md px-4 py-2 text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-toxic-neon/50"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as JobCategory | 'all')}
              >
                <option value="all">All Categories</option>
                {Object.entries(jobCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-2.5 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {isLoadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg h-48"></div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            renderEmptyState("No jobs available", canCreateJob)
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map(renderJobCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-posts" className="mt-0">
          {isLoadingCreatedJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg h-48"></div>
              ))}
            </div>
          ) : createdJobs.length === 0 ? (
            renderEmptyState("You haven't posted any jobs", canCreateJob)
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdJobs.map(renderJobCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applications" className="mt-0">
          {isLoadingMyApplications ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg h-48"></div>
              ))}
            </div>
          ) : myApplications.length === 0 ? (
            renderEmptyState("You haven't applied for any jobs")
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myApplications.map((application) => {
                const job = availableJobs.find(j => j.id === application.jobId);
                if (!job) return null;
                
                return (
                  <ToxicCard 
                    key={application.id}
                    className="cursor-pointer hover:border-toxic-neon/50 transition-all"
                    onClick={() => handleJobClick(job.id)}
                  >
                    <ToxicCardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <ToxicBadge variant="outline" className="flex items-center gap-1">
                          <JobCategoryIcon category={job.category} className="w-3 h-3" />
                          {jobCategoryLabels[job.category]}
                        </ToxicBadge>
                        
                        <ToxicBadge 
                          variant={
                            application.status === 'accepted' ? 'success' : 
                            application.status === 'rejected' ? 'destructive' : 
                            'default'
                          }
                        >
                          {application.status === 'pending' ? 'Pending' : 
                           application.status === 'accepted' ? 'Accepted' :
                           'Rejected'}
                        </ToxicBadge>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">{job.title}</h3>
                        <p className="text-sm text-white/70 line-clamp-2">{job.description}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm text-white/60">Applied</span>
                          <span className="text-white/80 text-sm">
                            {formatDistanceToNow(application.createdAt * 1000, { addSuffix: true })}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-white/60">Reward</span>
                          <span className="font-mono text-toxic-neon">{job.reward} ETH</span>
                        </div>
                      </div>
                    </ToxicCardContent>
                  </ToxicCard>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-0">
          {isLoadingMyReferrals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg h-48"></div>
              ))}
            </div>
          ) : myReferrals.length === 0 ? (
            renderEmptyState(primaryRole === 'Bounty Hunter' 
              ? "You haven't referred anyone to jobs yet" 
              : "Only Bounty Hunters can make referrals")
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myReferrals.map((referral) => {
                const job = availableJobs.find(j => j.id === referral.jobId);
                if (!job) return null;
                
                return (
                  <ToxicCard 
                    key={referral.id}
                    className="cursor-pointer hover:border-toxic-neon/50 transition-all"
                    onClick={() => handleJobClick(job.id)}
                  >
                    <ToxicCardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <ToxicBadge variant="outline" className="flex items-center gap-1">
                          <JobCategoryIcon category={job.category} className="w-3 h-3" />
                          {jobCategoryLabels[job.category]}
                        </ToxicBadge>
                        
                        <ToxicBadge 
                          variant={
                            referral.status === 'accepted' ? 'success' : 
                            referral.status === 'rejected' ? 'destructive' : 
                            'default'
                          }
                        >
                          {referral.status === 'pending' ? 'Pending' : 
                           referral.status === 'accepted' ? 'Accepted' :
                           'Rejected'}
                        </ToxicBadge>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">{job.title}</h3>
                        <p className="text-sm text-white/70">Applicant: {referral.applicant.substring(0, 6)}...{referral.applicant.substring(38)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm text-white/60">Referred</span>
                          <span className="text-white/80 text-sm">
                            {formatDistanceToNow(referral.createdAt * 1000, { addSuffix: true })}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-white/60">Reward (if accepted)</span>
                          <span className="font-mono text-toxic-neon">{job.referralReward || '0'} ETH</span>
                        </div>
                      </div>
                    </ToxicCardContent>
                  </ToxicCard>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
