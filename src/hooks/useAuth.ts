import { useState, useEffect } from 'react';

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
    return {
      title: "Welcome to CWlearning!",
      badge: "First Login",
      message: "Welcome aboard! Track your UI/UX flows, graphic design assets, and real-world design challenges. Let's start learning!",
      badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      iconType: 'info' as const
    };
  }

  if (diffHours < 24) {
    return {
      title: "Welcome Back!",
      badge: "Active Today",
      message: "Glad to see you back today! Keep up your awesome daily learning momentum and conquer your next design challenge.",
      badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      iconType: 'info' as const
    };
  }

  if (diffDays < 2) {
    // 24 hours to < 48 hours (1 day)
    return {
      title: "Welcome Back!",
      badge: "24 Hours Inactive",
      message: "Great to see you today! Daily practice builds strong design habits—let's keep your learning momentum going!",
      badgeClass: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      iconType: 'info' as const
    };
  }

  if (diffDays >= 2 && diffDays < 5) {
    // 2 to 4 days
    return {
      title: "We Missed You!",
      badge: `${diffDays} Days Inactive`,
      message: `We missed you over the last ${diffDays} days! Ready to get back into your creative flow and tackle your next design challenge?`,
      badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      iconType: 'warning' as const
    };
  }

  if (diffDays >= 5 && diffDays <= 7) {
    // 5 to 7 days
    return {
      title: "Time to Catch Up!",
      badge: `${diffDays} Days Inactive`,
      message: `It's been ${diffDays} days since your last login! Your design journey is waiting for you. Let's make today count and catch up on your goals!`,
      badgeClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
      iconType: 'alert' as const
    };
  }

  // More than 7 days (> 7 days)
  return {
    title: "Welcome Back, Designer!",
    badge: `${diffDays} Days Away`,
    message: `It's been over a week (${diffDays} days)! It's never too late to restart your learning streak. Explore new UI/UX flows and challenges today!`,
    badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    iconType: 'urgent' as const
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
