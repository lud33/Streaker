import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FlameIcon } from '@/components/icons/FlameIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, getApiErrorMessage } from '@/lib/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';
  const emailFromUrl = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // If no token in URL, the link is invalid
  const isValidLink = !!token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('/reset-password', {
        method: 'POST',
        body: {
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      setIsDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/auth'), 2500);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FlameIcon size={28} animated />
            </div>
            <span className="text-3xl font-bold gradient-text">Streaker</span>
          </div>
          <p className="text-muted-foreground">Set a new password for your account</p>
        </div>

        <div className="glass-card p-8">
          {!isValidLink ? (
            /* Invalid / expired link */
            <div className="text-center space-y-4">
              <p className="text-destructive font-medium">This reset link is invalid or has expired.</p>
              <p className="text-sm text-muted-foreground">
                Reset links expire after 60 minutes.
              </p>
              <Link to="/auth">
                <Button variant="outline" className="w-full">Back to Login</Button>
              </Link>
            </div>
          ) : isDone ? (
            /* Success state */
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-secondary mx-auto" />
              <p className="font-semibold text-lg">Password reset!</p>
              <p className="text-sm text-muted-foreground">Redirecting you to login…</p>
            </div>
          ) : (
            /* Reset form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Repeat your new password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                Reset Password
              </Button>

              <div className="text-center">
                <Link
                  to="/auth"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
