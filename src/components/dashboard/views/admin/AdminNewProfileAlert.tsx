import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Check, AlertTriangle } from 'lucide-react';
import { ROLE_ES } from '@/lib/constants';

// Aviso de altas nuevas sin revisar, hermano del banner rojo de bajas
// (AdminDeletionAlert). Nace del caso del 2 sep 2026: una profesional se
// registro con el rol equivocado y una ciudad fuera de la lista de filtros, y
// quedo invisible en el directorio sin que nadie se enterara. El email de aviso
// ayuda, pero un correo se pierde; el panel es donde se entra a mirar.
//
// Verde y no rojo porque un alta es una buena noticia — lo que urge no es
// alarmarse, es revisar que el rol y la zona son correctos antes de que pasen
// dias. Por eso se marcan en ambar los datos que suelen venir mal.

interface NewProfile {
  user_id: string;
  display_name: string | null;
  role: string | null;
  zone: string | null;
  region: string | null;
  photo_url: string | null;
  created_at: string;
}

const roleLabel = (r: string | null) => (r ? ROLE_ES[r] ?? r : 'Sin rol');

const AdminNewProfileAlert = ({ onOpenUsers }: { onOpenUsers?: () => void } = {}) => {
  const [pending, setPending] = useState<NewProfile[]>([]);
  const [acking, setAcking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (supabase.from('profiles') as any)
      .select('user_id, display_name, role, zone, region, photo_url, created_at')
      .is('admin_seen_at', null)
      .eq('is_seed', false)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }: { data: NewProfile[] | null }) => {
        // Si la migracion aun no esta aplicada la consulta falla: el panel debe
        // seguir usable, asi que el error se traduce en "no hay avisos".
        if (!cancelled) setPending(data ?? []);
      });
    return () => { cancelled = true; };
  }, []);

  if (pending.length === 0) return null;

  const markSeen = async () => {
    setAcking(true);
    const ids = pending.map(p => p.user_id);
    const { error } = await (supabase.from('profiles') as any)
      .update({ admin_seen_at: new Date().toISOString() })
      .in('user_id', ids);
    if (error) { setAcking(false); return; }
    setPending([]);
  };

  return (
    <div
      role="status"
      className="mb-6 rounded-2xl overflow-hidden"
      style={{ background: '#f0fdf4', border: '2px solid #16a34a', boxShadow: '0 4px 16px rgba(22,163,74,0.16)' }}
    >
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <UserPlus size={22} strokeWidth={2.5} style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <p className="text-base font-extrabold" style={{ color: '#14532d' }}>
              {pending.length === 1
                ? 'Se ha registrado 1 profesional nuevo'
                : `Se han registrado ${pending.length} profesionales nuevos`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#166534' }}>
              Comprueba que el rol y la zona son correctos: un rol equivocado deja el perfil fuera del directorio donde le buscan.
            </p>

            <ul className="mt-3 space-y-1.5">
              {pending.slice(0, 8).map(p => {
                // Sin comunidad derivada el perfil no sale al filtrar por zona,
                // y sin foto la ficha se ve vacia: son los dos motivos por los
                // que un alta buena pasa desapercibida.
                const sinZona = !p.region;
                const sinFoto = !p.photo_url || p.photo_url.length < 10;
                return (
                  <li key={p.user_id} className="text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5" style={{ color: '#166534' }}>
                    <span className="font-bold">{p.display_name || 'Sin nombre'}</span>
                    <span>· {roleLabel(p.role)}</span>
                    <span>· {p.zone || 'sin zona'}</span>
                    <span>· {new Date(p.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    {sinZona && (
                      <span className="px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1" style={{ background: 'rgba(217,119,6,0.14)', color: '#92400e' }}>
                        <AlertTriangle size={10} strokeWidth={3} /> sin comunidad
                      </span>
                    )}
                    {sinFoto && (
                      <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(217,119,6,0.14)', color: '#92400e' }}>sin foto</span>
                    )}
                  </li>
                );
              })}
              {pending.length > 8 && (
                <li className="text-xs" style={{ color: '#166534', opacity: 0.8 }}>y {pending.length - 8} más…</li>
              )}
            </ul>

            <div className="flex flex-wrap gap-2 mt-3">
              {onOpenUsers && (
                <button
                  onClick={onOpenUsers}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: '#fff', color: '#14532d', border: '1px solid #16a34a' }}
                >
                  Ver usuarios
                </button>
              )}
              <button
                onClick={markSeen}
                disabled={acking}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity disabled:opacity-50"
                style={{ background: '#16a34a', color: '#fff' }}
              >
                <Check size={13} strokeWidth={3} />
                {acking ? 'Guardando…' : 'Marcar como visto'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewProfileAlert;
