import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminActivityAlert } from '@/hooks/useAdminActivityAlert';
import { UserPlus, CalendarClock, UserMinus, Star, Phone, RefreshCw, AlertTriangle } from 'lucide-react';

// Línea temporal de TODO lo que pasa en XPEAK, en un solo sitio.
//
// "Ahora que estamos empezando necesito saber cada movimiento de cada cosa,
// cada mosca que se mueva lo tengo que saber" (4 sep 2026). Hasta ahora cada
// suceso vivía en su tabla y había que ir a buscarlo: la solicitud de Ramón
// (22 ago) estuvo 12 días sin que nadie la viera porque nada la ponía delante.
//
// Lo pendiente sube arriba del todo con su contacto a mano, porque el objetivo
// no es mirar estadísticas: es poder actuar sobre lo que está esperando.

interface Movimiento {
  tipo: 'alta' | 'solicitud' | 'solicitud_pendiente' | 'baja' | 'resena';
  cuando: string;
  quien: string;
  detalle: string | null;
  lugar: string | null;
  contacto: string | null;
  ref: string;
  pendiente: boolean;
}

const ESTILO: Record<Movimiento['tipo'], { icon: typeof UserPlus; color: string; fondo: string; etiqueta: string }> = {
  alta:                { icon: UserPlus,      color: '#16a34a', fondo: 'rgba(22,163,74,0.10)',  etiqueta: 'Alta' },
  solicitud:           { icon: CalendarClock, color: '#0369a1', fondo: 'rgba(3,105,161,0.10)',  etiqueta: 'Solicitud' },
  solicitud_pendiente: { icon: CalendarClock, color: '#b45309', fondo: 'rgba(180,83,9,0.12)',   etiqueta: 'Solicitud' },
  baja:                { icon: UserMinus,     color: '#b91c1c', fondo: 'rgba(185,28,28,0.10)',  etiqueta: 'Baja' },
  resena:              { icon: Star,          color: '#a16207', fondo: 'rgba(161,98,7,0.10)',   etiqueta: 'Reseña' },
};

const FILTROS = [
  { id: 'todo',      label: 'Todo' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'solicitud', label: 'Solicitudes' },
  { id: 'alta',      label: 'Altas' },
] as const;

const hace = (iso: string): string => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'ahora mismo';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'ayer';
  if (d < 30) return `hace ${d} días`;
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

