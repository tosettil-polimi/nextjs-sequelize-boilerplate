'use server';

import crypto from 'crypto';
import { Op } from 'sequelize';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { sendPasswordResetEmail } from '@/lib/mailer';
import { t } from '@/lib/i18n';

export interface PasswordActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

/**
 * Request a password reset email
 */
export async function forgotPassword(
  _prevState: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: await t('password.emailRequired') };
  }

  try {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        success: true,
        message: await t('password.resetEmailSent'),
      };
    }

    // Delete any existing reset tokens for this user
    await PasswordResetToken.destroy({ where: { userId: user.id } });

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Create reset token (expires in 1 hour)
    await PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await sendPasswordResetEmail(user.email, token);

    return {
      success: true,
      message: await t('password.resetEmailSent'),
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { error: await t('password.error') };
  }
}

/**
 * Reset password using token
 */
export async function resetPassword(
  _prevState: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!token) {
    return { error: await t('password.invalidToken') };
  }

  if (!password || !confirmPassword) {
    return { error: await t('password.allFieldsRequired') };
  }

  if (password !== confirmPassword) {
    return { error: await t('password.passwordsDoNotMatch') };
  }

  if (password.length < 8) {
    return { error: await t('password.passwordMinLength') };
  }

  try {
    // Find valid (non-expired) reset token
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!resetToken) {
      return { error: await t('password.linkExpired') };
    }

    // Fetch user with password scope so the beforeSave hook can compare and hash
    const user = await User.scope('withPassword').findOne({ where: { id: resetToken.userId } });

    if (!user) {
      return { error: await t('password.userNotFound') };
    }

    // Setting password triggers the beforeSave hook which hashes it
    user.password = password;
    await user.save();

    // Delete the consumed token
    await PasswordResetToken.destroy({ where: { id: resetToken.id } });

    return {
      success: true,
      message: await t('password.resetSuccess'),
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error: await t('password.error') };
  }
}

/**
 * Verify if a reset token is valid (not expired)
 */
export async function verifyResetToken(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    return resetToken !== null;
  } catch {
    return false;
  }
}
