"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutGrid, Palette, Trophy, LayoutDashboard, BookOpen, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Track = 'dashboard' | 'ui-ux' | 'graphic-design' | 'challenges' | 'interview' | 'placement';

const tracks: { id: Track; label: string; icon: React.ElementType; href: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'ui-ux', label: 'UI/UX', icon: LayoutGrid, href: '/ui-ux' },
  { id: 'graphic-design', label: 'Graphic Design', icon: Palette, href: '/graphic-design' },
  { id: 'challenges', label: 'Challenges', icon: Trophy, href: '/challenges' },
  { id: 'interview', label: 'Interview Q&A', icon: BookOpen, href: '/interview' },
  { id: 'placement', label: 'Placement', icon: Briefcase, href: '/placement' },
];

interface TrackNavigationProps {
  mobile?: boolean;
}

const TrackNavigation = ({ mobile = false }: TrackNavigationProps) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleTracks = tracks.filter((t) => {
    if (t.id === 'dashboard' || t.id === 'placement') return true; // Always visible
    if (!user || !user.roles) return false;

    if (t.id === 'ui-ux' && user.roles.includes('UIUX')) return true;
    if (t.id === 'graphic-design' && user.roles.includes('GraphicDesign')) return true;
    if (t.id === 'challenges' && user.roles.includes('Challenges')) return true;
    if (t.id === 'interview' && user.roles.includes('InterviewQ&S')) return true;
    
    return false;
  });

  const getActiveTrack = (): Track => {
    if (pathname === '/ui-ux') return 'ui-ux';
    if (pathname === '/graphic-design') return 'graphic-design';
    if (pathname === '/challenges') return 'challenges';
    if (pathname === '/interview') return 'interview';
    if (pathname === '/placement') return 'placement';
    return 'dashboard';
  };

  const activeTrack = getActiveTrack();

  // Mobile: vertical list layout inside the drawer
  if (mobile) {
    return (
      <nav className="flex flex-col gap-1">
        {visibleTracks.map((track) => {
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
      {visibleTracks.map((track) => {
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
