import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import AdminPendingBookingsAlert from './AdminPendingBookingsAlert';
import AdminSolicitudesSemaforo from './AdminSolicitudesSemaforo';
import AdminNewProfileAlert from './AdminNewProfileAlert';
import AdminInvisibleProfilesAlert from './AdminInvisibleProfilesAlert';
import AdminDeletionAlert from './AdminDeletionAlert';

// Los cinco avisos del panel en un solo bloque plegable (29 oct 2026): antes
// iban uno debajo de otro encima de las pestañas y tapaban el panel. Siguen
// montados aunque esté plegado, para que cada uno cuente lo suyo y el resumen
// diga qué hay sin tener que abrirlo.

const ETIQUETAS = {
  reservas: (n: number) => `${n} ${n === 1 ? 'reserva sin respuesta' : 'reservas sin respuesta'}`,
  solicitudes: (n: number) => `${n} ${n === 1 ? 'solicitud' : 'solicitudes'}`,
  nuevos: (n: number) => `${n} ${n === 1 ? 'perfil nuevo' : 'perfiles nuevos'}`,
  invisibles: (n: number) => `${n} ${n === 1 ? 'perfil invisible' : 'perfiles invisibles'}`,
  bajas: (n: number) => `${n} ${n === 1 ? 'baja' : 'bajas'}`,
} as const;
type Clave = keyof typeof ETIQUETAS;

const KEY = 'xpeak_admin_avisos_abierto';

interface Props {
  onOpenUsers: () => void;
  onOpenDeletions: () => void;
}

export default function AdminAvisos({ onOpenUsers, onOpenDeletions }: Props) {
  const [cuentas, setCuentas] = useState<Record<Clave, number>>({ reservas: 0, solicitudes: 0, nuevos: 0, invisibles: 0, bajas: 0 });
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try { setAbierto(localStorage.getItem(KEY) === '1'); } catch { /* sin localStorage: plegado */ }
  }, []);

  const toggle = () => setAbierto(a => {
    try { localStorage.setItem(KEY, a ? '0' : '1'); } catch { /* da igual */ }
    return !a;
  });

  // Funciones estables: cada aviso las tiene en las dependencias de su useEffect.
  const handlers = useMemo(() => {
    const contar = (k: Clave) => (n: number) => setCuentas(c => (c[k] === n ? c : { ...c, [k]: n }));
    return { onReservas: contar('reservas'), onSolicitudes: contar('solicitudes'), onNuevos: contar('nuevos'),
      onInvisibles: contar('invisibles'), onBajas: contar('bajas') };
  }, []);

  const activos = (Object.keys(ETIQUETAS) as Clave[]).filter(k => cuentas[k] > 0);

  return (
    <div className={activos.length ? 'mb-6' : ''}>
      {activos.length > 0 && (
        <button onClick={toggle} aria-expanded={abierto}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <Bell size={16} style={{ color: '#8A6D0F', flexShrink: 0 }} />
          <span className="text-sm font-extrabold" style={{ color: '#1f2937' }}>Avisos</span>
          <span className="flex-1 flex flex-wrap gap-1.5">
            {activos.map(k => (
              <span key={k} className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', color: '#374151' }}>
                {ETIQUETAS[k](cuentas[k])}
              </span>
            ))}
          </span>
          <ChevronDown size={16} style={{ color: '#6b7280', transform: abierto ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
        </button>
      )}
      <div className={abierto && activos.length ? 'mt-3' : 'hidden'}>
        <AdminPendingBookingsAlert onCount={handlers.onReservas} />
        <AdminSolicitudesSemaforo onCount={handlers.onSolicitudes} />
        <AdminNewProfileAlert onOpenUsers={onOpenUsers} onCount={handlers.onNuevos} />
        <AdminInvisibleProfilesAlert onOpenUsers={onOpenUsers} onCount={handlers.onInvisibles} />
        <AdminDeletionAlert onOpenDeletions={onOpenDeletions} onCount={handlers.onBajas} />
      </div>
    </div>
  );
}
