import { getAllVehicles } from '@/lib/vehicles';
import { locales } from '@/i18n/utils';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
  const vehicles = getAllVehicles();
  return locales.flatMap((lang) => vehicles.map((v) => ({ lang, slug: v.slug })));
};

export const load: PageLoad = async ({ params, parent }) => {
  const parentData = await parent();
  const vehicles = getAllVehicles();
  const vehicle = vehicles.find((v) => v.slug === params.slug);
  if (!vehicle) error(404, 'Vehicle not found');
  return { ...parentData, vehicle };
};
