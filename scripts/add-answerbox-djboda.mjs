/**
 * Añade BlogAnswerBox (respuesta extraíble GEO/AEO) a las páginas
 * BlogDJBoda* que no lo tienen. Extrae el rango de precio real del
 * "Servicio completo" en el array PRECIOS de cada página y la ciudad
 * del <h1>, para generar una respuesta con datos verdaderos, no genérica.
 */
import fs from 'node:fs';
import path from 'node:path';

const PAGES = '/Users/danielacedonunez/pretty-app-roles/src/pages';

const files = fs.readdirSync(PAGES).filter(f => f.startsWith('BlogDJBoda') && f.endsWith('.tsx'));

let modified = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(PAGES, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('BlogAnswerBox')) { skipped++; continue; }

  // Patrón A ("A Coruña" style): ciudad literal en el <h1>.
  // Patrón B ("Albacete" style): const ciudad = 'X'; usado como variable {ciudad}.
  const cityLiteralMatch = content.match(/DJ para bodas en ([^:]+):/);
  const cityVarMatch = content.match(/const ciudad = '([^']+)'/);
  const city = cityLiteralMatch ? cityLiteralMatch[1].trim() : (cityVarMatch ? cityVarMatch[1].trim() : null);
  const cityRef = cityVarMatch ? '${ciudad}' : city; // usar variable si el archivo la define, si no literal

  const priceMatch = content.match(/servicio:\s*'Servicio completo[^']*',\s*precio:\s*'([^']+)'/);
  const price = priceMatch ? priceMatch[1] : null;

  if (!city || !price) {
    console.log(`⚠️  Sin ciudad o precio en ${file}, skipping`);
    skipped++;
    continue;
  }

  const isTemplateLiteral = !!cityVarMatch;
  const question = isTemplateLiteral
    ? `\`¿Cuánto cuesta un DJ para una boda en ${cityRef}?\``
    : JSON.stringify(`¿Cuánto cuesta un DJ para una boda en ${city}?`);
  const answerText = (cityPlaceholder) =>
    `Un DJ para el servicio completo de una boda en ${cityPlaceholder} (ceremonia, cóctel, cena y pista de baile) cuesta entre ${price.replace('–', ' y ')} en 2026. El precio varía según la duración del evento, el equipo técnico incluido y la experiencia del DJ.`;
  const answer = isTemplateLiteral
    ? `\`${answerText(cityRef)}\``
    : JSON.stringify(answerText(city));

  const answerBoxJsx = isTemplateLiteral
    ? `<BlogAnswerBox question={${question}} answer={${answer}} />`
    : `            <BlogAnswerBox
              question=${question}
              answer=${answer}
            />
`;

  // Insert right after the <time>...</time> tag inside the intro block
  // (algunas páginas la tienen en su propia línea, otras comprimida en una sola línea de JSX)
  const timeRegex = /(<time className="text-xs mt-3 block"[^>]*>[^<]*<\/time>)/;
  if (!timeRegex.test(content)) {
    console.log(`⚠️  No <time> anchor en ${file}, skipping`);
    skipped++;
    continue;
  }
  content = content.replace(timeRegex, isTemplateLiteral ? `$1${answerBoxJsx}` : `$1\n${answerBoxJsx}`);

  // Add import: después del último import de componente existente (BlogAuthor o DJResourcesAffiliate)
  if (!content.includes("import BlogAnswerBox")) {
    if (content.includes("import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';")) {
      content = content.replace(
        /(import DJResourcesAffiliate from '@\/components\/DJResourcesAffiliate';\n)/,
        `$1import BlogAnswerBox from '@/components/BlogAnswerBox';\n`
      );
    } else {
      content = content.replace(
        /(import BlogAuthor from '@\/components\/BlogAuthor';\n)/,
        `$1import BlogAnswerBox from '@/components/BlogAnswerBox';\n`
      );
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file} → ${city} / ${price}`);
  modified++;
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped`);
