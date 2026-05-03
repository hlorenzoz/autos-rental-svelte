<script lang="ts">
  import type { Vehicle } from '@/schemas/vehicle';
  import type { Locale } from '@/i18n/utils';
  import VehicleCard from './VehicleCard.svelte';

  interface Props {
    vehicles: Vehicle[];
    locale: Locale;
    columns?: 2 | 3 | 4;
    class?: string;
  }

  let { vehicles, locale, columns = 3, class: className }: Props = $props();

  const gridCols: Record<2 | 3 | 4, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
</script>

<div class="grid grid-cols-1 gap-md lg:gap-lg {gridCols[columns]} {className ?? ''}">
  {#each vehicles as vehicle, index (vehicle.id)}
    <div
      class="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
      style="animation-delay: {index * 100}ms"
    >
      <VehicleCard {vehicle} {locale} />
    </div>
  {/each}
</div>
