import { defineConfig } from 'vite';
import sass from 'vite-plugin-sass';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  return {
    base: mode === 'production' ? '/static/dist/' : '/', // Use correct base URLs
    // base: '/static/dist', // Replace 'my-vite-app' with your repository name
    publicDir: 'src/assets',
    build: {
      outDir: 'static/dist',
      emptyOutDir: true, //clears the dist folder before building
      rollupOptions: {
        input: {
          main: './src/main.js',
        },
        output: {
          entryFileNames: 'js/compiledJS.js',
          assetFileNames: ({ name, type }) => {
            if (type === 'asset' && name) {
              // Image assets folder
              if (/.(jpg|jpeg|png|gif|svg|webp)$/i.test(name)) {
                return 'images/[name]-[hash][extname]';
              }
              if (name.endsWith('.css')) {
                return 'compiledCSS.[ext]';
              }
            }
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': 'http://localhost:5080', //fetching data from server
      },
    },
  };
});
