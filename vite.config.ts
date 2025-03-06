
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    mode === 'development' &&
    componentTagger(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream'],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {},
    global: {},
  },
  optimizeDeps: {
    include: [
      '@dynamic-labs/sdk-react-core',
      '@dynamic-labs/ethereum',
      '@dynamic-labs/ethereum-aa',
      '@mailchain/sdk'
    ],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  }
}));
