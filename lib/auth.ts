import 'server-only';
import { UniqueConstraintError } from 'sequelize';
import User from '@/models/User';
import type { Language } from '@/models/enums';

export interface UserDTO {
  id: string;
  email: string;
  name?: string;
  preferredLanguage?: Language;
}

/**
 * Verify user credentials and return user data if valid.
 * Uses unscoped() to include the password field excluded by the default scope.
 */
export async function verifyCredentials(email: string, password: string): Promise<UserDTO | null> {
  const user = await User.scope('withPassword').findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    return null;
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    preferredLanguage: user.preferredLanguage,
  };
}

/**
 * Create a new user account
 */
export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<UserDTO | null> {
  try {
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return null;
    }
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<UserDTO | null> {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      preferredLanguage: user.preferredLanguage,
    };
  } catch {
    return null;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<UserDTO | null> {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    preferredLanguage: user.preferredLanguage,
  };
}

/**
 * Update user profile
 */
export async function updateUser(
  id: string,
  updates: { name?: string; email?: string }
): Promise<UserDTO | null> {
  try {
    await User.update(updates, { where: { id } });
    const user = await User.findByPk(id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      preferredLanguage: user.preferredLanguage,
    };
  } catch {
    return null;
  }
}

/**
 * Change user password.
 * Uses withPassword scope to fetch the current hashed password for comparison.
 */
export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const user = await User.scope('withPassword').findOne({ where: { id } });

  if (!user) {
    return false;
  }

  const isValidPassword = await user.comparePassword(currentPassword);

  if (!isValidPassword) {
    return false;
  }

  user.password = newPassword;
  await user.save();

  return true;
}

/**
 * Delete user account
 */
export async function deleteUser(id: string): Promise<boolean> {
  const count = await User.destroy({ where: { id } });
  return count > 0;
}
