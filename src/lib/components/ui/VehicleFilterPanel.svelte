<script lang="ts">
  import type { Vehicle } from '@/schemas/vehicle';
  import type { Locale } from '@/i18n/utils';
  import { filterVehicles, getUniqueBrands, getUniqueCategories } from '@/lib/vehicles';
  import { formatCurrency } from '@/lib/formatters';

  interface FilterPanelLabels {
    brandLabel: string;
    categoryLabel: string;
    maxPriceLabel: string;
    clearFilters: string;
    noResults: string;
    found: string;
    all: string;
  }

  interface Props {
    vehicles: Vehicle[];
    locale: Locale;
    mode: 'sale' | 'rent';
    labels: FilterPanelLabels;
    vehiclesSlug: string;
  }

  let { vehicles, locale, mode, labels, vehiclesSlug }: Props = $props();

  let brand = $state('');
  let category = $state('');
  let maxPrice = $state('');

  const brands = $derived(getUniqueBrands(vehicles));
  const categories = $derived(getUniqueCategories(vehicles));

  const filtered = $derived(
    filterVehicles(vehicles, {
      brand: brand || undefined,
      category: category || undefined,
      ...(mode === 'rent' && maxPrice ? { maxPricePerDay: Number(maxPrice) } : {}),
      ...(mode === 'sale' && maxPrice ? { maxPriceSale: Number(maxPrice) } : {}),
    })
  );

  const hasActiveFilters = $derived(brand !== '' || category !== '' || maxPrice !== '');

  function clearFilters() {
    brand = '';
    category = '';
    maxPrice = '';
  }
</script>

<div class="w-full">
  <!-- Filter bar -->
  <div class="flex flex-col sm:flex-row gap-sm mb-lg p-md bg-surface-container rounded-xl border border-outline-variant/20">
    <div class="flex-1 flex flex-col gap-xs">
      <label
        for="filter-brand"
        class="text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
      >
        {labels.brandLabel}
      </label>
      <select
        id="filter-brand"
        aria-label={labels.brandLabel}
        bind:value={brand}
        class="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-sm py-xs text-on-surface text-body-sm focus:outline-none focus:border-primary transition-colors"
      >
        <option value="">{labels.all}</option>
        {#each brands as b (b)}
          <option value={b}>{b}</option>
        {/each}
      </select>
    </div>

    <div class="flex-1 flex flex-col gap-xs">
      <label
        for="filter-category"
        class="text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
      >
        {labels.categoryLabel}
      </label>
      <select
        id="filter-category"
        aria-label={labels.categoryLabel}
        bind:value={category}
        class="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-sm py-xs text-on-surface text-body-sm focus:outline-none focus:border-primary transition-colors"
      >
        <option value="">{labels.all}</option>
        {#each categories as c (c)}
          <option value={c}>{c}</option>
        {/each}
      </select>
    </div>

    <div class="flex-1 flex flex-col gap-xs">
      <label
        for="filter-price"
        class="text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold"
      >
        {labels.maxPriceLabel}
      </label>
      <input
        id="filter-price"
        aria-label={labels.maxPriceLabel}
        type="number"
        min={0}
        bind:value={maxPrice}
        placeholder={mode === 'rent' ? '350' : '200000'}
        class="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-sm py-xs text-on-surface text-body-sm focus:outline-none focus:border-primary transition-colors"
      />
    </div>

    {#if hasActiveFilters}
      <div class="flex items-end">
        <button
          type="button"
          onclick={clearFilters}
          class="px-md py-xs rounded-lg border border-outline text-on-surface-variant text-label-caps uppercase tracking-wider hover:bg-surface-container-high transition-colors"
        >
          {labels.clearFilters}
        </button>
      </div>
    {/if}
  </div>

  <!-- Results count -->
  <p data-testid="result-count" class="text-body-sm text-on-surface-variant mb-md">
    <span class="font-bold text-on-surface">{filtered.length}</span>
    {labels.found}
  </p>

  <!-- Grid or empty state -->
  {#if filtered.length === 0}
    <div class="py-xl text-center">
      <span class="material-symbols-outlined text-5xl text-outline/40 block mb-md">
        directions_car
      </span>
      <p data-testid="empty-state" class="text-body-lg text-on-surface-variant">{labels.noResults}</p>
      <button
        type="button"
        onclick={clearFilters}
        class="mt-md text-primary text-body-sm font-semibold hover:underline"
      >
        {labels.clearFilters}
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md lg:gap-lg">
      {#each filtered as vehicle (vehicle.id)}
        {@const price = mode === 'rent' ? vehicle.price.rent : vehicle.price.sale}
        {@const formatted = price ? formatCurrency(price, locale) : '—'}
        {@const suffix = mode === 'rent' ? ' / day' : ''}
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
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
                {mode === 'rent' ? 'Book Now' : 'Inquire'}
              </a>
            </div>
          </article>
        </div>
      {/each}
    </div>
  {/if}
</div>
