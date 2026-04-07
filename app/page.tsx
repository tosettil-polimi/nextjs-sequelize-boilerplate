import { redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from '@/models/enums';

export default function RootPage(): never {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
