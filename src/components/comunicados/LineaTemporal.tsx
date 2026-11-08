import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Pin } from 'lucide-react';
import { timeAgo } from '@/lib/timeAgo';
import { type Comunicado, type Interaccion, TIPOS_COMUNICADO, infoTipo, resumenSinTitulo, tipoDe } from '@/lib/comunicados';
import { Portada, StatsComunicado, TituloComunicado, ORO } from './ComunicadoPartes';

// Línea temporal de Novedades (8 nov 2026, ficha XDS aprobada). Una sola pieza
// para la página pública y el panel: fecha con punto a la izquierda, tarjeta a
// la derecha, filtros por tipo con contador. Los "Nuevo" son los no leídos
// (solo si se pasa `leidos`, o sea, con sesión). "Siguiendo" no se guarda en
// esta tabla: el panel pasa su contenido en `siguiendo` y aquí solo se pinta.

export type FiltroNovedades = 'todo' | 'xpeak' | 'noticia' | 'comunidad' | 'siguiendo';

interface Props {
  lista: Comunicado[];
  hrefDe: (c: Comunicado) => string;
  inter?: Record<string, Interaccion | undefined>;
  leidos?: Set<string>;
  filtroInicial?: FiltroNovedades;
  /** Contenido del filtro "Siguiendo" (solo panel). Si no se pasa, el filtro no aparece. */
  siguiendo?: ReactNode;
  siguiendoCount?: number;
  onFiltro?: (f: FiltroNovedades) => void;
}

const fechaDia = (iso: string) => {
  const d = new Date(iso);
  return {
    dia: d.toLocaleDateString('es-ES', { weekday: 'long' }),
    num: d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
  };
};

export default function LineaTemporal({ lista, hrefDe, inter = {}, leidos, filtroInicial = 'todo', siguiendo, siguiendoCount = 0, onFiltro }: Props) {
  const [filtro, setFiltro] = useState<FiltroNovedades>(filtroInicial);

  const cuentas = useMemo(() => {
    const m: Record<string, number> = { todo: lista.length, xpeak: 0, noticia: 0, comunidad: 0 };
    for (const c of lista) m[tipoDe(c)] += 1;
    return m;
  }, [lista]);

  const visibles = filtro === 'todo' ? lista : lista.filter(c => tipoDe(c) === filtro);
  const cambiar = (f: FiltroNovedades) => { setFiltro(f); onFiltro?.(f); };

  const chips: { id: FiltroNovedades; label: string; n: number }[] = [
    { id: 'todo', label: 'Todo', n: cuentas.todo },
    ...TIPOS_COMUNICADO.map(t => ({ id: t.id as FiltroNovedades, label: t.label, n: cuentas[t.id] })),
    ...(siguiendo !== undefined ? [{ id: 'siguiendo' as FiltroNovedades, label: 'Siguiendo', n: siguiendoCount }] : []),
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5 mb-8" role="group" aria-label="Filtrar por tipo">
        {chips.map(ch => {
          const activo = filtro === ch.id;
          return (
            <button key={ch.id} type="button" onClick={() => cambiar(ch.id)} aria-pressed={activo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: activo ? ORO : '#fff', border: `1px solid ${activo ? ORO : 'rgba(212,175,55,0.3)'}`, color: activo ? '#1f2937' : '#222' }}>
              {ch.label}
              <span className="text-[0.8rem] font-medium" style={{ color: activo ? '#1f2937' : '#4b5563' }}>{ch.n}</span>
            </button>
          );
        })}
      </div>

      {filtro === 'siguiendo' ? siguiendo : (
        visibles.length === 0 ? (
          <p className="text-center text-sm py-10" style={{ color: '#4b5563' }}>Todavía no hay novedades de este tipo.</p>
        ) : (
          <div className="lt-linea">
            {visibles.map(c => {
              const tipo = infoTipo(tipoDe(c));
              const { dia, num } = fechaDia(c.created_at);
              const nuevo = !!leidos && !leidos.has(c.id);
              const resumen = resumenSinTitulo(c.cuerpo, c.titulo);
              const conMedia = !!(c.imagen_url || c.video_url);
              return (
                <article key={c.id} className={`lt-item${nuevo ? ' lt-nuevo' : ''}`}>
                  <div className="lt-fecha">
                    <p className="lt-dia">{dia}</p>
                    <p className="lt-num">{num}</p>
                    <p className="lt-rel">{timeAgo(c.created_at)}</p>
                  </div>
                  <Link to={hrefDe(c)} className="lt-tarjeta group">
                    <div className="flex items-center gap-2.5 flex-wrap text-xs font-bold uppercase tracking-wide">
                      <span className="inline-flex items-center gap-1.5" style={{ color: tipo.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: tipo.punto }} />{tipo.label}
                      </span>
                      {nuevo && <span className="lt-badge">Nuevo</span>}
                      {c.fijado && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem]" style={{ background: '#FBF3DD', color: '#8B6A00' }}>
                          <Pin size={10} /> Fijado
                        </span>
                      )}
                    </div>
                    <TituloComunicado className="text-lg line-clamp-2 group-hover:underline underline-offset-2">{c.titulo}</TituloComunicado>
                    {resumen && <p className="text-sm leading-[1.45] line-clamp-3" style={{ color: '#4b5563' }}>{resumen}</p>}
                    {conMedia && (
                      <div className="relative aspect-[16/7] rounded-xl overflow-hidden" style={{ background: '#FBF3DD' }}>
                        <Portada c={c} />
                      </div>
                    )}
                    <StatsComunicado c={c} i={inter[c.id]} />
                  </Link>
                </article>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
