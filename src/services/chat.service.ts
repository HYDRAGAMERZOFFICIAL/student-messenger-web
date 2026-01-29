import api from './api';

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  unreadCount: number;
  type: 'private' | 'group';
}

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
  },

  async sendMessage(receiverId: string, content: string): Promise<Message> {
    const response = await api.post('/chat/send', { receiverId, content });
    return response.data;
  },
};
