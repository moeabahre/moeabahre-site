import { defineConfig } from 'astro/config';

// Two locales live under /en/ and /ar/. The root page picks one from the browser language.
export default defineConfig({
  site: 'https://moeabahre.com',
  trailingSlash: 'ignore',
});
