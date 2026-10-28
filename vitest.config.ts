import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Valores falsos a propósito: hay páginas que crean el cliente de Supabase
    // al importarse y sin URL revientan. En CI no hay .env, y en local así los
    // tests nunca pueden tocar la base de producción.
    env: {
      VITE_SUPABASE_URL: "http://localhost:54321",
      VITE_SUPABASE_PUBLISHABLE_KEY: "clave-falsa-de-test",
    },
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "supabase/**/*.{test,spec}.{ts,tsx}",
    ],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
