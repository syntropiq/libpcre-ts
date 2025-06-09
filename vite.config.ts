import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'libpcreTs',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    outDir: 'dist',
    rollupOptions: {
      external: [], // Add external dependencies here if needed
      output: {
        dir: 'dist',
        entryFileNames: ({ format }) => {
          if (format === 'es') return 'esm/index.js';
          if (format === 'cjs') return 'cjs/index.js';
          return 'index.js';
        },
        chunkFileNames: ({ format }) => {
          if (format === 'es') return 'esm/[name].js';
          if (format === 'cjs') return 'cjs/[name].js';
          return '[name].js';
        },
        assetFileNames: ({ format }) => {
          if (format === 'es') return 'esm/[name][extname]';
          if (format === 'cjs') return 'cjs/[name][extname]';
          return '[name][extname]';
        },
      },
    },
    emptyOutDir: false,
    minify: true,
  },
});
