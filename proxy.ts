import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, Language } from '@/models/enums';

// Routes that require authentication (without locale prefix)
const protectedRoutes = ['/dashboard', '/settings'];

// Routes that should redirect to dashboard if already authenticated (without locale prefix)
const publicRoutes = ['/login', '/forgot-password', '/reset-password'];

function getLocale(request: NextRequest): Language {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase());
    for (const lang of languages) {
      // Check for exact match or language prefix (e.g., 'it-IT' -> 'it')
      const langPrefix = lang.split('-')[0];
      if (SUPPORTED_LANGUAGES.includes(langPrefix as Language)) {
        return langPrefix as Language;
      }
    }
  }

  return DEFAULT_LANGUAGE;
}

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = SUPPORTED_LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in pathname, redirect to add one
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Extract locale and path without locale
  const localeMatch = pathname.match(/^\/(en|it)/);
  const locale = localeMatch ? localeMatch[1] : DEFAULT_LANGUAGE;
  const pathWithoutLocale = pathname.replace(/^\/(en|it)/, '') || '/';

  const isProtectedRoute = protectedRoutes.some((route) => pathWithoutLocale.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale);

  // Get session from cookie
  const cookie = request.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.nextUrl));
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$|.*\\.svg$).*)'],
};
