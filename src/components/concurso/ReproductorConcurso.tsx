import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSoundcloudWidget } from '@/hooks/useSoundcloudWidget';
import { useMixcloudWidget } from '@/hooks/useMixcloudWidget';
import { useHearthisWidget } from '@/hooks/useHearthisWidget';
import { useContadorEscucha } from '@/hooks/useContadorEscucha';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Pause, Play, X } from 'lucide-react';

// Reproductor de las sesiones del Concurso DJ que NO se corta al navegar
// (17 oct 2026, petición del usuario: "seguir escuchando la sesión mientras
// navegas por la web"). Vive por encima de las rutas (App.tsx), así que el
// iframe de SoundCloud no se desmonta al cambiar de página. Una sola sesión a
// la vez; elegir otra sustituye a la anterior. El iframe solo se crea al pulsar
// "Escuchar" (gesto del usuario): antes de eso no se carga nada de SoundCloud ni
// sus cookies. El reproductor de SoundCloud/Mixcloud/HearThis queda VISIBLE en la
// barra con sus propios controles: la primera versión lo escondía en 1x1 px y
// usaba la Widget API, y en producción no sonaba (la CSP bloquea su script y el
// widget falla al dibujar en un iframe de 1 px). Los archivos de audio subidos a
// XPEAK sí tienen barra compacta propia con <audio>.
// url = página de SoundCloud (concurso) o, con embedSrc, el iframe ya resuelto de
// cualquier plataforma (sesiones de perfiles: SoundCloud, Mixcloud, HearThis).
// audioSrc = archivo de audio directo (sesiones subidas a XPEAK): suena con un <audio> propio.
// escucha = de quién es el set (perfil de DJ). Con él, la barra también cuenta
// escuchas de 5 minutos (10 nov 2026: antes solo contaban en la ficha del set).
export type Sesion = { url: string; titulo: string; subtitulo?: string; embedSrc?: string; audioSrc?: string; alto?: number; escucha?: { djUserId: string; setUrl: string } };
export const claveSesion = (s: Sesion) => s.audioSrc ?? s.embedSrc ?? s.url;
interface Ctx { sesion: Sesion | null; sonando: boolean; reproducir: (s: Sesion) => void; cerrar: () => void }

const ReproductorCtx = createContext<Ctx | null>(null);

export function useReproductorConcurso(): Ctx {
  return useContext(ReproductorCtx) ?? { sesion: null, sonando: false, reproducir: () => {}, cerrar: () => {} };
}

