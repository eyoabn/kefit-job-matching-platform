import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '@/hooks/useNotifications';
import { 
  Bell, 
  MessageSquare, 
  Briefcase, 
  User, 
  CheckCircle2, 
  Trash2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export const NotificationPage = () => {
  const { data: notifications, isLoading } = useNotifications();
  const { mutateAsync: markRead } = useMarkNotificationRead();
  const { mutateAsync: markAllRead } = useMarkAllRead();

  const getIcon = (type: string) => {
    switch (type) {
      case 'Bid': return <User className="w-5 h-5" />;
      case 'Contract': return <Briefcase className="w-5 h-5" />;
      case 'Message': return <MessageSquare className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'Bid': return 'bg-kefit-primary/10 text-kefit-primary border-kefit-primary/20';
      case 'Contract': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Message': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-kefit-primary flex items-center justify-center text-white shadow-lg shadow-kefit-primary/20">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">Notification Center</h1>
              <p className="text-slate-500 font-medium">Stay updated with your latest activities.</p>
            </div>
          </div>
          <Button variant="ghost" className="text-slate-500 hover:text-kefit-primary font-bold" onClick={() => markAllRead()}>
            Mark all as read
          </Button>
        </header>

        <section className="card-geometric overflow-hidden">
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">Loading notifications...</div>
            ) : notifications?.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <Bell className="w-8 h-8" />
                </div>
                <p className="text-slate-500 font-bold">You're all caught up!</p>
              </div>
            ) : (
              notifications?.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-6 flex gap-4 transition-all group",
                    !notif.read ? "bg-kefit-primary/[0.02]" : "bg-white"
                  )}
                  onMouseEnter={() => !notif.read && markRead(notif.id)}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                    getColor(notif.type)
                  )}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-slate-930">{notif.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{notif.message}</p>
                    
                    {notif.link && (
                      <Link 
                        to={notif.link} 
                        className="inline-flex items-center gap-1.5 text-xs font-black text-kefit-primary mt-4 hover:underline"
                      >
                        Action <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};
