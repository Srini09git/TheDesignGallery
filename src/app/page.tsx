"use client";

import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import Gallery from '@/pages/Gallery';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isLoading, login, logout } = useAuth();

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

  return <Gallery username={user} onLogout={logout} />;
}
