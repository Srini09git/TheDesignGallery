"use client";

import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { useCompleted } from '@/hooks/useCompleted';

export default function DashboardShell() {
  const { user } = useAuth();
  const { completedIds } = useCompleted();

  if (!user) return null;

  return (
    <Dashboard
      username={user.username}
      roles={user.roles}
      completedIds={completedIds}
    />
  );
}
