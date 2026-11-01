import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, MessageCircle, Trash2, VolumeX } from 'lucide-react';
import { formatTiempo } from '@/lib/setFicha';
import type { ComentarioSet } from '@/hooks/useSetComentarios';

const MAX_TEXTO = 280;
// Segundos que un comentario se queda "flotando" sobre la onda al pasar por él.
const SEGUNDOS_BURBUJA = 6;

interface Props {
  /** Picos 0-100 de la onda real (archivos de XPEAK). Sin ellos, barra fina. */
  picos?: number[] | null;
  duracion: number;
  posicion: number;
  /** El reproductor está cargado y se puede saltar / comentar en un segundo. */
  listo: boolean;
  /** Se puede escribir un comentario en el segundo actual (el audio ya ha arrancado). Por defecto, `listo`. */
  puedeComentar?: boolean;
  comentarios: ComentarioSet[];
  onSaltar: (segundo: number) => void;
  viewerId?: string;
  esDuenoSet: boolean;
  onComentar: (segundo: number, texto: string) => Promise<string | null>;
  onBorrar: (id: string) => void;
  onSilenciar: (autorId: string) => void;
  onIniciarSesion: () => void;
}

// Una barra cada ~3 px como mínimo: con 300 barras de 1 px en un móvil el
// dorado se mezclaba con el hueco y la parte escuchada se veía gris oscura.
const reducirPicos = (picos: number[], max: number) => {
  if (picos.length <= max) return picos;
  const paso = picos.length / max;
  return Array.from({ length: max }, (_, i) => {
    const ini = Math.floor(i * paso);
    const fin = Math.max(ini + 1, Math.floor((i + 1) * paso));
    return Math.max(...picos.slice(ini, fin));
  });
};

