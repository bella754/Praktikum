// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin


// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [vue(),
            //vuetify({ autoImport: true }),
          ],
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
