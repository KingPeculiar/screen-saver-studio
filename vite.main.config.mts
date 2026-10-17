import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            external: ['electron', /^node:/],
        },
    },
    resolve: {
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});
