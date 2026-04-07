'use client';

import { Suspense, useActionState, useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { resetPassword, verifyResetToken, type PasswordActionState } from '@/app/actions/password';
import { useDictionary } from '@/lib/i18n/use-dictionary';

const initialState: PasswordActionState = {};

function ResetPasswordForm(): React.ReactElement {
  const params = useParams();
  const lang = params.lang as string;
  const dict = useDictionary(lang);
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      verifyResetToken(token).then(setIsValidToken);
    } else {
      setIsValidToken(false);
    }
  }, [token]);

  // Loading state while verifying token
  if (isValidToken === null) {
    return (
      <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand animate-spin mb-4" />
            <p className="text-neutral-400">{dict.auth.verifyingLink}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Invalid or expired token
  if (!isValidToken) {
    return (
      <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {dict.auth.invalidLink}
            </h2>
            <CardDescription className="text-neutral-400">
              {dict.auth.invalidLinkDescription}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-neutral-400 text-center">{dict.auth.linkExpiredMessage}</p>

          <Link href={`/${lang}/forgot-password`} className="block">
            <Button variant="brand" className="w-full font-semibold py-5">
              {dict.auth.requestNewLink}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Success state
  if (state.success) {
    return (
      <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-brand" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {dict.auth.passwordReset}
            </h2>
            <CardDescription className="text-neutral-400">{state.message}</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Link href={`/${lang}/login`} className="block">
            <Button variant="brand" className="w-full font-semibold py-5">
              {dict.auth.loginButton}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-4 text-center pb-8">
        <div className="mx-auto flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">{dict.auth.newPassword}</h2>
          <CardDescription className="text-neutral-400">
            {dict.auth.newPasswordDescription}
          </CardDescription>
        </div>
      </CardHeader>

      <form action={formAction}>
        <input type="hidden" name="token" value={token} />

        <CardContent className="space-y-5">
          {state.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-neutral-300 text-sm font-medium">
              {dict.auth.newPassword}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={dict.auth.newPasswordPlaceholder}
                required
                minLength={8}
                autoComplete="new-password"
                className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand focus:ring-brand/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-neutral-300 text-sm font-medium">
              {dict.auth.confirmPassword}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder={dict.auth.confirmPasswordPlaceholder}
                required
                minLength={8}
                autoComplete="new-password"
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
                {dict.auth.resetting}
              </>
            ) : (
              <>
                {dict.auth.resetPassword}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function LoadingFallback(): React.ReactElement {
  const params = useParams();
  const lang = params.lang as string;
  const dict = useDictionary(lang);

  return (
    <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand animate-spin mb-4" />
          <p className="text-neutral-400">{dict.common.loading}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage(): React.ReactElement {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
