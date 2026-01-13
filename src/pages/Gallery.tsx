import { useState } from 'react';
import { Poster } from '@/types/poster';
import { usePosters } from '@/hooks/usePosters';
import { useCompleted } from '@/hooks/useCompleted';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import PosterGrid from '@/components/PosterGrid';
import Lightbox from '@/components/Lightbox';

interface GalleryProps {
  username: string;
  onLogout: () => void;
}

const Gallery = ({ username, onLogout }: GalleryProps) => {
  const { completedIds, toggleCompleted, isCompleted } = useCompleted();
  const { posters, isLoading, selectedCategory, setSelectedCategory, categories } = usePosters(completedIds);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);

  return (
    <div className="min-h-screen gradient-warm">
      <Header username={username} onLogout={onLogout} />
      
      <main className="container mx-auto py-4">
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Welcome, {username}!
          </h2>
          <p className="text-muted-foreground">
            Browse and download beautiful designs
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          completedCount={completedIds.length}
        />

        <PosterGrid
          posters={posters}
          isLoading={isLoading}
          onPosterClick={setSelectedPoster}
          completedIds={completedIds}
        />
      </main>

      <Lightbox 
        poster={selectedPoster} 
        onClose={() => setSelectedPoster(null)}
        isCompleted={selectedPoster ? isCompleted(selectedPoster.id) : false}
        onToggleCompleted={toggleCompleted}
      />
    </div>
  );
};

export default Gallery;
