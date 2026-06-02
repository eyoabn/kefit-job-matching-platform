import { useState, useEffect } from 'react';
import { Users, Briefcase, DollarSign, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/api/adminAndMessages';

const recentActivity = [
  { type: 'user', message: 'New freelancer registered: John Doe', time: '2 min ago' },
  { type: 'job', message: 'New job posted: "Full Stack Developer"', time: '15 min ago' },
  { type: 'contract', message: 'Contract completed: Project Alpha', time: '1 hour ago' },
  { type: 'alert', message: 'Suspicious activity detected on account', time: '2 hours ago' },
];

const topFreelancers = [
  { name: 'Alice Johnson', jobs: 45, earnings: '$12,500', rating: 4.9 },
  { name: 'Bob Smith', jobs: 38, earnings: '$10,200', rating: 4.8 },
  { name: 'Carol Williams', jobs: 32, earnings: '$8,900', rating: 4.7 },
];

const recentJobs = [
  { title: 'Full Stack Developer', client: 'TechCorp', budget: '$5,000', status: 'Open' },
  { title: 'UI/UX Designer', client: 'DesignHub', budget: '$3,000', status: 'Open' },
  { title: 'Mobile App Developer', client: 'AppWorks', budget: '$4,500', status: 'In Progress' },
];

export const AdminDashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStatsData(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Users', value: statsData?.totalUsers?.toLocaleString() || '0', icon: Users, change: '+12%', color: 'bg-blue-500' },
    { label: 'Active Jobs', value: statsData?.activeJobs?.toLocaleString() || '0', icon: Briefcase, change: '+5%', color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `$${statsData?.totalRevenue?.toLocaleString() || '0'}`, icon: DollarSign, change: '+8%', color: 'bg-green-500' },
    { label: 'Active Contracts', value: statsData?.activeContracts?.toLocaleString() || '0', icon: Shield, change: '+3%', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'alert' ? 'bg-red-500' : 'bg-kefit-primary'}`} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">Top Freelancers</h2>
          <div className="space-y-4">
            {topFreelancers.map((freelancer, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-kefit-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-black text-kefit-primary">
                      {freelancer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{freelancer.name}</p>
                    <p className="text-xs text-slate-500">{freelancer.jobs} jobs completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-green-600">{freelancer.earnings}</p>
                  <p className="text-xs text-slate-500">★ {freelancer.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 mb-4">Recent Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Job Title</th>
                <th className="text-left py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Client</th>
                <th className="text-left py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Budget</th>
                <th className="text-left py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <p className="text-sm font-bold text-slate-900">{job.title}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-slate-600">{job.client}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm font-bold text-green-600">{job.budget}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};