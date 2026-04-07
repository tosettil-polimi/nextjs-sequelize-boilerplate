import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, Language } from '@/models/enums';

export default async function ProtectedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>): Promise<React.ReactElement> {
  const { lang } = await params;
  const validLang = SUPPORTED_LANGUAGES.includes(lang as Language) ? lang : DEFAULT_LANGUAGE;
  const session = await getSession();

  if (!session) {
    redirect(`/${validLang}/login`);
  }

  return <>{children}</>;
}
