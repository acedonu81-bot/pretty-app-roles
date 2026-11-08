import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Megaphone } from 'lucide-react';
import { useComunicados } from '@/hooks/useComunicados';
import { type Comunicado, esEnlaceInterno, resumenSinTitulo } from '@/lib/comunicados';
import { MetaComunicado, ORO, Portada, StatsComunicado, TituloComunicado } from './ComunicadoPartes';

// Los componentes compartidos viven en ComunicadoPartes; se reexportan porque
// el editor del admin los importa de aquí.
export { CuerpoConMenciones, Portada } from './ComunicadoPartes';

// Carrusel "Comunicados XPEAK" de Inicio (6 nov 2026). Es solo el escaparate:
// pulsar una tarjeta lleva a la página del tablón (vista 'comunicados'), no
// abre ventanas. Si no hay nada vigente no se muestra nada (un tablón vacío
// parece abandonado).

export const RUTA_TABLON = '/dashboard?view=comunicados';

export default function ComunicadosCarrusel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lista, leidos, inter, marcarLeido } = useComunicados(20);
  const pista = useRef<HTMLDivElement>(null);

  // Enlaces viejos (avisos de la campana ya enviados): /dashboard?view=explorar&comunicado=<id>
  // Solo si la URL NO es ya la del tablón: al pulsar Inicio desde un comunicado el carrusel se
  // monta un instante con ?view=comunicados&comunicado=... aún en la URL y te devolvía al
  // comunicado (6 nov 2026, "Inicio no hace nada").
  const idUrl = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get('view') === 'comunicados' ? null : p.get('comunicado');
  }, [location.search]);
  useEffect(() => {
    if (idUrl) navigate(`${RUTA_TABLON}&comunicado=${idUrl}`, { replace: true });
  }, [idUrl, navigate]);

  const abrir = useCallback((c: Comunicado) => {
    marcarLeido(c);
    // Banner: solo imagen y botón, sin texto. Se va directo al enlace.
    if (!c.cuerpo.trim() && !c.video_url && !c.encuesta_opciones?.length && c.cta_url) {
      if (esEnlaceInterno(c.cta_url)) navigate(c.cta_url);
      else window.open(c.cta_url, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(`${RUTA_TABLON}&comunicado=${c.id}`);
  }, [marcarLeido, navigate]);

  if (!lista.length) return null;

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const Nuevo = ({ c }: { c: Comunicado }) => (leidos.has(c.id) ? null : (
    <span className="lt-tag-nuevo absolute top-2.5 left-2.5 text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
      style={{ background: ORO, color: '#1f2937' }}>Nuevo</span>
  ));

  return (
    <section className="px-3 md:px-6 pt-4" aria-label="Novedades">
      <div className="mx-auto w-full max-w-6xl sm:px-4">
        <div className="flex items-center justify-between mb-2.5">
          <p role="heading" aria-level={2} className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wider" style={{ color: '#8B6A00' }}>
            <Megaphone size={14} /> Novedades
          </p>
          <div className="flex items-center gap-3">
            <Link to={RUTA_TABLON} className="inline-flex items-center gap-0.5 text-xs font-bold" style={{ color: '#8B6A00' }}>
              Ver todos <ChevronRight size={13} />
            </Link>
            {lista.length > 1 && (
              <div className="hidden md:flex gap-1.5">
                {[-1, 1].map(d => (
                  <button key={d} onClick={() => mover(d as 1 | -1)} aria-label={d < 0 ? 'Anteriores' : 'Siguientes'}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
                    style={{ border: '1px solid rgba(0,0,0,0.12)', background: '#fff' }}>
                    {d < 0 ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {lista.length === 1 ? (
          // Uno solo: fila compacta con la imagen en un recuadro pequeño.
          (() => {
            const c = lista[0];
            const resumen = resumenSinTitulo(c.cuerpo, c.titulo);
            return (
              <button onClick={() => abrir(c)} className="group w-full max-w-2xl text-left rounded-xl p-2.5 flex gap-3 items-center transition-shadow hover:shadow-md"
                style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.3)' }}>
                <div className="relative shrink-0 w-24 sm:w-32 aspect-[3/2] rounded-lg overflow-hidden" style={{ background: '#FBF3DD' }}>
                  <Portada c={c} />
                  {!leidos.has(c.id) && <span className="lt-tag-nuevo absolute top-1 left-1 w-2.5 h-2.5 rounded-full" style={{ background: ORO, boxShadow: '0 0 0 2px #fff' }} aria-label="Nuevo" />}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <MetaComunicado c={c} />
                  <TituloComunicado className="text-base line-clamp-2 group-hover:underline underline-offset-2">{c.titulo}</TituloComunicado>
                  {resumen && <p className="text-[0.8rem] leading-[1.35] line-clamp-2" style={{ color: '#4b5563' }}>{resumen}</p>}
                  <div className="flex items-center gap-3">
                    <StatsComunicado c={c} i={inter[c.id]} />
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold" style={{ color: '#8B6A00' }}>
                      {(c.encuesta_opciones?.length ?? 0) >= 2 ? 'Leer y votar' : 'Leer y comentar'} <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })()
        ) : (
          <div ref={pista} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
            {lista.map(c => (
              <button key={c.id} onClick={() => abrir(c)} className="group snap-start shrink-0 text-left w-[190px] sm:w-[210px] space-y-1">
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.25)', background: '#FBF3DD' }}>
                  <Portada c={c} />
                  <Nuevo c={c} />
                </div>
                <MetaComunicado c={c} />
                <TituloComunicado className="text-sm line-clamp-2 group-hover:underline underline-offset-2">{c.titulo}</TituloComunicado>
                <StatsComunicado c={c} i={inter[c.id]} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
