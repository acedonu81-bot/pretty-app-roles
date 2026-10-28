// Trinquete de tipos: el proyecto arrastra errores de TypeScript viejos y no
// se pueden arreglar de golpe sin tocar media app. En vez de ignorarlos, se
// guarda cuántos hay en scripts/tsc-baseline.json y esto falla si SUBEN.
// Así nada nuevo empeora, y cada vez que alguien arregla alguno se baja el
// listón con `node scripts/check-types.mjs --actualizar` (28 oct 2026).
//
// Uso: node scripts/check-types.mjs [--actualizar]
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = path.join(raiz, "scripts/tsc-baseline.json");

const r = spawnSync(
  path.join(raiz, "node_modules/.bin/tsc"),
  ["-p", "tsconfig.app.json", "--noEmit", "--pretty", "false"],
  { cwd: raiz, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);
if (r.error) {
  console.error("❌ No se pudo ejecutar tsc:", r.error.message);
  process.exit(2);
}

const lineas = (r.stdout + r.stderr).split("\n").filter((l) => / error TS\d+:/.test(l));
const actuales = lineas.length;

if (process.argv.includes("--actualizar")) {
  writeFileSync(baselinePath, JSON.stringify({ errores: actuales }, null, 2) + "\n");
  console.log(`✅ Listón de tipos guardado en ${actuales} errores`);
  process.exit(0);
}

const { errores: permitidos } = JSON.parse(readFileSync(baselinePath, "utf8"));

if (actuales > permitidos) {
  console.error(lineas.join("\n"));
  console.error(
    `\n❌ Errores de TypeScript: ${actuales} (el listón es ${permitidos}). ` +
      `Este cambio mete ${actuales - permitidos} nuevo(s); están arriba, mezclados con los viejos.`,
  );
  process.exit(1);
}

if (actuales < permitidos) {
  console.log(
    `✅ Tipos: ${actuales} errores, ${permitidos - actuales} menos que el listón (${permitidos}). ` +
      "Bájalo con: node scripts/check-types.mjs --actualizar",
  );
} else {
  console.log(`✅ Tipos: ${actuales} errores, igual que el listón`);
}
