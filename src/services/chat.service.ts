import api from './api';

export interface Message {
  id: string;
  senderId: string;
  senderName?: string; // Added for group chats
  receiverId?: string;
  groupId?: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  isGroup: boolean;
  participants: string[];
  lastMessage?: string;
  lastMessageSenderId?: string;
  lastMessageTime?: string;
  unreadCount: number;
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

  async sendMessage(receiverId: string, content: string, isGroup: boolean = false): Promise<Message> {
    const payload = isGroup ? { groupId: receiverId, content } : { receiverId, content };
    const response = await api.post('/chat/send', payload);
    return response.data;
  },

  async createGroup(name: string, participants: string[]): Promise<Conversation> {
    const response = await api.post('/chat/groups', { name, participants });
    return response.data;
  },

  async searchUsers(query: string): Promise<{ id: string; username: string; email: string; avatar?: string }[]> {
    const response = await api.get(`/chat/users/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};
