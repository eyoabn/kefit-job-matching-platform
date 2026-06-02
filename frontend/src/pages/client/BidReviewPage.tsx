import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useBids, useUpdateBidStatus, useHireFreelancer } from '@/hooks/useBids';
import { useJob } from '@/hooks/useJobs';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  Star,
  User,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const BidReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading: jobLoading } = useJob(id || '');
  const { data: bids, isLoading: bidsLoading } = useBids(id || '');
  const { mutateAsync: updateBid } = useUpdateBidStatus();
  const { mutateAsync: hireFreelancer } = useHireFreelancer();
  
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [isHiring, setIsHiring] = useState(false);

  const handleHire = async (bidId: string) => {
    if (window.confirm('Are you sure you want to hire this freelancer? A contract will be created automatically.')) {
      setIsHiring(true);
      try {
        await hireFreelancer({ jobId: id!, bidId });
        alert('Hiring successful! Contract created.');
        navigate('/client/dashboard');
       } catch (e: any) {
        if (e?.response?.status === 409) {
          alert('This bid was already accepted or job is already in progress.');
        } else if (e?.response?.status === 403) {
          alert('You are not authorized to hire for this job.');
        } else {
          alert(`Failed to hire: ${e.response?.data?.detail || e.message || 'Please try again.'}`);
        }
      } finally {
        setIsHiring(false);
      }
    }
  };

  const handleReject = async (bidId: string) => {
    if (window.confirm('Reject this bid?')) {
      try {
        await updateBid({ id: bidId, status: 'Rejected' });
      } catch (e) {
        alert('Failed to reject bid.');
      }
    }
  };

  if (jobLoading || bidsLoading) return <div className="p-12 text-center">Loading...</div>;
  if (!job) return <div className="p-12 text-center">Job not found</div>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-kefit-primary/10 text-kefit-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-kefit-primary/20">
                  {job.status}
                </span>
                <h1 className="text-3xl font-black text-slate-950 tracking-tight">{job.title}</h1>
              </div>
              <p className="text-slate-500 max-w-2xl">{job.description.substring(0, 150)}...</p>
            </div>
            <div className="card-geometric p-4 flex items-center gap-4 bg-white">
              <div className="p-3 rounded-xl bg-kefit-primary/5 text-kefit-primary">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Budget</p>
                <p className="text-xl font-black text-slate-950">{job.budget.toLocaleString()} <span className="text-sm">ETB</span></p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Active Bids ({bids?.length || 0})</h2>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <span>Sorted by</span>
                <select className="bg-transparent border-none font-black text-kefit-primary focus:ring-0">
                  <option>Recent First</option>
                  <option>Lowest Price</option>
                  <option>Highest Rating</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {bids?.length === 0 ? (
                <div className="card-geometric p-12 text-center text-slate-400 italic">
                  No bids received for this job yet.
                </div>
              ) : (
                bids?.map((bid) => (
                  <motion.div 
                    key={bid.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "card-geometric overflow-hidden border-2 transition-all cursor-pointer",
                      selectedBidId === bid.id ? "border-kefit-primary ring-4 ring-kefit-primary/5 shadow-2xl" : "border-transparent hover:border-slate-200"
                    )}
                    onClick={() => setSelectedBidId(bid.id)}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-black text-slate-900">{bid.freelancerName}</h3>
                              <ShieldCheck className="w-4 h-4 text-blue-500 fill-current" />
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold">
                              <div className="flex items-center gap-1 text-orange-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                4.9
                              </div>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">12 Reviews</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-emerald-600">Verified identity</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-950">{bid.amount.toLocaleString()} <span className="text-xs font-bold text-slate-400">ETB</span></p>
                          <p className="text-xs font-bold text-slate-500 flex items-center justify-end gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {bid.deliveryDays} days delivery
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                          {bid.proposal}
                        </p>
                      </div>

                      <AnimatePresence>
                        {selectedBidId === bid.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 mt-6 border-t border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                                  Chat
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleReject(bid.id)}>
                                  Reject
                                </Button>
                              </div>
                              <Button 
                                className="bg-slate-950 hover:bg-kefit-primary" 
                                leftIcon={<Zap className="w-4 h-4" />}
                                onClick={() => handleHire(bid.id)}
                                isLoading={isHiring}
                              >
                                Hire & Start Contract
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-geometric p-6 bg-slate-900 text-white">
              <h3 className="font-black text-lg mb-4">Market Insight</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Average Bid</span>
                  <span className="font-bold">41,000 ETB</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Lowest Bid</span>
                  <span className="font-bold">38,000 ETB</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Applicants</span>
                  <span className="font-bold">{bids?.length || 0} Freelancers</span>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10 text-xs text-slate-400 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-kefit-primary" />
                  <p>Hiring a freelancer through Kefit protects your payment and ensures quality delivery through our milestone-based contracts.</p>
                </div>
              </div>
            </div>

            <div className="card-geometric p-6">
              <h3 className="font-black text-slate-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};
