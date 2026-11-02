import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Headphones, ListMusic, Pause, Pin, Play } from 'lucide-react';
import { toast } from 'sonner';
import OndaComentarios from '@/components/OndaComentarios';
import { claveSesion, useReproductorConcurso } from '@/components/concurso/ReproductorConcurso';
import { useSoundcloudWidget } from '@/hooks/useSoundcloudWidget';
import { useSetComentarios } from '@/hooks/useSetComentarios';
import type { OndaSet } from '@/hooks/useSetOndas';
import { parseStreamUrl, resolveSoundcloudShort } from '@/lib/streaming';
import { etiquetaMood, formatTiempo, tituloPorDefecto, type SetFicha } from '@/lib/setFicha';
import { fotoOptimizada } from '@/lib/imagen';
import BotonCamara from '@/components/BotonCamara';
import Medalla from '@/components/Medalla';
import { useContadorEscucha } from '@/hooks/useContadorEscucha';
import { supabase } from '@/integrations/supabase/client';
import { subirImagenArtista } from '@/lib/imagenesArtista';

// Fila de un set en el perfil de DJ, al estilo Hearthis (1 nov 2026): portada,
// botón de play redondo, título, estilo, duración y la onda como barra de
// progreso con los comentarios clavados en su segundo. El primer set va
// "destacado", en tarjeta dorada, como el Stage de Hearthis.
//
// Archivos de XPEAK: suenan con un <audio> propio y la onda es la real.
// SoundCloud: al darle al play se monta su reproductor (mini, visible, para
// respetar su marca) y lo manejamos por postMessage; la barra es lisa porque
// su onda no se puede leer. Mixcloud/hearthis: su reproductor tal cual.

const EVENTO_SUENA = 'xpeak-set-suena';

