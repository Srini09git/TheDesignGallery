"use client";

import { LayoutGrid, Palette, Trophy, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Track = 'ui-ux' | 'graphic-design' | 'challenges' | 'preparation';

interface TrackNavigationProps {
  activeTrack: Track;
  onChange: (track: Track) => void;
}

const tracks: { id: Track; label: string; icon: any }[] = [
  { id: 'ui-ux', label: 'UI/UX', icon: LayoutGrid },
  { id: 'graphic-design', label: 'Graphic Design', icon: Palette },
  { id: 'challenges', label: 'Challenges', icon: Trophy },
  { id: 'preparation', label: 'Preparation', icon: BookOpen },
];

const TrackNavigation = ({ activeTrack, onChange }: TrackNavigationProps) => {
  return (
    <div className="flex space-x-2 px-2 overflow-x-auto no-scrollbar">
      {tracks.map((track) => {
        const Icon = track.icon;
        const isActive = activeTrack === track.id;

        return (
          <button
            key={track.id}
            onClick={() => onChange(track.id)}
            className={cn(
              'px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap',
              isActive
                ? 'gradient-primary text-primary-foreground shadow-soft'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <Icon className={cn('w-4 h-4 transition-transform duration-300', isActive && 'scale-110')} />
            <span>{track.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TrackNavigation;
