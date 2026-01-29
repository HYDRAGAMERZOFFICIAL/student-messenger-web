import React from 'react';
import { Conversation } from '../services/chat.service';

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, selectedId, onSelect }) => {
  return (
    <div className="w-1/4 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm italic">No conversations yet.</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition duration-150 ${
                selectedId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800 truncate">{conv.name}</h4>
                {conv.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage || 'No messages'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
