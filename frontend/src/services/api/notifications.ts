import { axiosInstance } from './axiosInstance';
import { Notification } from '@/types';
import { MOCK_NOTIFICATIONS } from './mockData';

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

export const notificationsService = {
  getNotifications: async (): Promise<Notification[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_NOTIFICATIONS;
    }
    const { data } = await axiosInstance.get('/notifications');
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    await axiosInstance.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    if (IS_MOCK) {
       await new Promise(resolve => setTimeout(resolve, 500));
       return;
    }
    await axiosInstance.post('/notifications/read-all');
  }
};
