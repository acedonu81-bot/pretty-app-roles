export const config = {
  matcher: '/((?!assets|api|.well-known|.*\\.[\\w]+$).*)',
};

// Content negotiation para agentes IA: si el request pide explícitamente
// Accept: text/markdown, servimos la versión .md generada en build
// (scripts/prerender-markdown.mjs) en vez del HTML, misma URL.
export default async function middleware(request: Request) {
  const accept = request.headers.get('accept') ?? '';
  if (!accept.includes('text/markdown')) return;

  const url = new URL(request.url);
  const mdPath = url.pathname === '/' || url.pathname.endsWith('/')
    ? `${url.pathname}index.md`
    : `${url.pathname}/index.md`;

  const mdUrl = new URL(mdPath, url);
  const mdResponse = await fetch(mdUrl);
  // El catch-all de vercel.json sirve /index.html (200) para cualquier ruta
  // sin archivo propio, así que un .md inexistente no da 404 — hay que
  // comprobar el content-type real de vuelta, no solo el status.
  if (!mdResponse.ok || !mdResponse.headers.get('content-type')?.includes('text/markdown')) return;

  return new Response(mdResponse.body, {
    status: 200,
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
