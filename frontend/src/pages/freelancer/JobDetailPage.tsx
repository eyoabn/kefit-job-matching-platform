import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  Send,
  Loader2,
  Briefcase,
  Zap,
  CheckCircle2,
  AlertCircle,
  Star
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useJob } from '@/hooks/useJobs';
import { useSubmitBid } from '@/hooks/useBids';
import { motion } from 'framer-motion';

const bidSchema = z.object({
  amount: z.string().transform(v => parseFloat(v)).refine(v => v > 0, 'Bid must be greater than 0'),
  timeline: z.string().min(1, 'Please specify an estimated duration'),
  proposal: z.string().min(100, 'Your proposal should be at least 100 characters to be competitive'),
});

type BidFormInput = z.input<typeof bidSchema>;
type BidFormOutput = z.output<typeof bidSchema>;

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading, error } = useJob(id || '');
  const { mutateAsync: submitBid } = useSubmitBid();
  const [templates, setTemplates] = React.useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('proposal_templates') || '[]');
  });

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<BidFormInput>({
    resolver: zodResolver(bidSchema) as any,
  });

  const proposalText = watch('proposal');

  const saveAsTemplate = () => {
    if (!proposalText || proposalText.length < 50) {
      alert('Proposal text is too short to be a template.');
      return;
    }
    const name = prompt('Name this template (e.g., Web Design Hook)');
    if (name) {
      const newTemplates = [...templates, { id: Date.now(), name, text: proposalText }];
      setTemplates(newTemplates);
      localStorage.setItem('proposal_templates', JSON.stringify(newTemplates));
      alert('Template saved!');
    }
  };

  const loadTemplate = (text: string) => {
    setValue('proposal', text);
  };

  const onSubmit = async (data: any) => {
    const validatedData = data as BidFormOutput;
    try {
      await submitBid({
        jobId: id!,
        data: {
          amount: validatedData.amount,
          timeline: validatedData.timeline,
          proposal: validatedData.proposal,
        },
      });
      alert('Application submitted successfully!');
      navigate('/applications');
    } catch (e: any) {
      if (e?.response?.status === 409) {
        alert('You already bid on this job.');
      } else {
        alert(`Failed to submit application: ${e.response?.data?.detail || e.message || 'Please try again.'}`);
      }
    }
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-kefit-primary" />
      </div>
    </DashboardLayout>
  );

  if (error || !job) return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
           <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Not Found</h2>
        <p className="text-slate-500 font-medium">This job post may have been removed or moved.</p>
        <Button onClick={() => navigate('/jobs')} className="bg-slate-950 font-black h-12 px-8 rounded-xl">Back to Marketplace</Button>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-slate-400 hover:text-kefit-primary transition-all mb-4 font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <section className="card-geometric p-10 bg-white border-slate-200 shadow-xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-2 h-full bg-kefit-primary" />
               <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                  <div className="space-y-4 max-w-2xl">
                     <div className="flex items-center gap-3">
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">Open for Proposals</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                     </div>
                     <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">{job.title}</h1>
                     <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
                        <span className="flex items-center gap-2 text-slate-900"><MapPin className="w-4 h-4 text-kefit-primary" /> Addis Ababa</span>
                        <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-kefit-primary" /> Technology</span>
                     </div>
                  </div>
                  
                  <div className="text-right shrink-0 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fixed Budget</p>
                     <p className="text-3xl font-black text-slate-950">{job.budget.toLocaleString()} <span className="text-xs">ETB</span></p>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8 border-y border-slate-50 mb-10">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                     <p className="text-lg font-black text-slate-900 flex items-center gap-2"><Clock className="w-5 h-5 text-kefit-primary" /> 2-4 Months</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Status</p>
                     <p className="text-lg font-black text-slate-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Payment Verified</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicants</p>
                     <p className="text-lg font-black text-slate-900 flex items-center gap-2"><Send className="w-5 h-5 text-blue-500" /> 12 Proposals</p>
                  </div>
               </div>

               <div className="space-y-10">
                  <div>
                    <h3 className="text-xl font-black text-slate-950 mb-4 flex items-center gap-3">
                       <Zap className="w-5 h-5 text-kefit-primary" />
                       Description
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-lg whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-slate-950 mb-6">Expertise Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(tag => (
                        <span key={tag} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-kefit-primary transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>
            </section>

            {/* Proposal Form */}
            <section id="proposal-form" className="card-geometric p-10 bg-slate-950 text-white relative overflow-hidden group border-none shadow-2xl">
               <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-2 tracking-tight">Submit Proposal</h2>
                  <p className="text-slate-400 mb-10 font-medium text-lg">Introduce yourself and tell the client why you're a fit.</p>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Your Bid (ETB)</label>
                          <input 
                            {...register('amount')}
                            type="number" 
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:outline-none focus:ring-4 focus:ring-kefit-primary/20 transition-all text-lg"
                            placeholder="e.g. 45,000"
                          />
                          {errors.amount && <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{errors.amount.message as string}</p>}
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timeline</label>
                          <input 
                            {...register('timeline')}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:outline-none focus:ring-4 focus:ring-kefit-primary/20 transition-all text-lg"
                            placeholder="e.g. 3 weeks"
                          />
                          {errors.timeline && <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{errors.timeline.message as string}</p>}
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Proposal Details</label>
                          <div className="flex gap-2">
                             {templates.length > 0 && (
                               <select 
                                 onChange={(e) => loadTemplate(e.target.value)}
                                 className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-kefit-primary/50"
                               >
                                 <option value="" className="bg-slate-900">Load Template...</option>
                                 {templates.map(t => <option key={t.id} value={t.text} className="bg-slate-900">{t.name}</option>)}
                               </select>
                             )}
                             <button 
                               type="button"
                               onClick={saveAsTemplate}
                               className="px-3 py-1.5 bg-kefit-primary/20 text-kefit-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-kefit-primary/30 transition-colors"
                             >
                               Save Current as Template
                             </button>
                          </div>
                       </div>
                       <textarea 
                         {...register('proposal')}
                         className="w-full h-64 bg-white/5 border border-white/10 rounded-[2rem] p-8 font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-kefit-primary/20 transition-all leading-relaxed"
                         placeholder="Start with a strong hook about your relevant experience..."
                       />
                       {errors.proposal && <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{errors.proposal.message as string}</p>}
                       <p className="text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Min. 100 characters</p>
                    </div>

                    <div className="flex justify-between items-center pt-6">
                       <p className="text-xs text-slate-400 font-medium hidden sm:block">By submitting, you agree to our Terms of Service.</p>
                       <Button type="submit" isLoading={isSubmitting} className="h-16 px-12 bg-kefit-primary hover:bg-kefit-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-kefit-primary/20 flex items-center gap-3">
                          Send Proposal <Send className="w-5 h-5" />
                       </Button>
                    </div>
                  </form>
               </div>
               
               {/* Decorative Orbs */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-kefit-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-kefit-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-96 space-y-8">
            <section className="card-geometric p-10 bg-white border-slate-200">
               <h3 className="text-lg font-black text-slate-950 mb-8 flex items-center justify-between">
                  About Client
                  <div className="w-2 h-2 bg-kefit-primary rounded-full animate-pulse" />
               </h3>
               <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center font-black text-kefit-primary text-2xl shadow-xl">S</div>
                    <div>
                      <p className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Safaricom ET</p>
                      <div className="flex items-center gap-1.5">
                         <MapPin className="w-3.5 h-3.5 text-slate-400" />
                         <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Addis Ababa</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-slate-50 space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trust Score</span>
                       <div className="flex gap-1 text-orange-400">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                       </div>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spend History</span>
                       <span className="text-sm font-black text-slate-900">450k+ ETB</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Member Since</span>
                       <span className="text-sm font-black text-slate-900">May 2024</span>
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full h-12 border-slate-200 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-kefit-primary rounded-xl">View Client Profile</Button>
               </div>
            </section>
            
            <section className="card-geometric p-10 bg-emerald-950 text-white overflow-hidden relative">
               <div className="relative z-10 space-y-4">
                  <h3 className="font-black text-kefit-primary uppercase tracking-[0.2em] text-[10px]">Payment Shield</h3>
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                     <p className="text-sm font-bold leading-relaxed">
                        Funds are secured in KefitEscrow. Payment is guaranteed upon milestone approval.
                     </p>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-kefit-primary/10 rounded-full blur-3xl" />
            </section>

            <section className="card-geometric p-8 bg-slate-50 border-transparent text-center space-y-4">
               <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
               <h4 className="font-black text-slate-900 text-sm">Advice for Success</h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Clients in this category prioritize portfolios over price. Ensure your case studies are linked in your proposal.
               </p>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};
