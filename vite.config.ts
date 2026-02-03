
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // This allows process.env.API_KEY to work in the browser using the value from Vercel's environment variables
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    target: 'esnext'
  }
});
