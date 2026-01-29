import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import NewGroupModal from '../components/NewGroupModal';
import { chatService } from '../services/chat.service';
import type { Message, Conversation } from '../services/chat.service';
import { useSocket } from '../hooks/useSocket';

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  
  const { on, off, emit } = useSocket();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (id && conversations.length > 0) {
      const conv = conversations.find(c => c.id === id);
      if (conv) {
        setSelectedConversation(conv);
      }
    } else if (!id) {
      setSelectedConversation(null);
    }
  }, [id, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          setMessagesLoading(true);
          const data = await chatService.getMessages(selectedConversation.id);
          setMessages(data);
        } catch (err) {
          console.error('Failed to fetch messages', err);
        } finally {
          setMessagesLoading(false);
        }
      };
      fetchMessages();
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    on('message', (message: Message) => {
      const targetId = message.groupId || (message.senderId === 'me' ? message.receiverId : message.senderId);
      
      if (selectedConversation?.id === targetId) {
        setMessages((prev) => [...prev, message]);
      }
      
      setConversations((prev) => 
        prev.map(c => 
          (c.id === targetId) 
          ? { ...c, lastMessage: message.content, lastMessageTime: message.timestamp } 
          : c
        )
      );
    });

    return () => off('message');
  }, [selectedConversation?.id, on, off]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;
    
    emit('sendMessage', {
      [selectedConversation.isGroup ? 'groupId' : 'receiverId']: selectedConversation.id,
      content
    });
  };

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleGroupCreated = (groupId: string) => {
    // Refresh conversations and navigate
    chatService.getConversations().then((data: Conversation[]) => {
      setConversations(data);
      navigate(`/chat/${groupId}`);
    });
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center bg-white rounded-2xl border">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Syncing Network</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden relative">
      <Sidebar
        conversations={conversations}
        selectedId={selectedConversation?.id || null}
        onSelect={handleSelectConversation}
        onCreateGroup={() => setIsGroupModalOpen(true)}
      />
      {messagesLoading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50/50">
           <div className="animate-pulse flex flex-col items-center">
             <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
             <div className="h-2 w-16 bg-gray-100 rounded"></div>
           </div>
        </div>
      ) : (
        <ChatWindow
          conversation={selectedConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )}

      {isGroupModalOpen && (
        <NewGroupModal
          onClose={() => setIsGroupModalOpen(false)}
          onCreated={handleGroupCreated}
        />
      )}
    </div>
  );
};

export default Chat;
