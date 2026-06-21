import { useState, useEffect } from 'react';
import { Poster, Category } from '@/types/poster';
import { Track } from '@/components/TrackNavigation';

export const usePosters = (completedIds: number[] = [], track: Track = 'graphic-design') => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>(track === 'ui-ux' ? 'mobile-screen' : 'all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    setSelectedCategory(track === 'ui-ux' ? 'mobile-screen' : 'all');
    setSelectedLevel('all');
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
        } else if (track === 'challenges') {
          const res = await fetch('/data/challenges.json');
          const data = await res.json();
          setPosters(data.posters || []);
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
      return [...uiuxCategories, 'completed'] as Category[];
    }
    if (track === 'challenges') {
      return ['all', 'completed'] as Category[];
    }
    return ['all', ...graphicCategories, 'completed'] as Category[];
  })();

  const filteredPosters = (() => {
    const trackPosters = (() => {
      if (track === 'ui-ux') {
        return posters.filter(poster => uiuxCategories.includes(poster.category as Category));
      }
      if (track === 'challenges') {
        return posters.filter(poster => poster.category === 'challenge');
      }
      return posters.filter(poster => graphicCategories.includes(poster.category as Category));
    })();

    const levelFiltered = (() => {
      if (selectedLevel === 'all') return trackPosters;
      const queryLevel = selectedLevel.toLowerCase() === 'easy' ? 'easy' : selectedLevel.toLowerCase();
      return trackPosters.filter(poster => poster.author.toLowerCase() === queryLevel);
    })();

    if (selectedCategory === 'all') {
      return levelFiltered;
    }
    if (selectedCategory === 'completed') {
      return levelFiltered.filter(poster => completedIds.includes(poster.id));
    }
    return levelFiltered.filter(poster => poster.category === selectedCategory);
  })();

  return {
    posters: filteredPosters,
    allPosters: posters,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    categories,
    selectedLevel,
    setSelectedLevel,
  };
};

