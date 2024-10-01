import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";

import legacy from '@vitejs/plugin-legacy';
import topLevelAwait from "vite-plugin-top-level-await";

// https://astro.build/config
export default defineConfig({
  site: 'https://slumper.me',
  integrations: [solidJs()],
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11', 'iOS >= 10', 'Safari >= 10'],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/modules/es.promise', 
        'core-js/modules/es.array.iterator', 
        'whatwg-fetch', 
      ]
    },
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: i => `__tla_${i}`
    })),
  ],
  vite: {
    build: {
      target: ['es2015'], 
      polyfillDynamicImport: true, 
      minify: 'terser', 
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2015', 
      }
    }
  }
});