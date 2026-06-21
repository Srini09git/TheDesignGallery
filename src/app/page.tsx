"use client";

import AppShell from '@/components/AppShell';
import DashboardShell from '@/components/DashboardShell';

export default function Home() {
  return (
    <AppShell>
      <DashboardShell />
    </AppShell>
  );
}
