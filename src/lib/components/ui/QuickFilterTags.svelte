<script lang="ts">
  export interface FilterTag {
    label: string;
    value: string;
  }

  interface Props {
    filters: FilterTag[];
    onFilterChange?: (active: string[]) => void;
  }

  let { filters, onFilterChange }: Props = $props();

  let active = $state<string[]>([]);

  function toggle(value: string) {
    const next = active.includes(value)
      ? active.filter((v) => v !== value)
      : [...active, value];
    active = next;
    onFilterChange?.(next);
  }
</script>

<div class="flex flex-wrap gap-3 mt-8" role="group" aria-label="Quick filters">
  {#each filters as { label, value } (value)}
    {@const isActive = active.includes(value)}
    <button
      type="button"
      aria-pressed={isActive}
      onclick={() => toggle(value)}
      class="px-4 py-1.5 rounded-full text-label-caps uppercase tracking-[0.05em] font-bold font-body transition-all duration-200 {isActive
        ? 'bg-primary text-on-primary shadow-sm'
        : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}"
    >
      {label}
    </button>
  {/each}
</div>
