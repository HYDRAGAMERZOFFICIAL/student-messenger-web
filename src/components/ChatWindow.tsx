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
      <div className="bg-[#0f172a]/40 backdrop-blur-2xl px-8 py-5 border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-5">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl",
              conversation.isGroup ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-blue-600 shadow-blue-500/20'
            )}
          >
            {conversation.name.charAt(0).toUpperCase()}
          </motion.div>
          <div>
            <h3 className="font-black text-white text-lg tracking-tight leading-none mb-1.5">{conversation.name}</h3>
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                isOnline || conversation.isGroup ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" : "bg-slate-600"
              )} />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                {typingUsers.length > 0 
                  ? `${typingUsers[0]} is transmitting...`
                  : conversation.isGroup ? `${conversation.participants.length} Active Nodes` : (isOnline ? 'Encrypted Connection' : 'Node Offline')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="w-11 h-11 flex items-center justify-center glass-card hover:bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90">
            <Phone size={18} />
          </button>
          <button className="w-11 h-11 flex items-center justify-center glass-card hover:bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90">
            <Video size={18} />
          </button>
          <button className="w-11 h-11 flex items-center justify-center glass-card hover:bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90">
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-8 overflow-y-auto scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed opacity-90">
        <div className="max-w-4xl mx-auto space-y-4">
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
      <div className="p-8 pt-4 bg-gradient-to-t from-[#0f172a] to-transparent">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center space-x-4">
          <div className="flex-1 flex items-center glass-panel !rounded-[24px] px-2 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all group">
            <button type="button" className="p-4 text-slate-600 hover:text-blue-400 transition-colors">
              <Paperclip size={20} />
            </button>
            <input
              className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium text-white placeholder-slate-600 py-5 px-2"
              type="text"
              placeholder="Transmit data..."
              value={newMessage}
              onChange={handleInputChange}
            />
            <button type="button" className="p-4 text-slate-600 hover:text-yellow-400 transition-colors">
              <Smile size={20} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn-primary !p-5 !rounded-[24px] shadow-2xl active:scale-90"
          >
            <Send size={22} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
