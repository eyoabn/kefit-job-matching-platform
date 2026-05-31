import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsService } from '../services/api/contracts';

export const useContracts = () => {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: contractsService.getContracts,
  });
};

export const useUpdateContractStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => 
      contractsService.updateContractStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
};
