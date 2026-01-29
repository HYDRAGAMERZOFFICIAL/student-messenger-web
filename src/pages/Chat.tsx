import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import NewGroupModal from '../components/NewGroupModal';
import { chatService } from '../services/chat.service';
import type { Message, Conversation } from '../services/chat.service';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { SOCKET_EVENTS } from '../utils/socketEvents';

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<(Message & { status?: 'sending' | 'sent' | 'failed' })[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({}); // conversationId -> usernames[]
  
  const { on, off, emit } = useSocket();

  useEffect(() => {
    // Presence listeners
    on(SOCKET_EVENTS.ONLINE_USERS, (userIds: string[]) => setOnlineUsers(new Set(userIds)));
    on(SOCKET_EVENTS.USER_ONLINE, ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => new Set([...Array.from(prev), userId]));
    });
    on(SOCKET_EVENTS.USER_OFFLINE, ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // Typing listeners
    on(SOCKET_EVENTS.TYPING_START, ({ userId, username, targetId }: { userId: string, username: string, targetId: string }) => {
      setTypingUsers(prev => {
        const current = prev[targetId] || [];
        if (current.includes(username)) return prev;
        return { ...prev, [targetId]: [...current, username] };
      });
    });

    on(SOCKET_EVENTS.TYPING_STOP, ({ userId, targetId }: { userId: string, targetId: string }) => {
      // Note: We'd need the username here too if we want to be precise, or just use userId
      setTypingUsers(prev => {
        // This is a bit simplified since we don't have the username in typing_stop easily
        // Let's assume one user for now or refine the event
        return { ...prev, [targetId]: [] }; 
      });
    });

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        // Add a slight delay for better transition feel
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchConversations();
  }, [on]);

  useEffect(() => {
    if (id && conversations.length > 0) {
      const conv = conversations.find(c => c.id === id);
      if (conv) {
        setSelectedConversation(conv);
        // Reset unread count for selected conversation
        setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
      }
    } else if (!id) {
      setSelectedConversation(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, conversations.length]); // Only depend on length to avoid infinite loop when updating counts

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.id]);

  useEffect(() => {
    on(SOCKET_EVENTS.RECEIVE_MESSAGE, (message: Message) => {
      const targetId = message.groupId || (message.senderId === 'me' ? message.receiverId : message.senderId);
      
      if (selectedConversation?.id === targetId) {
        setMessages((prev) => [...prev, message]);
      }
      
      setConversations((prev) => 
        prev.map(c => 
          (c.id === targetId) 
          ? { 
              ...c, 
              lastMessage: message.content, 
              lastMessageTime: message.timestamp,
              unreadCount: selectedConversation?.id === targetId ? 0 : (c.unreadCount + 1)
            } 
          : c
        )
      );
    });

    return () => {
      off(SOCKET_EVENTS.RECEIVE_MESSAGE);
      off(SOCKET_EVENTS.ONLINE_USERS);
      off(SOCKET_EVENTS.USER_ONLINE);
      off(SOCKET_EVENTS.USER_OFFLINE);
      off(SOCKET_EVENTS.TYPING_START);
      off(SOCKET_EVENTS.TYPING_STOP);
    };
  }, [selectedConversation?.id, on, off]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;
    
    const tempId = Date.now().toString();
    const tempMessage: any = {
      id: tempId,
      senderId: user?.id || 'me',
      content,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, tempMessage]);

    emit(SOCKET_EVENTS.SEND_MESSAGE, {
      [selectedConversation.isGroup ? 'groupId' : 'receiverId']: selectedConversation.id,
      content
    });
    
    // In a real app, we'd wait for an 'ack' from the server to set status to 'sent'
    // For this mock-heavy logic, we'll simulate 'sent'
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'sent' } : m));
    }, 500);

    // Stop typing when message sent
    emit(SOCKET_EVENTS.TYPING_STOP, { targetId: selectedConversation.id });
  };

  const handleTyping = (isTyping: boolean) => {
    if (!selectedConversation) return;
    emit(isTyping ? SOCKET_EVENTS.TYPING_START : SOCKET_EVENTS.TYPING_STOP, { targetId: selectedConversation.id });
  };

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleGroupCreated = (groupId: string) => {
    chatService.getConversations().then((data: Conversation[]) => {
      setConversations(data);
      navigate(`/chat/${groupId}`);
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0f172a] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative z-10"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6 mx-auto">
            <Sparkles className="text-white" size={32} />
          </div>
        </motion.div>
        <h2 className="text-white font-black text-2xl tracking-tighter mb-2">Syncing your campus...</h2>
        <div className="flex items-center space-x-2">
           <Loader2 className="animate-spin text-blue-500" size={16} />
           <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Establishing secure connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0f172a] flex overflow-hidden">
      <Sidebar
        conversations={conversations}
        selectedId={selectedConversation?.id || null}
        onSelect={handleSelectConversation}
        onCreateGroup={() => setIsGroupModalOpen(true)}
        onlineUsers={onlineUsers}
      />
      
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {messagesLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-[#0f172a]/50 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center">
                 <div className="w-10 h-1 border-t-2 border-blue-500 rounded-full animate-bounce mb-2" />
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Loading Intel</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              <ChatWindow
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                typingUsers={selectedConversation ? (typingUsers[selectedConversation.id] || []) : []}
                isOnline={selectedConversation && !selectedConversation.isGroup 
                  ? onlineUsers.has(selectedConversation.id) // In 1:1, conversation ID is the other user's ID
                  : false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
