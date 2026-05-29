import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // enhancedImages() must be listed before sveltekit()
  plugins: [enhancedImages(), tailwindcss(), sveltekit()],
  ssr: {
    noExternal: ['super-sitemap'],
  },
});
