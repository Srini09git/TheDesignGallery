import { useState } from 'react';
import { User, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-hover mb-6">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Poster
          </h1>
          <p className="text-muted-foreground">
            Discover and download beautiful designs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
          <div className="bg-card rounded-2xl p-8 shadow-soft">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">
                What should we call you?
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-xl border-border focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!username.trim()}
              className="w-full h-14 mt-6 text-lg font-medium rounded-xl gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
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
