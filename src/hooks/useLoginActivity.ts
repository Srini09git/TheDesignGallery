"use client";

import { useState, useCallback } from 'react';
import { getInactivityTier, LoginWarningInfo } from './useAuth';

const LAST_LOGIN_KEY = 'lastLogin';

export function useLoginActivity(storageKey: string = LAST_LOGIN_KEY) {
  const [warningData, setWarningData] = useState<LoginWarningInfo | null>(null);

  const checkActivity = useCallback(() => {
    try {
      const lastLoginStr = localStorage.getItem(storageKey);
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

          setWarningData({
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
          setWarningData({
            inactiveDays: 0,
            inactiveHours: 0,
            lastLoginFormatted: 'First Login',
            ...tierInfo,
          });
        }
      } else {
        const tierInfo = getInactivityTier(0, 0, true);
        setWarningData({
          inactiveDays: 0,
          inactiveHours: 0,
          lastLoginFormatted: 'First Login',
          ...tierInfo,
        });
      }

      // Always update lastLogin to current timestamp after checking
      localStorage.setItem(storageKey, now.toISOString());
    } catch (error) {
      console.error('Failed to process login activity tracking:', error);
      localStorage.setItem(storageKey, new Date().toISOString());
    }
  }, [storageKey]);

  const clearWarning = useCallback(() => {
    setWarningData(null);
  }, []);

  return {
    warningData,
    checkActivity,
    clearWarning,
  };
}
