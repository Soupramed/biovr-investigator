import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        explore: resolve(__dirname, 'explore.html'),
        quiz: resolve(__dirname, 'quiz.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
