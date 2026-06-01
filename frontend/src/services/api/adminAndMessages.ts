import { axiosInstance } from './axiosInstance';

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

export const adminService = {
  getUsers: async () => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: '1', name: 'Abebe Kebede', role: 'Freelancer', status: 'Active' },
        { id: '2', name: 'Safaricom Ethiopia', role: 'Client', status: 'Active' },
      ];
    }
    const { data } = await axiosInstance.get('/admin/users');
    return data;
  },
  getDashboardStats: async () => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        totalUsers: 1234,
        activeJobs: 89,
        totalRevenue: 45678,
        activeContracts: 156
      };
    }
    const { data } = await axiosInstance.get('/admin/dashboard-stats');
    return data;
  },
};

interface MessageThread {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export const messagesService = {
  getThreads: async (): Promise<MessageThread[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 't1', participantId: 'p1', participantName: 'Safaricom Ethiopia', lastMessage: 'When can you start?', time: '2h ago', unread: 1 },
      ];
    }
    const { data } = await axiosInstance.get('/messages/threads');
    return data;
  },

  getThread: async (participantId: string): Promise<Message[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 'm1', senderId: 'p1', content: 'When can you start?', createdAt: new Date().toISOString(), isRead: false },
      ];
    }
    const { data } = await axiosInstance.get(`/messages/${participantId}`);
    return data;
  },

  sendMessage: async (data: { receiver_id: string; content: string }): Promise<Message> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: Math.random().toString(36).substr(2, 9),
        senderId: 'me',
        content: data.content,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
    }
    const { data: response } = await axiosInstance.post('/messages', data);
    return response;
  },

  markAsRead: async (messageId: string): Promise<void> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }
    await axiosInstance.put(`/messages/${messageId}/read`);
  },
};
