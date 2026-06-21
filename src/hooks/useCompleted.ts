import { useState, useEffect } from 'react';

const COMPLETED_KEY = 'poster_completed';
const COMPLETED_DATES_KEY = 'poster_completed_dates';
const DOWNLOAD_DATES_KEY = 'poster_download_dates';

export const useCompleted = () => {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [completedDates, setCompletedDates] = useState<Record<number, string>>({});
  const [downloadDates, setDownloadDates] = useState<Record<number, string>>({});

  useEffect(() => {
    const storedIds = localStorage.getItem(COMPLETED_KEY);
    if (storedIds) {
      try {
        setCompletedIds(JSON.parse(storedIds));
      } catch {
        setCompletedIds([]);
      }
    }

    const storedDates = localStorage.getItem(COMPLETED_DATES_KEY);
    if (storedDates) {
      try {
        setCompletedDates(JSON.parse(storedDates));
      } catch {
        setCompletedDates({});
      }
    }

    const storedDownloads = localStorage.getItem(DOWNLOAD_DATES_KEY);
    if (storedDownloads) {
      try {
        setDownloadDates(JSON.parse(storedDownloads));
      } catch {
        setDownloadDates({});
      }
    }
  }, []);

  const markCompleted = (id: number) => {
    setCompletedIds((prev) => {
      if (prev.includes(id)) return prev; // Cannot undo!
      const newIds = [...prev, id];
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(newIds));
      return newIds;
    });

    setCompletedDates((prev) => {
      if (prev[id]) return prev; // already has date
      const dateStr = new Date().toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
      const newDates = { ...prev, [id]: dateStr };
      localStorage.setItem(COMPLETED_DATES_KEY, JSON.stringify(newDates));
      return newDates;
    });
  };

  const markDownloaded = (id: number) => {
    setDownloadDates((prev) => {
      const dateStr = new Date().toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
      // Always update on download to reflect the *recent* click time
      const newDates = { ...prev, [id]: dateStr };
      localStorage.setItem(DOWNLOAD_DATES_KEY, JSON.stringify(newDates));
      return newDates;
    });
  };

  const isCompleted = (id: number) => completedIds.includes(id);
  const getCompletionDate = (id: number) => completedDates[id] || null;
  const getDownloadDate = (id: number) => downloadDates[id] || null;

  return { 
    completedIds, 
    markCompleted, 
    isCompleted, 
    getCompletionDate,
    markDownloaded,
    getDownloadDate
  };
};
