import { useState, useEffect } from 'react';
import { Poster, Category } from '@/types/poster';

export const usePosters = (completedIds: number[] = [], track: 'graphic-design' | 'ui-ux' = 'graphic-design') => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  useEffect(() => {
    setSelectedCategory('all');
  }, [track]);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setIsLoading(true);
        if (track === 'ui-ux') {
          const [mobileRes, pcRes, uxRes] = await Promise.all([
            fetch('/data/uiux-mobile.json'),
            fetch('/data/uiux-pc.json'),
            fetch('/data/uiux-ux.json')
          ]);
          const mobileData = await mobileRes.json();
          const pcData = await pcRes.json();
          const uxData = await uxRes.json();
          setPosters([
            ...(mobileData.posters || []),
            ...(pcData.posters || []),
            ...(uxData.posters || [])
          ]);
        } else {
          const [postersRes, logosRes] = await Promise.all([
            fetch('/data/posters.json'),
            fetch('/data/logos.json')
          ]);
          const postersData = await postersRes.json();
          const logosData = await logosRes.json();
          setPosters([
            ...(postersData.posters || []),
            ...(logosData.posters || [])
          ]);
        }
      } catch (error) {
        console.error('Error fetching posters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosters();
  }, [track]);

  const graphicCategories: Category[] = ['poster', 'BrandLogo', 'logo', 'flyer', 'banner'];
  const uiuxCategories: Category[] = ['mobile-screen', 'desktop-ui', 'ux'];

  const categories = (() => {
    if (track === 'ui-ux') {
      return ['all', ...uiuxCategories, 'completed'] as Category[];
    }
    return ['all', ...graphicCategories, 'completed'] as Category[];
  })();

  const filteredPosters = (() => {
    const trackPosters = (() => {
      if (track === 'ui-ux') {
        return posters.filter(poster => uiuxCategories.includes(poster.category as Category));
      }
      return posters.filter(poster => graphicCategories.includes(poster.category as Category));
    })();

    if (selectedCategory === 'all') {
      return trackPosters;
    }
    if (selectedCategory === 'completed') {
      return trackPosters.filter(poster => completedIds.includes(poster.id));
    }
    return trackPosters.filter(poster => poster.category === selectedCategory);
  })();

  return {
    posters: filteredPosters,
    allPosters: posters,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
};
