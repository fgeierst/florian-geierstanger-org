/** @type {import('astro')} */
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import path from "node:path";

export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
    remarkPlugins: [remarkDefaultLayout],
  },
  site: "https://florian.geierstanger.org",
  integrations: [
    mdx({
      extendMarkdownConfig: true,
    }),
  ],
  build: {
    inlineStylesheets: "never",
  },
});

/**
 * Default blog layout
 */
function remarkDefaultLayout() {
  return function (_, file) {
    const filename = path.basename(file.history[0]);

    if (file.history[0].includes("/pages/blog/") && !filename.startsWith("_")) {
      if (!file.data.astro?.frontmatter?.layout) {
        file.data.astro ??= {};
        file.data.astro.frontmatter ??= {};
        file.data.astro.frontmatter.layout = "../../layouts/Blog.astro";
      }
    }
  };
}
