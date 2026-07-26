"use client";

import { AlertTriangle, Calendar, Clock, Flame, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginWarningInfo } from '@/hooks/useAuth';

// Dummy JSON data defined directly on the same file
export const DUMMY_LOGIN_NOTIFICATIONS_JSON = {
  first_login: {
    title: "Welcome to CWlearning!",
    badge: "First Login",
    message: "Welcome aboard! Track your UI/UX flows, graphic design assets, and real-world design challenges all in one place. Let's start learning!",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    iconType: "info" as const
  },
  active_today: {
    title: "Welcome Back!",
    badge: "Active Today",
    message: "Motivated By AI : Ena Paa Athukulla Vanthuta!",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    iconType: "info" as const
  },
  inactive_24h: {
    title: "Welcome Back!",
    badge: "24 Hours Inactive",
    message: "Motivated By AI : Correcta vanthudura ana designa kannula katta mattingiriye Paa!",
    badgeClass: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    iconType: "info" as const
  },
  inactive_2_5_days: {
    title: "We Missed You!",
    badge: "2-5 Days Inactive",
    message: "Motivated By AI : Aadi amavasi ku vara na yen una miss pana poren poitu velaya paru po!",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    iconType: "warning" as const
  },
  inactive_5_7_days: {
    title: "Time to Catch Up!",
    badge: "5-7 Days Inactive",
    message: "Motivated By AI : Paa! Ne ithae mari login kuduthutu iruntha catchUp la illa packUp tha..",
    badgeClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    iconType: "alert" as const
  },
  inactive_over_7_days: {
    title: "Welcome Back, Designer!",
    badge: "Over a Week Away",
    message: "Motivated By AI : Ne unamaiyave Designer haa?",
    badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    iconType: "urgent" as const
  }
};

interface LoginActivityModalProps {
  info?: LoginWarningInfo;
  onClose: () => void;
}

export default function LoginActivityModal({
  info,
  onClose,
}: LoginActivityModalProps) {
  // Use passed info or fallback to dummy JSON data on the same file
  const data = info || {
    inactiveDays: 2,
    inactiveHours: 48,
    lastLoginFormatted: new Date().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
    ...DUMMY_LOGIN_NOTIFICATIONS_JSON.inactive_2_5_days
  };

  const renderIcon = () => {
    switch (data.iconType) {
      case 'info':
        return <Sparkles className="w-7 h-7 text-indigo-500" />;
      case 'warning':
        return <Flame className="w-7 h-7 text-amber-500 fill-amber-500/20" />;
      case 'alert':
        return <AlertTriangle className="w-7 h-7 text-orange-500" />;
      case 'urgent':
        return <Zap className="w-7 h-7 text-rose-500 fill-rose-500/20" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card text-card-foreground border border-border/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-hover relative overflow-hidden space-y-6 animate-scale-in">
        
        {/* Top Glow Accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center shrink-0 shadow-soft">
            {renderIcon()}
          </div>
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border mb-1 ${data.badgeClass}`}>
              <Clock className="w-3 h-3" />
              <span>{data.badge}</span>
            </div>
            <h3 className="text-xl font-bold font-display leading-tight">
              {data.title}
            </h3>
          </div>
        </div>

        {/* Previous Login Details */}
        <div className="bg-secondary/40 rounded-2xl p-4 border border-border/50 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <div>
              <span className="font-semibold text-foreground/80">Previous Login: </span>
              <span className="font-mono text-foreground/90">{data.lastLoginFormatted}</span>
            </div>
          </div>
        </div>

        {/* Custom Encouraging / Tiered Message */}
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed font-medium">
            {data.message}
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onClose}
          className="w-full h-13 text-base font-semibold rounded-2xl gradient-primary text-white shadow-soft hover:shadow-hover hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
