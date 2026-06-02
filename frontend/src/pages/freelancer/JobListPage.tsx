import React, { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { JobCard } from '@/components/ui/JobCard';
import { 
  Search, 
  SlidersHorizontal, 
  Loader2, 
  Briefcase, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Star,
  ChevronDown,
  Filter,
  Bookmark
} from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const JobListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [filters, setFilters] = useState<{ status?: string; category?: string; min_budget?: number; max_budget?: number }>({});
  const { data: jobs, isLoading, error } = useJobs(filters);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, category }));
  };

  const trendingSkills = ['React', 'TypeScript', 'Node.js', 'Figma', 'Python', 'Tailwind', 'AI', 'Marketing'];

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = !selectedSkill || job.skills?.includes(selectedSkill);
    
    const bookmarks = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    const isBookmarked = bookmarks.includes(job.id);
    const matchesSaved = !showSavedOnly || isBookmarked;

    return matchesSearch && matchesSkill && matchesSaved;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-kefit-primary shadow-xl">
                  <Briefcase className="w-6 h-6" />
               </div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Marketplace</h1>
            </div>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
               Discover over <span className="text-kefit-primary font-black">2,400+ active projects</span> in Ethiopia's leading workforce platform.
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Market is Busy</span>
             </div>
          </div>
        </header>

        {/* Global Search Section */}
        <section className="bg-slate-950 p-6 lg:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1 group/search">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 transition-colors group-focus-within/search:text-kefit-primary" />
                 <input 
                   type="text" 
                   placeholder="Search by job title, skills, or keywords..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full h-16 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-kefit-primary/20 transition-all font-bold text-lg"
                 />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
<div className="relative">
                     <select
                       value={category}
                       onChange={(e) => setCategory(e.target.value)}
                       className="h-16 px-8 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-black text-slate-300 hover:bg-white/10 transition-all focus:outline-none appearance-none pr-14 cursor-pointer"
                     >
                       <option value="" className="bg-slate-900">All Categories</option>
                       <option value="technology" className="bg-slate-900">Technology</option>
                       <option value="design" className="bg-slate-900">Design</option>
                       <option value="marketing" className="bg-slate-900">Marketing</option>
                     </select>
                     <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                  </div>
                 
                 <div className="relative">
                    <select className="h-16 px-8 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-black text-slate-300 hover:bg-white/10 transition-all focus:outline-none appearance-none pr-14 cursor-pointer">
                      <option className="bg-slate-900">Location (Any)</option>
                      <option className="bg-slate-900">Addis Ababa</option>
                      <option className="bg-slate-900">Remote</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                 </div>

