import React from 'react';

const Chat: React.FC = () => {
  return (
    <div className="flex h-[80vh] border rounded shadow">
      <div className="w-1/4 border-r bg-white p-4">
        <h2 className="font-bold border-b pb-2 mb-4">Contacts</h2>
        {/* Sidebar content */}
      </div>
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Chat messages */}
          <p className="text-gray-500 italic">Select a conversation to start chatting.</p>
        </div>
        <div className="p-4 border-t bg-white">
          <input className="w-full p-2 border rounded" type="text" placeholder="Type a message..." />
        </div>
      </div>
    </div>
  );
};

export default Chat;
