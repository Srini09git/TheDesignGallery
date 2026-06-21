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
import { Loader2, Lock, ChevronDown, ShieldAlert } from 'lucide-react';
import { downloadPosterZip } from '@/lib/zipDownloader';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InterviewCard from '@/components/InterviewCard';

type GalleryTrack = 'ui-ux' | 'graphic-design' | 'challenges' | 'interview';

interface GalleryPageProps {
  track: GalleryTrack;
}

export default function GalleryPage({ track }: GalleryPageProps) {
  const { user } = useAuth();
  const { completedIds, markCompleted, isCompleted, getCompletionDate, markDownloaded, getDownloadDate } = useCompleted();
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
  const isInterview = track === 'interview';

  // Role mapping for interview categories
  const roleMappings: Record<string, string[]> = {
    'UIUX': ['UiUx'],
    'GraphicDesign': ['Graphic design'],
    'Frontend': ['Frontend'],
    'Backend': ['Backend'],
    'WebDevelopment': ['Frontend', 'Backend']
  };

  const userAllowedCategories = user?.roles?.flatMap(r => roleMappings[r] || []) || [];
  console.log("User roles:", user?.roles);
  console.log("User Allowed Categories:", userAllowedCategories);
  
  const allowedCategories = isInterview 
    ? categories.filter(c => c === 'all' || userAllowedCategories.includes(c))
    : categories;

  const finalVisiblePosters = isInterview
    ? visiblePosters.filter(p => userAllowedCategories.includes(p.category))
    : visiblePosters;

  // Check RBAC Authorization
  const hasAccess = () => {
    if (!user || !user.roles) return false;
    if (track === 'ui-ux' && user.roles.includes('UIUX')) return true;
    if (track === 'graphic-design' && user.roles.includes('GraphicDesign')) return true;
    if (track === 'challenges' && user.roles.includes('Challenges')) return true;
    if (track === 'interview' && (user.roles.includes('InterviewQ&S') || userAllowedCategories.length > 0)) return true;
    return false;
  };

  if (!hasAccess()) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-3xl flex items-center justify-center mb-6 shadow-soft">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            You do not have the required permissions to view the {track === 'ui-ux' ? 'UI/UX' : track === 'graphic-design' ? 'Graphic Design' : track === 'challenges' ? 'Challenges' : 'Interview Q&A'} track. 
            Please request access from your instructor or select another track.
          </p>
          <Button asChild className="rounded-xl h-12 px-8 gradient-primary text-white shadow-soft hover:shadow-hover hover:scale-105 transition-all">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Same container padding as graphic design page */}
      <div className="container mx-auto py-4 px-4">

        {/* Filter Bar — wraps on mobile, no scroll */}
        <div className="bg-card/25 backdrop-blur-md rounded-2xl border border-border/40 mb-4 p-3">
          {/* Category buttons — wrap on mobile */}
          <CategoryFilter
            categories={allowedCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            completedCount={isInterview ? undefined : completedIds.filter(id => posters.some(p => p.id === id)).length}
            allLabel={isInterview ? "All Q&A" : undefined}
          />

          {/* Level selector — sits below categories on mobile, hidden on interview track */}
          {!isInterview && (
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
          )}
        </div>

        {/* Content */}
        {isInterview ? (
          isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : finalVisiblePosters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-muted-foreground">No interview questions available for your roles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              {finalVisiblePosters.map((poster, index) => (
                <InterviewCard
                  key={poster.id}
                  poster={poster}
                  index={index}
                />
              ))}
            </div>
          )
        ) : isUiuxLike ? (
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
              {finalVisiblePosters.map((poster, index) => {
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
                    index={index}
                    isCompleted={isCompleted(poster.id)}
                    completedAt={getCompletionDate(poster.id)}
                    downloadedAt={getDownloadDate(poster.id)}
                    isLocked={isLocked}
                    onLockedClick={() => setLockMessage(getLockMessage())}
                    onOpen={() => setSelectedPoster(poster)}
                    onDownload={() => {
                      downloadPosterZip(
                        poster,
                        isCompleted(poster.id),
                        markCompleted,
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
            getCompletionDate={getCompletionDate}
            getDownloadDate={getDownloadDate}
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
            onMarkCompleted={markCompleted}
            onMarkDownloaded={markDownloaded}
          />
        ) : (
          <Lightbox
            poster={selectedPoster}
            onClose={() => setSelectedPoster(null)}
            isCompleted={isCompleted(selectedPoster.id)}
            onMarkCompleted={markCompleted}
            onMarkDownloaded={markDownloaded}
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
