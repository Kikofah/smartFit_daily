import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// react-native-web lets client/src reuse the same View/Text/Pressable/StyleSheet
// components originally written for the Expo mobile app (see
// docs/05-log/ for the 2026-08-29 architecture change from React Native to
// a web-first Express + Vite app).
export default defineConfig({
  root: 'client',
  publicDir: '../public',
  plugins: [react()],
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native': 'react-native-web',
    },
  },
  build: {
    outDir: '../dist-client',
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
