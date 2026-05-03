import { locales } from '$lib/i18n/utils';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
  return locales.map((lang) => ({ lang }));
};
