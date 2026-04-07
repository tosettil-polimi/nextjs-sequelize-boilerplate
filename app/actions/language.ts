'use server';

import { revalidatePath } from 'next/cache';
import User from '@/models/User';
import { getSession } from '@/lib/session';
import { Language, SUPPORTED_LANGUAGES } from '@/models/enums';

export interface LanguageActionState {
  error?: string;
  success?: boolean;
  newLanguage?: Language;
}

/**
 * Update user's preferred language
 */
export async function updateLanguagePreference(
  _prevState: LanguageActionState,
  formData: FormData
): Promise<LanguageActionState> {
  const session = await getSession();
  const language = formData.get('language') as string;

  // Validate language
  if (!language || !SUPPORTED_LANGUAGES.includes(language as Language)) {
    return { error: 'Invalid language' };
  }

  // If user is logged in, save preference to database
  if (session?.userId) {
    try {
      await User.findByIdAndUpdate(session.userId, {
        preferredLanguage: language as Language,
      });

      // Revalidate all paths
      revalidatePath('/en/settings');
      revalidatePath('/it/settings');
      revalidatePath('/en/dashboard');
      revalidatePath('/it/dashboard');
    } catch (error) {
      console.error('Update language preference error:', error);
      return { error: 'Failed to update language preference' };
    }
  }

  return {
    success: true,
    newLanguage: language as Language,
  };
}
