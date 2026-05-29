import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({
      runtime: 'nodejs24.x'
    }),
    alias: {
      '@': 'src/lib',
    },
    // Inline render-critical CSS (Tailwind global + small component styles) into
    // the document head so it isn't a render-blocking network request on first
    // paint. Covers the ~11KB global bundle and tiny per-component CSS.
    inlineStyleThreshold: 12288,
    prerender: {
      handleHttpError: 'fail',
      origin: 'https://autos-rental.hlorenzoz.com'
    }
  },
};

export default config;
