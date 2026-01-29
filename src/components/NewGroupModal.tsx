import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, MessageSquare, Loader2 } from 'lucide-react';
import { chatService } from '../services/chat.service';

interface NewGroupModalProps {
  onClose: () => void;
  onCreated: (groupId: string) => void;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({ onClose, onCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<string>(''); // For demo, comma separated IDs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return setError('Group name is required');
    
    setLoading(true);
    try {
      const participantList = participants.split(',').map(p => p.trim()).filter(p => p);
      const newGroup = await chatService.createGroup(groupName, participantList);
      onCreated(newGroup.id);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel w-full max-w-md overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
              <Users size={20} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Establish Group</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 text-red-400 p-3 rounded-xl text-[11px] font-black uppercase tracking-widest border border-red-500/20 text-center"
            >
              {error}
            </motion.div>
          )}
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Group Designation</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium placeholder:text-slate-600"
              placeholder="e.g. Advanced Calculus Sync"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Target Personnel (IDs)</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium placeholder:text-slate-600"
              placeholder="user_id_1, user_id_2"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
            <p className="text-[9px] text-slate-500 mt-2 font-black uppercase tracking-tighter flex items-center">
              <span className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
              Separate identifiers with commas
            </p>
          </div>

          <div className="pt-2 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase text-[11px] tracking-widest"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-500 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 uppercase text-[11px] tracking-widest flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <MessageSquare size={16} />
                  <span>Initialize Group</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewGroupModal;
