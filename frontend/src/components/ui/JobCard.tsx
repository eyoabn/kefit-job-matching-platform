import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Clock, MapPin, ChevronRight, Users, ShieldCheck, Zap, Bookmark, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: Job;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ job, className }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    setIsBookmarked(bookmarks.includes(job.id));
  }, [job.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const bookmarks = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: string) => id !== job.id);
    } else {
      newBookmarks = [...bookmarks, job.id];
    }
    localStorage.setItem('saved_jobs', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'card-geometric p-8 bg-white border-slate-200 hover:border-kefit-primary hover:shadow-xl cursor-pointer group relative overflow-hidden transition-all',
        className
      )}
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      {/* Top Banner for Premium Jobs */}
      {job.budget > 15000 && (
        <div className="absolute top-0 right-0">
          <div className="bg-kefit-primary text-white text-[8px] font-black uppercase tracking-[0.2em] py-1 px-8 translate-x-[30%] translate-y-[50%] rotate-45 shadow-sm">
             Premium
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-kefit-primary transition-colors">
              {job.title}
            </h3>
            <button 
              onClick={toggleBookmark}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                isBookmarked ? "text-kefit-primary bg-kefit-primary/10" : "text-slate-300 hover:text-slate-500 hover:bg-slate-50"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Addis Ababa</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 uppercase tracking-widest text-[9px] font-black text-kefit-primary bg-kefit-primary/5 px-2 py-0.5 rounded-md">
               <Zap className="w-3 h-3" /> Urgent
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p className="text-xl font-black text-slate-950 leading-none">{job.budget.toLocaleString()}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETB Budget</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
         <div className="flex text-orange-400">
            {[1,2,3,4].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
            <Star className="w-3 h-3 text-slate-200 fill-current" />
         </div>
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.8 (12 Reviews)</span>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-8 font-medium">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {job.skills?.slice(0, 4).map(skill => (
          <span key={skill} className="px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:border-kefit-primary/20 transition-all">
            {skill}
          </span>
        ))}
        {job.skills && job.skills.length > 4 && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest self-center ml-1">+{job.skills.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fixed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{job.bidCount || 0} PROPOSALS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verified</span>
          </div>
        </div>
        
        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};
