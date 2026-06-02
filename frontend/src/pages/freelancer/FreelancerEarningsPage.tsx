import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download,
  Filter,
  Wallet,
  Landmark,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const FreelancerEarningsPage = () => {
  const transactions = [
    { id: '1', date: 'May 20, 2026', type: 'Milestone Release', source: 'Safaricom Project', amount: '+12,400', status: 'Completed' },
    { id: '2', date: 'May 18, 2026', type: 'Withdrawal', source: 'CBE Bank Transfer', amount: '-15,000', status: 'Processing' },
    { id: '3', date: 'May 15, 2026', type: 'Bonus', source: 'Client Appreciated Fast Work', amount: '+2,000', status: 'Completed' },
    { id: '4', date: 'May 12, 2026', type: 'Milestone Release', source: 'Telebirr UI Overhaul', amount: '+8,500', status: 'Completed' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-kefit-primary" />
              Earnings & Finance
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Track your income, pending payments, and withdrawal history.</p>
          </div>
          <Button className="bg-kefit-primary hover:bg-kefit-primary/90 font-black h-12 px-8 flex items-center gap-2 rounded-xl group transition-all">
            <Wallet className="w-4 h-4 transition-transform group-hover:scale-110" />
            Withdraw ETB
          </Button>
        </header>

        {/* Financial Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="card-geometric p-8 bg-slate-950 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Available Balance</p>
                 <h3 className="text-4xl font-black">12,400 <span className="text-sm font-bold text-slate-400">ETB</span></h3>
                 <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold pt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Ready for withdrawal</span>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-kefit-primary/20 blur-[60px] -translate-y-1/2 translate-x-1/2" />
           </div>

           <div className="card-geometric p-8 bg-white border-slate-200">
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pending Release</p>
                 <h3 className="text-4xl font-black text-slate-900">28,500 <span className="text-sm font-bold text-slate-400">ETB</span></h3>
                 <div className="flex items-center gap-2 text-slate-400 text-xs font-bold pt-2">
                    <Clock className="w-4 h-4" />
                    <span>Est. payout in 5-7 days</span>
                 </div>
              </div>
           </div>

           <div className="card-geometric p-8 bg-white border-slate-200">
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total Lifetime</p>
                 <h3 className="text-4xl font-black text-slate-900">145,200 <span className="text-sm font-bold text-slate-400">ETB</span></h3>
                 <div className="flex items-center gap-2 text-kefit-primary text-xs font-bold pt-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Top Earner Badge</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Charts Mockup (Visual only) */}
        <section className="card-geometric p-8 bg-white border-slate-200 h-64 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="flex items-center gap-4 text-slate-300 relative z-10">
              <BarChart3 className="w-12 h-12" />
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-slate-950">Earnings Visibility Coming Soon</h3>
                 <p className="text-slate-500 font-medium">We are currently integrating deeper analytics for your performance.</p>
              </div>
           </div>
           {/* Visual decoration */}
           <div className="absolute inset-0 flex items-end gap-2 px-8 opacity-5 -z-0">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 40, 60, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-kefit-primary rounded-t-lg" style={{ height: `${h}%` }} />
              ))}
           </div>
        </section>

        {/* Transaction History */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
              <div className="flex gap-2">
                 <Button variant="ghost" size="sm" className="font-bold gap-2"><Filter className="w-4 h-4" /> Filter</Button>
                 <Button variant="ghost" size="sm" className="font-bold gap-2"><Download className="w-4 h-4" /> Statement</Button>
              </div>
           </div>

           <div className="card-geometric overflow-hidden border-slate-200 bg-white">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type / Source</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                       <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6 text-sm font-bold text-slate-500">{tx.date}</td>
                          <td className="px-8 py-6">
                             <div>
                                <p className="text-sm font-black text-slate-900 group-hover:text-kefit-primary transition-colors">{tx.type}</p>
                                <p className="text-xs text-slate-400 font-medium">{tx.source}</p>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                tx.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                             )}>
                                {tx.status}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className={cn(
                                "text-lg font-black tracking-tight",
                                tx.amount.startsWith('+') ? "text-emerald-500" : "text-slate-900"
                             )}>
                                {tx.amount} <span className="text-xs">ETB</span>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Payoneer/Bank Connect Section */}
           <div className="grid md:grid-cols-2 gap-6 pt-6">
              <div className="card-geometric p-8 flex items-center justify-between border-slate-200 hover:border-kefit-primary transition-all cursor-pointer group">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-kefit-primary group-hover:text-white transition-all">
                       <Landmark className="w-8 h-8" />
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900">Commercial Bank (CBE)</h4>
                       <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Primary Withdrawal Method</p>
                    </div>
                 </div>
                 <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Connected</div>
              </div>

              <div className="card-geometric p-8 flex items-center justify-between border-slate-200 hover:border-kefit-primary transition-all border-dashed cursor-pointer text-slate-400 hover:text-kefit-primary group">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-kefit-primary/10 transition-all border-2 border-dashed border-slate-200">
                       <Wallet className="w-8 h-8" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-500 group-hover:text-slate-950">Add Payout Method</h4>
                       <p className="text-xs font-medium uppercase tracking-widest mt-1">Telebirr, PayPal, or Wise</p>
                    </div>
                 </div>
                 <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100" />
              </div>
           </div>
        </section>
      </div>
    </DashboardLayout>
  );
};
