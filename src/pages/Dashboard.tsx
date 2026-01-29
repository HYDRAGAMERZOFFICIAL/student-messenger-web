import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    { title: 'Chat', description: 'Message your classmates and groups', link: '/chat', color: 'bg-blue-500' },
    { title: 'Groups', description: 'Join or create study groups', link: '/dashboard', color: 'bg-green-500' },
    { title: 'Profile', description: 'Manage your account settings', link: '/dashboard', color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-gray-600">Stay connected with your fellow students and manage your conversations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.link}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition duration-200 group"
          >
            <div className={`w-12 h-12 ${action.color} rounded-lg mb-4 flex items-center justify-center text-white`}>
              {/* Icon placeholder */}
              <span className="text-xl font-bold">{action.title.charAt(0)}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
              {action.title}
            </h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg p-4 text-center text-gray-500 italic text-sm">
          No recent activity to show.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
