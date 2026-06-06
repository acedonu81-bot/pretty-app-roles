/**
 * Adds hub backlinks to all blog articles.
 * - Articles WITH "Artículos relacionados": prepends hub item to existing array.
 * - Articles WITHOUT the section: adds full section before the final CTA div.
 */
import fs from 'node:fs';
import path from 'node:path';

const PAGES = '/Users/danielacedonunez/pretty-app-roles/src/pages';

const HUBS = {
  dj:     { href: '/blog/dj-para-eventos',          cat: 'Hub DJ',         tag: 'Hub DJ',         title: 'DJ para eventos: guía completa de precios 2026',     desc: 'Precios, perfiles y cómo contratar DJ para cada tipo de evento en España.' },
  bodas:  { href: '/blog/profesionales-bodas',      cat: 'Hub Bodas',      tag: 'Hub Bodas',      title: 'Profesionales para bodas: guía completa 2026',        desc: 'DJ, fotógrafo, catering y más. Todo lo que necesitas para tu boda.' },
  foto:   { href: '/blog/fotografos-eventos',       cat: 'Hub Foto',       tag: 'Hub Foto',       title: 'Fotógrafos para eventos: guía completa 2026',         desc: 'Precios y guías por tipo de evento fotográfico. Bodas, comuniones y más.' },
  comuni: { href: '/blog/comuniones-guia-completa', cat: 'Hub Comuniones', tag: 'Hub Comuniones', title: 'Comuniones en España: guía completa 2026',            desc: 'Presupuesto, DJ, fotógrafo, catering y animación para tu comunión.' },
  staff:  { href: '/blog/staff-para-eventos',       cat: 'Hub Staff',      tag: 'Hub Staff',      title: 'Staff para eventos: guía completa 2026',              desc: 'Camareros, azafatas, RRPP y personal de sala. Precios y ratios.' },
};

const WITH_SECTION = [
  ['BlogDJPrecio.tsx',          'A', ['dj']],
  ['BlogDJCorporativo.tsx',     'A', ['dj']],
  ['BlogDJFiestaPrivada.tsx',   'A', ['dj']],
  ['BlogCantanteBodas.tsx',     'A', ['bodas']],
  ['BlogMaestroCeremonias.tsx', 'A', ['bodas']],
  ['BlogMusicaEnVivoBodas.tsx', 'A', ['bodas']],
  ['BlogWeddingPlanner.tsx',    'A', ['bodas']],
  ['BlogSaxofonistaBodas.tsx',  'A', ['bodas']],
  ['BlogComunionCosto.tsx',     'A', ['comuni']],
  ['BlogPersonalImagen.tsx',    'A', ['staff']],
  ['BlogCamarerosPrecio.tsx',       'B', ['staff']],
  ['BlogCateringComuniones.tsx',    'B', ['comuni']],
  ['BlogContratarPersonalEvento.tsx','B', ['staff']],
  ['BlogContratoDJ.tsx',            'B', ['dj']],
  ['BlogCosteBoda.tsx',             'B', ['bodas']],
  ['BlogCuantosCalmarerosBoda.tsx', 'B', ['staff', 'bodas']],
  ['BlogDJBodaCivil.tsx',           'B', ['dj', 'bodas']],
  ['BlogDJComunion.tsx',            'B', ['dj', 'comuni']],
  ['BlogDJCumpleanos.tsx',          'B', ['dj']],
  ['BlogDJErroresBoda.tsx',         'B', ['dj', 'bodas']],
  ['BlogDJResidenteDiscoteca.tsx',  'B', ['dj']],
  ['BlogFotografoBodas.tsx',        'B', ['bodas', 'foto']],
  ['BlogFotografoComunion.tsx',     'B', ['foto', 'comuni']],
  ['BlogMaquillajeBoda.tsx',        'B', ['bodas']],
  ['BlogMusicaBoda.tsx',            'B', ['bodas', 'dj']],
  ['BlogStaffDiscoteca.tsx',        'B', ['staff']],
];

