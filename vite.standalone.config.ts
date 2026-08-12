import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { frontendPolicyGuard } from './scripts/frontend-policy-guard';

const offlineRedirectPattern =
  /\s*<script id="offline-entry-redirect">[\s\S]*?<\/script>/;
const trimOfflineWhitespace: Plugin = {
  name: 'trim-offline-trailing-whitespace',
  enforce: 'post',
  generateBundle(_options, bundle) {
    Object.values(bundle).forEach((entry) => {
      if (
        entry.type === 'asset' &&
        entry.fileName === 'index.html' &&
        typeof entry.source === 'string'
      ) {
        entry.source = entry.source.replace(/[ \t]+$/gm, '');
      }
    });
  },
};

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [
    {
      name: 'remove-offline-entry-redirect',
      transformIndexHtml(html) {
        return html.replace(offlineRedirectPattern, '');
      },
    },
    react(),
    viteSingleFile({
      removeViteModuleLoader: true,
    }),
    trimOfflineWhitespace,
    frontendPolicyGuard(),
  ],
  build: {
    outDir: 'offline',
    emptyOutDir: true,
    target: 'es2020',
  },
});
