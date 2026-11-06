import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Megaphone, Pin } from 'lucide-react';
import { useComunicados } from '@/hooks/useComunicados';
import ComunicadoInteraccion from '@/components/comunicados/ComunicadoInteraccion';
import {
  CuerpoConMenciones, MetaComunicado, ORO, Portada, StatsComunicado, TituloComunicado,
} from '@/components/comunicados/ComunicadoPartes';
import { type Comunicado, esEnlaceInterno, resumenSinTitulo } from '@/lib/comunicados';

// Página del tablón de comunicados (6 nov 2026): panel grande con todos los
// vigentes y, al pulsar uno, su propia página (como la del concurso), sin
// ventanas emergentes ni desplegables. El detalle vive en ?comunicado=<id>,
// así el botón atrás, un enlace o un aviso de la campana funcionan igual.

const TABLON = '/dashboard?view=comunicados';

export default function ComunicadosView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lista, leidos, inter, setInter, marcarLeido, cargado } = useComunicados(60);
  const id = useMemo(() => new URLSearchParams(location.search).get('comunicado'), [location.search]);
  const abierto = id ? lista.find(c => c.id === id) : undefined;

  useEffect(() => { if (abierto) marcarLeido(abierto); }, [abierto, marcarLeido]);
  useEffect(() => { window.scrollTo?.({ top: 0 }); }, [id]);

  const irA = (url: string) => {
    if (esEnlaceInterno(url)) navigate(url);
    else window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ── Detalle ────────────────────────────────────────────────────────────
  if (id) {
    return (
      <div className={`mx-auto w-full px-1 py-2 sm:px-2 space-y-4 ${abierto && (abierto.video_url || abierto.imagen_url) ? 'max-w-3xl md:max-w-6xl' : 'max-w-3xl'}`}>
        <button onClick={() => navigate(TABLON)} className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: '#8B6A00' }}>
          <ArrowLeft size={16} /> Todos los comunicados
        </button>

        {!cargado && <div className="h-64 rounded-2xl animate-pulse" style={{ background: 'rgba(0,0,0,0.05)' }} />}

        {cargado && !abierto && (
          <div className="rounded-2xl p-8 text-center" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="font-semibold mb-1" style={{ color: '#111827' }}>Este comunicado ya no está disponible.</p>
            <p className="text-sm" style={{ color: '#6b7280' }}>Puede que haya caducado o que no sea para tu categoría.</p>
          </div>
        )}

        {abierto && (
          <article className="rounded-2xl overflow-hidden md:flex md:items-stretch" style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.3)' }}>
            {/* Móvil: imagen arriba y texto debajo. Tablet y ordenador: imagen a la izquierda, texto a la derecha. */}
            {(abierto.video_url || abierto.imagen_url) && (
              <div className="md:w-5/12 md:shrink-0 flex items-start justify-center" style={{ background: abierto.video_url ? '#000' : '#FBF3DD' }}>
                {abierto.video_url ? (
                  <video src={abierto.video_url} controls playsInline poster={abierto.imagen_url ?? undefined} className="w-full max-h-[70vh] md:max-h-[85vh] bg-black" />
                ) : (
                  <img src={abierto.imagen_url!} alt={abierto.titulo} className="w-full max-h-[70vh] md:max-h-[85vh] object-contain" />
                )}
              </div>
            )}
            <div className="p-5 sm:p-7 space-y-4 md:flex-1 md:min-w-0">
              <MetaComunicado c={abierto} />
              <p role="heading" aria-level={1} className="text-2xl font-bold leading-[1.3]" style={{ color: '#111827' }}>{abierto.titulo}</p>
              {abierto.cuerpo.trim() && <CuerpoConMenciones cuerpo={abierto.cuerpo} grande />}
              {abierto.cta_url && (
                <button onClick={() => irA(abierto.cta_url!)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-extrabold" style={{ background: ORO, color: '#1f2937' }}>
                  {abierto.cta_texto || 'Ver más'} <ChevronRight size={15} />
                </button>
              )}
              <div className="pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <ComunicadoInteraccion c={abierto} inter={inter[abierto.id]}
                  onCambio={i => setInter(m => ({ ...m, [abierto.id]: i }))} />
              </div>
            </div>
          </article>
        )}
      </div>
    );
  }

  // ── Tablón ─────────────────────────────────────────────────────────────
  const abrir = (c: Comunicado) => {
    marcarLeido(c);
    if (!c.cuerpo.trim() && !c.video_url && !c.encuesta_opciones?.length && c.cta_url) { irA(c.cta_url); return; }
    navigate(`${TABLON}&comunicado=${c.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-1 py-2 sm:px-2 space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5" style={{ color: '#1f2937' }}>
          <Megaphone size={26} style={{ color: '#8B6A00' }} /> Comunicados
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Las novedades de XPEAK para ti: avisos, ganadores, encuestas y más.</p>
      </div>

      {!cargado && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(n => <div key={n} className="h-72 rounded-2xl animate-pulse" style={{ background: 'rgba(0,0,0,0.05)' }} />)}
        </div>
      )}

      {cargado && !lista.length && (
        <div className="rounded-2xl p-10 text-center" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Megaphone size={28} className="mx-auto mb-3" style={{ color: 'rgba(212,175,55,0.6)' }} />
          <p className="font-semibold" style={{ color: '#111827' }}>No hay comunicados ahora mismo.</p>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Cuando publiquemos algo nuevo lo verás aquí y en la campana.</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((c, idx) => {
          const grande = idx === 0 && lista.length > 1;
          const resumen = resumenSinTitulo(c.cuerpo, c.titulo);
          return (
            <button key={c.id} onClick={() => abrir(c)}
              className={`group text-left rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-lg ${grande ? 'lg:col-span-2' : ''}`}
              style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div className="relative aspect-[16/9] w-full" style={{ background: '#FBF3DD' }}>
                <Portada c={c} />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {!leidos.has(c.id) && (
                    <span className="text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: ORO, color: '#1f2937' }}>Nuevo</span>
                  )}
                  {c.fijado && (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,253,247,0.95)', color: '#6b5200' }}>
                      <Pin size={10} /> Fijado
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col">
                <MetaComunicado c={c} />
                <TituloComunicado className={`${grande ? 'text-xl' : 'text-base'} line-clamp-2 group-hover:underline underline-offset-2`}>{c.titulo}</TituloComunicado>
                {resumen && <p className="text-sm leading-[1.4] line-clamp-3" style={{ color: '#4b5563' }}>{resumen}</p>}
                <div className="flex items-center justify-between gap-3 pt-1 mt-auto">
                  <StatsComunicado c={c} i={inter[c.id]} />
                  <span className="inline-flex items-center gap-0.5 text-sm font-bold ml-auto" style={{ color: '#8B6A00' }}>
                    {(c.encuesta_opciones?.length ?? 0) >= 2 ? 'Leer y votar' : 'Leer'} <ChevronRight size={15} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
