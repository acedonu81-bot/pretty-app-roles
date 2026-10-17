import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    assetsDir: "assets",
    // Vite's default modulePreload injects <link rel="modulepreload"> for every
    // manualChunks vendor bundle into every page's HTML, regardless of which
    // route actually needs it. Disabling it lets each lazy route pull in only
    // the chunks it imports.
    modulePreload: false,
    rollupOptions: {
      output: {
        // Sufijo de versión en TODOS los nombres (17 oct 2026): durante un
        // deploy, navegadores que pidieron los /assets nuevos antes de que
        // estuvieran servidos recibieron 404 con caché de un año (immutable) y
        // se quedaron con la web sin estilos ni JS. Cambiar el patrón da URLs
        // nuevas a todo y deja atrás esos 404 guardados. Si vuelve a pasar,
        // subir el sufijo (r3, r4...).
        entryFileNames: 'assets/[name]-[hash]-r2.js',
        chunkFileNames: 'assets/[name]-[hash]-r2.js',
        assetFileNames: 'assets/[name]-[hash]-r2[extname]',
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;
          // pdf-vendor (html2pdf/jspdf/html2canvas) and motion-vendor
          // (framer-motion) are deliberately NOT split into shared vendor
          // chunks here. Grouping them as "vendor" made Rollup treat them as
          // common dependencies that every lazy route's dynamic import
          // resolves together — so /auth was pulling in the contracts PDF
          // generator (only used by the dashboard's ContractView) before its
          // own content could paint. Leaving them unbundled lets each one
          // fall into the chunk of whichever page actually imports it
          // (ContractView already lazy-loads html2pdf.js itself).
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/') || id.includes('react-router')) {
            return 'react-vendor';
          }
          if (id.includes('@radix-ui')) {
            return 'radix-vendor';
          }
          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "sonner": path.resolve(__dirname, "./src/lib/sonner-shim.ts"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
