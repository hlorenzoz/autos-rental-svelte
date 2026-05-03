<script lang="ts">
  import { page } from '$app/stores';
  import TopNavBar from '@/components/domains/nav/TopNavBar.svelte';
  import Footer from '@/components/domains/shared/Footer.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.t.legal.privacyTitle} | {data.t.site.name}</title>
  <meta name="description" content={data.t.legal.privacyLastUpdated} />
</svelte:head>

<TopNavBar
  locale={data.locale}
  currentUrl={$page.url}
  lightLabel={data.t.theme.toggleLight}
  darkLabel={data.t.theme.toggleDark}
/>

<main class="pt-24 pb-xl relative overflow-hidden">
  <div class="absolute top-0 right-0 w-[40%] aspect-square bg-primary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>

  <div class="max-w-3xl mx-auto px-8 relative z-10">
    <div class="text-center mb-2xl space-y-md">
      <h1 class="text-h1 font-display font-black tracking-tight text-on-surface">
        {data.t.legal.privacyTitle}
      </h1>
      <p class="text-body-lg text-on-surface-variant leading-relaxed">
        {data.t.legal.privacyLastUpdated}
      </p>
    </div>

    {#each data.t.legal.privacy.sections as section}
      <div class="bg-surface-container-lowest rounded-2xl p-lg border border-outline-variant/20 mb-xl shadow-sm">
        <h2 class="text-h2 font-display font-bold text-on-surface mb-md">{section.title}</h2>
        <p class="text-body-lg text-on-surface-variant leading-relaxed">{section.content}</p>
      </div>
    {/each}
  </div>
</main>

<Footer locale={data.locale} currentUrl={$page.url} />
