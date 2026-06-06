/**
 * Adds BlogEmailCapture to all blog posts that don't have it yet.
 * Inserts the component just before </main> and adds the import.
 */
import fs from 'node:fs';
import path from 'node:path';

const PAGES = '/Users/danielacedonunez/pretty-app-roles/src/pages';

// Map blog file → { intent, variant }
const INTENT_MAP = {
  'DJ': 'contratar-dj',
  'Fotografo': 'contratar-staff',
  'Fotografia': 'contratar-staff',
  'Camareros': 'contratar-staff',
  'Barman': 'contratar-staff',
  'Staff': 'contratar-staff',
  'Catering': 'contratar-staff',
  'Azafatas': 'contratar-staff',
  'Maquillaj': 'contratar-staff',
  'Maquilladora': 'ser-profesional',
  'Promotor': 'ser-profesional',
  'RRPP': 'ser-profesional',
  'Animadores': 'contratar-staff',
  'Cantante': 'contratar-staff',
  'Saxofonista': 'contratar-staff',
  'WeddingPlanner': 'contratar-staff',
  'MaestroCeremonias': 'contratar-staff',
  'PersonalImagen': 'ser-profesional',
  'TecnicoSonido': 'ser-profesional',
  'Videografo': 'contratar-staff',
  'Boda': 'contratar-dj',
  'Comunion': 'contratar-dj',
  'Empresa': 'contratar-dj',
};

function getIntent(filename) {
  for (const [key, intent] of Object.entries(INTENT_MAP)) {
    if (filename.includes(key)) return intent;
  }
  return 'general';
}

function getVariant(intent) {
  if (intent === 'contratar-dj') return 'presupuestos';
  if (intent === 'ser-profesional') return 'guia';
  return 'presupuestos';
}

function extractSlug(content) {
  // Try const slug = 'xxx'
  const slugMatch = content.match(/const\s+slug\s*=\s*['"]([^'"]+)['"]/);
  if (slugMatch) return slugMatch[1];

  // Try canonical href
  const canonMatch = content.match(/href={?`https:\/\/xpeak\.es\/blog\/([^`'"}\s]+)`/);
  if (canonMatch) return canonMatch[1];

  // Try canonical href static
  const canonStatic = content.match(/href="https:\/\/xpeak\.es\/blog\/([^"]+)"/);
  if (canonStatic) return canonStatic[1];

  return null;
}

const files = fs.readdirSync(PAGES)
  .filter(f => f.startsWith('Blog') && f.endsWith('.tsx'));

let modified = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(PAGES, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has it
  if (content.includes('BlogEmailCapture')) {
    skipped++;
    continue;
  }

  const intent = getIntent(file);
  const variant = getVariant(intent);
  const slug = extractSlug(content);
  const articlePath = slug ? `/blog/${slug}` : '';

  // Add import after last import line
  const importLine = `import BlogEmailCapture from '@/components/BlogEmailCapture';\n`;
  // Find the last import line
  const lastImportIdx = content.lastIndexOf('\nimport ');
  if (lastImportIdx === -1) {
    console.log(`⚠️  No import found in ${file}, skipping`);
    skipped++;
    continue;
  }
  const endOfLastImport = content.indexOf('\n', lastImportIdx + 1);
  if (endOfLastImport === -1) {
    skipped++;
    continue;
  }
  content = content.slice(0, endOfLastImport + 1) + importLine + content.slice(endOfLastImport + 1);

  // Insert BlogEmailCapture just before </main> or before <FooterPublic />
  let insertIdx = content.lastIndexOf('</main>');
  const captureJSX = `          <BlogEmailCapture variant="${variant}" intent="${intent}" articlePath="${articlePath}" />\n`;

  if (insertIdx === -1) {
    // Fall back to just before <FooterPublic />
    insertIdx = content.lastIndexOf('<FooterPublic');
    if (insertIdx === -1) {
      console.log(`⚠️  No insertion point in ${file}, skipping`);
      skipped++;
      continue;
    }
    // Walk back to the start of the line
    const lineStart = content.lastIndexOf('\n', insertIdx - 1) + 1;
    content = content.slice(0, lineStart) + captureJSX + content.slice(lineStart);
  } else {
    content = content.slice(0, insertIdx) + captureJSX + content.slice(insertIdx);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅  ${file} (intent=${intent}, variant=${variant}${slug ? `, slug=${slug}` : ''})`);
  modified++;
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped`);
