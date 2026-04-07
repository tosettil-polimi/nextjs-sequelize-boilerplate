import Link from 'next/link';
import { LogOut, BarChart3, Users, Clock, TrendingUp, Settings, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { getSession } from '@/lib/session';
import { logout } from '@/app/actions/auth';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/models/enums';

export default async function DashboardPage({
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
            <Logo size="md" />

            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">{session?.email}</span>
              <Link href={`/${validLang}/settings`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {dict.common.settings}
                </Button>
              </Link>
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
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{dict.dashboard.title}</h1>
          <p className="text-neutral-400">
            {dict.dashboard.welcome}, {session?.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">
                {dict.dashboard.totalUsers}
              </CardTitle>
              <Users className="w-4 h-4 text-brand" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-neutral-500 mt-1">{dict.dashboard.comparedToLastMonth}</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">
                {dict.dashboard.activeProjects}
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-brand" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-neutral-500 mt-1">{dict.dashboard.comparedToLastMonth}</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">
                {dict.dashboard.averageTime}
              </CardTitle>
              <Clock className="w-4 h-4 text-brand" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0s</div>
              <p className="text-xs text-neutral-500 mt-1">{dict.dashboard.perOperation}</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">
                {dict.dashboard.successRate}
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-brand" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">100%</div>
              <p className="text-xs text-neutral-500 mt-1">{dict.dashboard.completedOperations}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">{dict.dashboard.recentActivity}</CardTitle>
            <CardDescription className="text-neutral-400">
              {dict.dashboard.recentActivityDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-lg font-medium text-neutral-300 mb-2">
                {dict.dashboard.noRecentActivity}
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm">
                {dict.dashboard.noRecentActivityDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
