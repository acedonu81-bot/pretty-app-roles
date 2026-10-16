import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_ES, canonicalRole } from '@/lib/constants';
import { compararDirectorio, completeness, COMPLETENESS_MAX } from '@/lib/dailyRotation';
import { fotoOptimizada } from '@/lib/imagen';
import { track, logEvent } from '@/lib/track';

// Fichas reales en /auth (Ficha XDS 70,6, aprobada 13 oct 2026). Quien llega
// del anuncio de Instagram veía solo un formulario: la mitad se iba en menos
// de 3 s y del resto casi nadie tocaba nada. Con un poco de scroll ve ahora
// profesionales reales. Death line: a 7 días, si las altas no pasan del 0,7% y
// menos del 20% de quienes ven la tira toca una ficha, se quita.

export interface FichaReal {
  user_id: string;
  display_name: string | null;
  role: string | null;
  zone: string | null;
  photo_url: string | null;
  bio?: string | null;
  audio_embed_url?: string | null;
  audio_session_urls?: unknown;
  portfolio_urls?: unknown;
  is_verified?: boolean | null;
  score?: number | null;
}

const MAX_FICHAS = 8;
// ROLE_ES también nombra a quien no ofrece servicios: fuera de la tira.
const SIN_OFICIO = new Set(['empresario', 'pending']);

// Música delante (decisión del usuario, 13 oct 2026: el 100% de la demanda
// real es de música): 6 de música y 2 de otros oficios para que se vea que
// hay de todo. Si falta de un lado se rellena con el otro. Mismos oficios que
// el grupo "Música" de ExplorarView.
const MUSICA = new Set(['dj', 'grupo-musical', 'disco-movil']);
const MAX_MUSICA = 6;

// Solo perfiles completos con foto y oficio conocido (canonicalRole devuelve
// tal cual un rol desconocido como 'pending'), en el orden y la rotación
// diaria del directorio.
export function elegirFichas(filas: FichaReal[], date = new Date()): FichaReal[] {
  const completos = filas
    .filter(p => p.photo_url && p.display_name?.trim() && !SIN_OFICIO.has(p.role ?? '')
      && ROLE_ES[canonicalRole(p.role) ?? ''] && completeness(p) === COMPLETENESS_MAX)
    .sort((a, b) => compararDirectorio(a, b, date));
  const esMusica = (p: FichaReal) => MUSICA.has(canonicalRole(p.role) ?? '');
  const musica = completos.filter(esMusica);
  const resto = completos.filter(p => !esMusica(p));
  return [...musica.slice(0, MAX_MUSICA), ...resto, ...musica.slice(MAX_MUSICA)].slice(0, MAX_FICHAS);
}

// ROLE_ES trae etiquetas largas ("DJ / Artista / Música en Vivo"): en una
// ficha de 130 px solo cabe la primera parte.
const CORTA: Record<string, string> = { media: 'Fotografía', animador: 'Animación' };
export function oficioCorto(role: string | null): string {
  const c = canonicalRole(role) ?? role ?? '';
  return CORTA[c] ?? (ROLE_ES[c] ?? c).split(/\s+[/&]\s+/)[0];
}

async function fetchFichasReales(roles?: string[]): Promise<FichaReal[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, display_name, role, zone, photo_url, bio, audio_embed_url, audio_session_urls, portfolio_urls, is_verified, score')
    .neq('role', 'empresario')
    .not('display_name', 'is', null)
    .not('photo_url', 'is', null)
    .or('is_public.is.null,is_public.eq.true')
    .limit(300);
  if (error) throw error;
  const filas = (data ?? []) as FichaReal[];
  // En el blog solo los oficios del artículo (16 oct 2026).
  return elegirFichas(roles?.length ? filas.filter(p => roles.includes(canonicalRole(p.role) ?? '')) : filas);
}

