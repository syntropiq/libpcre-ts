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
        entryFileNames: (chunkInfo) => {
          // Vite passes a string for format, but fallback to .js if not cjs
          // See https://rollupjs.org/configuration-options/#output-entryfilenames
          // chunkInfo is not guaranteed to have format, so use build.lib.formats
          if (chunkInfo.name === 'index' && chunkInfo.facadeModuleId && chunkInfo.facadeModuleId.endsWith('.ts')) {
            // Main entry
            if (chunkInfo.isEntry && chunkInfo.name === 'index') {
              if (chunkInfo.moduleIds && chunkInfo.moduleIds.some(id => id.endsWith('.cjs'))) {
                return 'cjs/index.cjs';
              }
              // fallback: use .cjs for cjs format
              return 'cjs/index.cjs';
            }
          }
          // fallback for ESM
          if (chunkInfo.isEntry && chunkInfo.name === 'index') {
            return 'esm/index.js';
          }
          // fallback
          return '[name].js';
        },
        chunkFileNames: (chunkInfo) => {
          // Use .cjs for CJS chunks, .js for ESM
          if (chunkInfo.name && chunkInfo.name.endsWith('.cjs')) {
            return 'cjs/[name].cjs';
          }
          if (chunkInfo.name && chunkInfo.name.endsWith('.js')) {
            return 'esm/[name].js';
          }
          return '[name].js';
        },
        assetFileNames: '[name][extname]',
      },
    },
    emptyOutDir: false,
    minify: true,
  },
});
