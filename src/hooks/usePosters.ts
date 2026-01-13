import { useState, useEffect } from 'react';
import { Poster, Category } from '@/types/poster';

export const usePosters = (completedIds: number[] = []) => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await fetch('/data/posters.json');
        const data = await response.json();
        setPosters(data.posters);
      } catch (error) {
        console.error('Error fetching posters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosters();
  }, []);

  const filteredPosters = (() => {
    if (selectedCategory === 'all') {
      return posters;
    }
    if (selectedCategory === 'completed') {
      return posters.filter(poster => completedIds.includes(poster.id));
    }
    return posters.filter(poster => poster.category === selectedCategory);
  })();

  const categories: Category[] = ['all', 'logo', 'poster', 'flyer', 'banner', 'completed'];

  return {
    posters: filteredPosters,
    allPosters: posters,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
};
