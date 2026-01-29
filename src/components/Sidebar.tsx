import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageSquare, Users, Settings, LogOut } from 'lucide-react';
import type { Conversation } from '../services/chat.service';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/ui';

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateGroup: () => void;
  onlineUsers: Set<string>;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, selectedId, onSelect, onCreateGroup, onlineUsers }) => {
  const { logout, user } = useAuth();

  return (
    <div className="w-80 glass-panel border-r-0 h-screen flex flex-col z-20">
      {/* User Profile Mini */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-black truncate">{user?.username}</h2>
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-tighter">Student verified</p>
          </div>
          <button 
            onClick={logout}
            className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="p-4 space-y-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search chats..." 
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:bg-white/10 transition-all text-white"
          />
        </div>
        
        <button 
          onClick={onCreateGroup}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 py-2 rounded-xl text-sm font-black transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>New Group Chat</span>
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
        <div className="px-4 py-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Activity</h3>
        </div>
        
        <AnimatePresence mode='popLayout'>
          {conversations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 px-6"
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={20} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">No connections yet</p>
            </motion.div>
          ) : (
            conversations.map((conv) => (
              <motion.div
                layout
                key={conv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "group p-3 flex items-center space-x-3 cursor-pointer rounded-2xl transition-all duration-300 relative overflow-hidden",
                  selectedId === conv.id 
                    ? "bg-blue-600/10 border border-blue-500/20 shadow-lg" 
                    : "hover:bg-white/5 border border-transparent"
                )}
              >
                {selectedId === conv.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" 
                  />
                )}

                <div className={cn(
                  "w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black text-lg transition-transform group-hover:scale-105 shadow-md relative",
                  conv.isGroup ? 'bg-indigo-600' : 'bg-slate-700'
                )}>
                  {conv.isGroup ? <Users size={20} /> : conv.name.charAt(0).toUpperCase()}
                  
                  {/* Presence indicator for 1:1 chats */}
                  {!conv.isGroup && onlineUsers.has(conv.id) && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#0f172a] rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className={cn(
                      "font-black truncate text-sm transition-colors",
                      selectedId === conv.id ? "text-blue-400" : "text-slate-200 group-hover:text-white"
                    )}>
                      {conv.name}
                    </h4>
                    {conv.lastMessageTime && (
                      <span className="text-[9px] text-slate-500 font-black whitespace-nowrap ml-2 uppercase">
                        {formatDate(conv.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-slate-400 truncate font-medium">
                      {conv.lastMessage || 'Start a conversation...'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-lg font-black min-w-[18px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Nav */}
      <div className="p-4 grid grid-cols-3 gap-2 border-t border-white/5">
        <button className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-600/10 text-blue-400">
           <MessageSquare size={18} />
        </button>
        <button className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-white/5">
           <Users size={18} />
        </button>
        <button className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-white/5">
           <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
