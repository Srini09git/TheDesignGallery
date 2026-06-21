"use client";

import { Poster } from '@/types/poster';
import { cn } from '@/lib/utils';
import { Download, Eye, CheckCircle2, Lock } from 'lucide-react';

interface UiUxCardProps {
  poster: Poster;
  isCompleted: boolean;
  onOpen: () => void;
  onDownload: () => void;
  isDownloading?: boolean;
  isLocked?: boolean;
  onLockedClick?: () => void;
}

const difficultyColors: Record<string, string> = {
  Easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Advanced: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const categoryLabels: Record<string, string> = {
  'mobile-screen': 'Mobile Screen',
  'desktop-ui': 'Desktop UI',
  ux: 'UX Map',
};

export default function UiUxCard({
  poster,
  isCompleted,
  onOpen,
  onDownload,
  isDownloading = false,
  isLocked = false,
  onLockedClick,
}: UiUxCardProps) {
  const taskNum = poster.id === 300 ? 1 : poster.id === 301 ? 2 : poster.id === 302 ? 3 : poster.id - 299;

  return (
    <div 
      onClick={isLocked ? onLockedClick : onOpen}
      className={cn(
        "relative group bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-card transition-all duration-300 flex flex-col justify-between cursor-pointer",
        isLocked 
          ? "opacity-75 hover:border-destructive/30" 
          : "hover:shadow-hover hover:scale-[1.01] hover:border-primary/20"
      )}
    >
      {/* Top Banner Accent */}
      <div className={cn("absolute top-0 left-0 w-full h-[4px]", isLocked ? "bg-muted" : "gradient-primary")} />

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow justify-center min-h-[140px]">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            isLocked ? "text-muted-foreground" : "text-primary"
          )}>
            Task {taskNum}
          </span>
          <div className="flex items-center gap-2">
            {isLocked ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1.5 animate-pulse">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            ) : (
              <>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  difficultyColors[poster.author] || difficultyColors.Easy
                )}>
                  {poster.author}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {categoryLabels[poster.category] || poster.category}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className={cn(
          "text-xl font-bold font-display leading-tight mb-2 transition-colors duration-200",
          isLocked ? "text-muted-foreground" : "group-hover:text-primary"
        )}>
          {poster.title}
        </h3>
      </div>

      {/* Card Footer Actions */}
      <div className="p-6 pt-0 border-t border-border/45 bg-secondary/10 flex gap-2 items-center">
        {isLocked ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLockedClick?.();
            }}
            className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-secondary/80 text-secondary-foreground hover:bg-secondary active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 border border-border"
          >
            <Lock className="w-4 h-4 text-destructive" />
            <span>Locked - Complete Task {taskNum - 1}</span>
          </button>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 border border-border"
            >
              <Eye className="w-4 h-4" />
              <span>Open Task</span>
            </button>

            {isCompleted ? (
              <button
                disabled
                onClick={(e) => e.stopPropagation()}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 border border-emerald-500/20 shadow-sm cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                disabled={isDownloading}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-soft border",
                  isDownloading 
                    ? "bg-muted text-muted-foreground border-border cursor-not-allowed" 
                    : "gradient-primary text-primary-foreground border-transparent hover:brightness-105 active:scale-95"
                )}
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                    <span>Zipping...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}


