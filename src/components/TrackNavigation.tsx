"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Palette, Trophy, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Track = 'dashboard' | 'ui-ux' | 'graphic-design' | 'challenges';

const tracks: { id: Track; label: string; icon: React.ElementType; href: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'ui-ux', label: 'UI/UX', icon: LayoutGrid, href: '/ui-ux' },
  { id: 'graphic-design', label: 'Graphic Design', icon: Palette, href: '/graphic-design' },
  { id: 'challenges', label: 'Challenges', icon: Trophy, href: '/challenges' },
];

interface TrackNavigationProps {
  mobile?: boolean;
}

const TrackNavigation = ({ mobile = false }: TrackNavigationProps) => {
  const pathname = usePathname();

  const getActiveTrack = (): Track => {
    if (pathname === '/ui-ux') return 'ui-ux';
    if (pathname === '/graphic-design') return 'graphic-design';
    if (pathname === '/challenges') return 'challenges';
    return 'dashboard';
  };

  const activeTrack = getActiveTrack();

  // Mobile: vertical list layout inside the drawer
  if (mobile) {
    return (
      <nav className="flex flex-col gap-1">
        {tracks.map((track) => {
          const Icon = track.icon;
          const isActive = activeTrack === track.id;
          return (
            <Link
              key={track.id}
              href={track.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'gradient-primary text-primary-foreground shadow-soft'
                  : 'text-foreground hover:bg-secondary'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive && 'scale-110')} />
              <span>{track.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Desktop: horizontal pill row
  return (
    <div className="flex items-center gap-1.5 px-1">
      {tracks.map((track) => {
        const Icon = track.icon;
        const isActive = activeTrack === track.id;
        return (
          <Link
            key={track.id}
            href={track.href}
            className={cn(
              'px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap',
              isActive
                ? 'gradient-primary text-primary-foreground shadow-soft'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <Icon className={cn('w-3.5 h-3.5 transition-transform duration-300 shrink-0', isActive && 'scale-110')} />
            <span>{track.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default TrackNavigation;
