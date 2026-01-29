import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { chatService, Message, Conversation } from '../services/chat.service';
import { useSocket } from '../hooks/useSocket';

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { on, off, emit } = useSocket();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (err) {
        console.error('Failed to fetch conversations', err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const data = await chatService.getMessages(selectedConversation.id);
          setMessages(data);
        } catch (err) {
          console.error('Failed to fetch messages', err);
        }
      };
      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    on('message', (message: Message) => {
      if (selectedConversation && (message.senderId === selectedConversation.id || message.receiverId === selectedConversation.id)) {
        setMessages((prev) => [...prev, message]);
      }
      
      // Update last message in conversations list
      setConversations((prev) => 
        prev.map(c => 
          (c.id === message.senderId || c.id === message.receiverId) 
          ? { ...c, lastMessage: message.content } 
          : c
        )
      );
    });

    return () => off('message');
  }, [selectedConversation, on, off]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;
    
    try {
      // Optimistic update could go here
      emit('sendMessage', {
        receiverId: selectedConversation.id,
        content
      });
      
      // In a real app, the server would broadcast back and we'd handle it in the 'message' listener
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id) || null;
    setSelectedConversation(conv);
  };

  return (
    <div className="flex h-[calc(100vh-160px)] border rounded-xl shadow-lg overflow-hidden bg-white">
      <Sidebar
        conversations={conversations}
        selectedId={selectedConversation?.id || null}
        onSelect={handleSelectConversation}
      />
      <ChatWindow
        conversation={selectedConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;
