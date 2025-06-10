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
          // Determine format, fallback to 'js' if not specified
          const format = chunkInfo.format || (chunkInfo.moduleIds?.some(id => id.endsWith('.cjs')) ? 'cjs' : 'esm');
          if (chunkInfo.isEntry && chunkInfo.name === 'index') {
            return format === 'cjs' ? 'cjs/index.cjs' : 'esm/index.js';
          }
          // Default fallback
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
