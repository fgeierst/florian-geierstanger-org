/** @type {import('astro')} */
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  },
  site: 'https://florian.geierstanger.org',
  integrations: [sitemap(), svelte(), image()]
});