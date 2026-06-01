import { Job, Bid, User, Contract, Notification } from '@/types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer (React/TypeScript)',
    description: 'Join Safaricom Ethiopia to lead the development of our next-gen mobile payment portal. You will be working with React 18, TypeScript, and high-performance APIs.',
    budget: 45000,
    deadline: '2024-06-01',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    clientId: 'client-1', // Assuming logged in user is client-1 for demo
    status: 'Open',
    createdAt: new Date().toISOString(),
    bidCount: 5
  },
  {
    id: '2',
    title: 'Technical Product Manager',
    description: 'Lead the product roadmap for our digital payment integrations at TeleBirr. You will work closely with engineering and stakeholders to deliver world-class fintech solutions.',
    budget: 60000,
    deadline: '2024-06-15',
    skills: ['Agile', 'Product strategy', 'Fintech', 'Leadership'],
    clientId: 'client-1',
    status: 'InProgress',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    bidCount: 12
  },
  {
    id: '3',
    title: 'UX/UI Designer for E-commerce',
    description: 'We need a creative designer to revamp our local delivery app interface. Focus on mobile-first experience and Ethiopian cultural aesthetics.',
    budget: 15000,
    deadline: '2024-05-20',
    skills: ['Figma', 'UI Design', 'User Research'],
    clientId: 'client-2',
    status: 'Open',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    bidCount: 0
  }
];

export const MOCK_BIDS: Bid[] = [
  {
    id: 'bid-1',
    jobId: '1',
    freelancerId: 'fl-1',
    freelancerName: 'Dawit Solomon',
    amount: 40000,
    proposal: 'I have 5 years of experience with React and have built similar portals for banks in Ethiopia. I can deliver high-quality, pixel-perfect UI with robust performance.',
    deliveryDays: 14,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'bid-2',
    jobId: '1',
    freelancerId: 'fl-2',
    freelancerName: 'Hirut Bekele',
    amount: 45000,
    proposal: 'Professional full-stack developer with a focus on React. I have integrated TeleBirr before and can handle this project efficiently.',
    deliveryDays: 10,
    status: 'Pending',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'bid-3',
    jobId: '1',
    freelancerId: 'fl-3',
    freelancerName: 'Abebe Desta',
    amount: 38000,
    proposal: 'Senior React developer ready to start immediately. I offer competitive rates and guaranteed quality work.',
    deliveryDays: 20,
    status: 'Pending',
    createdAt: new Date(Date.now() - 10800000).toISOString()
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'ctr-1',
    jobId: '2',
    clientId: 'client-1',
    freelancerId: 'fl-4',
    freelancerName: 'Makeda Tesfaye',
    jobTitle: 'Technical Product Manager',
    amount: 60000,
    status: 'Active',
    startDate: new Date(Date.now() - 604800000).toISOString(),
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'nt-1',
    userId: 'client-1',
    title: 'New Bid Received',
    message: 'Dawit Solomon submitted a bid for "Senior Frontend Engineer"',
    type: 'Bid',
    read: false,
    link: '/client/jobs/1/bids',
    createdAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'nt-2',
    userId: 'client-1',
    title: 'Milestone Completed',
    message: 'Makeda Tesfaye marked "Sprint 1 Analysis" as completed.',
    type: 'Contract',
    read: true,
    link: '/client/contracts/ctr-1',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];
