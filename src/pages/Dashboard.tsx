import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Unread Messages', value: '0', icon: 'M', color: 'text-blue-600' },
    { label: 'Study Groups', value: '0', icon: 'G', color: 'text-green-600' },
    { label: 'Assignments', value: '0', icon: 'A', color: 'text-purple-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Hello, {user?.username}!</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl font-medium">
            Welcome to your student workspace. Stay synchronized with your peers and excel in your academic journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/chat" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg">
              Open Messenger
            </Link>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center font-black text-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900">Recent Chats</h2>
            <Link to="/chat" className="text-blue-600 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No recent conversations.</p>
            <Link to="/chat" className="mt-4 text-sm text-blue-600 font-bold">Start a new chat</Link>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900">Group Updates</h2>
            <button className="text-blue-600 text-sm font-bold hover:underline">Find Groups</button>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">You haven't joined any groups yet.</p>
            <button className="mt-4 text-sm text-blue-600 font-bold">Explore Categories</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
