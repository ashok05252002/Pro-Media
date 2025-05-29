import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Deploying to https://ashok05252002.github.io/Pro-Media/
  // base: '/Pro-Media/',

  plugins: [
    react({
      fastRefresh: false
    })
  ],
  
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 3000,
      protocol: 'ws',
      timeout: 5000,
      overlay: false
    },
    watch: {
      usePolling: true,
      interval: 1000
    },
    cors: true,
    open: false
  },
  
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom']
  },
  
  build: {
    chunkSizeWarningLimit: 1500,
    sourcemap: true
  },
  
  clearScreen: false
});
