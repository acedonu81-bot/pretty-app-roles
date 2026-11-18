import { useEffect, useMemo, useState } from 'react';
import { Download, LineChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ETIQUETA_FUENTE, csvEstadisticas } from '@/lib/estadisticasPlan';

// 18 nov 2026: estadísticas avanzadas del plan Premium (y de todos antes del
// lanzamiento): visitas día a día, de dónde llegan y exportar. Los datos salen de
// mis_visitas_por_dia / mis_visitas_por_origen, que solo responden a Premium.
// El origen solo existe desde que se registra (columna fuente); lo anterior no lo tiene.

type Dia = { dia: string; visitas: number };
type Origen = { fuente: string; visitas: number };

const fmtDia = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const etiquetaDia = (iso: string) => fmtDia.format(new Date(`${iso}T00:00:00Z`));

const EstadisticasPremium = ({ anio, totales, mensajesMes, conversacionesMes }: {
  anio: number;
  totales: { visitas: number; mensajes: number; solicitudes: number; conversaciones: number };
  mensajesMes: number[];
  conversacionesMes: number[];
}) => {
  const [dias, setDias] = useState<30 | 90>(30);
  const [serie, setSerie] = useState<Dia[]>([]);
  const [origen, setOrigen] = useState<Origen[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    (async () => {
      try {
        const [d, o] = await Promise.all([
          (supabase.rpc as any)('mis_visitas_por_dia', { p_dias: 90 }),
          (supabase.rpc as any)('mis_visitas_por_origen', { p_dias: dias }),
        ]);
        if (!vivo) return;
        setSerie(Array.isArray(d.data) ? (d.data as Dia[]) : []);
        setOrigen(Array.isArray(o.data) ? (o.data as Origen[]) : []);
      } catch { /* sin datos: se enseña vacío */ }
      if (vivo) setCargando(false);
    })();
    return () => { vivo = false; };
  }, [dias]);

  const visibles = useMemo(() => serie.slice(-dias), [serie, dias]);
  const total = visibles.reduce((a, b) => a + b.visitas, 0);
  const maximo = Math.max(...visibles.map(v => v.visitas), 1);
  const mejor = visibles.reduce<Dia | null>((m, v) => (v.visitas > (m?.visitas ?? 0) ? v : m), null);
  const totalOrigen = origen.reduce((a, b) => a + b.visitas, 0);

  const exportar = () => {
    const hoy = new Date();
    const csv = csvEstadisticas({
      generado: hoy.toLocaleDateString('es-ES'),
      anio,
      visitasDia: serie.map(s => ({ dia: s.dia, visitas: s.visitas })),
      origen,
      mensajesMes,
      conversacionesMes,
      totales,
    });
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadisticas-xpeak-${hoy.toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="glass-panel p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <LineChart size={16} style={{ color: '#8A6D0F' }} />
          <h3 className="text-sm font-bold">Estadísticas avanzadas</h3>
          <span className="text-[0.65rem] font-black uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: '#8B6A00' }}>Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)' }} role="group" aria-label="Periodo">
            {([30, 90] as const).map(n => (
              <button key={n} type="button" onClick={() => setDias(n)} aria-pressed={dias === n}
                className="px-3 py-1 text-xs font-bold"
                style={{ background: dias === n ? '#8B6A00' : 'transparent', color: dias === n ? '#fff' : '#6b6454' }}>
                {n} días
              </button>
            ))}
          </div>
          <button type="button" onClick={exportar}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold"
            style={{ border: '1px solid rgba(139,106,0,0.4)', color: '#8B6A00' }}>
            <Download size={13} /> Exportar (Excel/CSV)
          </button>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Visitas día a día</p>
      {cargando ? (
        <p className="text-sm text-muted-foreground py-6">Cargando…</p>
      ) : (
        <>
          <div className="flex items-end gap-[2px] h-28" role="img"
            aria-label={`Visitas a tu ficha en los últimos ${dias} días: ${total} en total`}>
            {visibles.map(v => (
              <div key={v.dia} title={`${etiquetaDia(v.dia)}: ${v.visitas}`} className="flex-1 min-w-[2px] rounded-t-sm"
                style={{ height: `${Math.max((v.visitas / maximo) * 100, v.visitas > 0 ? 6 : 2)}%`, background: v.visitas > 0 ? '#4285F4' : 'rgba(66,133,244,0.15)' }} />
            ))}
          </div>
          <div className="flex justify-between text-[0.7rem] text-muted-foreground mt-1">
            <span>{visibles[0] ? etiquetaDia(visibles[0].dia) : ''}</span>
            <span>{visibles.length ? etiquetaDia(visibles[visibles.length - 1].dia) : ''}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-bold" style={{ color: '#222' }}>{total}</span> {total === 1 ? 'visita' : 'visitas'} en {dias} días
            {mejor && mejor.visitas > 0 && <> · mejor día: {etiquetaDia(mejor.dia)} ({mejor.visitas})</>}
          </p>
        </>
      )}

      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-6 mb-2">De dónde llegan tus visitas</p>
      {origen.length === 0 && !cargando ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hay datos de origen. Se empieza a registrar con las visitas nuevas, así que aparecerán aquí en los próximos días.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {origen.map(o => (
            <div key={o.fuente}>
              <div className="flex justify-between text-sm">
                <span>{ETIQUETA_FUENTE[o.fuente] ?? o.fuente}</span>
                <span className="font-bold">{o.visitas}</span>
              </div>
              <div className="h-1.5 rounded-full mt-1" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${totalOrigen ? (o.visitas / totalOrigen) * 100 : 0}%`, background: '#8A6D0F' }} />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-1">Solo cuentan las visitas desde que se registra el origen.</p>
        </div>
      )}
    </div>
  );
};

export default EstadisticasPremium;
