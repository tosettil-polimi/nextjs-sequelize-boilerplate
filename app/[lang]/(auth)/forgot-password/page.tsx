'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { forgotPassword, type PasswordActionState } from '@/app/actions/password';
import { useDictionary } from '@/lib/i18n/use-dictionary';

const initialState: PasswordActionState = {};

export default function ForgotPasswordPage(): React.ReactElement {
  const params = useParams();
  const lang = params.lang as string;
  const dict = useDictionary(lang);
  const [state, formAction, isPending] = useActionState(forgotPassword, initialState);
  const [email, setEmail] = useState<string>();

  if (state.success) {
    return (
      <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-brand" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">{dict.auth.emailSent}</h2>
            <CardDescription className="text-neutral-400">{state.message}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-neutral-400 text-center">{dict.auth.emailSentMessage}</p>

          <Link href={`/${lang}/login`} className="block">
            <Button
              variant="outline"
              className="w-full border-neutral-700 hover:bg-neutral-800 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {dict.auth.backToLogin}
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
          <h2 className="text-xl font-bold tracking-tight text-white">
            {dict.auth.forgotPasswordTitle}
          </h2>
          <CardDescription className="text-neutral-400">
            {dict.auth.forgotPasswordDescription}
          </CardDescription>
        </div>
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
        </CardContent>

        <div className="px-6 pb-6 pt-2 space-y-3">
          <Button
            type="submit"
            variant="brand"
            disabled={isPending}
            className="w-full font-semibold py-5"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {dict.auth.sending}
              </>
            ) : (
              <>
                {dict.auth.sendResetLink}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <Link href={`/${lang}/login`} className="block">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {dict.auth.backToLogin}
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  );
}
