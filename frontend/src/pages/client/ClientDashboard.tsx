import React, { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Users, 
  Briefcase, 
  Clock, 
  ChevronRight, 
  Edit3, 
  XCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  Bell,
  MoreVertical,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/hooks/useJobs';
import { useNotifications } from '@/hooks/useNotifications';
import { useContracts } from '@/hooks/useContracts';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: jobs, isLoading: jobsLoading } = useJobs({ my_jobs: true });
  const { data: notifications } = useNotifications();
  const { data: contracts } = useContracts();
  
  const activeJobs = jobs?.filter(j => j.status === 'Open' || j.status === 'InProgress').slice(0, 3);
  
  const stats = [
    { label: 'Active Jobs', value: activeJobs?.length || 0, icon: Briefcase, color: 'text-kefit-primary', bg: 'bg-kefit-primary/10' },
    { label: 'Pending Bids', value: activeJobs?.reduce((sum, j) => sum + (j.bidCount || 0), 0) || 0, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Active Contracts', value: contracts?.length || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Hires', value: contracts?.filter(c => c.status === 'Completed').length || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const handleCloseJob = (id: string) => {
    if (window.confirm('Are you sure you want to close this job listing? It will no longer accept new bids.')) {
      alert(`Job ${id} closed successfully.`);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 lg:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Client'}!</h1>
            <p className="text-slate-400 font-medium max-w-md">You have {notifications?.filter(n => !n.read).length || 0} new notifications and 3 active proposals to review.</p>
            <div className="flex gap-4 pt-4">
              <Link to="/client/post-job">
                <Button className="bg-kefit-primary hover:bg-kefit-primary/90 text-white font-black rounded-xl h-12 px-6">
                  + Post New Job
                </Button>
              </Link>
              <Link to="/client/support">
                <Button variant="ghost" className="text-white hover:bg-white/10 font-bold">
                  Get Support
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4 relative z-10">
            {stats.slice(0, 4).map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl w-48 shadow-lg">
                <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-kefit-primary/10 blur-[100px] -z-0 translate-x-1/2 -translate-y-1/2" />
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Actions */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <QuickAction icon={Briefcase} label="Job Listings" href="/client/dashboard" />
              <QuickAction icon={MessageSquare} label="View Messages" href="/client/messages" />
              <QuickAction icon={Bell} label="Notifications" href="/client/notifications" />
              <QuickAction icon={LifeBuoy} label="Help Center" href="/client/support" />
            </section>

            {/* Recent Postings */}
            <section className="card-geometric overflow-hidden border-slate-200">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-kefit-primary" />
                  Your Active Job Postings
                </h2>
                <button className="text-sm font-black text-kefit-primary hover:underline">View All Listings</button>
              </div>

              <div className="divide-y divide-slate-100">
                {jobsLoading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-32 m-6" />)
                ) : activeJobs?.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-lg">No active jobs</p>
                      <p className="text-slate-500 text-sm mt-1">Start by posting your first project to find top talent.</p>
                    </div>
                    <Link to="/client/post-job">
                      <Button className="mt-4" size="sm">Create a Job</Button>
                    </Link>
                  </div>
                ) : (
                  activeJobs?.map(job => (
                    <div key={job.id} className="p-8 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-kefit-primary transition-colors tracking-tight">{job.title}</h3>
                          <span className={cn(
                            "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-lg border",
                            job.status === 'Open' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                          )}>
                            {job.status === 'InProgress' ? 'In Progress' : job.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-2 bg-kefit-primary/5 text-kefit-primary px-3 py-1 rounded-full border border-kefit-primary/10">
                            <Users className="w-3.5 h-3.5" />
                            {job.bidCount || 0} Proposals Received
                          </span>
                          <span className="text-slate-950 font-black">
                            {job.budget.toLocaleString()} ETB
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link to={`/client/jobs/${job.id}`}>
                          <Button 
                            variant="outline" 
                            className="h-12 px-6 rounded-xl border-slate-200 text-slate-700 hover:text-kefit-primary font-black"
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                          >
                            Review {job.bidCount} Bids
                          </Button>
                        </Link>
                        <div className="relative group/actions">
                          <button className="p-3 text-slate-400 hover:text-slate-950 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Active Contracts Summary */}
            <section className="card-geometric p-8 border-slate-200 bg-emerald-50/20 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Ongoing Contracts
                </h2>
                <Link to="/client/contracts" className="text-sm font-black text-emerald-600 hover:underline">View All Contracts</Link>
              </div>

              <div className="space-y-4">
                 {contracts?.length === 0 ? (
                    <p className="text-slate-500 text-sm font-medium italic">No active contracts found.</p>
                 ) : (
                    contracts?.map(contract => (
                      <div key={contract.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Zap className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 leading-tight">{contract.jobTitle}</h4>
                            <p className="text-xs text-slate-500 font-bold mt-1">Hired: {contract.freelancerName}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="font-black text-emerald-600" rightIcon={<ArrowRight className="w-4 h-4" />}>
                          Track
                        </Button>
                      </div>
                    ))
                 )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="space-y-8">
            {/* Recent Activity Feed */}
            <section className="card-geometric p-8">
              <h3 className="text-lg font-black text-slate-950 mb-6 flex items-center justify-between">
                Activity Feed
                <button className="text-[10px] font-black uppercase text-slate-400 hover:text-kefit-primary">Clear</button>
              </h3>
              <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {notifications?.slice(0, 4).map((notif, i) => (
                   <div key={i} className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 bg-kefit-primary rounded-full animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">{notif.message}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                   </div>
                ))}
              </div>
            </section>

            {/* Platform Governance / Support */}
            <section className="card-geometric p-8 bg-kefit-primary/5 border border-kefit-primary/10">
              <h3 className="font-black text-slate-950 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-kefit-primary" />
                Safety Hub
              </h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                Encountered any issues with a bid or contract? Our governance team is here to help.
              </p>
              <div className="space-y-3">
                <Link to="/client/support">
                  <Button variant="outline" className="w-full text-xs font-black h-10 border-kefit-primary/20 text-kefit-primary">
                    Report Issue
                  </Button>
                </Link>
                <Link to="/client/support">
                  <Button variant="ghost" className="w-full text-xs font-black h-10 text-slate-400">
                    Terms & Privacy
                  </Button>
                </Link>
              </div>
            </section>

             {/* Quick Stats Summary Card */}
             <section className="card-geometric p-8 relative overflow-hidden bg-kefit-primary group">
                <div className="relative z-10">
                  <h3 className="text-white font-black text-lg mb-1">Elite Client Program</h3>
                  <p className="text-white/70 text-sm font-bold mb-6">You've hired {contracts?.filter(c => c.status === 'Completed').length || 0} freelancers this year. {Math.max(0, 20 - (contracts?.filter(c => c.status === 'Completed').length || 0))} more to reach Platinum!</p>
                  <Button className="w-full bg-white text-kefit-primary hover:bg-white/90 font-black">
                    View Progress
                  </Button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                  <TrendingUp className="w-24 h-24 text-white" />
                </div>
             </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

const QuickAction = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => (
  <Link to={href} className="card-geometric p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-kefit-primary group transition-all bg-white border-slate-200">
    <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-kefit-primary/10 group-hover:text-kefit-primary transition-all">
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{label}</span>
  </Link>
);
