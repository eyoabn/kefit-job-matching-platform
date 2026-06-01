import { axiosInstance } from './axiosInstance';
import { Bid } from '@/types';
import { MOCK_BIDS } from './mockData';

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

export const bidsService = {
  getBidsByJobId: async (jobId: string): Promise<Bid[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_BIDS.filter(b => b.jobId === jobId);
    }
    const { data } = await axiosInstance.get(`/bids/${jobId}/bids`);
    return data;
  },

  getFreelancerBids: async (freelancerId: string): Promise<Bid[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_BIDS; // Return all for mock demo
    }
    const { data } = await axiosInstance.get(`/bids/freelancer/${freelancerId}`);
    return data;
  },

  submitBid: async (jobId: string, bidData: { amount: number; timeline: string; proposal: string }): Promise<Bid> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        id: Math.random().toString(36).substr(2, 9),
        jobId,
        freelancerId: 'current-user',
        ...bidData,
        deliveryDays: parseInt(bidData.timeline) || 30,
        status: 'Pending',
        createdAt: new Date().toISOString()
      } as Bid;
    }
    const { data } = await axiosInstance.post<Bid>(`/bids`, {
      jobId: jobId,
      amount: bidData.amount,
      proposal: bidData.proposal,
      deliveryDays: parseInt(bidData.timeline) || 30
    });
    return data;
  },

  updateBidStatus: async (id: string, status: Bid['status']): Promise<Bid> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const bid = MOCK_BIDS.find(b => b.id === id);
      if (!bid) throw new Error('Bid not found');
      return { ...bid, status };
    }
    const { data } = await axiosInstance.patch(`/bids/${id}`, { status });
    return data;
  },

  hireFreelancer: async (jobId: string, bidId: string): Promise<any> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    }
    const { data } = await axiosInstance.post(`/jobs/${jobId}/hire/${bidId}`);
    return data;
  }
};
