import { useState, useEffect } from 'react';

const COMPLETED_KEY = 'poster_completed';

export const useCompleted = () => {
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(COMPLETED_KEY);
    if (stored) {
      try {
        setCompletedIds(JSON.parse(stored));
      } catch {
        setCompletedIds([]);
      }
    }
  }, []);

  const toggleCompleted = (id: number) => {
    setCompletedIds((prev) => {
      const newIds = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(newIds));
      return newIds;
    });
  };

  const isCompleted = (id: number) => completedIds.includes(id);

  return { completedIds, toggleCompleted, isCompleted };
};
