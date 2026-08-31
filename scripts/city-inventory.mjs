/**
 * Inventario de ciudades — fuente única para decidir qué páginas
 * ciudad×categoría son indexables.
 *
 * Una página /contratar-<cat>/<ciudad> solo entra en el sitemap si existe al
 * menos un profesional cuyo `zone` case con esa ciudad. El resto sigue siendo
 * accesible (no se rompe ningún enlace) pero sale del sitemap y se marca
 * noindex desde CityLanding.tsx, porque una página que dice "Aún no hay"
 * enseña a Google que el dominio publica páginas vacías.
 *
 * `zone` es texto libre introducido por el usuario ("madrid", "Madrid, España",
 * "A Coruña", "españa"), así que hay que normalizar antes de comparar.
 *
 * IMPORTANTE: matchesCity() replica la semántica de la consulta que hace
 * useCityProfessionals() en CityLanding.tsx:
 *   .ilike('zone', `%${cityData.ciudad}%`)
 * es decir, substring case-insensitive contra el NOMBRE de la ciudad (con
 * acentos), no contra el slug. Si esto se desincroniza, el sitemap y la página
 * discrepan: prometeríamos ciudades vacías o esconderíamos ciudades con gente.
 */

import fs from 'node:fs';

/**
 * Lee un objeto literal exportado desde un .tsx sin compilarlo.
 * (misma implementación que usaba prerender-content.mjs, movida aquí para que
 * sitemap y prerender compartan una sola definición de CITIES)
 */
export function extractObjectLiteral(filePath, exportName) {
  const src = fs.readFileSync(filePath, 'utf8');
  const marker = `export const ${exportName}`;
  const markerIdx = src.indexOf(marker);
  if (markerIdx === -1) throw new Error(`${marker} not found in ${filePath}`);
  const braceStart = src.indexOf('{', src.indexOf('=', markerIdx));
  let depth = 0, end = -1;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error(`Unbalanced braces reading ${exportName}`);
  // eslint-disable-next-line no-eval
  const obj = eval(`(${src.slice(braceStart, end + 1)})`);
  const aliasRe = new RegExp(`${exportName}\\.(\\w+)\\s*=\\s*${exportName}\\.(\\w+);`, 'g');
  for (const m of src.slice(end + 1).matchAll(aliasRe)) {
    obj[m[1]] = obj[m[2]];
  }
  return obj;
}

/** Quita acentos y pasa a minúsculas para comparar sin depender de tildes. */
function fold(s) {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

/**
 * Zonas que no son una ciudad concreta y por tanto no acreditan inventario
 * en ninguna: un profesional con zone "España" no hace indexable a Soria.
 */
const NON_CITY_ZONES = new Set(['espana', 'spain', 'nacional', 'toda espana', 'remoto', 'online', '']);

export function isNonCityZone(zone) {
  return NON_CITY_ZONES.has(fold(zone));
}

/**
 * ¿El `zone` de un perfil corresponde a esta ciudad?
 * Mismo criterio que el .ilike('%ciudad%') de CityLanding.tsx.
 */
export function matchesCity(zone, cityName) {
  if (isNonCityZone(zone)) return false;
  const z = fold(zone);
  const c = fold(cityName);
  if (!z || !c) return false;
  return z.includes(c);
}

/**
 * Categorías → roles de `profiles`. Debe permanecer sincronizado con
 * ROLE_MAP de src/pages/CityLanding.tsx.
 */
export const ROLE_MAP = {
  dj: ['dj'], camareros: ['camarero', 'staff'], fotografo: ['media'], staff: ['staff', 'promotor'],
  catering: ['empresario'], maquillaje: ['makeup'], peluqueria: ['peluqueria'], promotores: ['promotor'],
  'disco-movil': ['dj'], vestuario: ['vestuario', 'staff'], azafata: ['azafata'],
  bailarin: ['bailarin'], 'grupo-musical': ['grupo-musical'],
  humorista: ['humorista'], monologo: ['humorista'], monologos: ['humorista'],
  mago: ['mago'], animador: ['animador'], animadores: ['animador'],
  payaso: ['payaso'], payasos: ['payaso'], speaker: ['speaker'],
  'photo-booth': ['photo-booth'],
};

/**
 * Conjunto de slugs de ciudad con al menos un profesional real.
 *
 * @param profiles  filas de `profiles` (necesitan `zone`)
 * @param cities    { slug: { ciudad } } — el CITIES de CityLanding.tsx
 * @returns Set<string> de slugs indexables
 */
/**
 * ¿Hay inventario para esta combinación ciudad×categoría?
 * La página /contratar-<cat>/<ciudad> filtra por ciudad Y por los roles de la
 * categoría, así que una ciudad con un bailarín no hace indexable su página de
 * DJs. Decidir solo por ciudad dejaría URLs en el sitemap que renderizan
 * "Aún no hay" — justo el thin content que queremos evitar.
 */
export function hasInventory(profiles, cityName, categorySlug) {
  // Mismo fallback que CityLanding.tsx: `ROLE_MAP[categorySlug] ?? ['dj']`.
  // Las categorías sin mapeo (mago, bailarin, grupo-musical…) consultan el rol
  // 'dj', así que su página solo tiene contenido si hay un DJ en la ciudad.
  const roles = ROLE_MAP[categorySlug] ?? ['dj'];
  return profiles.some(p => matchesCity(p.zone, cityName) && roles.includes(p.role));
}

export function citiesWithInventory(profiles, cities) {
  const withInventory = new Set();
  for (const [slug, info] of Object.entries(cities)) {
    const cityName = info?.ciudad;
    if (!cityName) continue;
    if (profiles.some(p => matchesCity(p.zone, cityName))) withInventory.add(slug);
  }
  return withInventory;
}

/**
 * Fecha del contenido real de una página ciudad×categoría: el `updated_at` más
 * reciente de los profesionales que muestra. El lastmod de la plantilla hace
 * que las miles de páginas compartan fecha cada vez que se toca el componente,
 * y Google acaba ignorando la señal. Devuelve null si no hay inventario.
 */
export function contentDate(profiles, cityName, categorySlug) {
  const roles = ROLE_MAP[categorySlug] ?? ['dj'];
  let latest = null;
  for (const p of profiles) {
    if (!matchesCity(p.zone, cityName) || !roles.includes(p.role)) continue;
    const d = p.updated_at ? String(p.updated_at).slice(0, 10) : null;
    if (d && (!latest || d > latest)) latest = d;
  }
  return latest;
}
