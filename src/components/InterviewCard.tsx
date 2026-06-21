"use client";

import { Poster } from '@/types/poster';
import { cn } from '@/lib/utils';
import { FileText, Download } from 'lucide-react';

interface InterviewCardProps {
  poster: Poster;
  index: number;
}

export default function InterviewCard({
  poster,
  index,
}: InterviewCardProps) {
  
  const handleDownload = () => {
    if (!poster.pdfUrl) return;
    const link = document.createElement('a');
    link.href = poster.pdfUrl;
    link.download = poster.pdfUrl.split('/').pop() || 'interview.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="flex flex-col animate-fade-in h-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 p-5 flex flex-col h-full gap-4">
        
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
            {poster.category}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold font-display text-card-foreground leading-tight">
            {poster.title}
          </h3>
          {poster.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {poster.description}
            </p>
          )}
        </div>

        <div className="mt-2 pt-4 border-t border-border flex items-center justify-end">
          <button
            onClick={handleDownload}
            disabled={!poster.pdfUrl}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              poster.pdfUrl 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-soft" 
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
