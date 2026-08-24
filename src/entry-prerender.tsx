/**
 * SSR entry for build-time prerendering.
 * Renders a page component to real HTML so crawlers see full content
 * instead of an empty SPA shell. Used by scripts/prerender-content.mjs
 * after `vite build --ssr src/entry-prerender.tsx`.
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const pages = import.meta.glob('./pages/*.tsx');

// routePattern (ej. "/contratar-dj/:ciudad") es opcional — si se omite se usa
// routePath tal cual. Sin pasar por una <Route> real con su patrón, useParams()
// en el componente (p.ej. CityLanding leyendo :ciudad) nunca se popula en SSR.
export async function renderPage(componentFile: string, routePath: string, routePattern?: string) {
  const loader = pages[`./pages/${componentFile}`];
  if (!loader) throw new Error(`Page not found: ${componentFile}`);
  const mod = (await loader()) as { default: React.ComponentType };
  const Page = mod.default;
  const helmetContext: Record<string, unknown> = {};
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={routePath}>
          <Routes>
            <Route path={routePattern ?? routePath} element={<Page />} />
          </Routes>
        </StaticRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
  const helmet = helmetContext.helmet as { script?: { toString(): string }; link?: { toString(): string } } | undefined;
  // Solo <link rel="preload"> de Helmet — el resto (canonical, etc.) ya lo
  // gestiona prerender-meta.mjs por su cuenta (corre antes en el pipeline de
  // build) con reemplazo real; arrastrar aquí cualquier <link> duplicaría
  // esos tags en vez de sustituirlos, porque este paso solo añade al <head>.
  const preloadLinks = (helmet?.link?.toString() ?? '').match(/<link[^>]*rel="preload"[^>]*>/g)?.join('') ?? '';
  const headScripts = preloadLinks + (helmet?.script?.toString() ?? '');
  return { html, headScripts };
}
