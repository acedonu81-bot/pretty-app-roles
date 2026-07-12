/**
 * SSR entry for build-time prerendering.
 * Renders a page component to real HTML so crawlers see full content
 * instead of an empty SPA shell. Used by scripts/prerender-content.mjs
 * after `vite build --ssr src/entry-prerender.tsx`.
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const pages = import.meta.glob('./pages/*.tsx');

export async function renderPage(componentFile: string, routePath: string) {
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
          <Page />
        </StaticRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
  const helmet = helmetContext.helmet as { script?: { toString(): string } } | undefined;
  return { html, headScripts: helmet?.script?.toString() ?? '' };
}
