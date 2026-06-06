/**
 * Añade schema LocalBusiness/Service a todas las páginas de ciudad DJ
 * que no lo tengan ya. Ejecutar: node scripts/add-local-schema.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.join(__dirname, '../src/pages');

const files = fs.readdirSync(PAGES_DIR).filter(f => f.startsWith('BlogDJBoda') && f.endsWith('.tsx'));

let updated = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(PAGES_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Ya tiene schema de servicio local
  if (content.includes("'@type': 'Service'") || content.includes('"@type": "Service"')) {
    skipped++;
    continue;
  }

  // Extraer ciudad del archivo
  const ciudadMatch = content.match(/const ciudad = '([^']+)'/);
  const slugMatch = content.match(/const slug = '([^']+)'/);

  if (!ciudadMatch) {
    // Páginas más antiguas con nombre hardcodeado
    console.log(`⚠️  Sin variable ciudad: ${file} — saltando`);
    skipped++;
    continue;
  }

  const ciudad = ciudadMatch[1];
  const slug = slugMatch ? slugMatch[1] : '';

  const serviceSchema = `
const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: \`DJs para bodas en ${ciudad}\`, description: \`Encuentra y contrata DJs verificados para bodas y eventos en ${ciudad}. Presupuestos gratuitos, contratos digitales y 0% comisión.\`, serviceType: 'DJ para bodas y eventos', areaServed: { '@type': 'City', name: '${ciudad}' }, provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' }, url: \`https://xpeak.es/blog/${slug}\`, offers: { '@type': 'Offer', description: 'Presupuestos gratuitos de DJs verificados', price: '0', priceCurrency: 'EUR' } };`;

  // Insertar la variable justo antes del export default
  content = content.replace(
    /^(export default function )/m,
    serviceSchema + '\n$1'
  );

  // Añadir el script tag dentro del <Helmet>, después del último </script>
  content = content.replace(
    /<meta name="twitter:card" content="summary_large_image" \/><\/Helmet>/,
    `<meta name="twitter:card" content="summary_large_image" /><script type="application/ld+json">{JSON.stringify(serviceSchema)}</script></Helmet>`
  );

  // Alternativa para páginas con twitter:card en otra línea
  if (!content.includes('serviceSchema)}</script>')) {
    content = content.replace(
      /<meta name="twitter:card" content="summary_large_image" \/>\s*<\/Helmet>/,
      `<meta name="twitter:card" content="summary_large_image" />\n        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>\n      </Helmet>`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  updated++;
  console.log(`✓ ${file} → ${ciudad}`);
}

console.log(`\nDone: ${updated} actualizados, ${skipped} saltados`);
