import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.slumper.me',
  integrations: [solidJs(), sitemap()]
});