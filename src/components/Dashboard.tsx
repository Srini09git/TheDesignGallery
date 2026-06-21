"use client";

import { useEffect, useState } from 'react';
import { 
  Trophy, 
  LayoutGrid, 
  Palette, 
  CheckCircle2, 
  ClipboardList, 
  Award,
  Sparkles,
  Plus,
  Trash2,
  X,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Poster } from '@/types/poster';

interface DashboardProps {
  username: string;
  roles?: string[];
  completedIds: number[];
}

interface TrackStats {
  total: number;
  completed: number;
  pending: number;
  percent: number;
}

interface SubStats {
  title: string;
  completed: number;
  total: number;
  percent: number;
}

interface Goal {
  id: string;
  text: string;
  done: boolean;
}

export default function Dashboard({ username, roles = [], completedIds }: DashboardProps) {
  const [stats, setStats] = useState<{
    uiux: TrackStats;
    graphic: TrackStats;
    challenges: TrackStats;
    prep: TrackStats;
  }>({
    uiux: { total: 0, completed: 0, pending: 0, percent: 0 },
    graphic: { total: 0, completed: 0, pending: 0, percent: 0 },
    challenges: { total: 0, completed: 0, pending: 0, percent: 0 },
    prep: { total: 0, completed: 0, pending: 0, percent: 0 },
  });

  const [activeExpanded, setActiveExpanded] = useState<string | null>(null);
  const [subStats, setSubStats] = useState<{
    uiux: SubStats[];
    graphic: SubStats[];
    challenges: SubStats[];
    prep: SubStats[];
  }>({
    uiux: [],
    graphic: [],
    challenges: [],
    prep: [],
  });

  const [loading, setLoading] = useState(true);
  
  // Custom Goals Checklist state (local storage)
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalText, setNewGoalText] = useState('');

  useEffect(() => {
    // Load custom goals
    const savedGoals = localStorage.getItem('user_goals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        setGoals([]);
      }
    } else {
      // Add default goals
      const defaultGoals = [
        { id: '1', text: 'Complete first Mobile UI task', done: false },
        { id: '2', text: 'Analyze Nielsen\'s Heuristics for prep', done: false },
        { id: '3', text: 'Export a layout zip pack', done: false }
      ];
      setGoals(defaultGoals);
      localStorage.setItem('user_goals', JSON.stringify(defaultGoals));
    }

    const fetchAllCounts = async () => {
      try {
        setLoading(true);
        // UI/UX data
        const [mobileRes, pcRes, uxRes] = await Promise.all([
          fetch('/data/uiux-mobile.json').then(r => r.json()).catch(() => ({ posters: [] })),
          fetch('/data/uiux-pc.json').then(r => r.json()).catch(() => ({ posters: [] })),
          fetch('/data/uiux-ux.json').then(r => r.json()).catch(() => ({ posters: [] }))
        ]);
        const uiuxPosters = [...(mobileRes.posters || []), ...(pcRes.posters || []), ...(uxRes.posters || [])];
        const uiuxTotal = uiuxPosters.length;
        const uiuxCompleted = uiuxPosters.filter(p => completedIds.includes(p.id)).length;

        // Graphic design data
        const [postersRes, logosRes] = await Promise.all([
          fetch('/data/posters.json').then(r => r.json()).catch(() => ({ posters: [] })),
          fetch('/data/logos.json').then(r => r.json()).catch(() => ({ posters: [] }))
        ]);
        const graphicPosters = [...(postersRes.posters || []), ...(logosRes.posters || [])];
        const graphicTotal = graphicPosters.length;
        const graphicCompleted = graphicPosters.filter(p => completedIds.includes(p.id)).length;

        // Challenges data
        const challengesRes = await fetch('/data/challenges.json').then(r => r.json()).catch(() => ({ posters: [] }));
        const challengesPosters = challengesRes.posters || [];
        const challengesTotal = challengesPosters.length;
        const challengesCompleted = challengesPosters.filter(p => completedIds.includes(p.id)).length;

        // Prep data
        const prepRes = await fetch('/data/preparation.json').then(r => r.json()).catch(() => ({ posters: [] }));
        const prepPosters = prepRes.posters || [];
        const prepTotal = prepPosters.length;
        const prepCompleted = prepPosters.filter(p => completedIds.includes(p.id)).length;

        setStats({
          uiux: {
            total: uiuxTotal,
            completed: uiuxCompleted,
            pending: Math.max(0, uiuxTotal - uiuxCompleted),
            percent: uiuxTotal > 0 ? Math.round((uiuxCompleted / uiuxTotal) * 100) : 0
          },
          graphic: {
            total: graphicTotal,
            completed: graphicCompleted,
            pending: Math.max(0, graphicTotal - graphicCompleted),
            percent: graphicTotal > 0 ? Math.round((graphicCompleted / graphicTotal) * 100) : 0
          },
          challenges: {
            total: challengesTotal,
            completed: challengesCompleted,
            pending: Math.max(0, challengesTotal - challengesCompleted),
            percent: challengesTotal > 0 ? Math.round((challengesCompleted / challengesTotal) * 100) : 0
          },
          prep: {
            total: prepTotal,
            completed: prepCompleted,
            pending: Math.max(0, prepTotal - prepCompleted),
            percent: prepTotal > 0 ? Math.round((prepCompleted / prepTotal) * 100) : 0
          }
        });

        // Subcategory Breakdown calculations
        const mobileTotal = mobileRes.posters?.length || 0;
        const mobileCompleted = mobileRes.posters?.filter((p: Poster) => completedIds.includes(p.id)).length || 0;
        const pcTotal = pcRes.posters?.length || 0;
        const pcCompleted = pcRes.posters?.filter((p: Poster) => completedIds.includes(p.id)).length || 0;
        const uxTotal = uxRes.posters?.length || 0;
        const uxCompleted = uxRes.posters?.filter((p: Poster) => completedIds.includes(p.id)).length || 0;

        const gPosters = postersRes.posters || [];
        const gLogos = logosRes.posters || [];
        const posterList = gPosters.filter((p: Poster) => p.category === 'poster');
        const logoList = gLogos.filter((p: Poster) => p.category === 'logo');
        const brandLogoList = gLogos.filter((p: Poster) => p.category === 'BrandLogo');
        const flyerList = gPosters.filter((p: Poster) => p.category === 'flyer');
        const bannerList = gPosters.filter((p: Poster) => p.category === 'banner');

        setSubStats({
          uiux: [
            { title: 'Mobile Screen', completed: mobileCompleted, total: mobileTotal, percent: mobileTotal > 0 ? Math.round((mobileCompleted / mobileTotal) * 100) : 0 },
            { title: 'Desktop UI', completed: pcCompleted, total: pcTotal, percent: pcTotal > 0 ? Math.round((pcCompleted / pcTotal) * 105 / 105 * 100) : 0 },
            { title: 'UX Map', completed: uxCompleted, total: uxTotal, percent: uxTotal > 0 ? Math.round((uxCompleted / uxTotal) * 100) : 0 }
          ],
          graphic: [
            { title: 'Posters', completed: posterList.filter((p: Poster) => completedIds.includes(p.id)).length, total: posterList.length, percent: posterList.length > 0 ? Math.round((posterList.filter((p: Poster) => completedIds.includes(p.id)).length / posterList.length) * 100) : 0 },
            { title: 'Logos', completed: logoList.filter((p: Poster) => completedIds.includes(p.id)).length, total: logoList.length, percent: logoList.length > 0 ? Math.round((logoList.filter((p: Poster) => completedIds.includes(p.id)).length / logoList.length) * 100) : 0 },
            { title: 'BrandLogos', completed: brandLogoList.filter((p: Poster) => completedIds.includes(p.id)).length, total: brandLogoList.length, percent: brandLogoList.length > 0 ? Math.round((brandLogoList.filter((p: Poster) => completedIds.includes(p.id)).length / brandLogoList.length) * 100) : 0 },
            { title: 'Flyers', completed: flyerList.filter((p: Poster) => completedIds.includes(p.id)).length, total: flyerList.length, percent: flyerList.length > 0 ? Math.round((flyerList.filter((p: Poster) => completedIds.includes(p.id)).length / flyerList.length) * 100) : 0 },
            { title: 'Banners', completed: bannerList.filter((p: Poster) => completedIds.includes(p.id)).length, total: bannerList.length, percent: bannerList.length > 0 ? Math.round((bannerList.filter((p: Poster) => completedIds.includes(p.id)).length / bannerList.length) * 100) : 0 }
          ],
          challenges: [
            { title: 'Challenges', completed: challengesPosters.filter(p => completedIds.includes(p.id)).length, total: challengesTotal, percent: challengesTotal > 0 ? Math.round((challengesPosters.filter(p => completedIds.includes(p.id)).length / challengesTotal) * 100) : 0 }
          ],
          prep: [
            { title: 'Interview Prep', completed: prepPosters.filter(p => completedIds.includes(p.id)).length, total: prepTotal, percent: prepTotal > 0 ? Math.round((prepPosters.filter(p => completedIds.includes(p.id)).length / prepTotal) * 100) : 0 }
          ]
        });

      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCounts();
  }, [completedIds]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGoal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      done: false
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem('user_goals', JSON.stringify(updated));
    setNewGoalText('');
  };

  const handleToggleGoal = (id: string) => {
    const updated = goals.map(g => g.id === id ? { ...g, done: !g.done } : g);
    setGoals(updated);
    localStorage.setItem('user_goals', JSON.stringify(updated));
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    localStorage.setItem('user_goals', JSON.stringify(updated));
  };

  const renderProgressBar = (percent: number, colorClass: string) => (
    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
      <div 
        className={`${colorClass} h-full rounded-full transition-all duration-500`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );

  const renderSubcategoryStats = (items: SubStats[], barColorClass: string) => {
    return (
      <div className="space-y-3.5 mt-3 pt-3 border-t border-border/40 w-full animate-slide-down" onClick={(e) => e.stopPropagation()}>
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground/90">{item.title}</span>
              <span className="text-muted-foreground font-medium">
                {item.completed}/{item.total} ({item.total - item.completed} pending)
              </span>
            </div>
            {renderProgressBar(item.percent, barColorClass)}
          </div>
        ))}
      </div>
    );
  };

  let totalItems = 0;
  let totalCompleted = 0;
  
  if (roles.includes('UIUX')) {
    totalItems += stats.uiux.total;
    totalCompleted += stats.uiux.completed;
  }
  if (roles.includes('GraphicDesign')) {
    totalItems += stats.graphic.total;
    totalCompleted += stats.graphic.completed;
  }
  if (roles.includes('Challenges')) {
    totalItems += stats.challenges.total;
    totalCompleted += stats.challenges.completed;
  }
  if (roles.includes('InterviewQ&S')) {
    totalItems += stats.prep.total;
    totalCompleted += stats.prep.completed;
  }

  const overallPercent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-5 animate-fade-in">
      <div className="relative rounded-3xl overflow-hidden gradient-primary p-5 sm:p-8 text-white shadow-hover flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-xl -ml-16 -mb-16 pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Designer Profile Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight">
            Welcome back, {username}!
          </h2>
          <p className="text-white/80 max-w-xl text-xs sm:text-sm md:text-base">
            Track your UI/UX flows, graphic assets, and design challenges. Ready to level up today?
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 relative z-10 border border-white/10 shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-white transition-all duration-1000 ease-out"
                strokeDasharray={`${overallPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-bold">{overallPercent}%</span>
          </div>
          <div>
            <div className="text-xs text-white/75 font-semibold">Overall Progress</div>
            <div className="text-lg font-bold">{totalCompleted} / {totalItems} Done</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* UI/UX Card */}
        {roles.includes('UIUX') && (
          <div 
            onClick={() => setActiveExpanded(activeExpanded === 'ui-ux' ? null : 'ui-ux')}
            className={`group cursor-pointer bg-card hover:bg-card/85 text-card-foreground border rounded-3xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between space-y-4 ${
              activeExpanded === 'ui-ux' ? 'border-indigo-500 shadow-hover ring-2 ring-indigo-500/20' : 'border-border/80 hover:border-primary/40'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/5 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                {stats.uiux.percent}% Done
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold font-display group-hover:text-primary transition-colors">UI/UX Track</h3>
              <p className="text-xs text-muted-foreground mt-1">High-fidelity wireframes & app screens</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-500">Completed: {stats.uiux.completed}</span>
                <span className="text-amber-500">Pending: {stats.uiux.pending}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${stats.uiux.percent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Graphic Design Card */}
        {roles.includes('GraphicDesign') && (
          <div 
            onClick={() => setActiveExpanded(activeExpanded === 'graphic-design' ? null : 'graphic-design')}
            className={`group cursor-pointer bg-card hover:bg-card/85 text-card-foreground border rounded-3xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between space-y-4 ${
              activeExpanded === 'graphic-design' ? 'border-amber-500 shadow-hover ring-2 ring-amber-500/20' : 'border-border/80 hover:border-primary/40'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                {stats.graphic.percent}% Done
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold font-display group-hover:text-primary transition-colors">Graphic Design</h3>
              <p className="text-xs text-muted-foreground mt-1">Creative poster & brand logo layouts</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-500">Completed: {stats.graphic.completed}</span>
                <span className="text-amber-500">Pending: {stats.graphic.pending}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${stats.graphic.percent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Design Challenges Card */}
        {roles.includes('Challenges') && (
          <div 
            onClick={() => setActiveExpanded(activeExpanded === 'challenges' ? null : 'challenges')}
            className={`group cursor-pointer bg-card hover:bg-card/85 text-card-foreground border rounded-3xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between space-y-4 ${
              activeExpanded === 'challenges' ? 'border-emerald-500 shadow-hover ring-2 ring-emerald-500/20' : 'border-border/80 hover:border-primary/40'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                {stats.challenges.percent}% Done
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold font-display group-hover:text-primary transition-colors">Design Challenges</h3>
              <p className="text-xs text-muted-foreground mt-1">Real-world design sprints & tasks</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-500">Completed: {stats.challenges.completed}</span>
                <span className="text-amber-500">Pending: {stats.challenges.pending}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${stats.challenges.percent}%` }}
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Detailed Subcategory Card rendered below the grid */}
      {activeExpanded && (
        <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 shadow-soft animate-scale-in relative">
          {/* Close button top right */}
          <button 
            onClick={() => setActiveExpanded(null)}
            className="absolute top-3 right-3 rounded-full p-2 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              activeExpanded === 'ui-ux' ? 'bg-indigo-500/10 text-indigo-500' :
              activeExpanded === 'graphic-design' ? 'bg-amber-500/10 text-amber-500' :
              activeExpanded === 'challenges' ? 'bg-emerald-500/10 text-emerald-500' :
              'bg-pink-500/10 text-pink-500'
            }`}>
              {activeExpanded === 'ui-ux' && <LayoutGrid className="w-5 h-5" />}
              {activeExpanded === 'graphic-design' && <Palette className="w-5 h-5" />}
              {activeExpanded === 'challenges' && <Trophy className="w-5 h-5" />}
              {activeExpanded === 'prep' && <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-display">
                {activeExpanded === 'ui-ux' && 'UI/UX Track Breakdown'}
                {activeExpanded === 'graphic-design' && 'Graphic Design Breakdown'}
                {activeExpanded === 'challenges' && 'Design Challenges Breakdown'}
                {activeExpanded === 'prep' && 'Interview Q&S Breakdown'}
              </h3>
              <p className="text-xs text-muted-foreground">Sub-category breakdown</p>
            </div>
          </div>

          {/* Subcategories list */}
          <div className="space-y-4">
            {(activeExpanded === 'ui-ux' ? subStats.uiux :
              activeExpanded === 'graphic-design' ? subStats.graphic :
              activeExpanded === 'challenges' ? subStats.challenges :
              subStats.prep).map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-foreground/90">{item.title}</span>
                  <span className="text-muted-foreground font-medium text-xs">
                    {item.completed}/{item.total} ({item.total - item.completed} pending)
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      activeExpanded === 'ui-ux' ? 'bg-indigo-500' :
                      activeExpanded === 'graphic-design' ? 'bg-amber-500' :
                      activeExpanded === 'challenges' ? 'bg-emerald-500' :
                      'bg-pink-500'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Planner */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* Goals / Daily checklist */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-3xl p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">Personal Design Goals</h3>
              <p className="text-xs text-muted-foreground">Stay organized and track your daily learning checklist</p>
            </div>
          </div>

          {/* Add Goal Form */}
          <form onSubmit={handleAddGoal} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="e.g. Redesign checkout button component..."
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              className="flex-1 bg-secondary text-secondary-foreground border border-border/60 hover:border-border px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit" size="icon" className="rounded-2xl gradient-primary h-12 w-12 text-white shrink-0">
              <Plus className="w-5 h-5" />
            </Button>
          </form>

          {/* Goals List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
            {goals.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No goals set. Add one above to get started!</p>
            ) : (
              goals.map((goal) => (
                <div 
                  key={goal.id} 
                  className="flex items-center justify-between gap-3 p-3.5 bg-secondary/30 rounded-2xl border border-border/40 hover:border-border transition-all duration-200 group"
                >
                  <div 
                    onClick={() => handleToggleGoal(goal.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      goal.done 
                        ? "bg-primary border-primary text-white" 
                        : "border-muted-foreground hover:border-primary"
                    }`}>
                      {goal.done && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-sm font-medium transition-all ${
                      goal.done ? "line-through text-muted-foreground opacity-65" : "text-foreground"
                    }`}>
                      {goal.text}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/5 transition-all text-muted-foreground"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              Keep pushing forward!
            </span>
            <span>Ver 1.2</span>
          </div>
        </div>

      </div>

    </div>
  );
}
