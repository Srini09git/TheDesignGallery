"use client";

import { Poster } from '@/types/poster';
import { cn, calculateDuration } from '@/lib/utils';
import { Eye, CheckCircle2, Lock, Clock } from 'lucide-react';

interface UiUxCardProps {
  poster: Poster;
  index: number;
  isCompleted: boolean;
  completedAt?: string | null;
  downloadedAt?: string | null;
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
  challenge: 'Challenge',
  preparation: 'Interview Prep',
};

export default function UiUxCard({
  poster,
  index,
  isCompleted,
  completedAt,
  downloadedAt,
  onOpen,
  onDownload,
  isDownloading = false,
  isLocked = false,
  onLockedClick,
}: UiUxCardProps) {
  const taskNum = index + 1;
  const duration = completedAt && downloadedAt ? calculateDuration(downloadedAt, completedAt) : null;

  return (
    <div
      onClick={isLocked ? onLockedClick : onOpen}
      className={cn(
        "relative group bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-card transition-all duration-300 cursor-pointer w-full",
        isLocked
          ? "opacity-75 hover:border-destructive/30"
          : "hover:shadow-hover hover:border-primary/20"
      )}
    >
      {/* Left accent border */}
      <div className={cn("absolute top-0 left-0 w-1 h-full", isLocked ? "bg-muted" : "gradient-primary")} />

      {/* Card content: mobile = stacked, desktop = row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-4 sm:p-5 pl-5 sm:pl-6">

        {/* Left: Text Content */}
        <div className="flex flex-col gap-1.5 min-w-0">
          {/* Task label + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "text-[11px] font-bold uppercase tracking-widest",
              isLocked ? "text-muted-foreground" : "text-primary"
            )}>
              Task {taskNum}
            </span>

            {isLocked ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                Locked
              </span>
            ) : (
              <>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                  difficultyColors[poster.author] || difficultyColors.Easy
                )}>
                  {poster.author}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary text-secondary-foreground">
                  {categoryLabels[poster.category] || poster.category}
                </span>
                {downloadedAt && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 sm:hidden">
                    ↓ {downloadedAt}
                  </span>
                )}
                {isCompleted && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 sm:hidden">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {completedAt ? `Done: ${completedAt}` : 'Done'}
                  </span>
                )}
                {duration && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1 sm:hidden">
                    <Clock className="w-2.5 h-2.5" />
                    {duration}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Title */}
          <h3 className={cn(
            "text-sm sm:text-base font-bold font-display leading-tight transition-colors duration-200",
            isLocked ? "text-muted-foreground" : "group-hover:text-primary text-foreground"
          )}>
            {poster.title}
          </h3>
        </div>

        {/* Right: Action buttons — on mobile they go below, on sm+ they're inline */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {isLocked ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLockedClick?.();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary/80 text-secondary-foreground hover:bg-secondary active:scale-95 transition-all duration-200 flex items-center gap-1.5 border border-border"
            >
              <Lock className="w-3.5 h-3.5 text-destructive" />
              <span>Locked</span>
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all duration-200 flex items-center gap-1.5 border border-border"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open</span>
              </button>

              {downloadedAt && (
                <span className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 items-center gap-1.5 border border-blue-500/20">
                  <span className="font-bold">↓</span>
                  <span>{downloadedAt}</span>
                </span>
              )}

              {isCompleted && (
                <span className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 items-center gap-1.5 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedAt ? `Done on ${completedAt}` : 'Completed'}</span>
                </span>
              )}

              {duration && (
                <span className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 items-center gap-1.5 border border-purple-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time taken: {duration}</span>
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
