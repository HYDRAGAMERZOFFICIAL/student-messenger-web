import React from 'react';
import type { Message } from '../services/chat.service';
import { formatDate } from '../utils/helpers';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showSenderName: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, showSenderName }) => {
  return (
    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} mb-4`}>
      {showSenderName && !isOwnMessage && (
        <span className="text-xs font-bold text-gray-500 mb-1 ml-1">
          {message.senderName || 'Unknown User'}
        </span>
      )}
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${
          isOwnMessage
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
        }`}
      >
        <p className="text-[15px] leading-relaxed break-words">{message.content}</p>
        <p className={`text-[10px] mt-1 text-right opacity-70 ${isOwnMessage ? 'text-blue-100' : 'text-gray-400'}`}>
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