// El hueco es casi cuadrado (130x150) y las fotos llegan de todas las formas:
// grupos en 16:9, retratos, tiras verticales de 1:3 (14 oct 2026). Con un solo
// object-position, a Marlene (16:9) se le cortaban los de los lados y de
// lagartijascolora (1:3) solo se veía la pared. Se encuadra según la forma
// real, comprobado simulando el recorte sobre las fotos:
// - muy apaisada (>1,6): entera, con la misma foto difuminada de fondo;
// - muy alta (<0,5): recorte centrado, la persona suele estar en medio;
// - el resto (retratos y 3:2): cubre el hueco con la cara arriba, como antes.
const FotoFicha = ({ src, alt }: { src: string; alt: string }) => {
  const [forma, setForma] = useState<'ancha' | 'alta' | 'normal'>('normal');
  const alCargar = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    const r = w / h;
    setForma(r > 1.6 ? 'ancha' : r < 0.5 ? 'alta' : 'normal');
  };
  return (
    <div className="relative w-full overflow-hidden" style={{ height: 150, background: '#FBF3DD' }}>
      {forma === 'ancha' && (
        <img src={src} alt="" aria-hidden decoding="async"
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ filter: 'blur(10px)', opacity: 0.85 }} />
      )}
      <img src={src} alt={alt} loading="lazy" decoding="async" onLoad={alCargar}
        className={`relative w-full h-full ${forma === 'ancha' ? 'object-contain' : 'object-cover'}`}
        style={{ objectPosition: forma === 'alta' ? '50% 50%' : forma === 'ancha' ? '50% 50%' : '50% 15%' }} />
    </div>
  );
};

// origen 'blog' (16 oct 2026): la misma tira dentro de los artículos de precio,
// filtrada a los oficios del artículo. Los eventos van a analytics_events como
// cta_click con detalle 'blog_ficha' (los track('auth_*') solo valen en /auth).
interface TiraProps { roles?: string[]; titulo?: string; articlePath?: string }

const FichasRealesTira = ({ roles, titulo = 'Ya están en XPEAK', articlePath }: TiraProps = {}) => {
  const enBlog = !!articlePath;
  const { data: fichas, isLoading } = useQuery({
    queryKey: ['auth-fichas-reales', roles?.join(',') ?? 'todos'],
    queryFn: () => fetchFichasReales(roles),
    staleTime: 10 * 60_000,
  });
  const ref = useRef<HTMLDivElement>(null);

  // Cuántos llegan a verla: es la primera condición de la death line.
  useEffect(() => {
    const el = ref.current;
    if (!el || !fichas?.length || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (enBlog) void logEvent('cta_click', articlePath, `blog_fichas_vistas n=${fichas.length}`);
        else track('auth_fichas_vistas', { n: fichas.length });
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [fichas, enBlog, articlePath]);

  if (!isLoading && (!fichas || fichas.length < 3)) return null;

  return (
    <div ref={ref} className="mb-5">
      <p className="text-[0.75rem] font-black uppercase tracking-wider mb-2" style={{ color: 'rgba(0,0,0,0.45)' }}>
        {titulo}
      </p>
      <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {isLoading
          ? Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="shrink-0 w-[130px] rounded-xl" style={{ height: 210, background: '#FBF3DD' }} />
            ))
          : fichas!.map((p, i) => (
              <Link key={p.user_id} to={`/p/${p.user_id}`}
                onClick={() => (enBlog
                  ? void logEvent('cta_click', articlePath, `blog_ficha pos=${i + 1} rol=${canonicalRole(p.role) ?? ''}`)
                  : track('auth_ficha_click', { rol: canonicalRole(p.role) ?? '', pos: i + 1 }))}
                className="shrink-0 w-[130px] snap-start rounded-xl overflow-hidden transition-transform active:scale-[0.98]"
                style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.3)' }}>
                <FotoFicha src={fotoOptimizada(p.photo_url, 260)} alt={p.display_name ?? ''} />
                <div className="px-2.5 py-2">
                  <p className="text-xs font-black truncate" style={{ color: '#111' }}>{p.display_name}</p>
                  <p className="text-[0.75rem] truncate" style={{ color: 'rgba(0,0,0,0.55)' }}>
                    {oficioCorto(p.role)}{p.zone ? ` · ${p.zone}` : ''}
                  </p>
                </div>
              </Link>
            ))}
        {!isLoading && (
          <Link to="/descubrir" onClick={() => (enBlog ? void logEvent('cta_click', articlePath, 'blog_fichas_ver_todos') : track('auth_fichas_ver_todos'))}
            className="shrink-0 w-[110px] snap-start rounded-xl flex items-center justify-center text-xs font-black"
            style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.35)', color: '#8B6A00' }}>
            Ver todos →
          </Link>
        )}
      </div>
    </div>
  );
};

export default FichasRealesTira;
