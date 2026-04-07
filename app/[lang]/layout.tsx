import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SUPPORTED_LANGUAGES, Language } from '@/models/enums';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'My App - Dashboard',
  description: 'Your application description goes here',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export async function generateStaticParams(): Promise<{ lang: string }[]> {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>): Promise<React.ReactElement> {
  const { lang } = await params;
  const validLang = SUPPORTED_LANGUAGES.includes(lang as Language) ? lang : 'en';

  return (
    <html lang={validLang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
