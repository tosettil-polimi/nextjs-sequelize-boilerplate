'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { login, type AuthState } from '@/app/actions/auth';
import { useDictionary } from '@/lib/i18n/use-dictionary';

const initialState: AuthState = {};

export default function LoginPage(): React.ReactElement {
  const params = useParams();
  const lang = params.lang as string;
  const dict = useDictionary(lang);
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [email, setEmail] = useState('');

  return (
    <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-4 text-center pb-8">
        <div className="mx-auto flex justify-center">
          <Logo size="lg" />
        </div>
        <CardDescription className="text-neutral-400">{dict.auth.loginTitle}</CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-5">
          {state.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-300 text-sm font-medium">
              {dict.common.email}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={dict.auth.emailPlaceholder}
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand focus:ring-brand/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-neutral-300 text-sm font-medium">
                {dict.common.password}
              </Label>
              <Link
                href={`/${lang}/forgot-password`}
                className="text-xs text-brand hover:text-brand/80 transition-colors"
              >
                {dict.auth.forgotPassword}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={dict.auth.passwordPlaceholder}
                required
                autoComplete="current-password"
                className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand focus:ring-brand/20"
              />
            </div>
          </div>
        </CardContent>

        <div className="px-6 pb-6 pt-2">
          <Button
            type="submit"
            variant="brand"
            disabled={isPending}
            className="w-full font-semibold py-5"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {dict.auth.loggingIn}
              </>
            ) : (
              <>
                {dict.auth.loginButton}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
