<script lang="ts">
  import type { Vehicle } from '@/schemas/vehicle';
  import type { Locale } from '@/i18n/utils';
  import { filterVehicles, getUniqueBrands, getUniqueCategories } from '@/lib/vehicles';
  import { formatCurrency } from '@/lib/formatters';
  import SearchPill from '$lib/components/ui/SearchPill.svelte';
  import QuickFilterTags from '$lib/components/ui/QuickFilterTags.svelte';
  import { SvelteSet } from 'svelte/reactivity';

  interface FilterState {
    brand?: string;
    category?: string;
    maxPrice?: number;
  }

  interface VehicleHubLabels {
    buyLabel: string;
    rentLabel: string;
    placeholder: string;
    filterLabel: string;
    filters: Array<{ label: string; value: string }>;
    noResults: string;
    clearFilters: string;
    found: string;
    bookNow: string;
    inquire: string;
  }

  interface Props {
    vehicles: Vehicle[];
    locale: Locale;
    labels: VehicleHubLabels;
    vehiclesSlug: string;
  }

  let { vehicles, locale, labels, vehiclesSlug }: Props = $props();

  let mode = $state<'buy' | 'rent'>('buy');
  let query = $state('');
  let filters = $state<FilterState>({});
  let activeTags = $state<string[]>([]);

  const brands = $derived(getUniqueBrands(vehicles));
  const categories = $derived(getUniqueCategories(vehicles));

  const filtered = $derived.by(() => {
    let result = filterVehicles(vehicles, {
      type: mode === 'buy' ? 'sale' : 'rent',
      search: query || undefined,
      brand: filters.brand,
      category: filters.category,
      maxPricePerDay: mode === 'rent' ? filters.maxPrice : undefined,
      maxPriceSale: mode === 'buy' ? filters.maxPrice : undefined,
    });

    if (activeTags.length > 0) {
      const catSet = new SvelteSet<string>();
      let maxSale: number | undefined;
      let maxRent: number | undefined;

      for (const tag of activeTags) {
        if (tag === 'electric') catSet.add('electric-sedan');
        if (tag === 'suv') {
          catSet.add('suv');
          catSet.add('luxury-suv');
        }
        if (tag === 'luxury') {
          catSet.add('luxury-suv');
          catSet.add('sports-coupe');
        }
        if (tag === 'budget') {
          maxSale = 50000;
          maxRent = 150;
        }
      }

      result = result.filter((v) => {
        if (catSet.size > 0 && !catSet.has(v.category)) return false;
        if (maxSale !== undefined && mode === 'buy' && (v.price.sale === undefined || v.price.sale > maxSale))
          return false;
        if (maxRent !== undefined && mode === 'rent' && (v.price.rent === undefined || v.price.rent > maxRent))
          return false;
        return true;
      });
    }

    return result;
  });
</script>

<div class="w-full">
  <div class="relative z-30 mb-lg">
    <SearchPill
      buyLabel={labels.buyLabel}
      rentLabel={labels.rentLabel}
      placeholder={labels.placeholder}
      filterLabel={labels.filterLabel}
      {brands}
      {categories}
      initialMode={mode}
      onModeChange={(m) => { mode = m; }}
      onSearch={(q) => { query = q; }}
      onFilterChange={(f) => { filters = f; }}
    />
  </div>

  <QuickFilterTags
    filters={labels.filters}
    onFilterChange={(tags) => { activeTags = tags; }}
  />

  <p data-testid="result-count" class="text-body-sm text-on-surface-variant mt-lg mb-md">
    <span class="font-bold text-on-surface">{filtered.length}</span>
    {labels.found}
  </p>

  {#if filtered.length === 0}
    <div class="py-xl text-center">
      <span class="material-symbols-outlined text-5xl text-outline/40 block mb-md">
        directions_car
      </span>
      <p data-testid="empty-state" class="text-body-lg text-on-surface-variant">
        {labels.noResults}
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md lg:gap-lg">
      {#each filtered as vehicle, i (vehicle.id)}
        {@const price = mode === 'rent' ? vehicle.price.rent : vehicle.price.sale}
        {@const formatted = price ? formatCurrency(price, locale) : '—'}
        {@const suffix = mode === 'rent' ? ' / day' : ''}
        <div
          class="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
          style="animation-delay: {i * 60}ms"
        >
          <article class="group bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/30 transition-all duration-500 hover:atmospheric-shadow hover:-translate-y-1">
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {#if !vehicle.available}
                <div class="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span class="px-4 py-1 rounded-full bg-surface/80 text-on-surface text-xs font-bold uppercase tracking-wider">
                    Unavailable
                  </span>
                </div>
              {/if}
            </div>
            <div class="p-md flex flex-col gap-sm">
              <div class="flex justify-between items-start gap-xs">
                <div>
                  <p class="text-label-caps text-on-surface-variant font-medium tracking-wider mb-xs">
                    {vehicle.year} · {vehicle.brand}
                  </p>
                  <h3 class="text-h3 font-display font-bold text-on-surface leading-tight">
                    {vehicle.model}
                  </h3>
                </div>
                <p class="text-h3 font-display font-bold text-primary text-right">
                  {formatted}
                  <span class="text-body-sm font-body font-normal text-on-surface-variant">
                    {suffix}
                  </span>
                </p>
              </div>
              <a
                href={`/${locale}/${vehiclesSlug}/${vehicle.slug}`}
                class="mt-xs block text-center bg-primary text-on-primary rounded-xl px-md py-sm text-label-caps uppercase tracking-[0.05em] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 active:scale-95"
              >
                {mode === 'rent' ? labels.bookNow : labels.inquire}
              </a>
            </div>
          </article>
        </div>
      {/each}
    </div>
  {/if}
</div>