const WITHOUT_SECTION = [
  ['BlogDJBodaVsDiscoteca.tsx',        ['dj']],
  ['BlogCateringBoda.tsx',             ['bodas']],
  ['BlogVideografoBodas.tsx',          ['bodas', 'foto']],
  ['BlogTendenciasBodas.tsx',          ['bodas']],
  ['BlogFotografiaEventosNocturnos.tsx',['foto']],
  ['BlogDiscoMovilComuniones.tsx',     ['comuni', 'dj']],
  ['BlogPrecioAzafatas.tsx',           ['staff']],
  ['BlogBarmanEventos.tsx',            ['staff', 'bodas']],
];

let modified = 0;
let skipped = 0;

function buildNewSection(hubKeys) {
  const items = hubKeys.map(k => {
    const h = HUBS[k];
    return `                  { href: '${h.href}', cat: '${h.cat}', title: '${h.title}' },`;
  }).join('\n');
  return `\n            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
${items}
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>`;
}

// Process WITH_SECTION files
for (const [file, pattern, hubKeys] of WITH_SECTION) {
  const fp = path.join(PAGES, file);
  let content = fs.readFileSync(fp, 'utf8');

  const needed = hubKeys.filter(k => !content.includes(HUBS[k].href));
  if (needed.length === 0) { skipped++; console.log(`  skip  ${file}`); continue; }

  const markerIdx = content.indexOf('Artículos relacionados');
  if (markerIdx === -1) { console.log(`  WARN  ${file} — marker not found`); continue; }

  const sectionText = content.slice(markerIdx, markerIdx + 2000);
  const mOpen = sectionText.match(/\{\[\n/);
  if (!mOpen) { console.log(`  WARN  ${file} — array open not found`); continue; }

  const afterArrayOpen = markerIdx + mOpen.index + mOpen[0].length;
  const restAfterOpen = content.slice(afterArrayOpen);
  const mItem = restAfterOpen.match(/^( +)\{ href:/m);
  if (!mItem) { console.log(`  WARN  ${file} — first item not found`); continue; }

  const indent = mItem[1];
  const insertPos = afterArrayOpen + mItem.index;

  const newItems = needed.map(k => {
    const h = HUBS[k];
    return pattern === 'A'
      ? `${indent}{ href: '${h.href}', tag: '${h.tag}', title: '${h.title}', desc: '${h.desc}' },\n`
      : `${indent}{ href: '${h.href}', cat: '${h.cat}', title: '${h.title}' },\n`;
  }).join('');

  content = content.slice(0, insertPos) + newItems + content.slice(insertPos);
  fs.writeFileSync(fp, content, 'utf8');
  modified++;
  console.log(`  ok    ${file} +[${needed.join(', ')}]`);
}

// Process WITHOUT_SECTION files
for (const [file, hubKeys] of WITHOUT_SECTION) {
  const fp = path.join(PAGES, file);
  let content = fs.readFileSync(fp, 'utf8');

  const needed = hubKeys.filter(k => !content.includes(HUBS[k].href));
  if (needed.length === 0) { skipped++; console.log(`  skip  ${file}`); continue; }

  const ctaMarker = '<div className="p-6 rounded-2xl text-center"';
  const ctaIdx = content.lastIndexOf(ctaMarker);
  if (ctaIdx === -1) { console.log(`  WARN  ${file} — CTA div not found`); continue; }

  const newSection = buildNewSection(needed);
  content = content.slice(0, ctaIdx) + newSection + '\n            ' + content.slice(ctaIdx);
  fs.writeFileSync(fp, content, 'utf8');
  modified++;
  console.log(`  ok    ${file} +section [${needed.join(', ')}]`);
}

console.log(`\nTotal: ${modified} modificados, ${skipped} ya tenian los hubs.`);
