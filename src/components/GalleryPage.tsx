"use client";

import { useState } from 'react';
import { Poster } from '@/types/poster';
import { usePosters } from '@/hooks/usePosters';
import { useCompleted } from '@/hooks/useCompleted';
import CategoryFilter from '@/components/CategoryFilter';
import PosterGrid from '@/components/PosterGrid';
import Lightbox from '@/components/Lightbox';
import UiUxCard from '@/components/UiUxCard';
import UiUxLightbox from '@/components/UiUxLightbox';
import AppShell from '@/components/AppShell';
import { Loader2, Lock, ChevronDown } from 'lucide-react';
import { downloadPosterZip } from '@/lib/zipDownloader';

type GalleryTrack = 'ui-ux' | 'graphic-design' | 'challenges';

interface GalleryPageProps {
  track: GalleryTrack;
}

export default function GalleryPage({ track }: GalleryPageProps) {
  const { completedIds, toggleCompleted, isCompleted } = useCompleted();
  const [zippingIds, setZippingIds] = useState<number[]>([]);
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const {
    posters,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    categories,
    selectedLevel,
    setSelectedLevel
  } = usePosters(completedIds, track);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);

  // UI/UX Locking States & Filtering (sorted by ID to ensure sequence)
  const sortedUiuxPosters = track === 'ui-ux'
    ? [...posters].sort((a, b) => a.id - b.id)
    : posters;

  const firstUncompletedIndex = sortedUiuxPosters.findIndex(poster => !isCompleted(poster.id));

  const visiblePosters = track === 'ui-ux'
    ? sortedUiuxPosters.filter((poster, index) => {
        if (index === 0) return true;
        const maxVisibleIndex = firstUncompletedIndex === -1
          ? sortedUiuxPosters.length - 1
          : firstUncompletedIndex + 1;
        return index <= maxVisibleIndex;
      })
    : posters;

  const isUiuxLike = track === 'ui-ux' || track === 'challenges';

  return (
    <AppShell>
      {/* Same container padding as graphic design page */}
      <div className="container mx-auto py-4 px-4">

        {/* Filter Bar — wraps on mobile, no scroll */}
        <div className="bg-card/25 backdrop-blur-md rounded-2xl border border-border/40 mb-4 p-3">
          {/* Category buttons — wrap on mobile */}
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            completedCount={completedIds.filter(id => posters.some(p => p.id === id)).length}
          />

          {/* Level selector — sits below categories on mobile */}
          <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border/30">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
              Level:
            </span>
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 pr-7 rounded-full text-xs font-semibold border border-border shadow-soft transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="Easy">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-secondary-foreground/60">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isUiuxLike ? (
          isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : visiblePosters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-muted-foreground">No tasks found in this category</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
              {visiblePosters.map((poster, index) => {
                const isLocked = track === 'ui-ux' &&
                  index > 0 &&
                  !isCompleted(sortedUiuxPosters[index - 1].id);

                const getLockMessage = () => {
                  if (index === 1) {
                    return "First Mobile Screen mudi aprm nee desktop screen ku varalam Poi velaya paru summa summa click panitu irukadha ";
                  }
                  if (index === 2) {
                    return "First Desktop Screen mudi aprm nee UX Flow ku varalam Poi velaya paru summa summa click panitu irukadha ";
                  }
                  const prevTitle = sortedUiuxPosters[index - 1].title;
                  return `First ${prevTitle} mudi aprm nee next card ku varalam. Poi velaya paru summa summa click panitu irukadha.`;
                };

                return (
                  <UiUxCard
                    key={poster.id}
                    poster={poster}
                    isCompleted={isCompleted(poster.id)}
                    isLocked={isLocked}
                    onLockedClick={() => setLockMessage(getLockMessage())}
                    onOpen={() => setSelectedPoster(poster)}
                    onDownload={() => {
                      downloadPosterZip(
                        poster,
                        isCompleted(poster.id),
                        toggleCompleted,
                        () => setZippingIds(prev => [...prev, poster.id]),
                        () => setZippingIds(prev => prev.filter(id => id !== poster.id))
                      );
                    }}
                    isDownloading={zippingIds.includes(poster.id)}
                  />
                );
              })}
            </div>
          )
        ) : (
          <PosterGrid
            posters={posters}
            isLoading={isLoading}
            onPosterClick={setSelectedPoster}
            completedIds={completedIds}
          />
        )}
      </div>

      {/* Lightboxes */}
      {selectedPoster && (
        isUiuxLike ? (
          <UiUxLightbox
            poster={selectedPoster}
            onClose={() => setSelectedPoster(null)}
            isCompleted={isCompleted(selectedPoster.id)}
            onToggleCompleted={toggleCompleted}
          />
        ) : (
          <Lightbox
            poster={selectedPoster}
            onClose={() => setSelectedPoster(null)}
            isCompleted={isCompleted(selectedPoster.id)}
            onToggleCompleted={toggleCompleted}
          />
        )
      )}

      {/* Lock Pop-up Modal */}
      {lockMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card text-card-foreground border border-border p-6 rounded-3xl max-w-sm w-full shadow-hover text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display">Task Locked 🔒</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lockMessage}
            </p>
            <button
              onClick={() => setLockMessage(null)}
              className="w-full py-3 rounded-2xl font-semibold gradient-primary text-primary-foreground shadow-soft transition-transform duration-200 active:scale-[0.98] hover:brightness-105"
            >
              Thanks
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
