import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { 
  FileText, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  MoreVertical,
  Briefcase,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useFreelancerBids } from '@/hooks/useBids';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { Link } from 'react-router-dom';

export const FreelancerBidsPage = () => {
  const { user } = useAuth();
  const { data: bids, isLoading } = useFreelancerBids(user?.id || '');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'withdrawn': return 'bg-slate-50 text-slate-500 border-slate-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'rejected': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FileText className="w-8 h-8 text-kefit-primary" />
              Proposals & Bids
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-lg">Track your history of sent proposals and active inquiries.</p>
          </div>
          <Link to="/jobs">
            <Button className="bg-slate-950 hover:bg-slate-900 text-white font-black h-12 px-8 rounded-xl shadow-lg">
              Find New Work
            </Button>
          </Link>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-2">
           <div className="flex gap-2">
             {['All Proposals', 'Active', 'Accepted', 'Archived'].map((tab, i) => (
               <button 
                 key={tab} 
                 className={cn(
                   "px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
                   i === 0 ? "text-kefit-primary" : "text-slate-400 hover:text-slate-600"
                 )}
               >
                 {tab}
                 {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-kefit-primary rounded-t-full shadow-[0_-4px_12px_rgba(33,184,113,0.3)]" />}
               </button>
             ))}
           </div>

           <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search bids..." 
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-kefit-primary/10 transition-all"
              />
           </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)
          ) : bids?.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-6 bg-white rounded-[3rem] border border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <Briefcase className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">No active proposals</h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">You haven't submitted any bids yet. The marketplace is full of opportunities waiting for you.</p>
               </div>
               <Link to="/jobs">
                  <Button className="h-14 px-10 bg-kefit-primary font-black shadow-xl shadow-kefit-primary/20">Browse Open Jobs</Button>
               </Link>
            </div>
          ) : (
            bids?.map((bid) => (
              <div 
                key={bid.id} 
                className="card-geometric bg-white border-slate-200 hover:border-kefit-primary transition-all group overflow-hidden"
              >
                <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                   <div className="flex gap-6 items-start">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-kefit-primary/5 group-hover:scale-105 transition-all text-kefit-primary">
                         <Briefcase className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                         <div className="flex flex-wrap items-center gap-3">
                           <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-kefit-primary transition-colors leading-tight">{bid.jobTitle || 'Custom Project Inquiry'}</h3>
                           <span className={cn(
                             "flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                             getStatusColor(bid.status)
                           )}>
                              {getStatusIcon(bid.status)}
                              {bid.status}
                           </span>
                         </div>
                         <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-slate-500">
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Submitted: {new Date(bid.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2 text-slate-900 font-black"><DollarSign className="w-4 h-4 text-kefit-primary" /> {bid.amount?.toLocaleString() || '---'} ETB</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block mr-4">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Estimated Timeline</p>
                         <p className="text-sm font-black text-slate-900">{bid.timeline || 'TBD'}</p>
                      </div>
                      <Link to={`/jobs/${bid.jobId}`}>
                        <Button variant="outline" size="sm" className="h-12 px-6 font-black border-slate-200 flex items-center gap-2 rounded-xl">
                           View Job <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                         <MoreVertical className="w-5 h-5" />
                      </button>
                   </div>
                </div>
                
                {/* Visual accent if accepted */}
                {bid.status.toLowerCase() === 'accepted' && (
                  <div className="h-1.5 w-full bg-emerald-500" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Tip Card */}
        <section className="card-geometric p-10 bg-slate-50 border-transparent relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-inner">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-kefit-primary shadow-lg shrink-0">
              <AlertCircle className="w-8 h-8" />
           </div>
           <div className="space-y-1 text-center md:text-left">
              <h4 className="text-lg font-black text-slate-950">Did you know?</h4>
              <p className="text-slate-500 font-medium">Bids with personalized cover letters are <span className="text-kefit-primary font-bold">3x more likely</span> to get a response from clients.</p>
           </div>
           <Button variant="ghost" className="md:ml-auto font-black text-kefit-primary uppercase tracking-widest text-xs">Learn Bidding Tips</Button>
        </section>
      </div>
    </DashboardLayout>
  );
};
