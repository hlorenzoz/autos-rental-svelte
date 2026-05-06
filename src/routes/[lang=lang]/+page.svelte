<script lang="ts">
  import { page } from '$app/stores';
  import TopNavBar from '@/components/domains/nav/TopNavBar.svelte';
  import HeroSection from '@/components/domains/shared/HeroSection.svelte';
  import OverviewSection from '@/components/domains/landing/OverviewSection.svelte';
  import FeaturedVehicles from '@/components/domains/vehicles/FeaturedVehicles.svelte';
  import ServicesSection from '@/components/domains/landing/ServicesSection.svelte';
  import ReviewsSection from '@/components/domains/landing/ReviewsSection.svelte';
  import ContactSection from '@/components/domains/landing/ContactSection.svelte';
  import Footer from '@/components/domains/shared/Footer.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.t.site.name}</title>
  <meta name="description" content={data.t.site.description} />
  <link rel="canonical" href="https://autos-rental.hlorenzoz.com/{data.locale}/" />
  <meta property="og:title" content={data.t.site.name} />
  <meta property="og:description" content={data.t.site.description} />
  <meta property="og:type" content="website" />
</svelte:head>

<TopNavBar
  locale={data.locale}
  currentUrl={$page.url}
  lightLabel={data.t.theme.toggleLight}
  darkLabel={data.t.theme.toggleDark}
/>

<main>
  <HeroSection locale={data.locale} />
  <OverviewSection locale={data.locale} />
  <FeaturedVehicles locale={data.locale} />
  <ServicesSection locale={data.locale} />
  <ReviewsSection locale={data.locale} />
  <ContactSection locale={data.locale} />
</main>

<Footer locale={data.locale} currentUrl={$page.url} />
