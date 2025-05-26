import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react
    ({
    fastRefresh: false // Try disabling if issues persist
  })
  ],
  server: {
    host: true, // Listen on all network interfaces
    port: 3000,
    strictPort: true, // Don't try fallback ports
    hmr: {
      clientPort: 3000, // Must match your dev server port
      protocol: 'ws',
      timeout: 5000,
      overlay: false // Disable error overlay if it causes issues
    },
    watch: {
      usePolling: true, // Essential for Docker/WSL
      interval: 1000    // Polling interval in ms
    },
    cors: true, // Enable CORS for all origins
    open: false // Disable automatic browser opening
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [ // Add any other dependencies that need optimization
      'react',
      'react-dom'
    ]
  },
  build: {
    chunkSizeWarningLimit: 1500, // Increase chunk size warning limit
    sourcemap: true // Helpful for debugging
  },
  clearScreen: false // Keep previous console output visible
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
