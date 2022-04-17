// @ts-check

/** @type {import('astro')} */
import { defineConfig } from "astro/config";
import astroImagePlugin from "astro-imagetools/plugin";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },
  site: 'https://florian-geierstanger-org.vercel.app/',
  integrations: [sitemap(), svelte()],
  vite: {
    plugins: [astroImagePlugin]
  }
});