"use client";

import { X, Download, CheckCircle2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
  onToggleCompleted: (id: number) => void;
}

export default function UiUxLightbox({
  poster,
  onClose,
  isCompleted,
  onToggleCompleted,
}: UiUxLightboxProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});
  const [isZipping, setIsZipping] = useState(false);

  // Reset states when poster changes
  useEffect(() => {
    setActiveImgIndex(0);
    setCheckedObjectives({});
  }, [poster]);

  if (!poster) return null;

  const images = poster.images || [poster.image];

  const handlePrev = () => {
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleToggleObjective = (index: number) => {
    setCheckedObjectives((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDownloadZip = () => {
    downloadPosterZip(
      poster,
      isCompleted,
      onToggleCompleted,
      () => setIsZipping(true),
      () => setIsZipping(false)
    );
  };

  const handleManualToggleComplete = () => {
    onToggleCompleted(poster.id);
    toast.success(isCompleted ? 'Task marked as active' : 'Task marked as Completed!');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-scale-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-card text-card-foreground border border-border w-full max-w-5xl rounded-3xl overflow-hidden shadow-hover relative flex flex-col md:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full p-2 bg-background/80 hover:bg-background text-foreground/80 hover:text-foreground transition-colors duration-200 border border-border shadow-soft"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          
          {/* Left Column: Image Viewer */}
          <div className="md:col-span-7 bg-muted/30 p-6 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-border min-h-[320px] md:min-h-[500px]">
            {/* Completion Tag */}
            {isCompleted && (
              <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-soft">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </div>
            )}

            {/* Active Image Window */}
            <div className="relative w-full h-[260px] md:h-[380px] rounded-2xl overflow-hidden bg-black/5 dark:bg-black/20 border border-border/40">
              <Image
                src={images[activeImgIndex]}
                alt={`${poster.title} View ${activeImgIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-contain p-2"
                priority
              />

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
              <div className="flex gap-2.5 mt-4 overflow-x-auto max-w-full py-1 justify-center no-scrollbar">
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

          {/* Right Column: Information & Objectives Details */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between h-full md:max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              
              {/* Header Details */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                    {poster.category.replace('-', ' ')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border/80">
                    {poster.author} Level
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
                  {poster.description || "Design and implement this creative challenge to develop UI/UX core workflows."}
                </p>
              </div>

              {/* Interactive Objectives Checklist */}
              {poster.objectives && poster.objectives.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Interactive Goal Checklist
                    </h4>
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-semibold">
                      {Object.values(checkedObjectives).filter(Boolean).length} / {poster.objectives.length} Done
                    </span>
                  </div>
                  <div className="space-y-2">
                    {poster.objectives.map((obj, i) => {
                      const isChecked = !!checkedObjectives[i];
                      return (
                        <div
                          key={i}
                          onClick={() => handleToggleObjective(i)}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none",
                            isChecked 
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                              : "bg-background border-border hover:bg-secondary/40 text-foreground"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-colors duration-200 flex-shrink-0",
                            isChecked 
                              ? "bg-emerald-500 border-emerald-500 text-white" 
                              : "border-muted-foreground/30 bg-card"
                          )}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={cn(
                            "text-xs font-medium leading-normal",
                            isChecked && "line-through text-emerald-800/60 dark:text-emerald-300/50"
                          )}>
                            {obj}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-6 mt-6 border-t border-border/60 flex flex-col sm:flex-row gap-3">
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
              
              <Button
                onClick={handleManualToggleComplete}
                variant={isCompleted ? "outline" : "outline"}
                className={cn(
                  "rounded-2xl py-6 font-semibold border-border hover:bg-secondary/50",
                  isCompleted 
                    ? "text-rose-500 border-rose-200 dark:border-rose-900/30 hover:bg-rose-500/5" 
                    : "text-foreground"
                )}
              >
                <CheckCircle2 className={cn("w-4 h-4 mr-2", isCompleted && "fill-emerald-500/10 text-emerald-500")} />
                {isCompleted ? 'Mark Active' : 'Mark Complete'}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
