import { axiosInstance } from './axiosInstance';
import { Job } from '@/types';
import { MOCK_JOBS } from './mockData';

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

export const jobsService = {
  getJobs: async (filters?: { status?: string; category?: string; min_budget?: number; max_budget?: number; my_jobs?: boolean }): Promise<Job[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_JOBS;
    }
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.min_budget) params.append('min_budget', String(filters.min_budget));
    if (filters?.max_budget) params.append('max_budget', String(filters.max_budget));
    if (filters?.my_jobs) params.append('my_jobs', 'true');
    const { data } = await axiosInstance.get(`/jobs?${params.toString()}`);
    return Array.isArray(data) ? data : (data.items || []);
  },

  getJobById: async (id: string): Promise<Job> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const job = MOCK_JOBS.find(j => j.id === id);
      if (!job) throw new Error('Job not found');
      return job;
    }
    const { data } = await axiosInstance.get(`/jobs/${id}`);
    return data;
  },

  createJob: async (jobData: Partial<Job>): Promise<Job> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...jobData, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() } as Job;
    }
    const { data } = await axiosInstance.post('/jobs', jobData);
    return data;
  },

  updateJob: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const job = MOCK_JOBS.find(j => j.id === id);
      if (!job) throw new Error('Job not found');
      return { ...job, ...jobData };
    }
    const { data } = await axiosInstance.put(`/jobs/${id}`, jobData);
    return data;
  },

  deleteJob: async (id: string): Promise<void> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    await axiosInstance.delete(`/jobs/${id}`);
  }
};
