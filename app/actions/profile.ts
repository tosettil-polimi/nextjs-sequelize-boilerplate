'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { updateUser, changePassword, getUserById } from '@/lib/auth';
import { t } from '@/lib/i18n';
import type { Language } from '@/models/enums';

export interface ProfileActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

/**
 * Update user profile (name only - email is not editable)
 */
export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await getSession();

  if (!session?.userId) {
    return { error: await t('profile.unauthorized') };
  }

  const name = formData.get('name') as string;

  try {
    const updatedUser = await updateUser(session.userId, {
      name: name || undefined,
    });

    if (!updatedUser) {
      return { error: await t('profile.error') };
    }

    // Revalidate all language paths
    revalidatePath('/en/settings');
    revalidatePath('/it/settings');
    revalidatePath('/en/dashboard');
    revalidatePath('/it/dashboard');

    return {
      success: true,
      message: await t('profile.updateSuccess'),
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return { error: await t('profile.error') };
  }
}

/**
 * Change user password
 */
export async function updatePassword(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await getSession();

  if (!session?.userId) {
    return { error: await t('profile.unauthorized') };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: await t('profile.allFieldsRequired') };
  }

  if (newPassword !== confirmPassword) {
    return { error: await t('profile.passwordsDoNotMatch') };
  }

  if (newPassword.length < 8) {
    return { error: await t('profile.passwordMinLength') };
  }

  if (currentPassword === newPassword) {
    return { error: await t('profile.passwordMustBeDifferent') };
  }

  try {
    const success = await changePassword(session.userId, currentPassword, newPassword);

    if (!success) {
      return { error: await t('profile.currentPasswordIncorrect') };
    }

    return {
      success: true,
      message: await t('profile.passwordUpdateSuccess'),
    };
  } catch (error) {
    console.error('Change password error:', error);
    return { error: await t('profile.error') };
  }
}

/**
 * Get current user profile data
 */
export async function getProfile(): Promise<{
  id: string;
  email: string;
  name?: string;
  preferredLanguage?: Language;
} | null> {
  const session = await getSession();

  if (!session?.userId) {
    return null;
  }

  return getUserById(session.userId);
}
