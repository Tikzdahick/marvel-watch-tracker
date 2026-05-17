import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Injected at build time so every deploy gets a unique SW registration URL
    __BUILD_TIME__: JSON.stringify(Date.now().toString()),
  },
  build: {
    rollupOptions: {
      output: {
        // Force everything into one bundle — prevents the TDZ "cannot access
        // before initialization" error caused by Rollup's chunk-splitting
        // reordering module initializers when circular refs are present.
        manualChunks: () => 'index',
      },
    },
  },
})
