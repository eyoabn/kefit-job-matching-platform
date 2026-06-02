import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { 
  HelpCircle, 
  MessageSquare, 
  LifeBuoy, 
  BookOpen, 
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  Send,
  ExternalLink,
  Mail,
  Zap
} from 'lucide-react';

export const SupportPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col items-center text-center space-y-4">
           <div className="w-16 h-16 rounded-3xl bg-kefit-primary/10 flex items-center justify-center text-kefit-primary shadow-inner">
             <LifeBuoy className="w-10 h-10" />
           </div>
           <div className="max-w-2xl">
            <h1 className="text-4xl font-black text-slate-950 tracking-tight">How can we help?</h1>
            <p className="text-xl text-slate-500 font-medium mt-2">Access Kefit support, explore our knowledge base, or contact our team directly.</p>
           </div>
        </header>

        <section className="grid md:grid-cols-3 gap-8">
           <SupportCard 
            icon={HelpCircle} 
            title="Help Center" 
            desc="Detailed guides on posting jobs, hiring, and system features." 
            color="bg-kefit-primary"
           />
           <SupportCard 
            icon={BookOpen} 
            title="Knowledge Base" 
            desc="Legal terms, security best practices, and platform guidelines." 
            color="bg-emerald-500"
           />
           <SupportCard 
            icon={ShieldAlert} 
            title="Dispute Resolution" 
            desc="Mediation services for contract disagreements or payment issues." 
            color="bg-blue-500"
           />
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 card-geometric p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-950 tracking-tight">Open a Support Ticket</h2>
                <p className="text-slate-500 mt-1 font-medium">Briefly describe your issue and our team will get back to you within 24 hours.</p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <Input label="Your Name" value="Abebe Kebede" disabled className="bg-slate-50 font-bold" />
                   <Select 
                    label="Issue Category" 
                    options={[
                      { label: 'General Inquiry', value: 'general' },
                      { label: 'Technical Issue', value: 'tech' },
                      { label: 'Billing & Payments', value: 'billing' },
                      { label: 'Security & Abuse', value: 'security' },
                      { label: 'Dispute', value: 'dispute' },
                    ]}
                   />
                </div>
                <Input label="Subject Line" placeholder="e.g. Issue releasing milestone payment" />
                <TextArea label="Detailed Description" placeholder="Please provide as much detail as possible, including job or contract IDs if applicable..." rows={6} />
                
                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                     <Zap className="w-4 h-4 text-kefit-primary" />
                     Estimated response: 4h 25m
                   </div>
                   <Button leftIcon={<Send className="w-4 h-4" />}>Submit Ticket</Button>
                </div>
              </form>
           </div>

           <div className="space-y-8">
              <div className="card-geometric p-8 bg-slate-900 text-white">
                 <h3 className="text-xl font-black mb-4">Direct Contact</h3>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="p-3 rounded-xl bg-white/10 text-kefit-primary">
                          <Mail className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Support</p>
                          <p className="font-bold">support@kefit.et</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="p-3 rounded-xl bg-white/10 text-blue-400">
                          <MessageSquare className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Chat</p>
                          <p className="font-bold">Available 8 AM - 6 PM EAT</p>
                       </div>
                    </div>
                    <Button className="w-full bg-kefit-primary hover:bg-white hover:text-kefit-primary transition-all font-black mt-4">
                       Start Live Chat
                    </Button>
                 </div>
              </div>

              <div className="card-geometric p-8 bg-kefit-primary/5 border border-kefit-primary/10">
                 <h3 className="font-black text-slate-950 mb-3">Community Hub</h3>
                 <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Join the Kefit user community to share tips and interact with other business owners in Ethiopia.
                 </p>
                 <a href="#" className="flex items-center justify-between text-sm font-black text-kefit-primary group">
                    Visit Community <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </a>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const SupportCard = ({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) => (
  <div className="card-geometric p-8 group hover:border-kefit-primary transition-all cursor-pointer bg-white">
     <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-110", color)}>
        <Icon className="w-6 h-6" />
     </div>
     <h3 className="text-lg font-black text-slate-950 mb-2 group-hover:text-kefit-primary transition-colors">{title}</h3>
     <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">{desc}</p>
     <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
        Read More <ChevronRight className="w-4 h-4" />
     </div>
  </div>
);
