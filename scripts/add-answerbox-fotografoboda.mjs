/**
 * Añade BlogAnswerBox (respuesta extraíble GEO/AEO) a las páginas
 * BlogFotografoBoda* que no lo tienen. Extrae el rango de precio real del
 * "Reportaje completo" en el array PRECIOS y la ciudad del título.
 */
import fs from 'node:fs';
import path from 'node:path';

const PAGES = '/Users/danielacedonunez/pretty-app-roles/src/pages';

const files = fs.readdirSync(PAGES).filter(f => f.startsWith('BlogFotografoBoda') && f.endsWith('.tsx'));

let modified = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(PAGES, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('BlogAnswerBox')) { skipped++; continue; }

  const cityMatch = content.match(/Fotógrafo para bodas en ([^:]+):/);
  const city = cityMatch ? cityMatch[1].trim() : null;

  const priceMatch = content.match(/servicio:\s*'Reportaje completo[^']*',\s*precio:\s*'([^']+)'/);
  const price = priceMatch ? priceMatch[1] : null;

  if (!city || !price) {
    console.log(`⚠️  Sin ciudad o precio en ${file}, skipping`);
    skipped++;
    continue;
  }

  const question = `¿Cuánto cuesta un fotógrafo para una boda en ${city}?`;
  const answer = `Un fotógrafo para el reportaje completo de una boda en ${city} (sin álbum impreso) cuesta entre ${price.replace('–', ' y ')} en 2026. El precio final depende de las horas de cobertura, si incluye álbum físico y si se contrata también videógrafo.`;

  const answerBoxJsx = `          <BlogAnswerBox
            question=${JSON.stringify(question)}
            answer=${JSON.stringify(answer)}
          />
`;

  const timeRegex = /(<time className="text-xs mt-3 block"[^>]*>[^<]*<\/time>)/;
  if (!timeRegex.test(content)) {
    console.log(`⚠️  No <time> anchor en ${file}, skipping`);
    skipped++;
    continue;
  }
  content = content.replace(timeRegex, `$1\n${answerBoxJsx}`);

  if (!content.includes("import BlogAnswerBox")) {
    if (content.includes("import BlogAuthor from '@/components/BlogAuthor';")) {
      content = content.replace(
        /(import BlogAuthor from '@\/components\/BlogAuthor';\n)/,
        `$1import BlogAnswerBox from '@/components/BlogAnswerBox';\n`
      );
    } else {
      console.log(`⚠️  Sin import anchor en ${file}, insertando tras react-helmet-async`);
      content = content.replace(
        /(import \{ Helmet \} from 'react-helmet-async';\n)/,
        `$1import BlogAnswerBox from '@/components/BlogAnswerBox';\n`
      );
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file} → ${city} / ${price}`);
  modified++;
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped`);
