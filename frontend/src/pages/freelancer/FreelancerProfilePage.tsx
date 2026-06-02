import React, { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { 
  User, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Briefcase, 
  Award, 
  Star, 
  Camera,
  Edit2,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const FreelancerProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const skills = ['React', 'TypeScript', 'Node.js', 'Figma', 'GraphQL', 'PostgreSQL', 'Tailwind CSS', 'AWS'];
  
  const portfolioItems = [
    { id: '1', title: 'Fintech Dashboard', category: 'Web App', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { id: '2', title: 'Delivery App UI', category: 'Mobile', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800' },
    { id: '3', title: 'Eco-Commerce Site', category: 'E-commerce', image: 'https://images.unsplash.com/photo-1523474253046-2cd2c78b661e?auto=format&fit=crop&q=80&w=800' },
  ];

  const experience = [
    { company: 'Gebeya Inc.', role: 'Senior Developer', period: '2022 - Present', desc: 'Leading the front-end architecture for multi-tenant SaaS platforms across Africa.' },
    { company: 'EagleLion IT', role: 'Full Stack Engineer', period: '2020 - 2022', desc: 'Developed core banking modules and internal ERP systems for local enterprises.' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        {/* Profile Header Card */}
        <section className="card-geometric bg-white overflow-hidden border-slate-200">
           <div className="h-48 bg-slate-950 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-kefit-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] translate-y-1/2 -translate-x-1/2 rounded-full" />
              <button className="absolute bottom-6 right-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                <Camera className="w-4 h-4" /> Change Cover
              </button>
           </div>
           
           <div className="px-8 pb-10 relative">
              <div className="flex flex-col md:flex-row items-end gap-8 -mt-16 relative z-10 mb-8">
                 <div className="relative group">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-white border-[6px] border-white shadow-2xl flex items-center justify-center overflow-hidden">
                       <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 font-black text-4xl">
                          {user?.name.substring(0, 2).toUpperCase()}
                       </div>
                    </div>
                    <button className="absolute bottom-2 right-2 bg-kefit-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white">
                       <Camera className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <div className="flex-1 space-y-2 mb-2">
                    <div className="flex items-center gap-3">
                       <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{user?.name}</h1>
                       <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5 shadow-sm">
                          <ShieldCheck className="w-4 h-4 fill-current" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Verified Expert</span>
                       </div>
                    </div>
                    <p className="text-xl font-bold text-slate-500 flex items-center gap-3">
                       Full-Stack Developer & UI Architect
                       <span className="text-slate-300">•</span>
                       <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Addis Ababa, Ethiopia</span>
                    </p>
                 </div>

                 <div className="flex gap-3 mb-2">
                    <Button 
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? 'outline' : 'default'}
                      className={cn(
                        "h-12 px-8 font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg",
                        !isEditing && "bg-slate-950 hover:bg-slate-900"
                      )}
                    >
                       {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                    <Link to="/profile/preview">
                      <Button variant="outline" className="h-12 px-6 font-bold border-slate-200">
                        <Globe className="w-4 h-4" />
                      </Button>
                    </Link>
                 </div>
              </div>

              <div className="grid lg:grid-cols-4 gap-12 pt-4 border-t border-slate-100">
                 <div className="lg:col-span-1 space-y-8">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Info</p>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                             <Mail className="w-4 h-4 text-slate-400" /> {user?.email}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                             <Phone className="w-4 h-4 text-slate-400" /> +251 911 223 344
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Online Presence</p>
                       <div className="flex gap-4">
                          {[Globe, Github, Linkedin].map((Icon, i) => (
                             <button key={i} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-kefit-primary hover:border-kefit-primary/30 transition-all hover:-translate-y-1">
                                <Icon className="w-5 h-5" />
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="card-geometric p-6 bg-slate-50 border-transparent">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Availability</p>
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-black text-slate-900">Work Status</span>
                          <div className="w-12 h-6 bg-kefit-primary/20 rounded-full relative p-1 cursor-pointer">
                             <div className="absolute right-1 top-1 w-4 h-4 bg-kefit-primary rounded-full shadow-sm" />
                          </div>
                       </div>
                       <p className="text-xs font-bold text-slate-500 leading-relaxed">Currently open to short-term and contract projects.</p>
                    </div>
                 </div>

                 <div className="lg:col-span-3 space-y-12">
                    <div className="space-y-4">
                       <h3 className="text-xl font-black text-slate-950 flex items-center justify-between">
                          Professional Bio
                          {isEditing && <Edit2 className="w-4 h-4 text-kefit-primary cursor-pointer" />}
                       </h3>
                       <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
                          Specializing in building performance-driven web applications with modern technologies. 
                          Deep expertise in the Ethiopian fintech ecosystem, having worked with major banks to 
                          digitize customer onboarding and transaction processing workflows.
                       </p>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-xl font-black text-slate-950">Expertise & Skills</h3>
                       <div className="flex flex-wrap gap-2">
                          {skills.map(s => (
                             <span key={s} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-xl hover:border-kefit-primary transition-colors cursor-default">
                                {s}
                             </span>
                          ))}
                          {isEditing && (
                             <button className="px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase rounded-xl flex items-center gap-2 hover:border-kefit-primary hover:text-kefit-primary transition-all">
                                <Plus className="w-3.5 h-3.5" /> Add Skill
                             </button>
                          )}
                       </div>
                    </div>

                    <div className="space-y-8">
                       <h3 className="text-xl font-black text-slate-950 flex items-center justify-between">
                          Experience
                          <button className="text-[10px] font-black uppercase tracking-widest text-kefit-primary hover:underline">Add History</button>
                       </h3>
                       <div className="space-y-8">
                          {experience.map((exp, i) => (
                             <div key={i} className="flex gap-6 items-start group">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-kefit-primary/10 transition-colors">
                                   <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-kefit-primary transition-colors" />
                                </div>
                                <div className="space-y-1 flex-1">
                                   <div className="flex justify-between items-start">
                                      <h4 className="font-black text-slate-900 text-lg tracking-tight">{exp.role}</h4>
                                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{exp.period}</span>
                                   </div>
                                   <p className="text-kefit-primary font-black text-[10px] uppercase tracking-widest">{exp.company}</p>
                                   <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl mt-2">{exp.desc}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Portfolio Section */}
        <section className="space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950">Visual Portfolio</h2>
              <Button size="sm" className="bg-slate-950 font-black flex items-center gap-2 h-11 px-6 rounded-xl">
                 <Plus className="w-4 h-4" /> New Project
              </Button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, i) => (
                 <motion.div 
                   key={item.id}
                   whileHover={{ y: -10 }}
                   className="card-geometric bg-white overflow-hidden border-slate-200 group cursor-pointer"
                 >
                    <div className="h-64 overflow-hidden relative">
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="ghost" className="text-white border-white/20 font-black h-12 rounded-xl bg-white/10 backdrop-blur-md">View Case Study</Button>
                       </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                       <div>
                          <h4 className="font-black text-slate-900 tracking-tight group-hover:text-kefit-primary transition-colors">{item.title}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{item.category}</p>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-kefit-primary group-hover:text-white transition-all">
                          <ExternalLink className="w-4 h-4" />
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </section>

        {/* Testimonials Mockup */}
        <section className="card-geometric p-10 bg-slate-50 border-transparent overflow-hidden relative">
           <div className="relative z-10 space-y-1">
              <h2 className="text-2xl font-black text-slate-950">Client Love</h2>
              <p className="text-slate-500 font-medium">Voices from the businesses I've helped grow.</p>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8 mt-10 relative z-10">
              {[1, 2].map(i => (
                 <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                    <div className="flex gap-1 mb-4 text-orange-400">
                       {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed italic mb-6">
                       "Working with {user?.name.split(' ')[0]} was a game changer for our delivery hub. 
                       The efficiency metrics improved by 40% immediately after the new dashboard launch."
                    </p>
                    <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                       <div className="w-12 h-12 rounded-xl bg-slate-100" />
                       <div>
                          <p className="font-black text-slate-900">Dawit Solomon</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CTO, ZayRide Ethiopia</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>

           {/* Large Decorative Accent */}
           <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
              <Zap className="w-96 h-96 text-kefit-primary" />
           </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

