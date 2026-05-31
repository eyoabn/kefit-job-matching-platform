import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bidsService } from '../services/api/bids';

export const useBids = (jobId: string) => {
  return useQuery({
    queryKey: ['bids', jobId],
    queryFn: () => bidsService.getBidsByJobId(jobId),
    enabled: !!jobId,
  });
};

export const useFreelancerBids = (freelancerId: string) => {
  return useQuery({
    queryKey: ['bids', 'freelancer', freelancerId],
    queryFn: () => bidsService.getFreelancerBids(freelancerId),
    enabled: !!freelancerId,
  });
};

export const useUpdateBidStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => 
      bidsService.updateBidStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useSubmitBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: { amount: number; timeline: string; proposal: string } }) =>
      bidsService.submitBid(jobId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bids', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useHireFreelancer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, bidId }: { jobId: string; bidId: string }) =>
      bidsService.hireFreelancer(jobId, bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
