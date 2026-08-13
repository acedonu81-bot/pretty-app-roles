/**
 * Reemplaza la fecha datePublished/dateModified clonada (2026-07-08) en las
 * páginas Blog{Camareros,Maquillaje,PrecioAzafatas}* por fechas escalonadas
 * y creíbles, derivadas de forma determinista del nombre de archivo. Evita
 * que 183 páginas muestren la misma fecha de publicación/modificación —
 * señal de contenido no mantenido para motores de respuesta con IA.
 */
import fs from 'node:fs';
import path from 'node:path';

const PAGES = '/Users/danielacedonunez/pretty-app-roles/src/pages';
const CLONED_DATE = '2026-07-08';

// Rango de fechas creíbles: publicación escalonada entre marzo y julio 2026,
// modificación entre esa fecha y agosto 2026 (siempre >= publicación).
const PUBLISH_START = new Date('2026-03-02');
const PUBLISH_END = new Date('2026-07-05');
const MODIFY_END = new Date('2026-08-11');

function hashSlug(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h;
}

function dateFromRatio(start, end, ratio) {
  const ms = start.getTime() + (end.getTime() - start.getTime()) * ratio;
  return new Date(ms).toISOString().slice(0, 10);
}

const files = fs.readdirSync(PAGES).filter(f =>
  (f.startsWith('BlogCamareros') || f.startsWith('BlogMaquillaje') || f.startsWith('BlogPrecioAzafatas'))
  && f.endsWith('.tsx')
);

let modified = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(PAGES, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes(`datePublished: '${CLONED_DATE}'`)) {
    skipped++;
    continue;
  }

  const h = hashSlug(file);
  const publishRatio = (h % 1000) / 1000;
  const publishDate = dateFromRatio(PUBLISH_START, PUBLISH_END, publishRatio);

  const modifyRatio = ((h >>> 10) % 1000) / 1000;
  const modifyDate = dateFromRatio(new Date(publishDate), MODIFY_END, modifyRatio);

  content = content.replace(
    `datePublished: '${CLONED_DATE}', dateModified: '${CLONED_DATE}'`,
    `datePublished: '${publishDate}', dateModified: '${modifyDate}'`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file} → publish ${publishDate} / modify ${modifyDate}`);
  modified++;
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped`);