const Inicial = ({ c, tam }: { c: ComentarioSet; tam: number }) => c.autor.foto ? (
  <img src={c.autor.foto} alt="" aria-hidden="true" className="rounded-full object-cover flex-shrink-0"
    style={{ width: tam, height: tam, border: '1.5px solid #fff' }} />
) : (
  <span className="rounded-full flex items-center justify-center flex-shrink-0 font-black"
    style={{ width: tam, height: tam, fontSize: tam * 0.45, background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#fff', border: '1.5px solid #fff' }}
    aria-hidden="true">
    {c.autor.nombre.charAt(0).toUpperCase()}
  </span>
);

// Onda del set con los comentarios clavados en su segundo (perfil de DJ tipo
// Hearthis, fase 2, 1 nov 2026). Al pasar por un comentario mientras suena,
// se queda unos segundos flotando encima, como en SoundCloud.
const OndaComentarios = ({
  picos, duracion, posicion, listo, puedeComentar = listo, comentarios, onSaltar, viewerId, esDuenoSet,
  onComentar, onBorrar, onSilenciar, onIniciarSesion,
}: Props) => {
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listaAbierta, setListaAbierta] = useState(false);
  const [marcado, setMarcado] = useState<string | null>(null);
  const pistaRef = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const el = pistaRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setAncho(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [duracion]);
  const barras = useMemo(
    () => (picos?.length && ancho ? reducirPicos(picos, Math.max(40, Math.floor(ancho / 3))) : picos ?? []),
    [picos, ancho],
  );

  const dur = duracion > 0 ? duracion : 0;
  const progreso = dur ? Math.min(1, posicion / dur) : 0;
  const enPista = comentarios.filter(c => dur && c.segundo <= dur);
  const burbuja = useMemo(() => {
    if (marcado) return enPista.find(c => c.id === marcado) ?? null;
    if (!listo) return null;
    const pasados = enPista.filter(c => posicion >= c.segundo && posicion - c.segundo < SEGUNDOS_BURBUJA);
    return pasados[pasados.length - 1] ?? null;
  }, [enPista, posicion, listo, marcado]);

  const clicPista = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dur || !listo) return;
    const r = e.currentTarget.getBoundingClientRect();
    onSaltar(Math.max(0, Math.min(dur, ((e.clientX - r.left) / r.width) * dur)));
  };

  const enviar = async () => {
    if (!viewerId || !texto.trim() || enviando) return;
    setEnviando(true);
    setError(null);
    const err = await onComentar(posicion, texto);
    setEnviando(false);
    if (err) { setError(err); return; }
    setTexto('');
    setListaAbierta(true);
  };

  const conPista = dur > 0;

  return (
    <div className="mt-3">
      {conPista && (
        <div className={`relative ${enPista.length ? 'pt-9' : 'pt-2'}`} onMouseLeave={() => setMarcado(null)}>
          {burbuja && (
            <div className="absolute top-0 z-10 max-w-[80%] flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs shadow-sm pointer-events-none"
              style={{
                left: `${Math.min(100, (burbuja.segundo / dur) * 100)}%`,
                transform: `translateX(-${Math.min(100, (burbuja.segundo / dur) * 100)}%)`,
                background: '#fff', border: '1px solid rgba(212,175,55,0.6)', color: '#222',
              }}>
              <Inicial c={burbuja} tam={16} />
              <span className="truncate"><b>{burbuja.autor.nombre}</b> {burbuja.texto}</span>
            </div>
          )}

          <div ref={pistaRef} role="slider" tabIndex={listo ? 0 : -1} aria-label="Posición del set"
            aria-valuemin={0} aria-valuemax={Math.round(dur)} aria-valuenow={Math.round(posicion)} aria-valuetext={formatTiempo(posicion)}
            onClick={clicPista}
            onKeyDown={e => {
              if (!listo) return;
              if (e.key === 'ArrowRight') onSaltar(Math.min(dur, posicion + 10));
              if (e.key === 'ArrowLeft') onSaltar(Math.max(0, posicion - 10));
            }}
            className={`relative ${listo ? 'cursor-pointer' : ''}`}
            style={{ height: barras.length ? 48 : 6 }}>
            {barras.length ? (
              <div className="absolute inset-0 flex items-center gap-px" aria-hidden="true">
                {barras.map((p, i) => (
                  <span key={i} className="flex-1 rounded-full"
                    style={{ height: `${p}%`, minWidth: 1, background: (i + 0.5) / barras.length <= progreso ? '#C8962E' : '#EADFC2' }} />
                ))}
              </div>
            ) : (
              <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: '#EADFC2' }} aria-hidden="true">
                <div className="h-full" style={{ width: `${progreso * 100}%`, background: '#C8962E' }} />
              </div>
            )}
          </div>

          {/* Marcadores: la cara de quien comentó, clavada en su segundo. */}
          <div className="relative h-5 mt-1">
            {enPista.map(c => (
              <button key={c.id} type="button"
                onClick={() => { if (listo) onSaltar(c.segundo); setMarcado(m => m === c.id ? null : c.id); }}
                onMouseEnter={() => setMarcado(c.id)}
                aria-label={`${c.autor.nombre} en el ${formatTiempo(c.segundo)}: ${c.texto}`}
                className="absolute top-0 -translate-x-1/2 hover:scale-125 transition-transform"
                style={{ left: `${(c.segundo / dur) * 100}%` }}>
                <Inicial c={c} tam={18} />
              </button>
            ))}
          </div>

          <div className="flex justify-between text-[0.6875rem] tabular-nums font-semibold" style={{ color: '#8B6A00' }}>
            <span>{formatTiempo(posicion)}</span>
            <span>{formatTiempo(dur)}</span>
          </div>
        </div>
      )}

      {/* Escribir */}
      {!esDuenoSet && (
        viewerId ? (
          <div className="mt-2">
            <div className="flex gap-2">
              <input value={texto} onChange={e => setTexto(e.target.value.slice(0, MAX_TEXTO))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); enviar(); } }}
                disabled={!puedeComentar}
                placeholder={puedeComentar ? `Comenta en el ${formatTiempo(posicion)}…` : 'Dale al play para comentar en el momento exacto'}
                aria-label="Escribe un comentario en este momento del set"
                className="flex-1 min-w-0 text-base sm:text-sm px-3 py-2 rounded-full disabled:opacity-60"
                style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.35)', color: '#222' }} />
              <button type="button" onClick={enviar} disabled={!puedeComentar || !texto.trim() || enviando}
                className="px-4 py-2 rounded-full text-sm font-black disabled:opacity-40 flex-shrink-0"
                style={{ background: '#D4AF37', color: '#000' }}>
                {enviando ? '…' : 'Comentar'}
              </button>
            </div>
            {error && <p className="text-xs mt-1" style={{ color: '#B45309' }}>{error}</p>}
          </div>
        ) : (
          <button type="button" onClick={onIniciarSesion} className="mt-2 text-xs font-bold flex items-center gap-1.5" style={{ color: '#8B6A00' }}>
            <MessageCircle size={13} /> Inicia sesión para comentar en el minuto exacto
          </button>
        )
      )}

      {/* Lista */}
      {comentarios.length > 0 && (
        <div className="mt-3">
          <button type="button" onClick={() => setListaAbierta(a => !a)} aria-expanded={listaAbierta}
            className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#8B6A00' }}>
            <MessageCircle size={13} />
            {comentarios.length} {comentarios.length === 1 ? 'comentario' : 'comentarios'}
            <ChevronDown size={13} className="transition-transform" style={{ transform: listaAbierta ? 'rotate(180deg)' : undefined }} />
          </button>
          {listaAbierta && (
            <ul className="mt-2 flex flex-col gap-2">
              {comentarios.map(c => (
                <li key={c.id} className="flex items-start gap-2">
                  <Inicial c={c} tam={26} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs" style={{ color: '#666' }}>
                      {c.autor.enlace
                        ? <a href={c.autor.enlace} className="font-bold hover:underline" style={{ color: '#222' }}>{c.autor.nombre}</a>
                        : <span className="font-bold" style={{ color: '#222' }}>{c.autor.nombre}</span>}
                      {' en el '}
                      <button type="button" onClick={() => listo && onSaltar(c.segundo)} disabled={!listo}
                        className="font-bold tabular-nums" style={{ color: '#8B6A00' }}>
                        {formatTiempo(c.segundo)}
                      </button>
                    </p>
                    <p className="text-sm break-words" style={{ color: '#222' }}>{c.texto}</p>
                  </div>
                  {(c.autor_id === viewerId || esDuenoSet) && (
                    <button type="button" onClick={() => onBorrar(c.id)} aria-label="Borrar comentario" title="Borrar"
                      className="p-1 flex-shrink-0" style={{ color: '#999' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                  {esDuenoSet && c.autor_id !== viewerId && (
                    <button type="button" onClick={() => onSilenciar(c.autor_id)} aria-label="Silenciar a esta persona en todos tus sets"
                      title="Silenciar en todos tus sets" className="p-1 flex-shrink-0" style={{ color: '#999' }}>
                      <VolumeX size={14} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default OndaComentarios;