const SetFilaArtista = ({ url, autor, ficha, numero, destacado, estiloPorDefecto, djUserId, viewerId, onda, onIniciarSesion, onFichaCambiada, escuchas = 0, puesto = null, onEscuchaRegistrada }: {
  url: string;
  autor: string;
  ficha: SetFicha | null;
  numero: number;
  destacado: boolean;
  estiloPorDefecto: string | null;
  djUserId?: string;
  viewerId?: string;
  onda?: OndaSet | null;
  onIniciarSesion: () => void;
  /** Tras cambiar carátula o fondo, para recargar las fichas. */
  onFichaCambiada?: () => void;
  /** Escuchas totales del set (escuchas_sets_dj). */
  escuchas?: number;
  /** Puesto en el podio de los más escuchados (30 días), si lo tiene. */
  puesto?: 1 | 2 | 3 | null;
  onEscuchaRegistrada?: () => void;
}) => {
  const parsed = useMemo(() => parseStreamUrl(url), [url]);
  const [esMovil, setEsMovil] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const cambio = () => setEsMovil(mq.matches);
    mq.addEventListener('change', cambio);
    return () => mq.removeEventListener('change', cambio);
  }, []);
  const esArchivo = !parsed;
  const esSoundcloud = parsed?.type === 'SoundCloud';
  const conPlayPropio = esArchivo || esSoundcloud;

  const titulo = ficha?.titulo || tituloPorDefecto(url, numero);
  const estilo = ficha?.etiquetas[0] ?? estiloPorDefecto;
  const datos = [ficha?.bpm ? `${ficha.bpm} BPM` : null, etiquetaMood(ficha?.mood)].filter(Boolean) as string[];

  const { sesion, reproducir } = useReproductorConcurso();
  const enBarra = !!sesion && (claveSesion(sesion) === url || sesion.url === url);

  // ── Archivo propio ──
  const audioRef = useRef<HTMLAudioElement>(null);
  const [sonandoArchivo, setSonandoArchivo] = useState(false);
  const [t, setT] = useState(0);
  const [dArchivo, setDArchivo] = useState(0);
  const saltoPendiente = useRef<number | null>(null);

  // ── SoundCloud ──
  const [embedSrc, setEmbedSrc] = useState<string | null>(parsed && !parsed.needsResolve ? parsed.embedUrl : null);
  const [scMontado, setScMontado] = useState(false);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const sc = useSoundcloudWidget(esSoundcloud && scMontado ? iframe : null);

  useEffect(() => {
    if (!parsed?.needsResolve || !parsed._soundcloudShort) return;
    resolveSoundcloudShort(parsed._soundcloudShort).then(u => setEmbedSrc(u));
  }, [parsed]);

  const sonando = esArchivo ? sonandoArchivo : sc.sonando;
  const posicion = esArchivo ? t : sc.posicion;
  // 5 minutos de reproducción real = una escucha (fase 3).
  useContadorEscucha(djUserId, url, sonando, posicion, onEscuchaRegistrada);
  const duracion = esArchivo ? (dArchivo || onda?.duracion || 0) : sc.duracion;

  // Solo un set sonando a la vez en la página.
  useEffect(() => {
    const otro = (e: Event) => {
      if ((e as CustomEvent<string>).detail === url) return;
      audioRef.current?.pause();
      if (sc.sonando) sc.pausar();
    };
    window.addEventListener(EVENTO_SUENA, otro);
    return () => window.removeEventListener(EVENTO_SUENA, otro);
  }, [url, sc]);
  useEffect(() => { if (sonando) window.dispatchEvent(new CustomEvent(EVENTO_SUENA, { detail: url })); }, [sonando, url]);

  const alternar = () => {
    if (esArchivo) {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) a.play().catch(() => toast.error('No se pudo reproducir este set.'));
      else a.pause();
      return;
    }
    if (!scMontado) { setScMontado(true); return; }
    sc.alternar();
  };

  const saltar = (segundos: number) => {
    if (esArchivo) {
      const a = audioRef.current;
      if (!a) return;
      if (a.readyState >= 1) a.currentTime = segundos;
      else saltoPendiente.current = segundos;
      setT(segundos);
      a.play().catch(() => {});
      return;
    }
    if (sc.listo) sc.saltar(segundos);
  };

  const anclar = () => {
    if (esArchivo) {
      audioRef.current?.pause();
      reproducir({ url, audioSrc: url, titulo, subtitulo: `${autor} · sigue sonando mientras navegas` });
    } else if (embedSrc) {
      setScMontado(false);
      reproducir({ url, embedSrc, titulo, subtitulo: `${autor} · sigue sonando mientras navegas` });
    }
  };

  const comentable = !!djUserId && conPlayPropio;
  const { comentarios, comentar, borrar, silenciar } = useSetComentarios(comentable ? djUserId : undefined, url);
  const [tracklistAbierta, setTracklistAbierta] = useState(false);
  const tracklist = ficha?.tracklist ?? [];
  const puedeSaltar = esArchivo || sc.listo;

  // El propio DJ cambia carátula y fondo con la cámara, desde su perfil.
  const editable = !!viewerId && viewerId === djUserId;
  const [subiendo, setSubiendo] = useState<'portada' | 'fondo' | null>(null);
  const cambiarImagen = async (tipo: 'portada' | 'fondo', file: File) => {
    if (!djUserId) return;
    setSubiendo(tipo);
    const r = await subirImagenArtista(djUserId, file, tipo);
    if ('error' in r) { setSubiendo(null); toast.error(r.error); return; }
    // Upsert solo con esa columna: PostgREST actualiza las que van en el
    // cuerpo, así que título, tracklist, etc. de la ficha no se tocan.
    const { error } = await supabase.from('dj_set_fichas').upsert(
      tipo === 'portada'
        ? { user_id: djUserId, set_url: url, portada_url: r.url, updated_at: new Date().toISOString() }
        : { user_id: djUserId, set_url: url, fondo_url: r.url, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,set_url' },
    );
    setSubiendo(null);
    if (error) { toast.error('La imagen se subió pero no se pudo guardar. Inténtalo de nuevo.'); return; }
    toast.success(tipo === 'portada' ? 'Carátula actualizada.' : 'Fondo actualizado.');
    onFichaCambiada?.();
  };
  const fondo = destacado ? (ficha?.fondo_url ?? ficha?.portada_url ?? null) : null;
  const fondoEsCaratula = !!fondo && !ficha?.fondo_url;

  const oscuro = destacado;
  const col = oscuro
    ? { titulo: '#fff', sub: 'rgba(255,255,255,0.82)', chipBg: 'rgba(255,255,255,0.18)', chip: '#fff', acento: '#FFF1C1' }
    : { titulo: '#111', sub: '#666', chipBg: 'rgba(37,99,235,0.1)', chip: '#1D4ED8', acento: '#8B6A00' };

  const srcMini = embedSrc
    ? embedSrc.replace('visual=true', 'visual=false').replace('auto_play=false', 'auto_play=true')
    : null;

  return (
    <article className={destacado ? 'rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden' : 'py-5'}
      style={destacado
        ? { background: 'linear-gradient(135deg,#7A5A0E 0%,#A9821F 45%,#C9A23A 100%)', boxShadow: '0 14px 40px rgba(139,106,0,0.28)' }
        : { borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
      {/* Fondo del destacado: el que suba el DJ o, si no, la carátula
          desenfocada (como el Stage de Hearthis), con velo dorado oscuro. */}
      {fondo && (
        <>
          <img src={fotoOptimizada(fondo, 1400)} alt="" aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${fondoEsCaratula ? 'scale-125' : ''}`}
            style={fondoEsCaratula ? { filter: 'blur(28px) saturate(1.2)' } : undefined} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(74,52,8,0.82) 0%, rgba(122,90,14,0.62) 55%, rgba(169,130,31,0.45) 100%)' }} />
        </>
      )}
      {destacado && editable && (
        <BotonCamara etiqueta="Cambiar el fondo de este set" onArchivo={f => cambiarImagen('fondo', f)}
          subiendo={subiendo === 'fondo'} className="bottom-3 right-3" />
      )}
      <div className="relative">
      {esArchivo && (
        <audio ref={audioRef} src={url} preload="none"
          onPlay={() => setSonandoArchivo(true)} onPause={() => setSonandoArchivo(false)} onEnded={() => setSonandoArchivo(false)}
          onLoadedMetadata={e => {
            setDArchivo(e.currentTarget.duration);
            if (saltoPendiente.current !== null) { e.currentTarget.currentTime = saltoPendiente.current; saltoPendiente.current = null; }
          }}
          onTimeUpdate={e => setT(e.currentTarget.currentTime)}
          onError={() => { setSonandoArchivo(false); toast.error('Este set no está disponible ahora mismo.'); }} />
      )}

      <div className="flex gap-4 sm:gap-5">
        <div className="relative flex-shrink-0 self-start">
        {puesto && (
          <div className="absolute -top-3 -left-3 z-20 pointer-events-none drop-shadow-md">
            <Medalla puesto={puesto} tam={destacado ? 56 : 46} />
          </div>
        )}
        {ficha?.portada_url ? (
          <img src={fotoOptimizada(ficha.portada_url, 320)} alt={`Portada de ${titulo}`} loading="lazy"
            className={`${destacado ? 'w-20 h-20 sm:w-40 sm:h-40' : 'w-16 h-16 sm:w-32 sm:h-32'} rounded-xl object-cover flex-shrink-0`}
            style={destacado ? { boxShadow: '0 8px 24px rgba(46,32,6,0.35)' } : undefined} />
        ) : (
          <div className={`${destacado ? 'w-20 h-20 sm:w-40 sm:h-40' : 'w-16 h-16 sm:w-32 sm:h-32'} rounded-xl flex items-center justify-center flex-shrink-0`}
            style={{ background: destacado ? 'rgba(255,255,255,0.16)' : 'linear-gradient(135deg,#E3B54F,#B8941E)' }} aria-hidden="true">
            <ListMusic size={destacado ? 34 : 26} color="#fff" />
          </div>
        )}
        {editable && (
          <BotonCamara etiqueta="Cambiar la carátula de este set" onArchivo={f => cambiarImagen('portada', f)}
            subiendo={subiendo === 'portada'} className="bottom-1.5 right-1.5" />
        )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            {conPlayPropio && !enBarra && (
              <button type="button" onClick={alternar} aria-label={sonando ? `Pausar ${titulo}` : `Escuchar ${titulo}`}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
                style={destacado
                  ? { background: '#fff', color: '#7A5A0E', boxShadow: '0 6px 18px rgba(46,32,6,0.3)' }
                  : { background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 6px 18px rgba(212,175,55,0.35)' }}>
                {sonando ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: 3 }} />}
              </button>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: col.sub }}>{autor}</p>
              <h3 className="text-lg sm:text-2xl font-black leading-tight line-clamp-2 break-words" style={{ color: col.titulo }}>{titulo}</h3>
              {datos.length > 0 && <p className="text-xs font-semibold mt-0.5" style={{ color: oscuro ? col.acento : '#2563EB' }}>{datos.join(' · ')}</p>}
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1.5 flex-shrink-0">
              {estilo && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: col.chipBg, color: col.chip }}>{estilo}</span>
              )}
              {duracion > 0 && (
                <span className="text-xs sm:text-sm tabular-nums font-semibold" style={{ color: col.sub }}>
                  {posicion > 0 ? `${formatTiempo(posicion)} / ` : ''}{formatTiempo(duracion)}
                </span>
              )}
              {escuchas > 0 && (
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm tabular-nums font-semibold" style={{ color: oscuro ? '#fff' : '#2563EB' }}
                  title="Escuchas de 5 minutos o más">
                  <Headphones size={14} /> {escuchas}
                </span>
              )}
            </div>
          </div>

          {/* En escritorio la onda va junto a la portada, como en Hearthis. Se
              pinta una sola vez (no dos ocultas por CSS): con SoundCloud serían
              dos reproductores sonando a la vez. */}
          {!esMovil && renderCuerpo()}
        </div>
      </div>

      {/* En móvil, a todo el ancho bajo la portada. */}
      {esMovil && renderCuerpo()}
      </div>
    </article>
  );

  function renderCuerpo() {
    return (
      <>
        {enBarra ? (
          <p className="mt-4 text-sm font-bold flex items-center gap-2" style={{ color: col.acento }}>
            <Pin size={15} /> Sonando en la barra de abajo
          </p>
        ) : conPlayPropio ? (
          <>
            {esSoundcloud && scMontado && srcMini && (
              <iframe ref={setIframe} src={srcMini} title={`${titulo} en SoundCloud`} allow="autoplay; encrypted-media"
                className="w-full mt-3 rounded-lg" style={{ height: 20, border: 'none' }} />
            )}
            {comentable ? (
              <OndaComentarios
                picos={esArchivo ? onda?.picos : null}
                duracion={duracion}
                posicion={posicion}
                listo={puedeSaltar && duracion > 0}
                puedeComentar={posicion > 0}
                comentarios={comentarios}
                onSaltar={saltar}
                viewerId={viewerId}
                esDuenoSet={!!viewerId && viewerId === djUserId}
                onComentar={(segundo, texto) => viewerId ? comentar(viewerId, segundo, texto) : Promise.resolve('Inicia sesión para comentar.')}
                onBorrar={async id => {
                  if (!window.confirm('¿Borrar este comentario?')) return;
                  if (!(await borrar(id))) toast.error('No se pudo borrar el comentario.');
                }}
                onSilenciar={async autorId => {
                  if (!window.confirm('Esta persona no podrá volver a comentar en ninguno de tus sets y se borrarán sus comentarios. ¿Silenciar?')) return;
                  if (await silenciar(autorId)) toast.success('Silenciado. Ya no podrá comentar tus sets.');
                  else toast.error('No se pudo silenciar. Inténtalo de nuevo.');
                }}
                onIniciarSesion={onIniciarSesion}
                oscuro={oscuro}
                mostrarTiempos={false}
              />
            ) : null}
            {/* SoundCloud aún sin cargar: barra vacía donde irá el progreso. */}
            {esSoundcloud && duracion === 0 && (
              <div className="mt-4 h-1.5 rounded-full" style={{ background: oscuro ? 'rgba(255,255,255,0.3)' : '#E6D9B5' }} aria-hidden="true" />
            )}
          </>
        ) : (
          // Mixcloud / hearthis: su propio reproductor.
          embedSrc && (
            <iframe src={embedSrc} title={titulo} allow="autoplay; encrypted-media" loading="lazy"
              className="w-full mt-3 rounded-lg" style={{ height: 120, border: 'none' }} />
          )
        )}

        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {tracklist.length > 0 && (
            <button type="button" onClick={() => setTracklistAbierta(a => !a)} aria-expanded={tracklistAbierta}
              className="flex items-center gap-1.5 text-xs font-bold" style={{ color: col.acento }}>
              <ListMusic size={13} /> Tracklist ({tracklist.length})
              <ChevronDown size={13} className="transition-transform" style={{ transform: tracklistAbierta ? 'rotate(180deg)' : undefined }} />
            </button>
          )}
          {conPlayPropio && !enBarra && (esArchivo || embedSrc) && (
            <button type="button" onClick={anclar} className="flex items-center gap-1.5 text-xs font-bold" style={{ color: col.acento }}
              title="Seguir escuchando mientras navegas">
              <Pin size={13} /> Escuchar mientras navego
            </button>
          )}
          {estilo && <span className="sm:hidden text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: col.chipBg, color: col.chip }}>{estilo}</span>}
          {duracion > 0 && <span className="sm:hidden text-xs tabular-nums" style={{ color: col.sub }}>{formatTiempo(duracion)}</span>}
          {escuchas > 0 && (
            <span className="sm:hidden inline-flex items-center gap-1 text-xs tabular-nums font-semibold" style={{ color: oscuro ? '#fff' : '#2563EB' }}>
              <Headphones size={12} /> {escuchas}
            </span>
          )}
        </div>

        {tracklistAbierta && (
          <ol className="mt-2 flex flex-col">
            {tracklist.map((tema, i) => {
              const contenido = (
                <>
                  <span className="text-xs font-bold tabular-nums flex-shrink-0" style={{ color: col.acento, minWidth: 44 }}>{formatTiempo(tema.t)}</span>
                  <span className="text-sm min-w-0 truncate" style={{ color: col.titulo }}>
                    <span className="font-semibold">{tema.artista}</span>
                    <span style={{ color: col.sub }}> · {tema.tema}</span>
                  </span>
                </>
              );
              return (
                <li key={`${tema.t}-${i}`} style={{ borderTop: i ? `1px solid ${oscuro ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'}` : undefined }}>
                  {puedeSaltar ? (
                    <button type="button" onClick={() => saltar(tema.t)}
                      className="w-full flex items-center gap-2 py-1.5 text-left rounded-md hover:bg-black/[0.04]"
                      aria-label={`Escuchar desde ${formatTiempo(tema.t)}: ${tema.artista}, ${tema.tema}`}>
                      {contenido}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 py-1.5">{contenido}</div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </>
    );
  }
};

export default SetFilaArtista;
