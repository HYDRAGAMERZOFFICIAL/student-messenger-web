import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, MessageSquare, Users, Settings, Bell, Bookmark, HelpCircle } from 'lucide-react';
import { cn } from '../utils/ui';

interface NavRailProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavRail: React.FC<NavRailProps> = ({ activeTab, onTabChange }) => {
  const items = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'chat', icon: MessageSquare, label: 'Messages' },
    { id: 'groups', icon: Users, label: 'Communities' },
    { id: 'bookmarks', icon: Bookmark, label: 'Intel' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
  ];

  return (
    <div className="w-[80px] bg-[#0a0f1d] border-r border-white/5 flex flex-col items-center py-8 z-30">
      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-12">
        <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center">
           <div className="w-2 h-2 bg-white rounded-sm" />
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "group relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300",
              activeTab === item.id 
                ? "bg-blue-600/10 text-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                : "text-slate-600 hover:text-slate-300 hover:bg-white/5"
            )}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            
            {activeTab === item.id && (
              <motion.div 
                layoutId="nav-pill"
                className="absolute -left-1 w-1 h-6 bg-blue-600 rounded-full"
              />
            )}

            {/* Tooltip */}
            <div className="absolute left-16 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/5">
              {item.label}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col space-y-4 mt-auto">
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-600 hover:text-white hover:bg-white/5 transition-all">
          <HelpCircle size={22} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-600 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={22} />
        </button>
      </div>
    </div>
  );
};

export default NavRail;