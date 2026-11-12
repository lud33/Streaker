import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { FlameIcon } from '@/components/icons/FlameIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Mail, Lock, User, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, getApiErrorMessage } from '@/lib/api';

type AuthMode = 'login' | 'signup';

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup, demoLogin } = useAuthContext();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        await signup(username, email, password);
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await demoLogin();
      toast.success('Welcome to Streaker!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotLoading(true);
    try {
      await apiRequest('/forgot-password', {
        method: 'POST',
        body: { email: forgotEmail },
      });
      setForgotSent(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsForgotLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setShowForgot(false);
    setForgotSent(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-background to-accent/20 items-center justify-center p-8">
        <div className="max-w-lg text-center space-y-8">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary animate-float">
            <FlameIcon size={64} animated />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">
              Build habits that <span className="gradient-text-flame">stick</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Track your daily habits, build streaks, and achieve your goals with Streaker.
              Your journey to a better you starts here.
            </p>
          </div>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              Track unlimited habits
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Visual streak calendar
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              Detailed analytics
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FlameIcon size={28} animated />
              </div>
              <span className="text-3xl font-bold gradient-text">Streaker</span>
            </div>
            <p className="text-muted-foreground">
              {showForgot
                ? 'Reset your password'
                : mode === 'login'
                ? 'Welcome back! Log in to continue.'
                : 'Create an account to get started.'}
            </p>
          </div>

          {/* ── Forgot password panel ── */}
          {showForgot ? (
            <div className="space-y-6">
              {forgotSent ? (
                <div className="glass-card p-6 text-center space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-secondary mx-auto" />
                  <p className="font-semibold">Check your inbox</p>
                  <p className="text-sm text-muted-foreground">
                    If <span className="font-medium">{forgotEmail}</span> has an account, a reset
                    link has been sent. Check your spam folder too.
                  </p>
                  <Button variant="outline" className="w-full" onClick={resetForgotFlow}>
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your account email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={isForgotLoading}
                  >
                    {isForgotLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                  <button
                    type="button"
                    onClick={resetForgotFlow}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* ── Mode toggle ── */}
              <div className="flex p-1 bg-muted rounded-xl">
                <button
                  onClick={() => setMode('login')}
                  className={cn(
                    'flex-1 py-2.5 rounded-lg font-medium transition-all',
                    mode === 'login'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Log in
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={cn(
                    'flex-1 py-2.5 rounded-lg font-medium transition-all',
                    mode === 'signup'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Sign up
                </button>
              </div>

              {/* ── Login / Signup form ── */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setShowForgot(true);
                        }}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'login' ? 'Log in' : 'Create account'}
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
                  or continue with
                </span>
              </div>

              {/* Social logins */}
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1 gap-2" disabled>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
              </div>

              {/* Demo login */}
              <Button
                variant="glass"
                size="lg"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <FlameIcon size={20} />
                Try Demo
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
