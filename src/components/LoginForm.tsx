"use client";

import { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface LoginFormProps {
  onLogin: (username: string, roles: string[]) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('https://68beae229c70953d96ed2f5e.mockapi.io/StudentLogin');
      if (!res.ok) {
        throw new Error('Failed to connect to authentication server');
      }
      const data = await res.json();
      const user = data.find((u: { Email: string; Password: string | number; Role?: string[] }) => u.Email === email.trim() && String(u.Password) === password.trim());
      
      if (user) {
        // Use the part before @ as the username, or just the email if no @ is present
        const displayName = email.includes('@') ? email.split('@')[0] : email;
        onLogin(displayName, user.Role || []);
      } else {
        setError('No access. Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-hover mb-6 border border-border/20">
            <Image
              src="/favicon.ico.png"
              alt="CWlearning logo"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            CWlearning
          </h1>
          <p className="text-muted-foreground">
            Track your design journey — UI/UX, Graphic Design & Challenges
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
          <div className="bg-card rounded-2xl p-8 shadow-soft">
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-xl animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 text-base rounded-xl border-border focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-14 text-base rounded-xl border-border focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!email.trim() || !password.trim() || isLoading}
              className="w-full h-14 mt-6 text-lg font-medium rounded-xl gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-in">
          Your data is stored locally on your device
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
