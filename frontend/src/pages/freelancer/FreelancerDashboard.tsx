import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/ui/JobCard';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/hooks/useJobs';
import { useContracts } from '@/hooks/useContracts';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Briefcase, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  MessageSquare,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  User,
  LayoutGrid,
  FileText
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: contracts, isLoading: contractsLoading } = useContracts();
  const { data: notifications } = useNotifications();
  const [isAvailable, setIsAvailable] = React.useState(() => {
    return localStorage.getItem('freelancer_available') !== 'false';
  });

  const toggleAvailability = () => {
    const newValue = !isAvailable;
    setIsAvailable(newValue);
    localStorage.setItem('freelancer_available', String(newValue));
  };

  const completedContracts = contracts?.filter(c => c.status === 'Completed').length || 0;
  const totalContracts = contracts?.length || 0;
  const successScore = totalContracts > 0 ? Math.round((completedContracts / totalContracts) * 100) : 100;

  const quickActions = [
    { label: 'Find Jobs', icon: Briefcase, href: '/jobs', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'My Bids', icon: FileText, href: '/applications', color: 'bg-blue-50 text-blue-600' },
    { label: 'Messages', icon: MessageSquare, href: '/messages', color: 'bg-purple-50 text-purple-600' },
    { label: 'My Profile', icon: User, href: '/profile', color: 'bg-kefit-primary/10 text-kefit-primary' },
  ];

  const stats = [
    { label: 'Active Proposals', value: '12', icon: Briefcase, color: 'text-kefit-primary', bg: 'bg-kefit-primary/10', trend: '+2 this week' },
    { label: 'Active Projects', value: contracts?.filter(c => c.status === 'Active').length || '0', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: 'Ongoing' },
    { label: 'Profile Views', value: '854', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+15% boost' },
    { label: 'Total Earnings', value: '45,200', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-50', trend: 'Pending: 12k' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        {/* Quick Actions Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {quickActions.map((action) => (
             <Link key={action.label} to={action.href}>
               <motion.div 
                 whileHover={{ y: -4, scale: 1.02 }}
                 className="card-geometric p-6 bg-white border-slate-200 flex items-center gap-4 hover:border-kefit-primary transition-all shadow-sm"
               >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", action.color)}>
                     <action.icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                     <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{action.label}</p>
                     <p className="text-[10px] text-slate-400 font-bold truncate">Quick Access</p>
                  </div>
               </motion.div>
             </Link>
           ))}
        </section>

        {/* Hero Section */}
        <header className="bg-slate-950 p-8 lg:p-12 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="relative z-10 space-y-4 max-w-xl">
              <button 
                onClick={toggleAvailability}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full w-fit border transition-all",
                  isAvailable 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full", isAvailable ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isAvailable ? 'Available for hire' : 'Away / Busy'}
                </span>
              </button>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
                Good evening, <span className="text-kefit-primary">{user?.name.split(' ')[0]}!</span>
              </h1>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                You have <span className="text-white font-bold">4 new job invitations</span> and 2 milestone payments pending release.
              </p>
              <div className="flex gap-4 pt-2">
                <Link to="/jobs">
                  <Button className="bg-kefit-primary hover:bg-kefit-primary/90 text-white font-black h-12 px-8 uppercase tracking-widest text-[11px] rounded-xl">
                    Explore New Jobs
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" className="text-white hover:bg-white/10 font-bold">
                    Edit Profile
                  </Button>
                </Link>
              </div>
           </div>

           <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="card-geometric p-6 bg-white/5 backdrop-blur-xl border-white/10 text-white w-full sm:w-48">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Job Success</p>
                 <div className="flex items-end gap-2">
                    <p className="text-3xl font-black">{successScore}%</p>
                    <ArrowUpRight className="w-5 h-5 text-emerald-400 mb-1" />
                 </div>
              </div>
              <div className="card-geometric p-6 bg-white/5 backdrop-blur-xl border-white/10 text-white w-full sm:w-48">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Hours</p>
                 <div className="flex items-end gap-2">
                    <p className="text-3xl font-black">1,240</p>
                    <Clock className="w-5 h-5 text-kefit-primary mb-1" />
                 </div>
              </div>
           </div>

           {/* Decorative Background */}
           <div className="absolute top-0 right-0 w-full h-full -z-0">
             <div className="absolute top-0 right-0 w-96 h-96 bg-kefit-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
           </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-geometric p-6 bg-white border-slate-200 hover:border-kefit-primary transition-all group"
            >
              <div className={cn("p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h3>
                {stat.label.includes('Earnings') && <span className="text-xs font-bold text-slate-400">ETB</span>}
              </div>
              <p className="mt-3 text-[10px] font-black text-kefit-primary uppercase tracking-wider bg-kefit-primary/5 w-fit px-2 py-0.5 rounded-md">
                {stat.trend}
              </p>
            </motion.div>
          ))}
        </section>

        <div className="grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Active Contracts / Projects */}
            <section className="card-geometric overflow-hidden border-slate-200">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-3">
                  <LayoutGrid className="w-6 h-6 text-kefit-primary" />
                  Ongoing Projects
                </h2>
                <Link to="/freelancer/contracts" className="text-sm font-black text-kefit-primary hover:underline">View All Projects</Link>
              </div>
              
              <div className="divide-y divide-slate-100">
                {contractsLoading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-32 m-6" />)
                ) : contracts?.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                      <Zap className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-bold">No active projects at the moment.</p>
                    <Link to="/jobs">
                      <Button variant="outline" size="sm">Find Work</Button>
                    </Link>
                  </div>
                ) : (
                  contracts?.slice(0, 3).map((contract) => (
                    <div key={contract.id} className="p-8 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-center justify-between gap-6 group">
                      <div className="flex gap-5 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-kefit-primary/5 text-kefit-primary flex items-center justify-center shrink-0 border border-kefit-primary/10">
                           <Briefcase className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-kefit-primary transition-colors">{contract.jobTitle}</h4>
                          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Client: {contract.clientName || 'Anonymous'}</span>
                            <span className="text-slate-300">•</span>
                            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-lg border border-emerald-100 uppercase text-[9px] tracking-widest font-black">
                              {contract.status}
                            </span>
                          </div>
                          <div className="pt-2">
                             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[200px]">
                                <div className="h-full w-[65%] bg-emerald-500 rounded-full" />
                             </div>
                             <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">65% Progress</p>
                          </div>
                        </div>
                      </div>
                      <Link to={`/freelancer/contracts/${contract.id}`}>
                        <Button variant="outline" size="sm" className="font-bold border-slate-200">Manage Project</Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Recommended Jobs */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-3">
                  <Star className="w-6 h-6 text-orange-500" />
                  Recommended for You
                </h2>
                <Link to="/jobs" className="text-sm font-black text-kefit-primary hover:underline">See All Openings</Link>
              </div>

              {jobsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs?.slice(0, 4).map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Recent Activity */}
            <section className="card-geometric p-8 bg-white border-slate-200">
               <h3 className="text-lg font-black text-slate-950 mb-6">Recent Activity</h3>
               <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {notifications?.slice(0, 5).map((notif, i) => (
                   <div key={i} className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shrink-0">
                      <div className="w-2 bg-kefit-primary h-2 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">{notif.message}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                   </div>
                ))}
               </div>
               <Link to="/notifications" className="block text-center text-xs font-black text-kefit-primary uppercase tracking-widest mt-8 hover:underline">
                  View All Activity
               </Link>
            </section>

            {/* Earnings Breakdown Wrap */}
            <section className="card-geometric p-8 bg-emerald-950 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-kefit-primary" />
                    Earnings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span className="font-medium">Available Now</span>
                      <span className="text-white font-black">12,400 ETB</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span className="font-medium">In Escrow</span>
                      <span className="text-white font-black">28,500 ETB</span>
                    </div>
                    <div className="h-px bg-white/10 my-4" />
                    <Link to="/freelancer/earnings">
                      <Button className="w-full bg-kefit-primary hover:bg-kefit-primary/90 text-white font-black">
                        Withdraw Funds
                      </Button>
                    </Link>
                  </div>
               </div>
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-kefit-primary/20 blur-[60px] translate-x-1/2 -translate-y-1/2" />
            </section>

            {/* Direct Messages Shortcut */}
            <section className="card-geometric p-8 border-slate-200">
               <h3 className="font-black text-slate-950 mb-6 flex items-center justify-between">
                  Messages
                  <MessageSquare className="w-5 h-5 text-kefit-primary" />
               </h3>
               <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                       <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate tracking-tight">Software Entity</p>
                          <p className="text-xs text-slate-500 truncate font-medium">I have reviewed your proposal...</p>
                       </div>
                    </div>
                  ))}
               </div>
               <Link to="/messages">
                  <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest mt-4">Open Inbox</Button>
               </Link>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};
