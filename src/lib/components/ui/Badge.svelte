<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'success';
    class?: string;
    children?: Snippet;
  }

  let { variant = 'primary', class: className, children }: Props = $props();

  const variantClasses: Record<NonNullable<Props['variant']>, string> = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary/10 text-tertiary',
    outline: 'bg-transparent text-on-surface-variant border border-outline-variant',
    success: 'bg-secondary-fixed text-on-secondary-fixed font-black',
  };

  const classes = $derived([
    'px-sm py-xs rounded-full text-[10px] uppercase tracking-[0.05em] font-bold font-body inline-flex items-center',
    variantClasses[variant!],
    className,
  ]
    .filter(Boolean)
    .join(' '));
</script>

<span class={classes}>
  {@render children?.()}
</span>
