import { axiosInstance } from './axiosInstance';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Safaricom Ethiopia',
    userAvatar: 'SE',
    lastMessage: 'When can you start working on the project...',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
    online: true,
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'TeleBirr',
    userAvatar: 'TB',
    lastMessage: 'The new designs for the wallet look great.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  'user-1': [
    {
      id: 'm1',
      senderId: 'user-1',
      receiverId: 'current-user',
      content: 'Hello! We reviewed your proposal for the project and we\'re impressed with your background. When can you start and do you have experience with M-Pesa API integrations?',
      read: true,
      createdAt: '2026-03-24T10:45:00Z',
    },
    {
      id: 'm2',
      senderId: 'current-user',
      receiverId: 'user-1',
      content: 'Thank you for reaching out! I\'m available to start immediately next Monday. I have integrated M-Pesa\'s G2 API for several local e-commerce projects last year.',
      read: true,
      createdAt: '2026-03-24T10:52:00Z',
    },
    {
      id: 'm3',
      senderId: 'user-1',
      receiverId: 'current-user',
      content: 'Excellent. I\'ve sent you a formal offer with the full scope of work. Please review it so we can kick off the onboarding process.',
      read: true,
      createdAt: '2026-03-24T11:05:00Z',
    },
  ],
};

export const messagesService = {
  getConversations: async (): Promise<Conversation[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_CONVERSATIONS;
    }
    const { data } = await axiosInstance.get('/messages/conversations');
    return data;
  },

  getThread: async (userId: string): Promise<Message[]> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_MESSAGES[userId] || [];
    }
    const { data } = await axiosInstance.get(`/messages/${userId}`);
    return data;
  },

  sendMessage: async (receiverId: string, content: string): Promise<Message> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newMessage: Message = {
        id: `m${Date.now()}`,
        senderId: 'current-user',
        receiverId,
        content,
        read: false,
        createdAt: new Date().toISOString(),
      };
      if (!MOCK_MESSAGES[receiverId]) {
        MOCK_MESSAGES[receiverId] = [];
      }
      MOCK_MESSAGES[receiverId].push(newMessage);
      return newMessage;
    }
    const { data } = await axiosInstance.post('/messages', { receiver_id: receiverId, content });
    return data;
  },

  markAsRead: async (messageId: string): Promise<void> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }
    await axiosInstance.put(`/messages/${messageId}/read`);
  },
};