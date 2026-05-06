import type { ParamMatcher } from '@sveltejs/kit';
import { locales } from '$lib/i18n/utils';

export const match: ParamMatcher = (param) => {
  return locales.includes(param as any);
};
