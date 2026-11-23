// Pestaña "Cobros" del panel admin (23 nov 2026): resumen del mes, suscripciones
// y movimientos de Stripe (cobros, devoluciones, rechazados y disputas), con el
// perfil de XPEAK de cada cliente. Datos de la función admin-cobros (solo admin).
import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Tipo = 'cobro' | 'devolucion' | 'fallido' | 'disputa';
interface Persona { user_id: string; nombre: string | null; email: string | null }
interface Movimiento { id: string; fecha: string; tipo: Tipo; importe: number; concepto: string; persona: Persona | null; enlace: string }
interface Suscripcion { user_id: string; plan: string | null; ciclo: string | null; estado: string | null; periodo_fin: string | null; cancela_al_final: boolean; updated_at: string; persona: Persona | null }
export interface DatosCobros {
  resumen: {
    mes: string; cobrado: number; devuelto: number; neto: number; cobros: number; fallidos: number; disputas: number;
    ingresoMensual: number;
    activas: { starter_mensual: number; starter_anual: number; business_mensual: number; business_anual: number };
    conBaja: number; impagadas: number; fundadores: number; lanzamiento: string | null;
  };
  suscripciones: Suscripcion[];
  movimientos: Movimiento[];
}

export const eur = (cent: number) => (cent / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
const fecha = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '-');
const hora = (iso: string) => new Date(iso).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });

const PLAN: Record<string, string> = { starter: 'Profesional', business: 'Premium' };
const ESTADO: Record<string, { txt: string; color: string }> = {
  active: { txt: 'Activa', color: '#059669' },
  past_due: { txt: 'Impagada', color: '#B45309' },
  unpaid: { txt: 'Impagada', color: '#B45309' },
  canceled: { txt: 'Cancelada', color: '#6b7280' },
  incomplete: { txt: 'Sin completar', color: '#6b7280' },
  incomplete_expired: { txt: 'Caducada', color: '#6b7280' },
};
const TIPO: Record<Tipo, { txt: string; color: string; fondo: string }> = {
  cobro: { txt: 'Cobro', color: '#047857', fondo: 'rgba(5,150,105,.1)' },
  devolucion: { txt: 'Devolución', color: '#1d4ed8', fondo: 'rgba(37,99,235,.1)' },
  fallido: { txt: 'Rechazado', color: '#B45309', fondo: 'rgba(217,119,6,.12)' },
  disputa: { txt: 'Disputa', color: '#B91C1C', fondo: 'rgba(220,38,38,.1)' },
};

const quien = (p: Persona | null) => p?.nombre ?? p?.email ?? 'Cliente sin cuenta en XPEAK';

// Lee los datos de la función. Lo usan esta pestaña y el resumen de "General".
export async function leerCobros(): Promise<DatosCobros> {
  const { data, error } = await supabase.functions.invoke('admin-cobros', { method: 'GET' });
  if (error || !data || (data as any).error) throw new Error((data as any)?.error ?? error?.message ?? 'sin datos');
  return data as DatosCobros;
}

const Cifra = ({ titulo, valor, nota, color = '#111' }: { titulo: string; valor: string | number; nota?: string; color?: string }) => (
  <div className="glass-panel p-4">
    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{titulo}</p>
    <p className="text-2xl font-black mt-1" style={{ color }}>{valor}</p>
    {nota && <p className="text-xs text-muted-foreground mt-0.5">{nota}</p>}
  </div>
);

const FILTROS: { id: 'todos' | Tipo; txt: string }[] = [
  { id: 'todos', txt: 'Todos' }, { id: 'cobro', txt: 'Cobros' }, { id: 'devolucion', txt: 'Devoluciones' },
  { id: 'fallido', txt: 'Rechazados' }, { id: 'disputa', txt: 'Disputas' },
];

