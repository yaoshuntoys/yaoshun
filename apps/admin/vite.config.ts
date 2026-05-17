import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

function resolveManualChunk(id: string) {
  if (!id.includes('node_modules')) {
    return undefined;
  }

  if (id.includes('/react/') || id.includes('/react-dom/')) {
    return 'react-vendor';
  }

  if (id.includes('/react-router') || id.includes('/@remix-run/')) {
    return 'router-vendor';
  }

  if (id.includes('/antd/') || id.includes('/@ant-design/') || id.includes('/rc-')) {
    return 'antd-vendor';
  }

  if (id.includes('/axios/')) {
    return 'request-vendor';
  }

  if (id.includes('/zustand/') || id.includes('/dayjs/')) {
    return 'shared-vendor';
  }

  return 'vendor';
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT || 8030);
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8010';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port,
      strictPort: true,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'antd',
        '@ant-design/icons',
        'axios',
        'zustand',
      ],
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: resolveManualChunk,
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  };
});
