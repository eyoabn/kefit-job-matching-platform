import { axiosInstance } from './axiosInstance';
import { Contract } from '@/types';
import { MOCK_CONTRACTS } from './mockData';

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

export const contractsService = {
  getContracts: async (): Promise<Contract[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_CONTRACTS;
    }
    const { data } = await axiosInstance.get('/contracts');
    return data;
  },

  getContractById: async (id: string): Promise<Contract> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const contract = MOCK_CONTRACTS.find(c => c.id === id);
      if (!contract) throw new Error('Contract not found');
      return contract;
    }
    const { data } = await axiosInstance.get(`/contracts/${id}`);
    return data;
  },

  hireFreelancer: async (jobId: string, bidId: string): Promise<Contract> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: Math.random().toString(36).substr(2, 9),
        jobId,
        clientId: 'client-1',
        freelancerId: 'freelancer-1',
        jobTitle: 'Test Job',
        amount: 500,
        status: 'Active',
        startDate: new Date().toISOString(),
      } as Contract;
    }
    const { data } = await axiosInstance.post(`/jobs/${jobId}/hire/${bidId}`);
    return data;
  },

  completeContract: async (id: string): Promise<Contract> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, status: 'Completed' } as Contract;
    }
    const { data } = await axiosInstance.put(`/contracts/${id}/complete`);
    return data;
  },

  leaveReview: async (contractId: string, reviewData: {
    rating: number;
    comment: string;
    communication_rating?: number;
    quality_rating?: number;
    timeline_rating?: number;
  }): Promise<any> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { id: Math.random().toString(36).substr(2, 9), ...reviewData };
    }
    const { data } = await axiosInstance.post(`/contracts/${contractId}/review`, reviewData);
    return data;
  },

  updateContractStatus: async (id: string, status: Contract['status']): Promise<Contract> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const contract = MOCK_CONTRACTS.find(c => c.id === id);
      if (!contract) throw new Error('Contract not found');
      return { ...contract, status };
    }
    const { data } = await axiosInstance.patch(`/contracts/${id}`, { status });
    return data;
  }
};
