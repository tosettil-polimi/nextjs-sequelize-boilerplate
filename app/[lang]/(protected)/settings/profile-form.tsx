'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { User, Mail, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile, type ProfileActionState } from '@/app/actions/profile';
import { useDictionary } from '@/lib/i18n/use-dictionary';

const initialState: ProfileActionState = {};

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  lang: string;
}

export function ProfileForm({
  initialName,
  initialEmail,
  lang,
}: ProfileFormProps): React.ReactElement {
  const dict = useDictionary(lang);
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);
  const [name, setName] = useState(initialName || '');

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
        <Label htmlFor="name" className="text-neutral-300 text-sm font-medium">
          {dict.common.name}
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={dict.settings.yourName}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-neutral-300 text-sm font-medium">
          {dict.common.email}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            id="email"
            type="email"
            value={initialEmail}
            disabled
            className="pl-10 bg-neutral-800/30 border-neutral-700 text-neutral-400 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-neutral-500">{dict.settings.emailCannotBeChanged}</p>
      </div>

      <Button type="submit" variant="brand" disabled={isPending} className="font-semibold">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {dict.settings.saving}
          </>
        ) : (
          dict.settings.saveChanges
        )}
      </Button>
    </form>
  );
}
