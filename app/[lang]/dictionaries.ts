import 'server-only';
import type { Language } from '@/models/enums';

export type Dictionary = {
  common: {
    email: string;
    password: string;
    name: string;
    save: string;
    cancel: string;
    loading: string;
    logout: string;
    settings: string;
    dashboard: string;
    back: string;
  };
  auth: {
    login: string;
    loginTitle: string;
    loginButton: string;
    loggingIn: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    forgotPasswordTitle: string;
    forgotPasswordDescription: string;
    sendResetLink: string;
    sending: string;
    backToLogin: string;
    emailSent: string;
    emailSentMessage: string;
    invalidLink: string;
    invalidLinkDescription: string;
    linkExpiredMessage: string;
    requestNewLink: string;
    verifyingLink: string;
    newPassword: string;
    newPasswordDescription: string;
    newPasswordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    resetPassword: string;
    resetting: string;
    passwordReset: string;
    passwordResetSuccess: string;
  };
  dashboard: {
    title: string;
    welcome: string;
    totalUsers: string;
    activeProjects: string;
    averageTime: string;
    perOperation: string;
    successRate: string;
    completedOperations: string;
    comparedToLastMonth: string;
    recentActivity: string;
    recentActivityDescription: string;
    noRecentActivity: string;
    noRecentActivityDescription: string;
  };
  settings: {
    title: string;
    description: string;
    profile: string;
    security: string;
    preferences: string;
    profileInfo: string;
    profileDescription: string;
    yourName: string;
    emailCannotBeChanged: string;
    saveChanges: string;
    saving: string;
    changePassword: string;
    changePasswordDescription: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    repeatNewPassword: string;
    updatePassword: string;
    updating: string;
    language: string;
    languageDescription: string;
    selectLanguage: string;
    english: string;
    italian: string;
  };
  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordMinLength: string;
  };
};

const dictionaries: Record<Language, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default as Dictionary),
  it: () => import('./dictionaries/it.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Language): Promise<Dictionary> => {
  return dictionaries[locale]();
};
