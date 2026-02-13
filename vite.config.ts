import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development"].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge'],
          'vendor-query': ['@tanstack/react-query'],
          'tools-group-security': [
            './src/components/tools/WebsiteScanner.tsx',
            './src/components/tools/XSSDetector.tsx',
            './src/components/tools/SSLChecker.tsx'
          ],
          'tools-group-network': [
            './src/components/tools/Ping.tsx',
            './src/components/tools/Traceroute.tsx',
            './src/components/tools/Whois.tsx',
            './src/components/tools/DNSRecon.tsx',
            './src/components/tools/SubdomainFinder.tsx'
          ],
          'tools-group-utils': [
            './src/components/tools/PasswordGenerator.tsx',
            './src/components/tools/HashGenerator.tsx',
            './src/components/tools/EncoderDecoder.tsx',
            './src/components/tools/UrlParser.tsx'
          ]
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }
}));
