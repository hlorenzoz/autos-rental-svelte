<script lang="ts">
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';
  import WhatsAppWidget from '@/components/ui/WhatsAppWidget.svelte';
  import CookieBanner from '@/components/ui/CookieBanner.svelte';
  import PWAInstaller from '@/components/ui/PWAInstaller.svelte';
  import '../../app.css';

  interface Props {
    data: LayoutData;
    children: import('svelte').Snippet;
  }

  let { data, children }: Props = $props();

  $effect(() => {
    document.documentElement.lang = data.locale;
  });

  $effect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('SW registered', reg))
          .catch((err) => console.log('SW failed', err));
      });
    }
  });
</script>

<svelte:head>
  <meta name="description" content={data.t.site.description} />
  <link rel="apple-touch-icon" href="/icons/icon-180.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta name="theme-color" content="#0043c8" />
  <!-- Fonts are self-hosted and bundled via app.css (Fontsource + subset icons) -->
</svelte:head>

{@render children()}

<div id="below-the-fold-trigger" class="absolute top-[100vh] h-1 w-full pointer-events-none"></div>

<WhatsAppWidget locale={data.locale} />
<CookieBanner locale={data.locale} />
<PWAInstaller locale={data.locale} />
