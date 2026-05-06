import { getAllVehicles } from '@/lib/vehicles';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent();
  const vehicles = getAllVehicles();
  return { ...parentData, vehicles };
};
