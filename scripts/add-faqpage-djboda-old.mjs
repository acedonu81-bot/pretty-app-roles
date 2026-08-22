/**
 * Añade JSON-LD FAQPage (a partir del array `faq` ya existente en cada
 * página) y convierte la pregunta visible de <p> a <h3> real, para las
 * páginas BlogDJBoda* del patrón antiguo ("Albacete" style, variable
 * `ciudad`) que tienen preguntas/respuestas escritas pero sin schema
 * estructurado ni encabezado semántico.
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

  if (content.includes('FAQPage')) { skipped++; continue; }
  if (!content.includes('const faq = [')) { skipped++; continue; }

  // 1. Construir e insertar el schema FAQPage justo después de const faq = [...]
  const faqPageSchema = `
const faqPageSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
`;
  const faqDeclEnd = content.indexOf('];', content.indexOf('const faq = [')) + 2;
  content = content.slice(0, faqDeclEnd) + faqPageSchema + content.slice(faqDeclEnd);

  // 2. Inyectar <script type="application/ld+json"> en el Helmet, antes de </Helmet>
  const scriptTag = `<script type="application/ld+json">{JSON.stringify(faqPageSchema)}</script>`;
  const helmetCloseIdx = content.indexOf('</Helmet>');
  if (helmetCloseIdx === -1) { console.log(`⚠️  No </Helmet> en ${file}`); skipped++; continue; }
  content = content.slice(0, helmetCloseIdx) + scriptTag + content.slice(helmetCloseIdx);

  // 3. Convertir <p> de pregunta a <h3> real (patrón f.q, no f.name)
  content = content.replace(
    '<p className="text-sm font-bold mb-2">{f.q}</p>',
    '<h3 className="text-sm font-bold mb-2">{f.q}</h3>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file}`);
  modified++;
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped`);
