<script lang="ts">
  import { page } from '$app/stores';
  import TopNavBar from '@/components/domains/nav/TopNavBar.svelte';
  import Footer from '@/components/domains/shared/Footer.svelte';
  import VehicleFilterPanel from '@/components/ui/VehicleFilterPanel.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.t.vehicles.forRentHeadline} | {data.t.site.name}</title>
  <meta name="description" content={data.t.vehicles.forRentSubline} />
</svelte:head>

<TopNavBar
  locale={data.locale}
  currentUrl={$page.url}
  lightLabel={data.t.theme.toggleLight}
  darkLabel={data.t.theme.toggleDark}
/>

<main class="pt-24 pb-xl">
  <div class="max-w-7xl mx-auto px-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-lg border-b border-outline-variant/20 pb-lg mb-xl">
      <div class="space-y-sm">
        <h1 class="text-h1 font-display font-black tracking-tight text-on-surface">
          {data.t.vehicles.forRentHeadline}
        </h1>
        <p class="text-body-lg text-on-surface-variant max-w-2xl">
          {data.t.vehicles.forRentSubline}
        </p>
      </div>
      <a
        href="/{data.locale}{data.t.nav.links.inventory}"
        class="hidden md:inline-flex items-center gap-xs text-body-sm text-on-surface-variant hover:text-primary transition-colors"
      >
        <span class="material-symbols-outlined text-base">arrow_back</span>
        {data.t.vehicleDetail.backToInventory}
      </a>
    </div>

    <VehicleFilterPanel
      vehicles={data.vehicles}
      locale={data.locale}
      mode="rent"
      labels={{
        brandLabel: data.t.filters.brand,
        categoryLabel: data.t.filters.category,
        maxPriceLabel: data.t.filters.priceRange,
        clearFilters: data.t.filters.clearFilters,
        noResults: data.t.filters.noResults,
        found: data.t.vehicles.viewAll,
        all: data.t.filters.all,
      }}
      vehiclesSlug={data.t.nav.slugs.vehicles}
    />
  </div>
</main>

<Footer locale={data.locale} currentUrl={$page.url} />
