/**
 * Añade serviceSchema a páginas de ciudad con formato antiguo (sin variable ciudad)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.join(__dirname, '../src/pages');

// Mapa manual ciudad → slug para páginas antiguas
const CIUDAD_MAP = {
  'BlogDJBodaMadrid.tsx': { ciudad: 'Madrid', slug: 'dj-bodas-madrid' },
  'BlogDJBodaBarcelona.tsx': { ciudad: 'Barcelona', slug: 'dj-bodas-barcelona' },
  'BlogDJBodaValencia.tsx': { ciudad: 'Valencia', slug: 'dj-bodas-valencia' },
  'BlogDJBodaSevilla.tsx': { ciudad: 'Sevilla', slug: 'dj-bodas-sevilla' },
  'BlogDJBodaBilbao.tsx': { ciudad: 'Bilbao', slug: 'dj-bodas-bilbao' },
  'BlogDJBodaMalaga.tsx': { ciudad: 'Málaga', slug: 'dj-bodas-malaga' },
  'BlogDJBodaMallorca.tsx': { ciudad: 'Mallorca', slug: 'dj-bodas-mallorca' },
  'BlogDJBodaGranada.tsx': { ciudad: 'Granada', slug: 'dj-bodas-granada' },
  'BlogDJBodaIbiza.tsx': { ciudad: 'Ibiza', slug: 'dj-bodas-ibiza' },
  'BlogDJBodaZaragoza.tsx': { ciudad: 'Zaragoza', slug: 'dj-bodas-zaragoza' },
  'BlogDJBodaMurcia.tsx': { ciudad: 'Murcia', slug: 'dj-bodas-murcia' },
  'BlogDJBodaAlicante.tsx': { ciudad: 'Alicante', slug: 'dj-bodas-alicante' },
  'BlogDJBodaCordoba.tsx': { ciudad: 'Córdoba', slug: 'dj-bodas-cordoba' },
  'BlogDJBodaValladolid.tsx': { ciudad: 'Valladolid', slug: 'dj-bodas-valladolid' },
  'BlogDJBodaACoruna.tsx': { ciudad: 'A Coruña', slug: 'dj-bodas-a-coruna' },
  'BlogDJBodaTenerife.tsx': { ciudad: 'Tenerife', slug: 'dj-bodas-tenerife' },
};

let updated = 0;

for (const [file, { ciudad, slug }] of Object.entries(CIUDAD_MAP)) {
  const filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) { console.log(`⚠️  No encontrado: ${file}`); continue; }

  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes("'@type': 'Service'") || content.includes('"@type": "Service"') || content.includes('serviceSchema')) {
    console.log(`✓ Ya tiene schema: ${file}`);
    continue;
  }

  const schemaConst = `\nconst serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'DJs para bodas en ${ciudad}', description: 'Encuentra y contrata DJs verificados para bodas y eventos en ${ciudad}. Presupuestos gratuitos, contratos digitales y 0% comisión.', serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: '${ciudad}' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: 'https://xpeak.es/blog/${slug}', offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };\n`;

  // Insertar constante antes del export default
  content = content.replace(/\nexport default function/, schemaConst + '\nexport default function');

  // Añadir el script tag al Helmet — buscar el último </script> dentro del Helmet y añadir después
  // O añadir antes del </Helmet>
  content = content.replace(
    /(\s*<\/Helmet>)/,
    `\n        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>$1`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  updated++;
  console.log(`✓ ${file} → ${ciudad}`);
}

console.log(`\nDone: ${updated} actualizados`);