const urlIframe = (url: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d4af37&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&show_artwork=false&visual=false`;

export const ALTO_BARRA = 56;
const CABECERA = 30;

const srcSesion = (s: Sesion) => {
  if (!s.embedSrc) return urlIframe(s.url);
  let src = s.embedSrc.replace('auto_play=false', 'auto_play=true');
  // Las sesiones de perfil traen visual=true (portada grande): en la barra de 166 px
  // se ve enorme y recortada. Aquí siempre el reproductor clásico, con la onda.
  if (/w\.soundcloud\.com\/player/.test(src)) src = src.replace('visual=true', 'visual=false') + (/show_artwork=/.test(src) ? '' : '&show_artwork=false');
  if (/w\.soundcloud\.com\/player/.test(src) && !/auto_play=/.test(src)) src += `${src.includes('?') ? '&' : '?'}auto_play=true`;
  // Mixcloud y HearThis arrancan solos con autoplay=1 (hay gesto del usuario).
  if (/mixcloud\.com|hearthis\.at/.test(src) && !/autoplay=/.test(src)) src += `${src.includes('?') ? '&' : '?'}autoplay=1`;
  return src;
};

export function ReproductorConcursoProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [sonando, setSonando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [minimizado, setMinimizado] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Escuchas desde la barra (10 nov 2026) ──
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [posAudio, setPosAudio] = useState(0);
  const src = sesion && !sesion.audioSrc ? srcSesion(sesion) : '';
  const contar = !!sesion?.escucha;
  const sc = useSoundcloudWidget(contar && /w\.soundcloud\.com/.test(src) ? iframe : null);
  const mx = useMixcloudWidget(contar && /mixcloud\.com/.test(src) ? iframe : null);
  const ht = useHearthisWidget(contar && /hearthis\.at/.test(src) ? iframe : null);
  const externo = /w\.soundcloud\.com/.test(src) ? sc : /mixcloud\.com/.test(src) ? mx : /hearthis\.at/.test(src) ? ht : null;
  useContadorEscucha(
    sesion?.escucha?.djUserId,
    sesion?.escucha?.setUrl ?? '',
    sesion?.audioSrc ? sonando : !!externo?.sonando,
    sesion?.audioSrc ? posAudio : (externo?.posicion ?? 0),
  );

  const reproducir = useCallback((s: Sesion) => {
    setSesion(prev => (prev && claveSesion(prev) === claveSesion(s) ? prev : s));
  }, []);
  const cerrar = useCallback(() => { setSesion(null); setSonando(false); setProgreso(0); }, []);

  useEffect(() => {
    setSonando(!!sesion); setProgreso(0); setMinimizado(false);
  }, [sesion && claveSesion(sesion)]); // eslint-disable-line react-hooks/exhaustive-deps

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
  // El widget clásico de SoundCloud necesita 166 px: con el tope antiguo de 120
  // salía recortado en el móvil (24 oct 2026), con el pie "Privacy policy"
  // asomando y la onda partida.
  const compacta = !sesion || !!sesion.audioSrc;
  const altoIframe = sesion?.alto ?? (/soundcloud\.com/.test(sesion?.embedSrc ?? sesion?.url ?? '') ? 166 : 120);
  const altoBarra = compacta ? ALTO_BARRA : minimizado ? CABECERA : CABECERA + Math.min(altoIframe, 166);
  useEffect(() => {
    const el = document.documentElement;
    el.toggleAttribute('data-reproductor', !!sesion);
    if (sesion) el.style.setProperty('--reproductor-h', `${altoBarra}px`); else el.style.removeProperty('--reproductor-h');
    return () => { el.removeAttribute('data-reproductor'); el.style.removeProperty('--reproductor-h'); };
  }, [sesion, altoBarra]);

  const alternar = () => {
    const a = audioRef.current;
    if (a) { if (a.paused) void a.play(); else a.pause(); }
  };

  const valor = useMemo(() => ({ sesion, sonando, reproducir, cerrar }), [sesion, sonando, reproducir, cerrar]);

  return (
    <ReproductorCtx.Provider value={valor}>
      {children}
      {sesion && compacta && (
        <div role="region" aria-label="Reproductor de sesiones"
          className="fixed left-0 right-0 z-[60] flex items-center gap-3 px-3"
          style={{
            bottom: 'var(--reproductor-bottom, 0px)', height: ALTO_BARRA, background: '#FFFDF7',
            borderTop: '1px solid rgba(212,175,55,0.45)', boxShadow: '0 -6px 20px rgba(0,0,0,0.08)',
          }}>
          <div aria-hidden className="absolute left-0 top-0 h-[3px]" style={{ width: `${progreso}%`, background: 'linear-gradient(90deg,#D4AF37,#B8941E)', transition: 'width .4s linear' }} />
          <button type="button" onClick={alternar} aria-label={sonando ? 'Pausar' : 'Reproducir'}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#2a1d00' }}>
            {sonando ? <Pause size={18} fill="#2a1d00" /> : <Play size={18} fill="#2a1d00" />}
          </button>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-sm font-black truncate" style={{ color: '#111' }}>{sesion.titulo}</p>
            <p className="text-[0.75rem] truncate" style={{ color: 'rgba(0,0,0,0.55)' }}>{sesion.subtitulo ?? 'Concurso DJ XPEAK Madrid · sigue sonando mientras navegas'}</p>
          </div>
          <button type="button" onClick={cerrar} aria-label="Cerrar el reproductor"
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ color: '#555' }}>
            <X size={18} />
          </button>
          <audio key={sesion.audioSrc} ref={audioRef} src={sesion.audioSrc} autoPlay preload="metadata"
            onPlay={() => setSonando(true)} onPause={() => setSonando(false)}
            onTimeUpdate={e => { setPosAudio(e.currentTarget.currentTime); setProgreso(e.currentTarget.duration ? Math.round((e.currentTarget.currentTime / e.currentTarget.duration) * 1000) / 10 : 0); }}
            onEnded={() => { setSonando(false); setProgreso(0); }} />
        </div>
      )}
      {sesion && !compacta && (
        // Reproductor del propio SoundCloud/Mixcloud/HearThis a la vista en la barra
        // (play/pausa y progreso suyos); sigue montado al navegar.
        <div role="region" aria-label="Reproductor de sesiones"
          className="fixed left-0 right-0 z-[60]"
          style={{ bottom: 'var(--reproductor-bottom, 0px)', height: altoBarra, background: '#FFFDF7', borderTop: '1px solid rgba(212,175,55,0.45)', boxShadow: '0 -6px 20px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-2 px-3" style={{ height: CABECERA }}>
            <p className="min-w-0 flex-1 text-xs font-black truncate" style={{ color: '#111' }}>
              {sesion.titulo} <span className="hidden min-[440px]:inline" style={{ color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>· {sesion.subtitulo ?? 'sigue sonando mientras navegas'}</span>
            </p>
            <button type="button" onClick={() => setMinimizado(m => !m)} aria-label={minimizado ? 'Mostrar el reproductor' : 'Minimizar el reproductor'}
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ color: '#555' }}>
              {minimizado ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button type="button" onClick={cerrar} aria-label="Cerrar el reproductor"
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ color: '#555' }}>
              <X size={16} />
            </button>
          </div>
          <iframe ref={setIframe} key={claveSesion(sesion)} title={sesion.titulo} src={srcSesion(sesion)} allow="autoplay; encrypted-media"
            width="100%" height={Math.min(altoIframe, 166)}
            // Minimizado: se saca de pantalla SIN desmontarlo ni ocultarlo (display:none o 1 px
            // cortan el audio / el widget no dibuja), así sigue sonando.
            style={minimizado ? { border: 0, position: 'fixed', left: -10000, bottom: 0, width: '100vw' } : { border: 0, display: 'block' }} />
        </div>
      )}
    </ReproductorCtx.Provider>
  );
}
