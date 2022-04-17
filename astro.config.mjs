// @ts-check

/** @type {import('astro')} */
import astroImagePlugin from "astro-imagetools/plugin";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },
  site: 'https://florian-geierstanger-org.vercel.app/',
  integrations: [sitemap()],
  vite: {
    plugins: [astroImagePlugin]
  }
});