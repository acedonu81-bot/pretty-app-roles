/**
 * IndexNow — notifica a Bing (y otros motores que lo soportan: Yandex, Seznam)
 * que el contenido del sitio cambió, en vez de esperar a que lo rastreen por
 * su cuenta. Gratis, sin cuenta ni API key de pago — solo requiere el archivo
 * de verificación público/{key}.txt (ya en public/) y esta llamada HTTP.
 *
 * Envía todas las URLs del sitemap recién generado. Bing procesa el lote
 * igual esté la URL nueva o sin cambios — es barato y no penaliza reenviar
 * URLs que ya conocía.
 *
 * Ejecutar después de update-sitemap.mjs (necesita public/sitemap.xml final).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
// Key generada por Bing Webmaster Tools al importar el sitio desde Search
// Console — usar esta (no una key propia distinta) para que el panel de
// Bing reconozca las notificaciones como del mismo sitio verificado.
const KEY = '640b0fb68fcd4d7bbded0fc86210684d';
const HOST = 'xpeak.es';

function extractUrls(sitemapXml) {
  const matches = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map(m => m[1]);
}

async function main() {
  if (!fs.existsSync(SITEMAP)) {
    console.warn('  ⚠ sitemap.xml no encontrado — se omite el ping a IndexNow');
    return;
  }
  const urls = extractUrls(fs.readFileSync(SITEMAP, 'utf-8'));
  if (!urls.length) {
    console.warn('  ⚠ sitemap.xml sin URLs — se omite el ping a IndexNow');
    return;
  }

  // IndexNow admite hasta 10.000 URLs por lote.
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  if (res.ok || res.status === 202) {
    console.log(`✅ IndexNow: ${urls.length} URLs notificadas a Bing (status ${res.status})`);
  } else {
    console.warn(`  ⚠ IndexNow respondió ${res.status} — no bloquea el build`);
  }
}

main().catch(e => console.warn('  ⚠ IndexNow ping falló (no bloquea el build):', e.message));
