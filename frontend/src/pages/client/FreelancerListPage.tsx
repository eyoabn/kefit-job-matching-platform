import React, { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  MapPin, 
  Star, 
  ChevronRight, 
  Filter,
  User,
  ShieldCheck,
  Zap,
  Globe,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const FreelancerListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const freelancers = [
    {
      id: '1',
      name: 'Yared Hagos',
      title: 'Full-Stack Developer',
      location: 'Addis Ababa',
      rating: 4.9,
      reviews: 42,
      hourlyRate: '1,200',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      verified: true,
      bio: 'Over 8 years of experience building scalable web applications for Ethiopian fintechs.',
    },
    {
      id: '2',
      name: 'Selamawit Tadesse',
      title: 'UI/UX Designer',
      location: 'Remote (Bahir Dar)',
      rating: 5.0,
      reviews: 28,
      hourlyRate: '950',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      verified: true,
      bio: 'Passionate about creating intuitive user experiences that bridge cultural gaps.',
    },
    {
      id: '3',
      name: 'Brook Solomon',
      title: 'Digital Marketing Expert',
      location: 'Addis Ababa',
      rating: 4.7,
      reviews: 15,
      hourlyRate: '800',
      skills: ['SEO', 'Google Ads', 'Content Strategy', 'Social Media'],
      verified: false,
      bio: 'Helping local businesses grow their online presence through data-driven marketing.',
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">Find Top Talent</h1>
          <p className="text-slate-500 mt-1 font-medium">Connect with Ethiopia's most skilled professionals.</p>
        </header>

        {/* Search & Filter Bar (Prominent) */}
        <section className="card-geometric p-6 bg-slate-900 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-4 relative z-10">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-kefit-primary" />
              <input 
                type="text" 
                placeholder="Search by name, title, or skills..." 
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-kefit-primary/50 font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <select className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-slate-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-kefit-primary/50 transition-all">
                  <option className="bg-slate-900">All Categories</option>
                  <option className="bg-slate-900">Technology</option>
                  <option className="bg-slate-900">Design</option>
                  <option className="bg-slate-900">Marketing</option>
               </select>
               <select className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-slate-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-kefit-primary/50 transition-all">
                  <option className="bg-slate-900">Location (Any)</option>
                  <option className="bg-slate-900">Addis Ababa</option>
                  <option className="bg-slate-900">Remote</option>
               </select>
               <Button className="h-14 px-8 bg-kefit-primary hover:bg-kefit-primary/90 font-black">
                  Search Talent
               </Button>
            </div>
          </div>
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-kefit-primary/10 blur-[100px] -z-0 translate-x-1/2 -translate-y-1/2" />
        </section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6 hidden lg:block">
            <FilterSection title="Availability">
               <FilterOption label="Full-time" />
               <FilterOption label="Contractual" checked />
               <FilterOption label="Hourly" />
            </FilterSection>
            
            <FilterSection title="Rating">
               <FilterOption label="4.5 & up" checked />
               <FilterOption label="4.0 & up" />
               <FilterOption label="3.0 & up" />
            </FilterSection>

            <FilterSection title="Hourly Rate (ETB)">
               <div className="space-y-4 pt-2">
                 <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-kefit-primary" />
                 <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                   <span>Any</span>
                   <span>2,000+ ETB</span>
                 </div>
               </div>
            </FilterSection>
          </aside>

          {/* Main List */}
          <div className="lg:col-span-3 space-y-6">
            {freelancers.map((f, i) => (
              <motion.div 
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-geometric p-8 hover:border-kefit-primary transition-all group relative overflow-hidden bg-white"
              >
                <div className="flex flex-col md:flex-row gap-8">
                   <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-2xl group-hover:bg-kefit-primary/5 transition-colors">
                        {f.name.substring(0, 2).toUpperCase()}
                      </div>
                      {f.verified && (
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                           <ShieldCheck className="w-6 h-6 text-blue-500 fill-current" />
                        </div>
                      )}
                   </div>
                   
                   <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-kefit-primary transition-colors">{f.name}</h3>
                           <div className="text-right">
                              <p className="text-2xl font-black text-slate-950">{f.hourlyRate} <span className="text-xs font-bold text-slate-500">ETB/hr</span></p>
                           </div>
                        </div>
                        <p className="text-kefit-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2">{f.title}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                           <span className="flex items-center gap-1">
                             <MapPin className="w-3.5 h-3.5" />
                             {f.location}
                           </span>
                           <span className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
                             <Star className="w-3.5 h-3.5 fill-current" />
                             {f.rating} ({f.reviews} reviews)
                           </span>
                           <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Top Rated
                           </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {f.bio}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {f.skills.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100 group-hover:border-kefit-primary/20 transition-all">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold tracking-tight">Active recently</span>
                         </div>
                         <div className="flex gap-2">
                            <Button variant="ghost" className="font-black text-slate-500 hover:text-kefit-primary">View Profile</Button>
                            <Button className="bg-slate-950 font-black shadow-lg shadow-slate-950/10">Hire Now</Button>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="card-geometric p-6 bg-white">
     <h4 className="font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 uppercase tracking-widest text-[10px]">{title}</h4>
     <div className="space-y-3">
        {children}
     </div>
  </div>
);

const FilterOption = ({ label, checked = false }: { label: string; checked?: boolean }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
     <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-kefit-primary focus:ring-kefit-primary bg-slate-50" defaultChecked={checked} />
     <span className="text-sm font-bold text-slate-600 group-hover:text-slate-950 transition-colors">{label}</span>
  </label>
);
