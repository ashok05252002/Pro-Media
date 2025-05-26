import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Pro-Media/', // ✅ Important for GitHub Pages if using username.github.io

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


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // Explicitly set host
//     port: 3000,       // Ensure this matches your dev server port
//     strictPort: true, // Prevents automatic port fallback
//     hmr: {
//       clientPort: 3000, // Match your dev server port
//       protocol: 'ws',
//       timeout: 5000
//     },
//     watch: {
//       usePolling: true // Helpful for some Docker/WSL setups
//     }
//   },
  
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });
