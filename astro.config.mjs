// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ma-blog.pages.dev',
  integrations: [react(), mdx()],
  adapter: cloudflare(),
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'everforest-light',
      wrap: true,
    },
  },
});
