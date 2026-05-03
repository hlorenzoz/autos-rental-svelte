<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    'aria-label'?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    variant = 'primary',
    href,
    type = 'button',
    class: className,
    'aria-label': ariaLabel,
    children,
    ...rest
  }: Props = $props();

  const variantClasses: Record<NonNullable<Props['variant']>, string> = {
    primary:
      'bg-primary text-on-primary rounded-xl px-md py-sm font-body text-label-caps uppercase tracking-[0.05em] font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 active:scale-95',
    secondary:
      'bg-transparent text-on-surface border border-outline rounded-xl px-md py-sm font-body text-label-caps uppercase tracking-[0.05em] font-semibold hover:bg-surface-container transition-all duration-300 active:scale-95',
    ghost:
      'bg-transparent text-primary font-body text-label-caps uppercase tracking-[0.05em] font-semibold hover:text-primary-container transition-colors duration-300',
  };

  const classes = $derived([variantClasses[variant!], className].filter(Boolean).join(' '));
</script>

{#if href}
  <a {href} class={classes} aria-label={ariaLabel} {...rest}>
    {@render children?.()}
  </a>
{:else}
  <button {type} class={classes} aria-label={ariaLabel} {...rest}>
    {@render children?.()}
  </button>
{/if}
