import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  User,
  Bell,
  Palette,
  Shield,
  Trash2,
  LogOut,
  FileText,
  Moon,
  Sun,
  Loader2,
} from 'lucide-react';

export default function Settings() {
  const { user, logout, updateProfile, deleteAccount } = useAuthContext();
  const { habits, getHabitStats } = useHabitsContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Profile form state
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Delete account dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const profileDirty =
    username !== (user?.username ?? '') ||
    email !== (user?.email ?? '') ||
    newPassword.length > 0;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDirty) return;

    if (newPassword && !currentPassword) {
      toast.error('Enter your current password to set a new one.');
      return;
    }

    const fields: Parameters<typeof updateProfile>[0] = {};
    if (username !== user?.username) fields.username = username;
    if (email !== user?.email) fields.email = email;
    if (newPassword) {
      fields.password = newPassword;
      fields.currentPassword = currentPassword;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile(fields);
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Profile updated.');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;

    setIsDeletingAccount(true);
    try {
      await deleteAccount(deletePassword);
      navigate('/auth');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setIsDeletingAccount(false);
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241); // Primary color
    doc.text('Streaker Habit Report', pageWidth / 2, 25, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, 35, { align: 'center' });
    
    // User info
    if (user) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`User: ${user.username}`, 20, 50);
    }
    
    // Summary stats
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Summary', 20, 65);
    
    const totalHabits = habits.length;
    const totalCompletedDays = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
    const avgCompletionRate = habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + getHabitStats(h).completionRate, 0) / habits.length)
      : 0;
    const longestStreak = habits.length > 0
      ? Math.max(...habits.map(h => getHabitStats(h).longestStreak))
      : 0;
    
    doc.setFontSize(11);
    doc.text(`• Total Habits: ${totalHabits}`, 25, 75);
    doc.text(`• Total Completed Days: ${totalCompletedDays}`, 25, 83);
    doc.text(`• Average Completion Rate: ${avgCompletionRate}%`, 25, 91);
    doc.text(`• Best Streak: ${longestStreak} days`, 25, 99);
    
    // Individual habits
    doc.setFontSize(16);
    doc.text('Habit Details', 20, 115);
    
    let yPosition = 125;
    
    habits.forEach((habit, index) => {
      const stats = getHabitStats(habit);
      
      // Check if we need a new page
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 25;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`${index + 1}. ${habit.name}`, 25, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(80);
      yPosition += 8;
      doc.text(`Category: ${habit.category}`, 30, yPosition);
      yPosition += 6;
      doc.text(`Current Streak: ${stats.currentStreak} days`, 30, yPosition);
      yPosition += 6;
      doc.text(`Best Streak: ${stats.longestStreak} days`, 30, yPosition);
      yPosition += 6;
      doc.text(`Total Completed: ${stats.totalCompleted} days`, 30, yPosition);
      yPosition += 6;
      doc.text(`Completion Rate: ${stats.completionRate}%`, 30, yPosition);
      yPosition += 6;
      doc.text(`Started: ${format(new Date(habit.createdAt), 'MMM d, yyyy')}`, 30, yPosition);
      
      yPosition += 15;
    });
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Generated by Streaker - Build Better Habits', pageWidth / 2, 290, { align: 'center' });
    
    // Save the PDF
    doc.save(`Streaker-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('Report downloaded successfully!');
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-8 animate-fade-in">
        {/* Profile */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={40}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Separator />

            <p className="text-sm font-medium">Change Password</p>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Required to set a new password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              disabled={!profileDirty || isSavingProfile}
              className="gap-2"
            >
              {isSavingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Profile
            </Button>
          </form>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get reminded to complete your habits
                </p>
              </div>
              <Switch disabled />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Streak Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when your streak is at risk
                </p>
              </div>
              <Switch disabled />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Achievement Celebrations</p>
                <p className="text-sm text-muted-foreground">
                  Celebrate when you unlock achievements
                </p>
              </div>
              <Switch defaultChecked disabled />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-warning" />
                )}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Data & Privacy</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">Download PDF Report</p>
                <p className="text-sm text-muted-foreground">
                  Get a detailed PDF report of all your habits and progress.
                </p>
              </div>
              <Button variant="outline" className="gap-2" onClick={generatePDFReport}>
                <FileText className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-6 border-destructive/50">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">Log Out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
              <Button variant="outline" onClick={logout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => {
                  setDeletePassword('');
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeletingAccount) setIsDeleteDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your habits, goals, and data
              will be deleted immediately. Enter your password to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="deletePassword">Password</Label>
            <Input
              id="deletePassword"
              type="password"
              placeholder="Enter your password to confirm"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && deletePassword) handleDeleteAccount();
              }}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeletingAccount}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!deletePassword || isDeletingAccount}
              className="gap-2"
            >
              {isDeletingAccount && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete my account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