const AdminActivity = () => {
  // Abrir esta pestaña ES revisarla: el escudo del sidebar se apaga y no
  // vuelve a encenderse hasta que entre algo nuevo. Sin botón de "marcar
  // leído" que haya que acordarse de pulsar.
  const { marcarVisto } = useAdminActivityAlert(true);
  const [items, setItems] = useState<Movimiento[]>([]);
  // Nombre de canal único por instancia: con uno fijo, dos montajes a la vez
  // rompen con "cannot add postgres_changes callbacks after subscribe()" y
  // tumban el dashboard entero a pantalla en blanco.
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;
  const [filtro, setFiltro] = useState<typeof FILTROS[number]['id']>('todo');
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    const { data } = await (supabase.from('admin_activity' as any) as any)
      .select('*')
      .limit(300);
    setItems((data as Movimiento[]) ?? []);
    setCargando(false);
  };

  useEffect(() => {
    cargar();
    // Un respiro antes de marcar: si se entra y se sale al instante, lo nuevo
    // sigue avisando en el siguiente vistazo.
    const visto = setTimeout(() => { marcarVisto(); }, 1500);
    // Realtime sobre las dos tablas que generan los sucesos que urgen.
    const ch = supabase
      .channel(`admin-activity-${instanceId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flash_bookings' }, cargar)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, cargar)
      .subscribe();
    return () => { clearTimeout(visto); supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lo que espera acción va primero, por antiguo: quien lleva más tiempo
  // esperando es a quien antes hay que atender.
  const pendientes = items.filter(i => i.pendiente)
    .sort((a, b) => new Date(a.cuando).getTime() - new Date(b.cuando).getTime());
  const resto = items.filter(i => !i.pendiente);

  const visibles = filtro === 'todo' ? [...pendientes, ...resto]
    : filtro === 'pendiente' ? pendientes
    : filtro === 'solicitud' ? items.filter(i => i.tipo.startsWith('solicitud'))
    : items.filter(i => i.tipo === 'alta');

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-lg font-extrabold">Actividad</h3>
          <p className="text-xs text-muted-foreground">
            Todo lo que pasa en XPEAK, por orden. {pendientes.length > 0 && (
              <span className="font-bold" style={{ color: '#b45309' }}>
                {pendientes.length} {pendientes.length === 1 ? 'cosa espera' : 'cosas esperan'} acción.
              </span>
            )}
          </p>
        </div>
        <button
          onClick={cargar}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-opacity hover:opacity-70"
          style={{ borderColor: 'rgba(0,0,0,0.12)' }}
        >
          <RefreshCw size={12} className={cargando ? 'animate-spin' : undefined} /> Actualizar
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {FILTROS.map(f => {
          const n = f.id === 'todo' ? items.length
            : f.id === 'pendiente' ? pendientes.length
            : f.id === 'solicitud' ? items.filter(i => i.tipo.startsWith('solicitud')).length
            : items.filter(i => i.tipo === 'alta').length;
          const activo = filtro === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={activo
                ? { background: '#0a0908', color: '#fff' }
                : { background: 'rgba(0,0,0,0.05)', color: '#444' }}
            >
              {f.label} <span style={{ opacity: 0.6 }}>{n}</span>
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        <div className="px-4 py-10 text-center rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
          <p className="text-sm font-bold" style={{ color: '#444' }}>
            {cargando ? 'Cargando…' : 'Nada por aquí todavía.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {visibles.map(m => {
            const e = ESTILO[m.tipo] ?? ESTILO.alta;
            const Icon = e.icon;
            const horas = (Date.now() - new Date(m.cuando).getTime()) / 3600000;
            const urgente = m.pendiente && m.tipo === 'solicitud_pendiente' && horas >= 4;
            return (
              <li
                key={`${m.tipo}-${m.ref}`}
                className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                style={{
                  background: m.pendiente ? e.fondo : 'rgba(0,0,0,0.02)',
                  border: m.pendiente ? `1px solid ${e.color}33` : '1px solid transparent',
                }}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: e.fondo, color: e.color }}
                >
                  <Icon size={14} strokeWidth={2.5} />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[0.65rem] font-black uppercase tracking-wider" style={{ color: e.color }}>
                      {e.etiqueta}
                    </span>
                    <span className="text-sm font-bold truncate">{m.quien}</span>
                    {m.detalle && <span className="text-xs" style={{ color: '#555' }}>· {m.detalle}</span>}
                    {m.lugar && m.lugar !== '—' && <span className="text-xs" style={{ color: '#777' }}>· {m.lugar}</span>}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-[0.7rem]" style={{ color: '#888' }}>{hace(m.cuando)}</span>
                    {urgente && (
                      <span
                        className="text-[0.65rem] font-black px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                        style={{ background: 'rgba(185,28,28,0.12)', color: '#b91c1c' }}
                      >
                        <AlertTriangle size={9} strokeWidth={3} /> sin responder
                      </span>
                    )}
                    {/* El contacto va enlazado: el objetivo es poder llamar
                        ahora mismo, no tomar nota para luego. */}
                    {m.contacto && (
                      <a
                        href={m.contacto.includes('@') ? `mailto:${m.contacto}` : `tel:${m.contacto}`}
                        className="text-[0.7rem] font-bold inline-flex items-center gap-1 underline"
                        style={{ color: e.color }}
                      >
                        <Phone size={9} strokeWidth={3} />{m.contacto}
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminActivity;
