import React, { useState } from 'react';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-black text-gray-900">Create New Group</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-sm font-black text-gray-700 mb-1 uppercase tracking-wider">Group Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-200"
              placeholder="Study Group Alpha"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 mb-1 uppercase tracking-wider">Participant IDs (Demo)</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-200"
              placeholder="user_id_1, user_id_2"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
            <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Separate multiple IDs with commas.</p>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100"
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGroupModal;
