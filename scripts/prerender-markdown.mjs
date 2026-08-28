/**
 * Genera una versión Markdown de cada página estática, a partir del HTML
 * real ya inyectado por prerender-content.mjs (el contenido del <div
 * id="root">, no el shell SPA vacío). Los .md quedan junto al .html
 * correspondiente (dist/<ruta>/index.md) para que middleware.ts los sirva
 * en la misma URL cuando el request pide Accept: text/markdown.
 *
 * Run after prerender-content.mjs:
 *   node scripts/prerender-markdown.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
// El prerender no emite <script>/<style>/<svg> dentro del root, pero por si
// algún componente los cuela, no queremos ruido en el Markdown.
turndown.remove(['script', 'style', 'svg', 'noscript']);

function extractRoot(html) {
  const m = html.match(/<div id="root">([\s\S]*?)<\/div>\s*(?=<\/body>|\n\s*<\/body>)/);
  return m ? m[1] : null;
}

function extractMeta(html) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  return { title, description, canonical };
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === 'index.html') out.push(full);
  }
  return out;
}

const htmlFiles = walk(DIST);
let ok = 0, skipped = 0;

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const rootHtml = extractRoot(html);
  // Páginas sin contenido prerenderizado (shell SPA puro, ej. rutas SKIP de
  // prerender-content.mjs) no tienen nada útil que convertir.
  if (!rootHtml || rootHtml.trim().length < 50) { skipped++; continue; }

  const { title, description, canonical } = extractMeta(html);
  const body = turndown.turndown(rootHtml).trim();

  const frontMatter = [
    `# ${title || 'XPEAK'}`,
    description ? `\n${description}\n` : '',
    canonical ? `\nURL: ${canonical}\n` : '',
    '\n---\n',
  ].join('');

  const mdFile = htmlFile.replace(/index\.html$/, 'index.md');
  fs.writeFileSync(mdFile, `${frontMatter}\n${body}\n`);
  ok++;
}

console.log(`Prerender markdown: ${ok} páginas .md generadas, ${skipped} sin contenido (omitidas)`);
