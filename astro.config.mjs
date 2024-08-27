import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: 'https://slumper.me',
  integrations: [solidJs()],
  output: "server",
  adapter: netlify()
});