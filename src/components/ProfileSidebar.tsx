import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, Shield, Bell, Share2, MoreHorizontal, GraduationCap, Clock, FileText } from 'lucide-react';
import type { Conversation } from '../services/chat.service';
import { cn } from '../utils/ui';

interface ProfileSidebarProps {
  conversation: Conversation | null;
  onClose: () => void;
  isOpen: boolean;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ conversation, onClose, isOpen }) => {
  if (!conversation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-[360px] bg-[#0a0f1d] border-l border-white/5 h-screen flex flex-col z-30 shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Node Intelligence</h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center glass-card text-slate-500 hover:text-white transition-all"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Profile Hero */}
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl ring-4 ring-white/5">
                  {conversation.name.charAt(0).toUpperCase()}
                </div>
                {!conversation.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-8 border-[#0a0f1d] rounded-full shadow-lg" />
                )}
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight mb-1">{conversation.name}</h4>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {conversation.isGroup ? 'Encrypted Community' : 'Direct Sync Active'}
              </p>
            </div>

            {/* Qualification/Progress placeholder */}
            <div className="px-8 mb-8">
               <div className="glass-card p-5 border-white/5">
                  <div className="flex items-center justify-between mb-3">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Status</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">85% Complete</p>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                     />
                  </div>
               </div>
            </div>

            {/* Details Section */}
            <div className="px-8 space-y-6">
               <section>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 border-b border-white/5 pb-2">Identification</h5>
                  <div className="space-y-4">
                     <DetailItem icon={Mail} label="Nexus ID" value={conversation.isGroup ? `${conversation.participants.length} Members` : 'subject@nexus.edu'} />
                     <DetailItem icon={GraduationCap} label="Faculty" value="Advanced Computing" />
                     <DetailItem icon={Clock} label="Last Active" value="15m ago" />
                  </div>
               </section>

               <section>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 border-b border-white/5 pb-2">Data Archives</h5>
                  <div className="grid grid-cols-2 gap-3">
                     <ArchiveCard icon={FileText} label="Transcripts" count={12} />
                     <ArchiveCard icon={Share2} label="Assets" count={45} />
                  </div>
               </section>

               <section>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 border-b border-white/5 pb-2">Security Controls</h5>
                  <div className="space-y-2">
                     <ControlButton icon={Bell} label="Mute Signal" />
                     <ControlButton icon={Shield} label="Verify Node" />
                     <ControlButton icon={MoreHorizontal} label="Advanced Config" color="text-red-500" />
                  </div>
               </section>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DetailItem = ({ icon: Icon, label, value }: any) => (
   <div className="flex items-center space-x-3">
      <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500">
         <Icon size={16} />
      </div>
      <div>
         <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 leading-none mb-1">{label}</p>
         <p className="text-[13px] font-bold text-slate-300 tracking-tight">{value}</p>
      </div>
   </div>
);

const ArchiveCard = ({ icon: Icon, label, count }: any) => (
   <div className="glass-card p-4 border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group">
      <Icon size={18} className="text-slate-600 group-hover:text-blue-500 transition-colors mb-2" />
      <p className="text-[13px] font-black text-white leading-none mb-1">{count}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">{label}</p>
   </div>
);

const ControlButton = ({ icon: Icon, label, color = "text-slate-400" }: any) => (
   <button className={cn(
      "w-full flex items-center justify-between p-3.5 glass-card border-white/5 hover:bg-white/[0.04] transition-all group",
      color
   )}>
      <div className="flex items-center space-x-3">
         <Icon size={18} />
         <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      </div>
   </button>
);

export default ProfileSidebar;