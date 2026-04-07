import Link from 'next/link';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';
import { getSession } from '@/lib/session';
import { logout } from '@/app/actions/auth';
import { getProfile } from '@/app/actions/profile';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/models/enums';
import { ProfileForm } from './profile-form';
import { PasswordForm } from './password-form';
import { LanguageForm } from './language-form';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<React.ReactElement> {
  const { lang } = await params;
  const validLang = (
    SUPPORTED_LANGUAGES.includes(lang as Language) ? lang : DEFAULT_LANGUAGE
  ) as Language;
  const dict = await getDictionary(validLang);
  const session = await getSession();
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-neutral-900 via-black to-black pointer-events-none" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-brand/5 to-transparent rotate-12 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-brand/5 to-transparent -rotate-12 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-neutral-800 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/${validLang}/dashboard`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {dict.common.dashboard}
                </Button>
              </Link>
              <Logo size="md" />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">{session?.email}</span>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {dict.common.logout}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{dict.settings.title}</h1>
          <p className="text-neutral-400">{dict.settings.description}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-neutral-900 border border-neutral-800">
            <TabsTrigger
              value="profile"
              className="text-neutral-400 data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              {dict.settings.profile}
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-neutral-400 data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              {dict.settings.security}
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="text-neutral-400 data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              {dict.settings.preferences}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">{dict.settings.profileInfo}</CardTitle>
                <CardDescription className="text-neutral-400">
                  {dict.settings.profileDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  initialName={profile?.name || ''}
                  initialEmail={profile?.email || ''}
                  lang={validLang}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">{dict.settings.changePassword}</CardTitle>
                <CardDescription className="text-neutral-400">
                  {dict.settings.changePasswordDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordForm lang={validLang} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">{dict.settings.language}</CardTitle>
                <CardDescription className="text-neutral-400">
                  {dict.settings.languageDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LanguageForm currentLang={validLang} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
