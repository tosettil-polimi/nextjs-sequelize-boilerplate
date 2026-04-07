import 'server-only';
import { headers } from 'next/headers';
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/models/enums';

// Backend error messages translations
const translations: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    // Auth
    'auth.emailPasswordRequired': 'Email and password are required',
    'auth.invalidCredentials': 'Invalid credentials',
    // Profile
    'profile.unauthorized': 'Unauthorized',
    'profile.emailRequired': 'Email is required',
    'profile.updateFailed': 'Unable to update profile. Email already in use.',
    'profile.updateSuccess': 'Profile updated successfully',
    'profile.error': 'An error occurred. Please try again later.',
    'profile.allFieldsRequired': 'All fields are required',
    'profile.passwordsDoNotMatch': 'New passwords do not match',
    'profile.passwordMinLength': 'New password must be at least 8 characters',
    'profile.passwordMustBeDifferent': 'New password must be different from current password',
    'profile.currentPasswordIncorrect': 'Current password is incorrect',
    'profile.passwordUpdateSuccess': 'Password updated successfully',
    // Password reset
    'password.emailRequired': 'Email is required',
    'password.resetEmailSent':
      'If the email exists, you will receive a link to reset your password',
    'password.error': 'An error occurred. Please try again later.',
    'password.invalidToken': 'Invalid token',
    'password.allFieldsRequired': 'All fields are required',
    'password.passwordsDoNotMatch': 'Passwords do not match',
    'password.passwordMinLength': 'Password must be at least 8 characters',
    'password.linkExpired': 'The link has expired or is invalid. Request a new reset.',
    'password.userNotFound': 'User not found',
    'password.resetSuccess': 'Password reset successfully. You can now sign in.',
    // Validation (models)
    'validation.emailRequired': 'Email is required',
    'validation.emailInvalid': 'Enter a valid email address',
    'validation.passwordRequired': 'Password is required',
    'validation.passwordMinLength': 'Password must be at least 8 characters',
    'validation.nameMaxLength': 'Name cannot exceed 100 characters',
    'validation.roleRequired': 'Role is required',
    'validation.divisionRequired': 'Division is required',
  },
  [Language.IT]: {
    // Auth
    'auth.emailPasswordRequired': 'Email e password sono obbligatori',
    'auth.invalidCredentials': 'Credenziali non valide',
    // Profile
    'profile.unauthorized': 'Non autorizzato',
    'profile.emailRequired': 'Email è obbligatoria',
    'profile.updateFailed': 'Impossibile aggiornare il profilo. Email già in uso.',
    'profile.updateSuccess': 'Profilo aggiornato con successo',
    'profile.error': 'Si è verificato un errore. Riprova più tardi.',
    'profile.allFieldsRequired': 'Tutti i campi sono obbligatori',
    'profile.passwordsDoNotMatch': 'Le nuove password non corrispondono',
    'profile.passwordMinLength': 'La nuova password deve essere di almeno 8 caratteri',
    'profile.passwordMustBeDifferent': 'La nuova password deve essere diversa da quella attuale',
    'profile.currentPasswordIncorrect': 'Password attuale non corretta',
    'profile.passwordUpdateSuccess': 'Password aggiornata con successo',
    // Password reset
    'password.emailRequired': 'Email è obbligatoria',
    'password.resetEmailSent': "Se l'email esiste, riceverai un link per reimpostare la password",
    'password.error': 'Si è verificato un errore. Riprova più tardi.',
    'password.invalidToken': 'Token non valido',
    'password.allFieldsRequired': 'Tutti i campi sono obbligatori',
    'password.passwordsDoNotMatch': 'Le password non corrispondono',
    'password.passwordMinLength': 'La password deve essere di almeno 8 caratteri',
    'password.linkExpired': 'Il link è scaduto o non valido. Richiedi un nuovo reset.',
    'password.userNotFound': 'Utente non trovato',
    'password.resetSuccess': 'Password reimpostata con successo. Ora puoi accedere.',
    // Validation (models)
    'validation.emailRequired': 'Email è obbligatoria',
    'validation.emailInvalid': 'Inserisci un indirizzo email valido',
    'validation.passwordRequired': 'Password è obbligatoria',
    'validation.passwordMinLength': 'La password deve essere di almeno 8 caratteri',
    'validation.nameMaxLength': 'Il nome non può superare i 100 caratteri',
    'validation.roleRequired': 'Il ruolo è obbligatorio',
    'validation.divisionRequired': 'La divisione è obbligatoria',
  },
};

/**
 * Get the current locale from the referer header or Accept-Language
 */
export async function getCurrentLocale(): Promise<Language> {
  const headersList = await headers();
  const referer = headersList.get('referer') || '';

  // First try to extract locale from referer URL
  for (const locale of SUPPORTED_LANGUAGES) {
    if (referer.includes(`/${locale}/`)) {
      return locale;
    }
  }

  // Fallback to Accept-Language header
  const acceptLanguage = headersList.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase());
    for (const lang of languages) {
      const langPrefix = lang.split('-')[0];
      if (SUPPORTED_LANGUAGES.includes(langPrefix as Language)) {
        return langPrefix as Language;
      }
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Translate a message key to the current locale
 */
export async function t(key: string): Promise<string> {
  const locale = await getCurrentLocale();
  return translations[locale][key] || translations[DEFAULT_LANGUAGE][key] || key;
}

/**
 * Translate a message key to a specific locale
 */
export function tWithLocale(key: string, locale: Language): string {
  return translations[locale][key] || translations[DEFAULT_LANGUAGE][key] || key;
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: Language): Record<string, string> {
  return translations[locale] || translations[DEFAULT_LANGUAGE];
}
