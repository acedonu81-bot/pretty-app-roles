import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pause, Play, X } from 'lucide-react';

// Reproductor de las sesiones del Concurso DJ que NO se corta al navegar
// (17 oct 2026, petición del usuario: "seguir escuchando la sesión mientras
// navegas por la web"). Vive por encima de las rutas (App.tsx), así que el
// iframe de SoundCloud no se desmonta al cambiar de página. Una sola sesión a
// la vez; elegir otra sustituye a la anterior. El iframe solo se crea al pulsar
// "Escuchar" (gesto del usuario): antes de eso no se carga nada de SoundCloud ni
// sus cookies. Control real (play/pausa/progreso) con la Widget API de SoundCloud.
type Sesion = { url: string; titulo: string };
interface Ctx { sesion: Sesion | null; sonando: boolean; reproducir: (s: Sesion) => void; cerrar: () => void }

const ReproductorCtx = createContext<Ctx | null>(null);

export function useReproductorConcurso(): Ctx {
  return useContext(ReproductorCtx) ?? { sesion: null, sonando: false, reproducir: () => {}, cerrar: () => {} };
}

interface Widget { bind: (e: string, f: (d?: { relativePosition?: number }) => void) => void; play: () => void; toggle: () => void }
declare global { interface Window { SC?: { Widget: ((el: HTMLIFrameElement) => Widget) & { Events: Record<string, string> } } } }

let apiPromesa: Promise<void> | null = null;
function cargarApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('sin ventana'));
  if (window.SC?.Widget) return Promise.resolve();
  if (!apiPromesa) {
    apiPromesa = new Promise<void>((ok, ko) => {
      const s = document.createElement('script');
      s.src = 'https://w.soundcloud.com/player/api.js';
      s.async = true;
      s.onload = () => ok();
      s.onerror = () => { apiPromesa = null; ko(new Error('api.js')); };
      document.head.appendChild(s);
    });
  }
  return apiPromesa;
}

const urlIframe = (url: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d4af37&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&visual=false`;

export const ALTO_BARRA = 56;

export function ReproductorConcursoProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [sonando, setSonando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<Widget | null>(null);

  const reproducir = useCallback((s: Sesion) => {
    setSesion(prev => (prev?.url === s.url ? prev : s));
  }, []);
  const cerrar = useCallback(() => { setSesion(null); setSonando(false); setProgreso(0); }, []);

  useEffect(() => {
    if (!sesion) return;
    let vivo = true;
    setSonando(true); setProgreso(0);
    cargarApi().then(() => {
      const el = iframeRef.current;
      if (!vivo || !el || !window.SC) return;
      const w = window.SC.Widget(el);
      const E = window.SC.Widget.Events;
      widgetRef.current = w;
      w.bind(E.READY, () => w.play());
      w.bind(E.PLAY, () => setSonando(true));
      w.bind(E.PAUSE, () => setSonando(false));
      w.bind(E.FINISH, () => { setSonando(false); setProgreso(0); });
      w.bind(E.PLAY_PROGRESS, d => setProgreso(Math.round((d?.relativePosition ?? 0) * 1000) / 10));
    }).catch(() => { /* sin API sigue sonando por el auto_play del iframe, sin controles */ });
    return () => { vivo = false; widgetRef.current = null; };
  }, [sesion?.url]); // eslint-disable-line react-hooks/exhaustive-deps

  // Muchos enlaces del sitio son <a href> normales y recargan la página entera,
  // que corta el audio. Mientras suena una sesión, los enlaces internos se
  // convierten en navegación de la propia app (sin recarga). Se respetan los
  // clics con teclas, nueva pestaña, descargas, archivos (.xml, .pdf...) y
  // enlaces externos.
  useEffect(() => {
    if (!sesion) return;
    const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    const alClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      if (a.origin !== window.location.origin) return;
      if (/\.[a-z0-9]{2,5}$/i.test(a.pathname)) return;
      if (a.pathname === window.location.pathname && a.search === window.location.search) return; // ancla en la misma página
      const ruta = (base && a.pathname.startsWith(base) ? a.pathname.slice(base.length) : a.pathname) || '/';
      e.preventDefault();
      navigate(ruta + a.search + a.hash);
    };
    document.addEventListener('click', alClic);
    return () => document.removeEventListener('click', alClic);
  }, [sesion, navigate]);

  // Espacio para que la barra no tape el final de la página (ver index.css).
  useEffect(() => {
    document.documentElement.toggleAttribute('data-reproductor', !!sesion);
    return () => document.documentElement.removeAttribute('data-reproductor');
  }, [sesion]);

  const valor = useMemo(() => ({ sesion, sonando, reproducir, cerrar }), [sesion, sonando, reproducir, cerrar]);

  return (
    <ReproductorCtx.Provider value={valor}>
      {children}
      {sesion && (
        <div role="region" aria-label="Reproductor de la sesión del concurso"
          className="fixed left-0 right-0 z-[60] flex items-center gap-3 px-3"
          style={{
            bottom: 'var(--reproductor-bottom, 0px)', height: ALTO_BARRA, background: '#FFFDF7',
            borderTop: '1px solid rgba(212,175,55,0.45)', boxShadow: '0 -6px 20px rgba(0,0,0,0.08)',
          }}>
          <div aria-hidden className="absolute left-0 top-0 h-[3px]" style={{ width: `${progreso}%`, background: 'linear-gradient(90deg,#D4AF37,#B8941E)', transition: 'width .4s linear' }} />
          <button type="button" onClick={() => widgetRef.current?.toggle()} aria-label={sonando ? 'Pausar' : 'Reproducir'}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#2a1d00' }}>
            {sonando ? <Pause size={18} fill="#2a1d00" /> : <Play size={18} fill="#2a1d00" />}
          </button>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-sm font-black truncate" style={{ color: '#111' }}>{sesion.titulo}</p>
            <p className="text-[0.75rem] truncate" style={{ color: 'rgba(0,0,0,0.55)' }}>Concurso DJ XPEAK Madrid · sigue sonando mientras navegas</p>
          </div>
          <button type="button" onClick={cerrar} aria-label="Cerrar el reproductor"
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ color: '#555' }}>
            <X size={18} />
          </button>
          {/* El iframe va oculto pero montado: si se desmonta, el audio se corta. */}
          <iframe key={sesion.url} ref={iframeRef} title={sesion.titulo} src={urlIframe(sesion.url)} allow="autoplay"
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', border: 0 }} />
        </div>
      )}
    </ReproductorCtx.Provider>
  );
}
