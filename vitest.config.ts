import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // 5 s por defecto se queda corto cuando el ordenador va cargado: el asistente
    // de bienvenida tarda más de 1 s solo en montarse y un test inestable bloquea
    // deploy-prod.sh (28 oct 2026).
    testTimeout: 20000,
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
