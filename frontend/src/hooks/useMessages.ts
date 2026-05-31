import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService, Message, Conversation } from '../services/api/messages';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: messagesService.getConversations,
  });
};

export const useMessages = (userId: string) => {
  return useQuery({
    queryKey: ['messages', userId],
    queryFn: () => messagesService.getThread(userId),
    enabled: !!userId,
    refetchInterval: 5000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ receiverId, content }: { receiverId: string; content: string }) =>
      messagesService.sendMessage(receiverId, content),
    onMutate: async ({ receiverId, content }) => {
      await queryClient.cancelQueries({ queryKey: ['messages', receiverId] });
      const previousMessages = queryClient.getQueryData<Message[]>(['messages', receiverId]);

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: 'current-user',
        receiverId,
        content,
        read: false,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(['messages', receiverId], (old) =>
        old ? [...old, optimisticMessage] : [optimisticMessage]
      );

      return { previousMessages };
    },
    onError: (_err, { receiverId }, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', receiverId], context.previousMessages);
      }
    },
    onSuccess: (_data, { receiverId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', receiverId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => messagesService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};