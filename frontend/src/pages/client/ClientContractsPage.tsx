import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useContracts, useUpdateContractStatus } from '@/hooks/useContracts';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contract } from '@/types';

export const ClientContractsPage = () => {
  const { data: contracts, isLoading } = useContracts();
  const { mutateAsync: updateStatus } = useUpdateContractStatus();

  const handleStatusUpdate = async (id: string, status: Contract['status']) => {
    if (window.confirm(`Mark this contract as ${status}?`)) {
      await updateStatus({ id, status });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">Active Contracts</h1>
            <p className="text-slate-500 mt-1">Track ongoing projects and manage deliverables.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Download History</Button>
          </div>
        </header>

        <section className="card-geometric overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-6">
              <button className="text-sm font-black text-kefit-primary border-b-2 border-kefit-primary pb-6 -mb-6">Active</button>
              <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Completed</button>
              <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Cancelled</button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">Loading contracts...</div>
            ) : contracts?.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="max-w-xs">
                  <p className="text-slate-900 font-bold">No active contracts</p>
                  <p className="text-sm text-slate-500 mt-1">Hire a freelancer from your job bids to start working.</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.history.back()}>
                  Go to Job Postings
                </Button>
              </div>
            ) : (
              contracts?.map((contract) => (
                <div key={contract.id} className="p-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4 items-start">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        contract.status === 'Active' ? "bg-kefit-primary/10 text-kefit-primary" : "bg-slate-100 text-slate-400"
                      )}>
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-slate-950 flex items-center gap-2">
                          {contract.jobTitle}
                          <span className={cn(
                            "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md",
                            contract.status === 'Active' ? "bg-kefit-primary/10 text-kefit-primary" : "bg-slate-200 text-slate-600"
                          )}>
                            {contract.status}
                          </span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Started {new Date(contract.startDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="text-slate-900">Freelancer: {contract.freelancerName}</span>
                          <span>•</span>
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                            {contract.amount.toLocaleString()} ETB Escrow
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-10 px-4">View Deliverables</Button>
                      <Button 
                        size="sm" 
                        className="h-10 px-4 bg-slate-950 hover:bg-kefit-primary" 
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        onClick={() => handleStatusUpdate(contract.id, 'Completed')}
                      >
                        Release Payment
                      </Button>
                      <button className="p-2 text-slate-400 hover:text-slate-950">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-geometric p-6 border-l-4 border-l-kefit-primary">
            <h4 className="font-black text-slate-950 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-kefit-primary" />
              Kefit Escrow Protection
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your funds are held securely. Release payment only when you are satisfied with the work delivered by your freelancer.
            </p>
          </div>
          <div className="card-geometric p-6 border-l-4 border-l-emerald-500">
            <h4 className="font-black text-slate-950 flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Work Logs & History
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Access all previous communication and file history for this contract in one place for legal and tax compliance.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
