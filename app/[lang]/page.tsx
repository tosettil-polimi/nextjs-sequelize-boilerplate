import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, Language } from '@/models/enums';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<never> {
  const { lang } = await params;
  const validLang = SUPPORTED_LANGUAGES.includes(lang as Language) ? lang : DEFAULT_LANGUAGE;
  const session = await getSession();

  if (session?.userId) {
    redirect(`/${validLang}/dashboard`);
  }

  redirect(`/${validLang}/login`);
}
