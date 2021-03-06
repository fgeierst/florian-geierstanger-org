/** @type {import('astro')} */
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { astroImageTools } from "astro-imagetools";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },
  site: 'https://florian.geierstanger.org',
  integrations: [
    astroImageTools,
    sitemap(),
    svelte(),
  ],
});