<Button onClick={handleSearch} className="h-16 px-10 bg-kefit-primary hover:bg-kefit-primary/90 text-white font-black rounded-[2rem] shadow-lg shadow-kefit-primary/20 flex items-center gap-3">
                     Search Jobs
                  </Button>
              </div>
           </div>

           {/* Animated Background Orbs */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-kefit-primary/10 blur-[100px] -z-0 translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[80px] -z-0 -translate-x-1/2 translate-y-1/2" />
        </section>

        {/* Skills & Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
             <Filter className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filter by Skills</span>
          </div>
          {trendingSkills.map(skill => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm",
                selectedSkill === skill 
                  ? "bg-slate-950 text-white border-slate-950 scale-105" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-kefit-primary hover:text-kefit-primary"
              )}
            >
              {skill}
            </button>
          ))}
          
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ml-auto",
              showSavedOnly 
                ? "bg-kefit-primary text-white border-kefit-primary" 
                : "bg-white text-slate-600 border-slate-200 hover:border-kefit-primary"
            )}
          >
            <Bookmark className={cn("w-3.5 h-3.5", showSavedOnly && "fill-current")} />
            {showSavedOnly ? 'Showing Saved' : 'Show Saved Only'}
          </button>
          {selectedSkill && (
            <button 
              onClick={() => setSelectedSkill(null)}
              className="text-[10px] font-black text-red-500 hover:underline px-4 uppercase tracking-widest"
            >
              Reset
            </button>
          )}
        </div>

        {/* Main Jobs Listing */}
        <div className="grid lg:grid-cols-12 gap-10">
           {/* Sidebar Filters */}
           <aside className="lg:col-span-3 space-y-8 hidden lg:block">
              <FilterGroup title="Budget (ETB)">
                 <div className="space-y-4">
                    <input 
                      type="range" 
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-kefit-primary" 
                    />
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Any</span>
                       <span>50,000+</span>
                    </div>
                 </div>
              </FilterGroup>

              <FilterGroup title="Job Type">
                 <FilterCheckbox label="Fixed Price" checked />
                 <FilterCheckbox label="Hourly Rate" />
                 <FilterCheckbox label="Milestone Based" />
              </FilterGroup>

              <FilterGroup title="Experience Level">
                 <FilterCheckbox label="Entry Level" />
                 <FilterCheckbox label="Intermediate" checked />
                 <FilterCheckbox label="Expert" />
              </FilterGroup>

              <FilterGroup title="Client History">
                 <FilterCheckbox label="Verified Payment" />
                 <FilterCheckbox label="Previous Client" />
                 <FilterCheckbox label="High Rating" />
              </FilterGroup>

              <div className="card-geometric p-6 bg-kefit-primary/5 border-dashed border-kefit-primary/20 text-center space-y-4">
                 <Zap className="w-8 h-8 text-kefit-primary mx-auto" />
                 <h4 className="font-black text-slate-950 text-sm">Save this Search</h4>
                 <p className="text-xs text-slate-500 font-medium">Get notified when new jobs match these filters.</p>
                 <Button variant="ghost" size="sm" className="w-full bg-white font-black text-[10px]">Enable Alerts</Button>
              </div>
           </aside>

           {/* Jobs Feed */}
           <div className="lg:col-span-9">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)}
                </div>
              ) : error ? (
                <div className="p-20 text-center bg-red-50 rounded-[3rem] border border-red-100 flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-red-500 shadow-xl">
                      <Zap className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-red-950">System Connection Error</h3>
                    <p className="text-red-700/70 font-medium">We couldn't fetch the marketplace feed. Please try again.</p>
                  </div>
                  <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white font-black">
                    Retry Connection
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                      {filteredJobs && filteredJobs.length > 0 ? (
                        filteredJobs.map((job, i) => (
                          <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                          >
                             <JobCard job={job} />
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full py-40 text-center flex flex-col items-center gap-6">
                          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                             <Search className="w-12 h-12" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900">No results found</h3>
                            <p className="text-slate-500 font-medium">Try broadening your search criteria or skill filters.</p>
                          </div>
                          <Button variant="ghost" onClick={() => { setSearchTerm(''); setSelectedSkill(null); }} className="font-black text-kefit-primary">
                            Clear all filters
                          </Button>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {filteredJobs && filteredJobs.length > 0 && (
                    <div className="flex justify-center pt-10">
                       <Button variant="outline" className="h-14 px-12 border-slate-200 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-50">
                          Load More Opportunities
                       </Button>
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="card-geometric p-8 bg-white border-slate-100">
     <h4 className="font-black text-slate-950 uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center justify-between">
        {title}
        <ChevronDown className="w-4 h-4 text-slate-300" />
     </h4>
     <div className="space-y-4">
        {children}
     </div>
  </div>
);

const FilterCheckbox = ({ label, checked = false }: { label: string; checked?: boolean }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
     <div className={cn(
       "w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center shrink-0",
       checked ? "bg-kefit-primary border-kefit-primary" : "bg-white border-slate-200 group-hover:border-kefit-primary/50"
     )}>
        {checked && <Zap className="w-3 h-3 text-white fill-current" />}
     </div>
     <span className={cn(
       "text-sm font-bold transition-colors",
       checked ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"
     )}>{label}</span>
  </label>
);
