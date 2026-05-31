export type UserRole = 'Client' | 'Freelancer' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  clientId: string;
  status: 'Open' | 'InProgress' | 'Closed';
  createdAt: string;
  bidCount?: number;
}

export interface Bid {
  id: string;
  jobId: string;
  jobTitle?: string;
  freelancerId: string;
  freelancerName?: string;
  amount: number;
  proposal: string;
  deliveryDays: number; // in days
  timeline?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
  createdAt: string;
}

export interface Contract {
  id: string;
  jobId: string;
  clientId: string;
  clientName?: string;
  freelancerId: string;
  freelancerName: string;
  jobTitle: string;
  amount: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Bid' | 'Contract' | 'Message' | 'System';
  read: boolean;
  link?: string;
  createdAt: string;
}
