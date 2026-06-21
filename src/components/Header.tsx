"use client";

import { LogOut, User, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackNavigation from './TrackNavigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

const Header = ({ username, onLogout }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile nav when route changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border w-full">
      {/* Main Header Row */}
      <div className="w-full px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Brand/Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white shadow-sm border border-border/30">
              <Image
                src="/favicon.ico.png"
                alt="CWlearning logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <h1 className="text-base font-display font-bold text-foreground whitespace-nowrap hidden sm:block">
              CWlearning
            </h1>
          </div>

          {/* Navigation - hidden on mobile, visible on sm+ */}
          <div className="hidden sm:flex flex-1 justify-center min-w-0">
            <TrackNavigation />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Username - desktop only */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full">
              <User className="w-3.5 h-3.5 text-secondary-foreground" />
              <span className="text-xs font-medium text-secondary-foreground max-w-[80px] truncate">
                {username}
              </span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-secondary transition-colors w-8 h-8"
              aria-label="Toggle theme"
            >
              {!mounted || theme === 'light' ? (
                <Moon className="w-4 h-4 text-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-foreground" />
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors w-8 h-8 hidden sm:flex"
            >
              <LogOut className="w-4 h-4" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="rounded-full hover:bg-secondary transition-colors w-8 h-8 sm:hidden"
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? (
                <X className="w-4 h-4 text-foreground" />
              ) : (
                <Menu className="w-4 h-4 text-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="sm:hidden border-t border-border/60 bg-background/98 px-3 py-3 animate-fade-in">
          <TrackNavigation mobile />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">{username}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive text-xs h-7 px-3 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
