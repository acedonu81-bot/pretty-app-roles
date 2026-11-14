import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trackBlogCtaClick } from '@/lib/blogAnalytics';

/**
 * Las tablas de tarifas de los blogs (Clarity, 14 nov 2026) reciben clics reales
 * en las filas, pero eran texto muerto. Esto hace clicable cada fila con precio y
 * la lleva a la página donde se contrata ese perfil.
 *
 * Hay ~240 blogs con la tabla escrita a mano, así que se hace aquí una sola vez
 * (DOM + delegación de eventos) en vez de tocar cada artículo. No se mueve ni se
 * reemplaza ningún nodo que React pinte: solo atributos y CSS, para no romper la
 * reconciliación.
 */

const CSS = `
tr[data-xp-destino]{cursor:pointer}
tr[data-xp-destino]:hover td,tr[data-xp-destino]:focus-visible td{background:rgba(5,150,105,0.08)!important}
tr[data-xp-destino]:focus-visible{outline:2px solid #059669;outline-offset:-2px}
tr[data-xp-destino] td:first-child::after{content:' \\2192';color:#059669;font-weight:700}
`;

/** Destino por tema del artículo (según el slug). */
function destinoPorSlug(path: string): string | null {
  if (/camarero/.test(path)) return '/contratar-camareros';
  if (/azafata/.test(path)) return '/contratar-azafata';
  if (/maquillaje|peluquer/.test(path)) return '/contratar-maquillaje';
  if (/fotograf|videograf/.test(path)) return '/contratar-fotografo';
  if (/saxofon|cuarteto|trio|grupo-musical|banda/.test(path)) return '/contratar-grupo-musical';
  if (/animador|payaso|comunion/.test(path)) return '/contratar-animadores';
  if (/tecnico-sonido|sonido/.test(path)) return '/contratar-tecnico-sonido';
  if (/catering/.test(path)) return '/contratar-catering';
  if (/cuanto-cobra-un-dj|dj-/.test(path)) return '/contratar-dj';
  return null;
}

/** Artículos genéricos de staff: el destino depende de la fila. */
const ESGENERICO = /staff|personal|discoteca|rrpp|hosteleria/;

function destinoPorFila(texto: string): string {
  const t = texto.toLowerCase();
  if (/hostess|azafat/.test(t)) return '/contratar-azafata';
  if (/rrpp|relaciones p|promotor/.test(t)) return '/contratar-promotores';
  if (/camarer|bartender|barra/.test(t)) return '/contratar-camareros';
  if (/\bdj\b/.test(t)) return '/contratar-dj';
  if (/t[eé]cnico|sonido/.test(t)) return '/contratar-tecnico-sonido';
  return '/contratar-staff';
}

function enhance() {
  const path = window.location.pathname;
  if (!path.startsWith('/blog/')) return;
  const base = destinoPorSlug(path);
  const generico = ESGENERICO.test(path);
  if (!base && !generico) return;

  document.querySelectorAll('article table tbody tr, main table tbody tr').forEach((tr) => {
    if (tr.hasAttribute('data-xp-destino')) return;
    const celdas = tr.querySelectorAll('td');
    if (celdas.length < 2) return;
    const texto = tr.textContent || '';
    // Solo filas con precio: evita tablas de otro tipo (comparativas, calendarios).
    if (!/€/.test(texto)) return;
    const destino = generico ? destinoPorFila(celdas[0].textContent || '') : base;
    if (!destino) return;
    tr.setAttribute('data-xp-destino', destino);
    tr.setAttribute('tabindex', '0');
    tr.setAttribute('role', 'link');
    tr.setAttribute('title', 'Ver profesionales disponibles');
  });
}

const BlogTablaEnlaces = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pathname.startsWith('/blog/')) return;
    const style = document.createElement('style');
    style.setAttribute('data-xp-tabla-enlaces', '');
    style.textContent = CSS;
    document.head.appendChild(style);

    enhance();
    // Los blogs se cargan en diferido: se reintenta cuando cambia el DOM.
    let pendiente = 0;
    const obs = new MutationObserver(() => {
      window.clearTimeout(pendiente);
      pendiente = window.setTimeout(enhance, 150);
    });
    obs.observe(document.body, { childList: true, subtree: true });

    const ir = (tr: Element, nuevaPestana: boolean) => {
      const destino = tr.getAttribute('data-xp-destino');
      if (!destino) return;
      trackBlogCtaClick({
        component: 'inline',
        role: 'tabla_fila',
        variant: 'tabla',
        href: destino,
        article_path: pathname,
      });
      if (nuevaPestana) window.open(destino, '_blank', 'noopener');
      else navigate(destino);
    };
    const onClick = (e: MouseEvent) => {
      const tr = (e.target as Element | null)?.closest?.('tr[data-xp-destino]');
      if (!tr) return;
      // Si ya hay un enlace dentro de la fila, que mande el enlace.
      if ((e.target as Element).closest('a,button')) return;
      ir(tr, e.metaKey || e.ctrlKey);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      const tr = (e.target as Element | null)?.closest?.('tr[data-xp-destino]');
      if (tr) ir(tr, false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);

    return () => {
      obs.disconnect();
      window.clearTimeout(pendiente);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      style.remove();
    };
  }, [pathname, navigate]);

  return null;
};

export default BlogTablaEnlaces;
