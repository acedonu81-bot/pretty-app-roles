#!/usr/bin/env node
// Sube el número de build de iOS (CURRENT_PROJECT_VERSION) al siguiente.
//
// Por qué existe (15 sep 2026): Info.plist resuelve CFBundleVersion desde
// $(CURRENT_PROJECT_VERSION), que vive en project.pbxproj — o sea, en git.
// El proyecto no usa VERSIONING_SYSTEM, así que Xcode NO lo incrementa al
// archivar: hay que subirlo a mano antes de cada build, y App Store Connect
// rechaza un build repetido con "The bundle version must be higher".
//
// Se olvidó al subir el build 2 y el repo quedó descuadrado respecto a Apple.
// Con esto el paso deja de depender de acordarse.
//
//   node scripts/ios-bump-build.mjs          → sube al siguiente
//   node scripts/ios-bump-build.mjs 7        → fija un número concreto
//   node scripts/ios-bump-build.mjs --check  → solo muestra el actual

import { readFileSync, writeFileSync } from 'node:fs';

const PBXPROJ = new URL('../ios/App/App.xcodeproj/project.pbxproj', import.meta.url);
const RE = /CURRENT_PROJECT_VERSION = (\d+);/g;

const src = readFileSync(PBXPROJ, 'utf8');
const found = [...src.matchAll(RE)].map(m => Number(m[1]));

if (found.length === 0) {
  console.error('✖ No se encontró CURRENT_PROJECT_VERSION en project.pbxproj');
  process.exit(1);
}

const actual = Math.max(...found);
const arg = process.argv[2];

if (arg === '--check') {
  console.log(`Build actual: ${actual}`);
  process.exit(0);
}

let siguiente;
if (arg) {
  siguiente = Number(arg);
  if (!Number.isInteger(siguiente) || siguiente < 1) {
    console.error(`✖ "${arg}" no es un número de build válido`);
    process.exit(1);
  }
  // Avisar, pero no bloquear: a veces hay que recolocar el número a mano
  // para cuadrar con lo que ya está subido en App Store Connect.
  if (siguiente <= actual) {
    console.warn(`⚠ ${siguiente} no es mayor que el actual (${actual}). Apple rechaza builds repetidos o menores.`);
  }
} else {
  siguiente = actual + 1;
}

// Se escriben TODAS las configuraciones (Debug y Release): si solo se cambia
// una, el archive de Release puede salir con un número distinto al esperado.
writeFileSync(PBXPROJ, src.replace(RE, `CURRENT_PROJECT_VERSION = ${siguiente};`));

console.log(`✅ Build ${actual} → ${siguiente} (${found.length} configuraciones)`);
console.log('   Recuerda commitear ios/App/App.xcodeproj/project.pbxproj');
