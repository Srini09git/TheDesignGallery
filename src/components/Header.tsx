"use client";

import { Sparkles, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackNavigation, { Track } from './TrackNavigation';

interface HeaderProps {
  username: string;
  onLogout: () => void;
  activeTrack: Track;
  onTrackChange: (track: Track) => void;
}

const Header = ({ username, onLogout, activeTrack, onTrackChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          {/* Brand/Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground whitespace-nowrap">
              The Design Gallery
            </h1>
          </div>

          {/* Navigation Center */}
          <div className="flex-1 max-w-xl mx-auto flex justify-center w-full order-last sm:order-none sm:w-auto">
            <TrackNavigation activeTrack={activeTrack} onChange={onTrackChange} />
          </div>

          {/* Profile / Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
              <User className="w-4 h-4 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">
                {username}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
