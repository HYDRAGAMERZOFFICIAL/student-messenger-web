import React from 'react';
import type { Conversation } from '../services/chat.service';
import { formatDate, truncateText } from '../utils/helpers';

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateGroup: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, selectedId, onSelect, onCreateGroup }) => {
  return (
    <div className="w-80 border-r bg-white flex flex-col h-full">
      <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-black text-gray-900">Messages</h2>
        <button
          onClick={onCreateGroup}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          title="Create New Group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
            <p className="text-gray-400 text-sm font-medium">No conversations yet.</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`p-4 flex items-center space-x-3 cursor-pointer transition-all duration-200 border-b border-gray-50 ${
                selectedId === conv.id 
                  ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm ${
                conv.isGroup ? 'bg-indigo-500' : 'bg-blue-400'
              }`}>
                {conv.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`font-bold truncate ${selectedId === conv.id ? 'text-blue-900' : 'text-gray-800'}`}>
                    {conv.name}
                  </h4>
                  {conv.lastMessageTime && (
                    <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap ml-2 uppercase">
                      {formatDate(conv.lastMessageTime)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate font-medium">
                    {conv.lastMessage ? truncateText(conv.lastMessage, 35) : 'Start a conversation'}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
