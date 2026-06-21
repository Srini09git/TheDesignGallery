"use client";

import { useState } from 'react';
import { Poster } from '@/types/poster';
import { usePosters } from '@/hooks/usePosters';
import { useCompleted } from '@/hooks/useCompleted';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import PosterGrid from '@/components/PosterGrid';
import Lightbox from '@/components/Lightbox';
import UiUxCard from '@/components/UiUxCard';
import UiUxLightbox from '@/components/UiUxLightbox';
import { Track } from '@/components/TrackNavigation';
import { Trophy, BookOpen, Loader2, Lock } from 'lucide-react';
import { downloadPosterZip } from '@/lib/zipDownloader';

interface GalleryProps {
  username: string;
  onLogout: () => void;
}

const Gallery = ({ username, onLogout }: GalleryProps) => {
  const { completedIds, toggleCompleted, isCompleted } = useCompleted();
  const [activeTrack, setActiveTrack] = useState<Track>('graphic-design');
  const [zippingIds, setZippingIds] = useState<number[]>([]);
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const { posters, isLoading, selectedCategory, setSelectedCategory, categories } = usePosters(
    completedIds, 
    activeTrack === 'ui-ux' ? 'ui-ux' : 'graphic-design'
  );
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);

  // UI/UX Locking States & Filtering (sorted by ID to ensure sequence)
  const sortedUiuxPosters = activeTrack === 'ui-ux'
    ? [...posters].sort((a, b) => a.id - b.id)
    : posters;

  // Find the index of the first task that is NOT completed
  const firstUncompletedIndex = sortedUiuxPosters.findIndex(poster => !isCompleted(poster.id));

  // A UI/UX task is visible if it is index 0 OR it is at or before firstUncompletedIndex + 1
  const visiblePosters = activeTrack === 'ui-ux'
    ? sortedUiuxPosters.filter((poster, index) => {
        if (index === 0) return true;
        const maxVisibleIndex = firstUncompletedIndex === -1 
          ? sortedUiuxPosters.length - 1 
          : firstUncompletedIndex + 1;
        return index <= maxVisibleIndex;
      })
    : posters;

  return (
    <div className="min-h-screen gradient-warm">
      <Header 
        username={username} 
        onLogout={onLogout} 
        activeTrack={activeTrack} 
        onTrackChange={setActiveTrack} 
      />
      
      <main className="container mx-auto py-4">
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Welcome, {username}!
          </h2>
          <p className="text-muted-foreground">
            Browse and download beautiful designs
          </p>
        </div>

        {activeTrack === 'graphic-design' || activeTrack === 'ui-ux' ? (
          <>
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              completedCount={completedIds.filter(id => posters.some(p => p.id === id)).length}
            />

            {activeTrack === 'ui-ux' ? (
              isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : visiblePosters.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-lg text-muted-foreground">No UI/UX tasks found in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
                  {visiblePosters.map((poster, index) => {
                    const isLocked = activeTrack === 'ui-ux' && 
                      index > 0 && 
                      !isCompleted(sortedUiuxPosters[index - 1].id);
                    
                    const getLockMessage = () => {
                      if (index === 1) {
                        return "First Mobile Screen mudi aprm nee desktop screen ku varalam Poi velaya paru summa summa click panitu irukadha ";
                      }
                      if (index === 2) {
                        return "First Desktop Screen mudi aprm nee UX Flow ku varalam Poi velaya paru summa summa click panitu irukadha ";
                      }
                      
                      // Generic message for subsequent cards
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto animate-fade-in px-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              {activeTrack === 'challenges' && <Trophy className="w-8 h-8" />}
              {activeTrack === 'preparation' && <BookOpen className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold font-display text-foreground mb-2">
              {activeTrack === 'challenges' && 'Design Challenges'}
              {activeTrack === 'preparation' && 'Interview & Exam Prep'}
            </h3>
            <p className="text-muted-foreground mb-6">
              We are currently curating and uploading the best content for this track. Switch to "Graphic Design" to browse active designs.
            </p>
            <button
              onClick={() => setActiveTrack('graphic-design')}
              className="px-6 py-2.5 rounded-full text-sm font-semibold gradient-primary text-primary-foreground shadow-soft transition-transform duration-300 hover:scale-[1.02]"
            >
              Go to Graphic Design
            </button>
          </div>
        )}
      </main>

      {selectedPoster && (
        activeTrack === 'ui-ux' ? (
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

      {/* Lock Details Pop-up Modal */}
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
    </div>
  );
};

export default Gallery;
