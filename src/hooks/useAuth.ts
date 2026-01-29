import { useState, useEffect } from 'react';
import { authService, User } from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(!!currentUser);
  }, []);

  const login = async (credentials: any) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (userData: any) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
