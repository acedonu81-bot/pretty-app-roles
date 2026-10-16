import { describe, it, expect, vi, beforeEach } from 'vitest';

const logEvent = vi.fn();
vi.mock('@/lib/track', () => ({ logEvent: (...a: unknown[]) => logEvent(...a) }));

import { trackBlogCtaClick } from '@/lib/blogAnalytics';

describe('trackBlogCtaClick', () => {
  beforeEach(() => { logEvent.mockClear(); window.dataLayer = []; });

  it('guarda el clic en analytics_events con el artículo y el destino', () => {
    trackBlogCtaClick({ component: 'top', role: 'dj', href: '/auth?mode=register&role=dj', article_path: '/blog/cuanto-cobra-un-dj-en-espana' });
    expect(logEvent).toHaveBeenCalledWith('cta_click', '/blog/cuanto-cobra-un-dj-en-espana', 'blog top dj - > /auth?mode=register&role=dj');
    expect(window.dataLayer).toHaveLength(1);
  });

  it('el detalle no pasa de 120 caracteres', () => {
    trackBlogCtaClick({ component: 'inline', href: '/auth?x=' + 'a'.repeat(200) });
    expect((logEvent.mock.calls[0][2] as string).length).toBeLessThanOrEqual(120);
  });
});
