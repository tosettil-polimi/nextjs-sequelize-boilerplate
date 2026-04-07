'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';
import { verifyCredentials } from '@/lib/auth';
import { DEFAULT_LANGUAGE } from '@/models/enums';
import { getCurrentLocale, t } from '@/lib/i18n';

export interface AuthState {
  error?: string;
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: await t('auth.emailPasswordRequired') };
  }

  const user = await verifyCredentials(email, password);

  if (!user) {
    return { error: await t('auth.invalidCredentials') };
  }

  await createSession(user.id, user.email);

  // Redirect to user's preferred language, fallback to current locale or default
  const targetLocale = user.preferredLanguage || (await getCurrentLocale()) || DEFAULT_LANGUAGE;
  redirect(`/${targetLocale}/dashboard`);
}

export async function logout(): Promise<void> {
  const locale = await getCurrentLocale();
  await deleteSession();
  redirect(`/${locale}/login`);
}
