import { useState, useEffect } from 'react';
import { DUMMY_LOGIN_NOTIFICATIONS_JSON } from '@/components/LoginActivityModal';

const AUTH_KEY = 'poster_user';
const LAST_LOGIN_KEY = 'lastLogin';

export interface User {
  username: string;
  roles: string[];
}

export interface LoginWarningInfo {
  inactiveDays: number;
  inactiveHours: number;
  lastLoginFormatted: string;
  title: string;
  badge: string;
  message: string;
  badgeClass: string;
  iconType: 'info' | 'warning' | 'alert' | 'urgent';
}

export function getInactivityTier(diffHours: number, diffDays: number, isFirstLogin: boolean = false) {
  if (isFirstLogin) {
    return DUMMY_LOGIN_NOTIFICATIONS_JSON.first_login;
  }

  if (diffHours < 24) {
    return DUMMY_LOGIN_NOTIFICATIONS_JSON.active_today;
  }

  if (diffDays < 2) {
    // 24 hours to < 48 hours (1 day)
    return DUMMY_LOGIN_NOTIFICATIONS_JSON.inactive_24h;
  }

  if (diffDays >= 2 && diffDays < 5) {
    // 2 to 4 days
    return {
      ...DUMMY_LOGIN_NOTIFICATIONS_JSON.inactive_2_5_days,
      badge: `${diffDays} Days Inactive`,
    };
  }

  if (diffDays >= 5 && diffDays <= 7) {
    // 5 to 7 days
    return {
      ...DUMMY_LOGIN_NOTIFICATIONS_JSON.inactive_5_7_days,
      badge: `${diffDays} Days Inactive`,
    };
  }

  // More than 7 days (> 7 days)
  return {
    ...DUMMY_LOGIN_NOTIFICATIONS_JSON.inactive_over_7_days,
    badge: `${diffDays} Days Away`,
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginWarning, setLoginWarning] = useState<LoginWarningInfo | null>(null);

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

  const checkLoginActivity = () => {
    try {
      const lastLoginStr = localStorage.getItem(LAST_LOGIN_KEY);
      const now = new Date();

      if (lastLoginStr) {
        const lastLoginDate = new Date(lastLoginStr);
        if (!isNaN(lastLoginDate.getTime())) {
          const diffMs = now.getTime() - lastLoginDate.getTime();
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          const tierInfo = getInactivityTier(diffHours, diffDays, false);

          const formatted = lastLoginDate.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          setLoginWarning({
            inactiveDays: diffDays,
            inactiveHours: diffHours,
            lastLoginFormatted: formatted,
            title: tierInfo.title,
            badge: tierInfo.badge,
            message: tierInfo.message,
            badgeClass: tierInfo.badgeClass,
            iconType: tierInfo.iconType,
          });
        } else {
          const tierInfo = getInactivityTier(0, 0, true);
          setLoginWarning({
            inactiveDays: 0,
            inactiveHours: 0,
            lastLoginFormatted: 'First Login',
            ...tierInfo,
          });
        }
      } else {
        // First login ever
        const tierInfo = getInactivityTier(0, 0, true);
        setLoginWarning({
          inactiveDays: 0,
          inactiveHours: 0,
          lastLoginFormatted: 'First Login',
          ...tierInfo,
        });
      }

      // Always update lastLogin to current timestamp after checking
      localStorage.setItem(LAST_LOGIN_KEY, now.toISOString());
    } catch (e) {
      console.error('Error checking login activity:', e);
      localStorage.setItem(LAST_LOGIN_KEY, new Date().toISOString());
    }
  };

  const login = (username: string, roles: string[] = []) => {
    const userObj: User = { username, roles };
    localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
    
    // Check login activity and show popup on every login
    checkLoginActivity();

    setUser(userObj);
  };

  const dismissLoginWarning = () => {
    setLoginWarning(null);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setLoginWarning(null);
  };

  return { user, isLoading, login, logout, loginWarning, dismissLoginWarning };
};
