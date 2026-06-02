import React, { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Camera, 
  Mail, 
  Phone, 
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ClientSettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your professional profile and security preferences.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs Sidebar */}
          <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-1 shrink-0 bg-slate-50 p-2 rounded-2xl h-fit border border-slate-200">
            <button 
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl font-black text-sm transition-all",
                activeTab === 'profile' ? "bg-white text-kefit-primary shadow-sm ring-1 ring-slate-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <User className="w-4 h-4" />
              Public Profile
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl font-black text-sm transition-all",
                activeTab === 'security' ? "bg-white text-kefit-primary shadow-sm ring-1 ring-slate-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl font-black text-sm transition-all",
                activeTab === 'notifications' ? "bg-white text-kefit-primary shadow-sm ring-1 ring-slate-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <div className="h-px bg-slate-200 my-2 hidden lg:block" />
            <button 
              className="flex items-center gap-3 p-3 rounded-xl font-black text-sm text-red-500 hover:bg-red-50 transition-all text-left"
              onClick={() => {
                if (window.confirm('Are you sure you want to sign out?')) logout();
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </aside>

          {/* Settings Content */}
          <main className="flex-1 space-y-6">
            {activeTab === 'profile' && (
              <section className="card-geometric p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center pb-8 border-b border-slate-100">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-3xl shadow-inner border-2 border-dashed border-slate-200 group-hover:border-kefit-primary group-hover:bg-kefit-primary/5 transition-all">
                       {user?.name?.substring(0, 2).toUpperCase()}
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-kefit-primary/10 rounded-3xl">
                        <Camera className="w-8 h-8 text-kefit-primary" />
                       </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-950">Avatar & Visual Identity</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-4">Upload a high-quality logo or portrait representing your entity.</p>
                    <div className="flex gap-2">
                       <Button size="sm" variant="outline">Change Photo</Button>
                       <Button size="sm" variant="ghost" className="text-red-500">Remove</Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Full Name / Company Name" defaultValue={user?.name} className="font-bold" />
                  <Input label="Email Address" defaultValue={user?.email} disabled className="bg-slate-50 font-bold" />
                </div>

                <TextArea label="Bio / About Company" placeholder="Tell freelancers about what you do and your vision..." rows={5} className="font-medium" />

                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Phone Number" placeholder="+251 91 123 4567" icon={<Phone className="w-4 h-4" />} />
                  <Input label="Industry" placeholder="e.g. Technology, Fintech, Healthcare" />
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                   <Button className="bg-slate-950 hover:bg-kefit-primary shadow-xl shadow-slate-950/10">Save Profile Updates</Button>
                </div>
              </section>
            )}

            {activeTab === 'security' && (
              <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="card-geometric p-8">
                  <h3 className="text-xl font-black text-slate-950 mb-6">Password & Authentication</h3>
                  <div className="space-y-6">
                    <Input label="Current Password" type="password" />
                    <div className="grid md:grid-cols-2 gap-6">
                       <Input label="New Password" type={showPassword ? "text" : "password"} />
                       <Input label="Confirm New Password" type={showPassword ? "text" : "password"} />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer w-fit group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-kefit-primary focus:ring-kefit-primary"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                      />
                      <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Show Passwords</span>
                    </label>
                    <div className="pt-4">
                      <Button className="bg-slate-950 hover:bg-kefit-primary">Update Password</Button>
                    </div>
                  </div>
                </div>

                <div className="card-geometric p-8 border-l-4 border-l-orange-400">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-950">Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        Secure your account with an extra layer of security. We will send a code to your phone or authentication app.
                      </p>
                      <Button variant="outline" size="sm" className="mt-4 border-orange-200 text-orange-700 hover:bg-orange-50">Setup 2FA Now</Button>
                    </div>
                  </div>
                </div>

                <div className="card-geometric p-8 bg-red-50/30 border border-red-100">
                   <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-red-900">Danger Zone</h4>
                      <p className="text-sm text-red-700 mt-1 leading-relaxed">
                         Deleting your account is permanent. All your data including job history, messages and active contracts will be permanently removed.
                      </p>
                      <Button variant="ghost" className="mt-4 text-red-600 hover:bg-red-100 font-black">Permanently Delete Account</Button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'notifications' && (
              <section className="card-geometric p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                   <h3 className="text-xl font-black text-slate-950">Email Preferences</h3>
                   <p className="text-sm text-slate-500 mt-1">Control which updates you receive in your inbox.</p>
                </div>
                
                <div className="space-y-4">
                   <NotificationPreference 
                    title="Hiring Activity" 
                    desc="Receive notifications about new bids and freelancer interactions." 
                    defaultChecked 
                   />
                   <NotificationPreference 
                    title="Contracts & Payments" 
                    desc="Get updates on contract status, milestones, and payment processing." 
                    defaultChecked 
                   />
                   <NotificationPreference 
                    title="Direct Messages" 
                    desc="Receive email alerts when freelancers send you private messages." 
                   />
                   <NotificationPreference 
                    title="Platform Updates" 
                    desc="Stay informed about new features, newsletters, and policy changes." 
                   />
                </div>
                
                <div className="pt-6 border-t border-slate-100 flex justify-end">
                   <Button className="bg-slate-950 hover:bg-kefit-primary">Update Preferences</Button>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

const NotificationPreference = ({ title, desc, defaultChecked = false }: { title: string; desc: string; defaultChecked?: boolean }) => (
  <div className="flex items-start justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all">
    <div className="max-w-md">
      <h4 className="font-black text-slate-900">{title}</h4>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{desc}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kefit-primary"></div>
    </label>
  </div>
);
