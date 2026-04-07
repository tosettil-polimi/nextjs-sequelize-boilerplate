'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDictionary } from '@/lib/i18n/use-dictionary';
import { Language, SUPPORTED_LANGUAGES } from '@/models/enums';
import { updateLanguagePreference, type LanguageActionState } from '@/app/actions/language';

interface LanguageFormProps {
  currentLang: Language;
}

const languageLabels: Record<Language, { flag: string; native: string }> = {
  [Language.EN]: { flag: '🇬🇧', native: 'English' },
  [Language.IT]: { flag: '🇮🇹', native: 'Italiano' },
};

const initialState: LanguageActionState = {};

export function LanguageForm({ currentLang }: LanguageFormProps): React.ReactElement {
  const router = useRouter();
  const dict = useDictionary(currentLang);
  const [state, formAction] = useActionState(updateLanguagePreference, initialState);
  const [isPending, startTransition] = useTransition();

  // Handle language change redirect
  useEffect(() => {
    if (state.success && state.newLanguage && state.newLanguage !== currentLang) {
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(/^\/(en|it)/, '');
      const newPath = `/${state.newLanguage}${pathWithoutLang}`;
      router.push(newPath);
    }
  }, [state.success, state.newLanguage, currentLang, router]);

  const handleLanguageChange = (value: string): void => {
    startTransition(() => {
      const formData = new FormData();
      formData.set('language', value);
      formAction(formData);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-neutral-400 mb-4">
        <Globe className="w-4 h-4" />
        <span className="text-sm">{dict.settings.selectLanguage}</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language" className="text-neutral-300 text-sm font-medium">
          {dict.settings.language}
        </Label>

        <Select value={currentLang} onValueChange={handleLanguageChange} disabled={isPending}>
          <SelectTrigger className="w-full bg-neutral-800/50 border-neutral-700 text-white">
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{dict.common.loading}</span>
              </div>
            ) : (
              <SelectValue placeholder={dict.settings.selectLanguage} />
            )}
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem
                key={lang}
                value={lang}
                className="text-white hover:bg-neutral-700 focus:bg-neutral-700 focus:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{languageLabels[lang].flag}</span>
                  <span>{languageLabels[lang].native}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {state.error}
        </div>
      )}
    </div>
  );
}
