import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, Video, Info, Paperclip, Smile, MessageSquare } from 'lucide-react';
import type { Message, Conversation } from '../services/chat.service';
import MessageBubble from './MessageBubble';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/ui';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  typingUsers: string[];
  isOnline: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  conversation, 
  messages, 
  onSendMessage,
  onTyping,
  typingUsers,
  isOnline
}) => {
  const [newMessage, setNewMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Typing logic
    onTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTyping(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0f172a] p-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-blue-500 mb-8 mx-auto border border-white/5 shadow-2xl">
            <MessageSquare size={48} />
          </div>
          <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Select a conversation</h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
            Connect with your classmates or join study groups to start the conversation.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden relative">
      {/* Header */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl px-6 py-4 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white font-black mr-4 shadow-lg",
              conversation.isGroup ? 'bg-indigo-600' : 'bg-blue-600'
            )}
          >
            {conversation.name.charAt(0).toUpperCase()}
          </motion.div>
          <div>
            <h3 className="font-black text-white leading-none mb-1">{conversation.name}</h3>
            <div className="flex items-center space-x-2">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                isOnline || conversation.isGroup ? "bg-green-500 animate-pulse" : "bg-slate-600"
              )} />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {typingUsers.length > 0 
                  ? `${typingUsers.join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`
                  : conversation.isGroup ? `${conversation.participants.length} Students` : (isOnline ? 'Active Connection' : 'Offline')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Phone size={20} />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Video size={20} />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-2">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isOwnMessage = msg.senderId === user?.id || msg.senderId === 'me';
              const showSenderName = conversation.isGroup && !isOwnMessage && (idx === 0 || messages[idx-1]?.senderId !== msg.senderId);
              
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwnMessage={isOwnMessage}
                  showSenderName={!!showSenderName}
                />
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/5">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-1 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all">
            <button type="button" className="p-2 text-slate-500 hover:text-blue-400 transition-colors">
              <Paperclip size={20} />
            </button>
            <input
              className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium text-white placeholder-slate-500 py-3 px-2"
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleInputChange}
            />
            <button type="button" className="p-2 text-slate-500 hover:text-yellow-400 transition-colors">
              <Smile size={20} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:grayscale shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
