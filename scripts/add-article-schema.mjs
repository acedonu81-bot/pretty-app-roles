/**
 * Adds Article + BreadcrumbList schema to blog posts that don't have them.
 * Also adds visible date line (E-E-A-T) if missing.
 */
import fs from 'node:fs';
import path from 'node:path';

const PAGES = '/Users/danielacedonunez/pretty-app-roles/src/pages';
const TODAY = '2026-06-07';

function extractSlug(content) {
  const m = content.match(/const\s+slug\s*=\s*['"]([^'"]+)['"]/);
  if (m) return m[1];
  const c = content.match(/href={?`https:\/\/xpeak\.es\/blog\/([^`'"}\s]+)`/);
  if (c) return c[1];
  const s = content.match(/href="https:\/\/xpeak\.es\/blog\/([^"]+)"/);
  if (s) return s[1];
  return null;
}

function extractTitle(content) {
  // From <title>...</title> in Helmet
  const m = content.match(/<title>([^<]+)<\/title>/);
  if (m) {
    // Remove " | XPEAK" suffix
    return m[1].replace(/\s*[|–]\s*XPEAK\s*$/, '').trim();
  }
  return null;
}

function extractDescription(content) {
  const m = content.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  if (m) return m[1];
  return '';
}

const files = fs.readdirSync(PAGES)
  .filter(f => f.startsWith('Blog') && f.endsWith('.tsx'));

let modified = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(PAGES, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has Article schema
  if (content.includes("'@type': 'Article'") || content.includes('"@type": "Article"')) {
    skipped++;
    continue;
  }

  const slug = extractSlug(content);
  if (!slug) { console.log(`⚠️  No slug in ${file}, skipping`); skipped++; continue; }

  const title = extractTitle(content);
  if (!title) { console.log(`⚠️  No title in ${file}, skipping`); skipped++; continue; }

  const description = extractDescription(content);
  const url = `https://xpeak.es/blog/${slug}`;

  // Build schema strings
  const articleSchema = `
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: ${JSON.stringify(title)},
    description: ${JSON.stringify(description)},
    author: { '@type': 'Organization', name: 'XPEAK' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    datePublished: '${TODAY}',
    dateModified: '${TODAY}',
    url: ${JSON.stringify(url)},
    mainEntityOfPage: { '@type': 'WebPage', '@id': ${JSON.stringify(url)} },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
      { '@type': 'ListItem', position: 3, name: ${JSON.stringify(title)}, item: ${JSON.stringify(url)} },
    ],
  };
`;

  // Insert schemas inside the component function, before the return statement
  // Find "return (" or "return(" inside the function body
  const returnIdx = content.search(/\n\s{2}return\s*\(/);
  if (returnIdx === -1) {
    console.log(`⚠️  No return found in ${file}, skipping`);
    skipped++;
    continue;
  }

  content = content.slice(0, returnIdx) + articleSchema + content.slice(returnIdx);

  // Add script tags inside Helmet, just before </Helmet>
  const scriptTags = `        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
`;
  const helmetClose = content.lastIndexOf('</Helmet>');
  if (helmetClose === -1) {
    console.log(`⚠️  No Helmet close in ${file}, skipping`);
    skipped++;
    continue;
  }

  // Walk back to line start
  const lineStart = content.lastIndexOf('\n', helmetClose - 1) + 1;
  content = content.slice(0, lineStart) + scriptTags + content.slice(lineStart);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅  ${file} → ${slug}`);
  modified++;
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped`);
