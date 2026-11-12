import { Link } from 'react-router-dom';
import { FlameIcon } from '@/components/icons/FlameIcon';
import { Button } from '@/components/ui/button';
import {
  Target,
  TrendingUp,
  Calendar,
  Trophy,
  ArrowRight,
  Zap,
  BarChart3,
  CheckCircle2,
  Star,
  Shield,
  Sparkles,
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <FlameIcon size={24} animated />
            </div>
            <span className="text-xl font-bold gradient-text">Streaker</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/auth">
              <Button variant="gradient" size="sm" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-24 px-6 relative">
        {/* Background glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Your habit journey starts here</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Build Habits That
            <br />
            <span className="gradient-text-flame">Actually Stick</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Streaker makes habit tracking visual, motivating, and rewarding.
            Watch your consistency compound into real life change — one day at a time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/auth">
              <Button variant="gradient" size="lg" className="gap-2 text-base px-8 h-12">
                Start for Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                <FlameIcon size={18} />
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Mock app preview card */}
          <div className="glass-card p-6 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center gap-3 mb-5 text-left">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-secondary/60" />
              </div>
              <span className="text-xs text-muted-foreground">Today's Habits</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Morning Run', color: '#6366f1', streak: 14, done: true },
                { name: 'Read 30 min', color: '#10b981', streak: 7, done: true },
                { name: 'Meditate', color: '#f59e0b', streak: 21, done: false },
              ].map((h) => (
                <div key={h.name} className="rounded-xl bg-muted/40 p-4 flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: h.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{h.name}</p>
                    <p className="text-xs text-muted-foreground">🔥 {h.streak} day streak</p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: h.done ? h.color + '30' : 'transparent', border: `2px solid ${h.color}` }}
                  >
                    {h.done && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: h.color }} />}
                  </div>
                </div>
              ))}
            </div>
            {/* Mini contribution calendar strip */}
            <div className="mt-5 flex gap-1 justify-center">
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = [0, 0, 1, 2, 1, 3, 2, 0, 1, 3, 2, 1, 0, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 3, 2, 1, 3, 2, 3, 3, 2, 3, 3, 3, 3][i];
                const opacities = ['opacity-10', 'opacity-30', 'opacity-60', 'opacity-100'];
                return (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm bg-primary ${opacities[intensity]}`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">35-day contribution calendar</p>
          </div>
        </div>
      </section>

      {/* ── Social proof stats ── */}
      <section className="py-12 px-6 border-y border-border/40 bg-muted/20">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-12 text-center">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '1M+', label: 'Habits Tracked' },
            { value: '500K+', label: 'Streaks Built' },
            { value: '95%', label: 'Retention Rate' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built around the science of habit formation — visual feedback, streaks, and goals that keep you coming back.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Calendar className="w-6 h-6" />,
                title: 'Contribution Calendar',
                description: 'GitHub-style heatmap shows your entire habit history at a glance. The greener it gets, the better you feel.',
                color: 'text-primary',
                bg: 'bg-primary/10',
              },
              {
                icon: <FlameIcon size={24} />,
                title: 'Streak Tracking',
                description: 'Daily streaks that reward consistency. Breaking a streak hurts — in the best possible way.',
                color: 'text-orange-400',
                bg: 'bg-orange-400/10',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Rich Analytics',
                description: 'Weekly trends, category breakdowns, completion rates. Know exactly where you stand.',
                color: 'text-secondary',
                bg: 'bg-secondary/10',
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Goal Setting',
                description: 'Link goals directly to habits. Set streak targets, total day goals, or weekly completion targets.',
                color: 'text-accent',
                bg: 'bg-accent/10',
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: 'Achievements',
                description: 'Unlock 12 achievements as you hit milestones — from your first habit to 100-day streaks.',
                color: 'text-warning',
                bg: 'bg-warning/10',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'PDF Reports',
                description: 'Download a detailed PDF of your progress anytime. Great for reflecting on how far you\'ve come.',
                color: 'text-violet-400',
                bg: 'bg-violet-400/10',
              },
            ].map((f) => (
              <div key={f.title} className="glass-card p-6 hover-lift group">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center ${f.color} mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three steps to a better you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-border" />

            {[
              {
                step: '1',
                title: 'Create Your Habits',
                description: 'Pick a name, color, and category. Takes under 30 seconds.',
                icon: <Zap className="w-5 h-5" />,
              },
              {
                step: '2',
                title: 'Check In Daily',
                description: 'Tap to complete your habits each day and watch your streak grow.',
                icon: <CheckCircle2 className="w-5 h-5" />,
              },
              {
                step: '3',
                title: 'Track Your Growth',
                description: 'Watch the contribution calendar fill up and unlock achievements.',
                icon: <Star className="w-5 h-5" />,
              },
            ].map((s) => (
              <div key={s.step} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground mx-auto mb-5 glow-primary z-10 relative">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">People Love Streaker</h2>
            <p className="text-lg text-muted-foreground">Real results from real people</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I've tried every habit app out there. Streaker is the first one I've stuck with for more than a month. The streak system is genuinely motivating.",
                name: 'Sarah K.',
                role: 'Designer',
                stars: 5,
              },
              {
                quote: "The contribution calendar is exactly what I needed. Seeing all those green squares fill up is incredibly satisfying. 90-day streak and counting.",
                name: 'Marcus T.',
                role: 'Software Engineer',
                stars: 5,
              },
              {
                quote: "Clean, fast, and it just works. I set up my morning routine in 2 minutes and now I'm 6 weeks consistent. Highly recommend.",
                name: 'Priya M.',
                role: 'Product Manager',
                stars: 5,
              },
            ].map((t) => (
              <div key={t.name} className="glass-card p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing / free callout ── */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>

          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5 mb-4">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary font-medium">100% Free — No credit card needed</span>
          </div>

          <h2 className="text-4xl font-bold mb-4">Ready to Build Better Habits?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Everything is free. Unlimited habits, full analytics, all features. No paywalls.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link to="/auth">
              <Button variant="gradient" size="lg" className="gap-2 text-base px-8 h-12">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                <FlameIcon size={18} />
                Try Demo First
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {['No credit card', 'Unlimited habits', 'All features included', 'Cancel anytime'].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FlameIcon size={18} />
            </div>
            <span className="font-semibold">Streaker</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Streaker. Build better habits, one day at a time.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
