// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://unimatches.netlify.app', // Tu URL de Netlify aquí
  integrations: [tailwind(), sitemap()],
});