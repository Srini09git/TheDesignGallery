import { useState, useEffect } from 'react';

const AUTH_KEY = 'poster_user';

export interface User {
  username: string;
  roles: string[];
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_KEY);
      if (storedUser) {
        // If it's a legacy string, we upgrade it to an object with no roles
        if (!storedUser.startsWith('{')) {
          setUser({ username: storedUser, roles: [] });
        } else {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, roles: string[] = []) => {
    const userObj: User = { username, roles };
    localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, isLoading, login, logout };
};
