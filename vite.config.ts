import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Expose process.env.API_KEY to the client for the GenAI SDK
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});