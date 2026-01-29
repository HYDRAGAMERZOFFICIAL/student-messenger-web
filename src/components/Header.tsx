import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-blue-600 text-white px-3 py-1 rounded-lg">
          SM
        </Link>
        
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">Dashboard</Link>
              <Link to="/chat" className="text-gray-600 hover:text-blue-600 font-medium transition">Chat</Link>
              <div className="flex items-center space-x-4 pl-4 border-l">
                <span className="text-sm font-semibold text-gray-800">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
