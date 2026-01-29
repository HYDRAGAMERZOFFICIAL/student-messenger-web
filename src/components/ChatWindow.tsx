import React, { useState, useEffect, useRef } from 'react';
import type { Message, Conversation } from '../services/chat.service';
import MessageBubble from './MessageBubble';
import { useAuth } from '../hooks/useAuth';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 p-8 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-300 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">Select a conversation</h3>
        <p className="text-gray-400 font-medium max-w-xs mx-auto">Choose a contact or group from the sidebar to start messaging.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50/30 overflow-hidden relative">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-sm ${
            conversation.isGroup ? 'bg-indigo-500' : 'bg-blue-400'
          }`}>
            {conversation.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-black text-gray-900 leading-tight">{conversation.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {conversation.isGroup ? `${conversation.participants.length} Participants` : 'Active Now'}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-1 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40 grayscale">
             <p className="text-sm font-black text-gray-400 uppercase tracking-tighter italic">No messages yet</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
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
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white/80 backdrop-blur-md border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3 bg-gray-100 p-2 pl-4 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <input
            className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-gray-800 placeholder-gray-400 py-2"
            type="text"
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:grayscale shadow-lg shadow-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
