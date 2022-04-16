// @ts-check
/** @type {import('astro')} */

import astroImagePlugin from "astro-imagetools/plugin";

export default {
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
  integrations: [
    
  ],
  vite: {
    plugins: [astroImagePlugin],
  },
};