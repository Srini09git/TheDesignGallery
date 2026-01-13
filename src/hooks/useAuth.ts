import { useState, useEffect } from 'react';

const AUTH_KEY = 'poster_user';

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_KEY);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string) => {
    localStorage.setItem(AUTH_KEY, username);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, isLoading, login, logout };
};
