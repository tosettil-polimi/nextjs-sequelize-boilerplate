'use client';

import { useMemo } from 'react';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import enDict from '@/app/[lang]/dictionaries/en.json';
import itDict from '@/app/[lang]/dictionaries/it.json';

const dictionaries: Record<string, Dictionary> = {
  en: enDict as Dictionary,
  it: itDict as Dictionary,
};

export function useDictionary(lang: string): Dictionary {
  return useMemo(() => {
    return dictionaries[lang] || dictionaries.en;
  }, [lang]);
}
