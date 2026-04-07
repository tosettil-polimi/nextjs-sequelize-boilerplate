'use client';

import { useActionState, useState, useEffect } from 'react';
import { Lock, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePassword, type ProfileActionState } from '@/app/actions/profile';
import { useDictionary } from '@/lib/i18n/use-dictionary';

const initialState: ProfileActionState = {};

interface PasswordFormProps {
  lang: string;
}

export function PasswordForm({ lang }: PasswordFormProps): React.ReactElement {
  const dict = useDictionary(lang);
  const [state, formAction, isPending] = useActionState(updatePassword, initialState);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Reset form on success
  useEffect(() => {
    if (state.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-neutral-300 text-sm font-medium">
          {dict.settings.currentPassword}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder={dict.auth.passwordPlaceholder}
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-neutral-300 text-sm font-medium">
          {dict.settings.newPassword}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder={dict.auth.newPasswordPlaceholder}
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-neutral-300 text-sm font-medium">
          {dict.settings.confirmNewPassword}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder={dict.settings.repeatNewPassword}
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand focus:ring-brand/20"
          />
        </div>
      </div>

      <Button type="submit" variant="brand" disabled={isPending} className="font-semibold">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {dict.settings.updating}
          </>
        ) : (
          dict.settings.updatePassword
        )}
      </Button>
    </form>
  );
}
