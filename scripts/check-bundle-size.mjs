#!/usr/bin/env node
// Falla el build si algún chunk JS individual supera el límite — el caso
// real que motivó esto: ExcelJS (938 KB) se coló como import estático en
// EmpresarioView/ContractView y se descargaba en cada visita al panel,
// aunque nadie exportara nada (11 sep 2026). Un chunk grande no es
// necesariamente un error (html2pdf/exceljs son legítimos si van lazy),
// así que solo se permite una lista corta de nombres conocidos y ya
// verificados como lazy — cualquier chunk nuevo por encima del límite
// para el build, y hay que revisar si de verdad hace falta cargarlo así.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist', 'assets');
const LIMIT_KB = 300;

// Chunks ya auditados: son pesados porque la librería lo es, pero se cargan
// vía import() dinámico (verificado con grep antes de añadirlos aquí), así
// que su peso nunca entra en la carga inicial de ninguna vista.
const ALLOWLIST_PREFIXES = ['html2pdf-', 'exceljs.min-', 'BarChart-'];

let files;
try {
  files = readdirSync(DIST).filter(f => f.endsWith('.js'));
} catch {
  console.log('check-bundle-size: no se encontró dist/assets, se omite (¿build sin ejecutar?)');
  process.exit(0);
}

const offenders = [];
for (const file of files) {
  const sizeKb = statSync(join(DIST, file)).size / 1024;
  if (sizeKb <= LIMIT_KB) continue;
  if (ALLOWLIST_PREFIXES.some(p => file.startsWith(p))) continue;
  offenders.push({ file, sizeKb: Math.round(sizeKb) });
}

if (offenders.length === 0) {
  console.log(`check-bundle-size: OK — ningún chunk nuevo supera ${LIMIT_KB} KB`);
  process.exit(0);
}

console.error(`\n❌ check-bundle-size: ${offenders.length} chunk(s) superan ${LIMIT_KB} KB y no están en la allowlist:\n`);
for (const o of offenders) console.error(`   ${o.file} — ${o.sizeKb} KB`);
console.error(`
Esto probablemente significa que una librería pesada se está importando de
forma ESTÁTICA en un componente que carga siempre (o casi siempre), en vez
de con import() dinámico dentro de la función que la usa de verdad.

Revisa con: grep -rn "^import .* from '<paquete>'" src/
Si el import ya es dinámico y el peso es legítimo, añade el prefijo del
nombre de archivo a ALLOWLIST_PREFIXES en scripts/check-bundle-size.mjs.
`);
process.exit(1);
