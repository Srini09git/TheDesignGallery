import { useState } from 'react';
import { Poster } from '@/types/poster';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface PosterCardProps {
  poster: Poster;
  onClick: (poster: Poster) => void;
  index: number;
  isCompleted?: boolean;
}

const PosterCard = ({ poster, onClick, index, isCompleted = false }: PosterCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="masonry-item animate-fade-in cursor-pointer group"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onClick(poster)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-muted shadow-card hover:shadow-hover transition-all duration-300 transform group-hover:scale-[1.02]">
        {/* Completed Badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-accent text-black rounded-full text-xs font-medium shadow-soft">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </div>
        )}

        {!isLoaded && !hasError && (
          <div className="aspect-[3/4] animate-pulse bg-muted" />
        )}
        
        <img
          src={poster.image}
          alt={poster.title}
          className={cn(
            'w-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            isCompleted && 'ring-2 ring-accent ring-offset-2 ring-offset-background'
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />

        {hasError && (
          <div className="aspect-[3/4] flex items-center justify-center bg-muted text-muted-foreground">
            <span className="text-sm">Image not found</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-primary-foreground font-medium text-sm line-clamp-2 mb-1">
              {poster.title}
            </h3>
            <p className="text-primary-foreground/70 text-xs">
              Level: {poster.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;
