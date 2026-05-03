<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    lightLabel: string;
    darkLabel: string;
  }

  let { lightLabel, darkLabel }: Props = $props();

  let isDark = $state(false);

  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      isDark = true;
    } else if (stored === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  function toggle() {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }
</script>

<button
  type="button"
  onclick={toggle}
  aria-label={isDark ? lightLabel : darkLabel}
  class="rounded-full w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors duration-300"
>
  {#if isDark}
    <span class="material-symbols-outlined filled">dark_mode</span>
  {:else}
    <span class="material-symbols-outlined filled">light_mode</span>
  {/if}
</button>
