/** @type {import('astro')} */
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },
  site: "https://florian.geierstanger.org",
  integrations: [mdx()],
  build: {
    inlineStylesheets: "never",
  },
});
