import { error } from '@sveltejs/kit';
import { getDictionary, locales, type Locale } from '$lib/i18n/utils';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const trailingSlash = 'always';

export const load: LayoutLoad = ({ params }) => {
  const lang = params.lang as Locale;
  const t = getDictionary(lang);
  return { locale: lang, t };
};
