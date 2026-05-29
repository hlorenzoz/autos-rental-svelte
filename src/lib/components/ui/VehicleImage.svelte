<script lang="ts">
  import { getVehicleImage } from '@/lib/vehicleImages';

  interface Props {
    slug: string;
    alt: string;
    class?: string;
    sizes?: string;
    loading?: 'lazy' | 'eager';
    fetchpriority?: 'high' | 'low' | 'auto';
  }

  let {
    slug,
    alt,
    class: klass,
    sizes,
    loading = 'lazy',
    fetchpriority,
  }: Props = $props();

  const pic = $derived(getVehicleImage(slug));
</script>

{#if pic}
  <enhanced:img src={pic} {alt} class={klass} {sizes} {loading} {fetchpriority} />
{/if}
