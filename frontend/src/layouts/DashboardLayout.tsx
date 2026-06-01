import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Bell, 
  User, 
  LogOut,
  Search,
  Menu,
  X,
  RefreshCw,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Clock,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => (
  <Link
    to={href}
    className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
      active 
        ? 'bg-white/15 text-white shadow-inner' 
        : 'text-white/70 hover:bg-white/5 hover:text-white'
    )}
  >
    <Icon className="w-5 h-5" />
    {label}
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const { data: notifications } = useNotifications();
  const { mutateAsync: markAllRead } = useMarkAllRead();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const toggleRole = () => {
    if (!user) return;
    navigate(user.role === 'Client' ? '/dashboard' : '/client/dashboard');
  };

  const freelancerNav = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Browse Jobs', icon: Briefcase, href: '/jobs' },
    { label: 'My Contracts', icon: ShieldCheck, href: '/freelancer/contracts' },
    { label: 'Earnings', icon: DollarSign, href: '/freelancer/earnings' },
    { label: 'Messages', icon: MessageSquare, href: '/messages' },
    { label: 'My Profile', icon: User, href: '/profile' },
  ];

  const clientNav = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/client/dashboard' },
    { label: 'Find Talent', icon: Search, href: '/client/freelancers' },
    { label: 'Post a Job', icon: Briefcase, href: '/client/post-job' },
    { label: 'My Contracts', icon: FileText, href: '/client/contracts' },
    { label: 'Messages', icon: MessageSquare, href: '/client/messages' },
    { label: 'Settings', icon: User, href: '/client/settings' },
  ];

  const adminNav = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Jobs', icon: Briefcase, href: '/admin/jobs' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const navigation = user?.role === 'Client' ? clientNav : user?.role === 'Admin' ? adminNav : freelancerNav;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-kefit-secondary rounded-lg flex items-center justify-center">
                <span className="text-kefit-primary font-bold text-xl">K</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight italic">Kefit</h1>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4">
            {navigation.map((item) => {
              const { label, icon, href } = item;
              return (
                <SidebarItem
                  key={href}
                  label={label}
                  icon={icon}
                  href={href}
                  active={location.pathname === href}
                />
              );
            })}
          </nav>

          <div className="p-4 mt-auto">
            {user?.role !== 'Admin' && (
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mb-1">
                  {user?.role || 'Freelancer'} Pro
                </p>
                <p className="text-xs text-white/80 mb-3 leading-relaxed">
                  Unlock exclusive features and unlimited job bids.
                </p>
                <button className="w-full py-2 bg-kefit-secondary text-kefit-primary font-bold rounded-xl text-xs hover:brightness-110 transition-all">
                  Upgrade Now
                </button>
              </div>
            )}
            
            <button 
              onClick={logout}
              className="w-full mt-4 flex items-center gap-3 px-4 py-3 text-red-100 hover:text-white hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <button 
            className="p-2 -ml-2 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>

          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={user?.role === 'Admin' ? "Search users, jobs..." : "Search jobs, projects..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kefit-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user?.role !== 'Admin' && (
              <button 
                onClick={toggleRole}
                className="px-3 py-1.5 bg-slate-100 hover:bg-kefit-secondary/20 text-slate-600 hover:text-kefit-primary rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                title={`Switch to ${user?.role === 'Freelancer' ? 'Client' : 'Freelancer'} Mode`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Switch Role</span>
              </button>
            )}

            {user?.role !== 'Admin' && <div className="h-8 w-px bg-slate-200 hidden sm:block" />}

            <div className="relative">
              <button
                onClick={() => {
                  if (unreadCount > 0) {
                    markAllRead();
                  }
                  setIsNotifOpen(!isNotifOpen);
                }}
                className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-black text-slate-950">Notifications</h4>
                      <Link
                        to={user?.role === 'Admin' ? '/admin/notifications' : user?.role === 'Client' ? '/client/notifications' : '/notifications'}
                        onClick={() => setIsNotifOpen(false)}
                        className="text-xs font-bold text-kefit-primary hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications?.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors",
                            !notif.read && "bg-kefit-primary/[0.02]"
                          )}
                        >
                          <p className="text-sm font-bold text-slate-900 truncate">{notif.title}</p>
                          <p className="text-xs text-slate-500 font-medium truncate">{notif.message}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                      {(!notifications || notifications.length === 0) && (
                        <div className="p-8 text-center text-slate-400 text-sm">No notifications</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 p-1.5 rounded-xl hover:bg-slate-50 transition-all group outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Abebe Kebede'}</p>
                  <span className="text-[10px] text-kefit-primary font-black uppercase tracking-widest px-2 py-0.5 bg-kefit-primary/10 rounded-md border border-kefit-primary/20">
                    {user?.role || 'Guest'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-kefit-primary flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-sm ring-1 ring-slate-200 group-hover:scale-105 transition-transform">
                  {user?.name?.substring(0, 2).toUpperCase() || 'AK'}
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)} 
                  />
                  <div className="absolute right-0 mt-4 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-20 flex flex-col gap-1">
                    <div className="p-3 mb-1 border-b border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (user?.role === 'Admin') {
                          navigate('/admin/settings');
                        } else if (user?.role === 'Client') {
                          navigate('/client/settings');
                        } else {
                          navigate('/profile');
                        }
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all font-bold text-sm text-left"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
