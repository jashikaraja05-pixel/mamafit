import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      allowedHosts: true as const,
      // When running in a cloud container behind an SSL reverse proxy (e.g. Cloud Run),
      // clientPort must be 443 so the browser connects to wss://...:443 instead of defaulting to internal port 24678.
      hmr: {
        clientPort:
          process.env.APP_URL?.startsWith('https') ||
          process.env.PORT === '8080' ||
          process.env.NGINX_PORT === '8080' ||
          Boolean(process.env.K_SERVICE)
            ? 443
            : undefined,
      },
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
