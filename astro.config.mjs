import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: 'https://slumper.me',
  integrations: [solidJs(), sitemap()],
  output: "server",
  adapter: netlify()
});