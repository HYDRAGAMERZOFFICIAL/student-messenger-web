import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageSquare, Users, Settings, LogOut, Loader2 } from 'lucide-react';
import { chatService, type Conversation } from '../services/chat.service';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; username: string; email: string; avatar?: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await chatService.searchUsers(searchQuery);
          setSearchResults(results);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleUserSelect = (userId: string) => {
    // Check if conversation already exists
    const existing = conversations.find(c => !c.isGroup && c.id === userId);
    if (existing) {
      onSelect(existing.id);
    } else {
      // If it doesn't exist, we just navigate to it. 
      // The Chat page will handle creating the conversation on first message.
      onSelect(userId);
    }
    setSearchQuery('');
  };

  return (
    <div className="w-[340px] glass-panel border-r-0 h-screen flex flex-col z-20 overflow-hidden">
      {/* User Profile Mini */}
      <div className="p-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-[22px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] ring-2 ring-white/10">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h2 className="text-white font-black text-lg tracking-tight leading-none mb-1.5">{user?.username}</h2>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Online</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-10 h-10 flex items-center justify-center glass-card hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all active:scale-90"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="space-y-4">
          <div className="relative group">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={18} />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            )}
            <input 
              type="text" 
              placeholder="Search Intelligence..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-12 py-3.5 text-sm"
            />
          </div>
          
          <button 
            onClick={onCreateGroup}
            className="w-full btn-primary !py-3.5 !rounded-2xl !text-[10px] flex items-center justify-center space-x-2"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Initialize Group</span>
          </button>
        </div>
      </div>

      {/* Conversation List / Search Results */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide py-2">
        <div className="px-4 py-3 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500/70">
            {searchQuery ? 'Search Results' : 'Recent Communications'}
          </h3>
          <div className="w-8 h-[1px] bg-white/5" />
        </div>
        
        <AnimatePresence mode='popLayout'>
          {searchQuery ? (
            searchResults.length === 0 && !isSearching ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 px-6"
              >
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">No Nodes Found</p>
              </motion.div>
            ) : (
              searchResults.map((result) => (
                <motion.div
                  key={result.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleUserSelect(result.id)}
                  className="group p-4 flex items-center space-x-4 cursor-pointer rounded-[24px] hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center text-white font-black text-lg">
                    {result.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black truncate text-[15px] text-slate-200 group-hover:text-white">
                      {result.username}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate font-black uppercase tracking-widest">
                      {result.email}
                    </p>
                  </div>
                </motion.div>
              ))
            )
          ) : conversations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-6"
            >
              <div className="w-16 h-16 bg-white/[0.03] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                <MessageSquare size={24} className="text-slate-700" />
              </div>
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Zero Active Channels</p>
            </motion.div>
          ) : (
            conversations.map((conv) => (
              <motion.div
                layout
                key={conv.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "group p-4 flex items-center space-x-4 cursor-pointer rounded-[24px] transition-all duration-300 relative overflow-hidden",
                  selectedId === conv.id 
                    ? "bg-blue-600/10 border border-blue-500/20 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.2)]" 
                    : "hover:bg-white/[0.04] border border-transparent hover:border-white/5"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black text-xl transition-all duration-500 group-hover:scale-105 shadow-lg relative",
                  conv.isGroup ? 'bg-indigo-600' : 'bg-slate-800 border border-white/5'
                )}>
                  {conv.isGroup ? <Users size={24} /> : conv.name.charAt(0).toUpperCase()}
                  
                  {!conv.isGroup && onlineUsers.has(conv.id) && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[5px] border-[#0f172a] rounded-full shadow-lg" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={cn(
                      "font-black truncate text-[15px] tracking-tight transition-colors",
                      selectedId === conv.id ? "text-blue-400" : "text-slate-200 group-hover:text-white"
                    )}>
                      {conv.name}
                    </h4>
                    {conv.lastMessageTime && (
                      <span className="text-[9px] text-slate-600 font-black whitespace-nowrap ml-2 uppercase tracking-tighter">
                        {formatDate(conv.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 truncate font-medium tracking-tight">
                      {conv.lastMessage 
                        ? (conv.lastMessageSenderId === user?.id ? `You: ${conv.lastMessage}` : conv.lastMessage) 
                        : 'Channel established...'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black min-w-[20px] h-5 flex items-center justify-center shadow-lg shadow-blue-500/40">
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
      <div className="p-6 pt-2 grid grid-cols-3 gap-3">
        <button className="flex items-center justify-center h-12 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 transition-all active:scale-90">
           <MessageSquare size={20} />
        </button>
        <button className="flex items-center justify-center h-12 rounded-2xl glass-card text-slate-500 hover:text-white transition-all active:scale-90">
           <Users size={20} />
        </button>
        <button className="flex items-center justify-center h-12 rounded-2xl glass-card text-slate-500 hover:text-white transition-all active:scale-90">
           <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
