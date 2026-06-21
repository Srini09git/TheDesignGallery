"use client";

import { Poster } from '@/types/poster';
import PosterCard from './PosterCard';
import { Loader2 } from 'lucide-react';

interface PosterGridProps {
  posters: Poster[];
  isLoading: boolean;
  onPosterClick: (poster: Poster) => void;
  completedIds?: number[];
  getCompletionDate?: (id: number) => string | null;
  getDownloadDate?: (id: number) => string | null;
}

const PosterGrid = ({ posters, isLoading, onPosterClick, completedIds = [], getCompletionDate, getDownloadDate }: PosterGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-muted-foreground">No posters found in this category</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid px-4">
      {posters.map((poster, index) => (
        <PosterCard
          key={poster.id}
          poster={poster}
          onClick={onPosterClick}
          index={index}
          isCompleted={completedIds.includes(poster.id)}
          completedAt={getCompletionDate?.(poster.id)}
          downloadedAt={getDownloadDate?.(poster.id)}
        />
      ))}
    </div>
  );
};

export default PosterGrid;
