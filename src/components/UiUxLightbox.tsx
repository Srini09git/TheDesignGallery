"use client";

import { X, Download, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Poster } from '@/types/poster';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { downloadPosterZip } from '@/lib/zipDownloader';

interface UiUxLightboxProps {
  poster: Poster | null;
  onClose: () => void;
  isCompleted: boolean;
  onMarkCompleted: (id: number) => void;
  onMarkDownloaded: (id: number) => void;
}

export default function UiUxLightbox({
  poster,
  onClose,
  isCompleted,
  onMarkCompleted,
  onMarkDownloaded,
}: UiUxLightboxProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isZipping, setIsZipping] = useState(false);

  // Reset state when poster changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [poster]);

  if (!poster) return null;

  const hasImage = poster.image !== false && (typeof poster.image === 'string' || (poster.images && poster.images.length > 0));
  const images = poster.images || (typeof poster.image === 'string' ? [poster.image] : []);

  const handlePrev = () => {
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDownloadZip = () => {
    onMarkDownloaded(poster.id);
    downloadPosterZip(
      poster,
      isCompleted,
      onMarkCompleted,
      () => setIsZipping(true),
      () => setIsZipping(false)
    );
  };

  const handleManualToggleComplete = () => {
    if (isCompleted) return;
    onMarkCompleted(poster.id);
    toast.success('Task marked as Completed!');
  };

  const handleDownloadSingleImage = async (imgUrl: string) => {
    onMarkDownloaded(poster.id);
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1) || 'design-screen.png';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image download started!');
    } catch (error) {
      const link = document.createElement('a');
      link.href = imgUrl;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Opening image for download!');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-md flex items-start justify-center p-4 md:p-6 overflow-y-auto animate-scale-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-card text-card-foreground border border-border w-full max-w-5xl md:max-w-6xl rounded-3xl shadow-hover relative flex flex-col my-8 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full p-2 bg-background/80 hover:bg-background text-foreground/80 hover:text-foreground transition-colors duration-200 border border-border shadow-soft"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Section: Image Viewer (Hidden if no image) */}
        {hasImage && (
          <div className="bg-muted/30 p-6 flex flex-col justify-center items-center relative border-b border-border min-h-[300px] sm:min-h-[400px]">
          {/* Completion Tag */}
          {isCompleted && (
            <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-soft">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
          )}

          {/* Active Image Window */}
          <div className="relative w-full h-[260px] sm:h-[450px] md:h-[500px] rounded-2xl overflow-hidden bg-black/5 dark:bg-black/20 border border-border/40">
            <Image
              src={images[activeImgIndex]}
              alt={`${poster.title} View ${activeImgIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-contain p-2"
              priority
            />

            {/* Single Image Download Button */}
            <button
              onClick={() => handleDownloadSingleImage(images[activeImgIndex])}
              className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-background/90 hover:bg-background text-foreground hover:scale-105 active:scale-95 transition-all duration-200 shadow-soft border border-border"
              title="Download this screen"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Navigation Arrows for multi-images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground hover:scale-105 active:scale-95 transition-all duration-200 shadow-soft border border-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground hover:scale-105 active:scale-95 transition-all duration-200 shadow-soft border border-border"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail selector */}
          {images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-hidden max-w-full py-1 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIndex(i)}
                  className={cn(
                    "relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-muted/60",
                    activeImgIndex === i 
                      ? "border-primary scale-105 shadow-soft" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          {images.length > 1 && (
            <p className="text-[10px] text-muted-foreground mt-2">
              Showing Screen {activeImgIndex + 1} of {images.length}
            </p>
          )}
        </div>
        )}

        {/* Bottom Section: Content & Actions Details */}
        <div className="p-6 flex flex-col space-y-6">

          {/* Header Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                {poster.category.replace('-', ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border/80">
                {poster.level || poster.author} Level
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display leading-tight text-foreground">
              {poster.title}
            </h2>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/20 p-4 rounded-2xl border border-border/30">
              {poster.des || poster.description || "Design and implement this creative challenge to develop UI/UX core workflows."}
            </p>
          </div>

          {/* Step by Step */}
          {poster.step_by_step && poster.step_by_step.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Step by Step
              </h4>
              <ul className="text-sm text-foreground/80 leading-relaxed bg-secondary/20 p-4 rounded-2xl border border-border/30 list-disc list-inside space-y-1">
                {poster.step_by_step.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Idea */}
          {poster.idea && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Idea
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/20 p-4 rounded-2xl border border-border/30">
                {poster.idea}
              </p>
            </div>
          )}

          {/* Asset Image */}
          {poster.asset_image && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Asset Image
              </h4>
              <div className="relative w-full max-w-sm h-48 rounded-xl overflow-hidden border border-border/40">
                <Image
                  src={poster.asset_image}
                  alt="Asset"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row gap-3">
            {hasImage ? (
              <Button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className={cn(
                  "flex-1 rounded-2xl py-6 font-semibold shadow-soft flex items-center justify-center gap-2",
                  isCompleted
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                    : "gradient-primary hover:opacity-95 text-white"
                )}
              >
                {isZipping ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    <span>Packaging ZIP...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download ZIP ({images.length} Screens)</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onMarkDownloaded(poster.id);
                  toast.success('Task started!');
                }}
                className={cn(
                  "flex-1 rounded-2xl py-6 font-semibold shadow-soft flex items-center justify-center gap-2",
                  isCompleted
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                    : "gradient-primary hover:opacity-95 text-white"
                )}
              >
                <span>Start Task</span>
              </Button>
            )}

            <Button
              onClick={handleManualToggleComplete}
              disabled={isCompleted}
              variant="outline"
              className={cn(
                "rounded-2xl py-6 font-semibold border-border hover:bg-secondary/50 transition-all",
                isCompleted
                  ? "text-emerald-500 border-emerald-200 dark:border-emerald-900/30 bg-emerald-500/5 opacity-90"
                  : "text-foreground"
              )}
            >
              <CheckCircle2 className={cn("w-4 h-4 mr-2", isCompleted && "fill-emerald-500/20 text-emerald-500")} />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

