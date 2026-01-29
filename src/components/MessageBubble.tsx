import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '../services/chat.service';
import { formatDate } from '../utils/helpers';
import { cn } from '../utils/ui';

interface MessageBubbleProps {
  message: Message & { status?: 'sending' | 'sent' | 'failed' };
  isOwnMessage: boolean;
  showSenderName: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, showSenderName }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex flex-col mb-1",
        isOwnMessage ? "items-end" : "items-start"
      )}
    >
      {showSenderName && !isOwnMessage && (
        <span className="text-[10px] font-black text-slate-500 mb-1 ml-4 uppercase tracking-widest">
          {message.senderName || 'Anonymous Student'}
        </span>
      )}
      
      <div className={cn(
        "max-w-[80%] group relative",
        isOwnMessage ? "flex flex-row-reverse" : "flex flex-row"
      )}>
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl shadow-sm text-[15px] font-medium leading-relaxed transition-all",
            isOwnMessage
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-white/5 border border-white/5 text-slate-200 rounded-tl-none hover:bg-white/10"
          )}
        >
          {message.content}
          
          <div className={cn(
            "text-[9px] mt-1 flex items-center space-x-1 transition-opacity",
            isOwnMessage ? "text-blue-100 justify-end" : "text-slate-500 justify-start",
            message.status === 'sending' ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <span>{formatDate(message.timestamp)}</span>
            {isOwnMessage && (
              <span className="font-black uppercase tracking-tighter">
                {message.status === 'sending' ? '• Sending' : '• Sent'}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