const AdminCobros = ({ cargar = leerCobros }: { cargar?: () => Promise<DatosCobros> }) => {
  const [datos, setDatos] = useState<DatosCobros | null>(null);
  const [fallo, setFallo] = useState(false);
  const [filtro, setFiltro] = useState<'todos' | Tipo>('todos');
  const [verCanceladas, setVerCanceladas] = useState(false);

  const recargar = () => { setFallo(false); setDatos(null); cargar().then(setDatos).catch(() => setFallo(true)); };
  useEffect(recargar, [cargar]);

  if (fallo) return (
    <div className="glass-panel p-6 text-sm">
      No se han podido leer los cobros de Stripe. <button type="button" onClick={recargar} className="underline font-bold">Reintentar</button>
    </div>
  );
  if (!datos) return <div className="glass-panel p-6 text-sm text-muted-foreground">Cargando cobros…</div>;

  const r = datos.resumen;
  const a = r.activas;
  const totalActivas = a.starter_mensual + a.starter_anual + a.business_mensual + a.business_anual;
  const subs = datos.suscripciones.filter(s => verCanceladas || (s.estado !== 'canceled' && s.estado !== 'incomplete_expired'));
  const movs = datos.movimientos.filter(m => filtro === 'todos' || m.tipo === filtro);
  const nombreMes = new Date(`${r.mes}-15`).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-black">Cobros</h2>
          <p className="text-xs text-muted-foreground">
            {r.lanzamiento ? `Lanzamiento: ${fecha(r.lanzamiento)}` : 'Lanzamiento sin marcar'} · {r.fundadores} fundadores con Profesional sin pagar
          </p>
        </div>
        <button type="button" onClick={recargar} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.4)', color: '#8A6D0F' }}>
          <RefreshCw size={13} /> Actualizar
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Cifra titulo="Ingreso mensual recurrente" valor={eur(r.ingresoMensual)} nota="Suscripciones vivas, anual entre 12, sin cupones" color="#8A6D0F" />
        <Cifra titulo={`Neto de ${nombreMes}`} valor={eur(r.neto)} nota={`${eur(r.cobrado)} cobrado · ${eur(r.devuelto)} devuelto`} />
        <Cifra titulo="Suscripciones activas" valor={totalActivas}
          nota={`Profesional ${a.starter_mensual} mes + ${a.starter_anual} año · Premium ${a.business_mensual} mes + ${a.business_anual} año`} />
        <Cifra titulo="A vigilar" valor={r.fallidos + r.impagadas + r.disputas + r.conBaja}
          color={r.disputas || r.impagadas ? '#B45309' : '#111'}
          nota={`${r.fallidos} rechazados este mes · ${r.impagadas} impagadas · ${r.disputas} disputas · ${r.conBaja} con baja pedida`} />
      </div>

      <section className="glass-panel p-5">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <h3 className="text-sm font-bold">Suscripciones</h3>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={verCanceladas} onChange={e => setVerCanceladas(e.target.checked)} /> Ver también canceladas
          </label>
        </div>
        {subs.length === 0 ? <p className="text-sm text-muted-foreground">Nadie paga un plan todavía.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3">Profesional</th><th className="py-2 pr-3">Plan</th><th className="py-2 pr-3">Estado</th><th className="py-2">Renueva o termina</th>
              </tr></thead>
              <tbody>
                {subs.map(s => {
                  const e = ESTADO[s.estado ?? ''] ?? { txt: s.estado ?? '-', color: '#6b7280' };
                  return (
                    <tr key={s.user_id} className="border-t" style={{ borderColor: 'rgba(0,0,0,.06)' }}>
                      <td className="py-2 pr-3"><p className="font-bold">{quien(s.persona)}</p><p className="text-xs text-muted-foreground">{s.persona?.email}</p></td>
                      <td className="py-2 pr-3">{PLAN[s.plan ?? ''] ?? s.plan ?? '-'} · {s.ciclo === 'anual' ? 'anual' : 'mensual'}</td>
                      <td className="py-2 pr-3 font-bold" style={{ color: e.color }}>{e.txt}{s.cancela_al_final && s.estado === 'active' ? ' · baja pedida' : ''}</td>
                      <td className="py-2">{fecha(s.periodo_fin)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="glass-panel p-5">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <h3 className="text-sm font-bold">Movimientos</h3>
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filtrar movimientos">
            {FILTROS.map(f => (
              <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: filtro === f.id ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.04)', color: filtro === f.id ? '#8A6D0F' : '#555' }}>
                {f.txt}
              </button>
            ))}
          </div>
        </div>
        {movs.length === 0 ? <p className="text-sm text-muted-foreground">Sin movimientos.</p> : (
          <div className="flex flex-col">
            {movs.map(m => {
              const t = TIPO[m.tipo];
              return (
                <div key={m.id} className="flex items-center gap-3 py-2.5 border-t" style={{ borderColor: 'rgba(0,0,0,.06)' }}>
                  <span className="shrink-0 text-[11px] font-extrabold px-2 py-0.5 rounded-full" style={{ color: t.color, background: t.fondo }}>{t.txt}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{quien(m.persona)}</p>
                    <p className="text-xs text-muted-foreground truncate">{hora(m.fecha)} · {m.concepto}</p>
                  </div>
                  <p className="shrink-0 font-black text-sm" style={{ color: m.importe < 0 ? '#1d4ed8' : m.tipo === 'fallido' ? '#9ca3af' : '#111' }}>
                    {m.tipo === 'disputa' ? '' : eur(m.importe)}
                  </p>
                  <a href={m.enlace} target="_blank" rel="noopener noreferrer" aria-label="Ver en Stripe" className="shrink-0 text-muted-foreground hover:text-[#8A6D0F]">
                    <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-3">Últimos 100 cobros y devoluciones de Stripe. Para devolver o cancelar, abre el movimiento en Stripe.</p>
      </section>
    </div>
  );
};

export default AdminCobros;
