"use client";

import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';
import LoginActivityModal from '@/components/LoginActivityModal';
import { Loader2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, isLoading, login, logout, loginWarning, dismissLoginWarning } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div className="min-h-screen gradient-warm">
      <Header username={user.username} onLogout={logout} />
      <main className="w-full">
        {children}
      </main>

      {loginWarning && (
        <LoginActivityModal
          info={loginWarning}
          onClose={dismissLoginWarning}
        />
      )}
    </div>
  );
}
