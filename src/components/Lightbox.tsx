import { X, Download, Heart, Share2, CheckCircle2 } from 'lucide-react';
import { Poster } from '@/types/poster';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LightboxProps {
  poster: Poster | null;
  onClose: () => void;
  isCompleted?: boolean;
  onToggleCompleted?: (id: number) => void;
}

const Lightbox = ({ poster, onClose, isCompleted = false, onToggleCompleted }: LightboxProps) => {
  const [isLiked, setIsLiked] = useState(false);

  if (!poster) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(poster.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${poster.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success('Added to favorites!');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poster.title,
          text: `Check out this design: ${poster.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleToggleCompleted = () => {
    if (onToggleCompleted) {
      onToggleCompleted(poster.id);
      toast.success(isCompleted ? 'Removed from completed' : 'Marked as completed!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-sm animate-scale-in"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className="rounded-full bg-background/10 hover:bg-background/20 text-primary-foreground"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-destructive' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="rounded-full bg-background/10 hover:bg-background/20 text-primary-foreground"
        >
          <Share2 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full bg-background/10 hover:bg-background/20 text-primary-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div
        className="h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl max-h-[80vh] w-full relative">
          {isCompleted && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium shadow-soft">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </div>
          )}
          <img
            src={poster.image}
            alt={poster.title}
            className={cn(
              "w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-hover",
              isCompleted && "ring-4 ring-accent"
            )}
          />
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-2xl font-display font-bold text-primary-foreground mb-1">
            {poster.title}
          </h2>
          <p className="text-primary-foreground/70 mb-6">by {poster.author}</p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleDownload}
              className="gradient-primary hover:opacity-90 rounded-full px-8 py-6 text-lg font-medium shadow-hover"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
            
            <Button
              onClick={handleToggleCompleted}
              variant={isCompleted ? "secondary" : "outline"}
              className={cn(
                "rounded-full px-8 py-6 text-lg font-medium bg-green-800",
                isCompleted 
                  ? "bg-accent text-accent-foreground hover:bg-accent/80" 
                  : "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              <CheckCircle2 className={cn("w-5 h-5 mr-2 ", isCompleted && "fill-current")} />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
