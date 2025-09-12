import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  plugins: [solidPlugin(),
    copy({
      targets: [
        {src: 'src/icons/*', dest: './dist/assets/icons' },
        {src: 'src/CurrentApps/AppIcons/*', dest: './dist/assets/icons' },
        {src: 'src/scripts/*', dest: './dist/assets/scripts' },
        {src: 'src/fonts/*', dest: './dist/assets/fonts' }
      ],
      verbose: true,
      hook: 'writeBundle',
    })
  ],
  build: { 
    target: 'esnext',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0];
          
          if (!fileName) {
            return 'assets/[name]-[hash][extname]';
          }
          
          const info = fileName.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(fileName)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/.test(fileName)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  base: './',
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  }
});
