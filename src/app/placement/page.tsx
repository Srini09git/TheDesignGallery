"use client";

import AppShell from '@/components/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { Briefcase } from 'lucide-react';

export default function PlacementPage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
        <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-soft">
          <Briefcase className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-display font-bold text-foreground mb-4">Placement</h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed font-medium">
          "First poi Task lam mudiga then idha page ku varalam {user?.username}😒 by CEO😉"
        </p>
      </div>
    </AppShell>
  );
}
