import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useContracts } from '@/hooks/useContracts';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  User, 
  Calendar,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const FreelancerContractsPage = () => {
  const { data: contracts, isLoading } = useContracts();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              My Contracts
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your active projects and milestone progress.</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="font-bold border-slate-200">Export History</Button>
             <Link to="/jobs">
               <Button className="bg-kefit-primary hover:bg-kefit-primary/90 font-black">Browse Jobs</Button>
             </Link>
          </div>
        </header>

        {/* Filters / Categories */}
        <div className="flex gap-4 border-b border-slate-100 pb-px">
          {['Active', 'Pending', 'Past Work', 'Disputes'].map((tab, i) => (
            <button 
              key={tab} 
              className={cn(
                "px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                i === 0 ? "text-kefit-primary" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
              {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-kefit-primary rounded-t-full" />}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)
          ) : contracts?.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-6 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <ShieldCheck className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">No active contracts found</h3>
                  <p className="text-slate-500 font-medium">Start bidding on projects to build your history.</p>
               </div>
               <Link to="/jobs">
                  <Button className="h-12 px-10 bg-slate-950 font-black">Find New Projects</Button>
               </Link>
            </div>
          ) : (
            contracts?.map((contract) => (
              <div 
                key={contract.id} 
                className="card-geometric bg-white border-slate-200 hover:border-kefit-primary transition-all group overflow-hidden"
              >
                <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                   <div className="flex gap-6 items-start">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 text-kefit-primary flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                         <Briefcase className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center gap-3">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-kefit-primary transition-colors">{contract.jobTitle}</h3>
                           <span className={cn(
                             "px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                             contract.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                           )}>
                              {contract.status}
                           </span>
                         </div>
                         <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-slate-500">
                            <span className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> {contract.clientName}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Started: May 12, 2026</span>
                            <span className="flex items-center gap-2 text-slate-900 font-black">24,000 ETB Total</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center gap-4">
                      <div className="text-right hidden sm:block mr-4">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Upcoming Milestone</p>
                         <p className="text-sm font-bold text-slate-900">Frontend Polish (12,000 ETB)</p>
                      </div>
                      <Link to={`/freelancer/contracts/${contract.id}`}>
                        <Button className="h-12 px-8 bg-slate-950 font-black flex items-center gap-2">
                           Dashboard <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100">
                         <MoreVertical className="w-5 h-5" />
                      </button>
                   </div>
                </div>
                
                {/* Progress bar at bottom */}
                <div className="h-1.5 w-full bg-slate-100">
                   <div className="h-full bg-emerald-500 w-[45%]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
