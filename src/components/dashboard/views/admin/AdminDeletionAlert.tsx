import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Check } from 'lucide-react';
import { ROLE_ES } from '@/lib/constants';

// Aviso de bajas de perfiles sin confirmar. Antes una eliminación no dejaba
// rastro y podías perder al único camarero con foto sin enterarte, así que el
// banner es deliberadamente imposible de pasar por alto: rojo, arriba del todo
// y presente hasta que se marca como visto.
//
// Los registros no llevan datos personales (ver migración
// 20260901120000_profile_deletions_log.sql): quien se borra ejerce su derecho
// de supresión, así que solo se guarda rol, zona y completitud del perfil.

interface Deletion {
  id: string;
  deleted_at: string;
  role: string | null;
  zone: string | null;
  had_photo: boolean;
  was_verified: boolean;
  days_active: number | null;
}

const roleLabel = (r: string | null) => (r ? ROLE_ES[r] ?? r : 'Sin rol');

const AdminDeletionAlert = ({ onOpenDeletions }: { onOpenDeletions?: () => void } = {}) => {
  const [pending, setPending] = useState<Deletion[]>([]);
  const [acking, setAcking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (supabase.from('profile_deletions' as any) as any)
      .select('id, deleted_at, role, zone, had_photo, was_verified, days_active')
      .eq('acknowledged', false)
      .order('deleted_at', { ascending: false })
      .limit(50)
      .then(({ data }: { data: Deletion[] | null }) => {
        // Si la migración aún no está aplicada la consulta falla: el panel debe
        // seguir usable, así que el error se traduce en "no hay avisos".
        if (!cancelled) setPending(data ?? []);
      });
    return () => { cancelled = true; };
  }, []);

  if (pending.length === 0) return null;

  const markSeen = async () => {
    setAcking(true);
    const ids = pending.map(d => d.id);
    const { error } = await (supabase.from('profile_deletions' as any) as any)
      .update({ acknowledged: true })
      .in('id', ids);
    if (error) { setAcking(false); return; }
    setPending([]);
  };

  return (
    <div
      role="alert"
      className="mb-6 rounded-2xl overflow-hidden"
      style={{ background: '#fff5f5', border: '2px solid #dc2626', boxShadow: '0 4px 16px rgba(220,38,38,0.18)' }}
    >
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} strokeWidth={2.5} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <p className="text-base font-extrabold" style={{ color: '#991b1b' }}>
              {pending.length === 1
                ? 'Se ha eliminado 1 perfil'
                : `Se han eliminado ${pending.length} perfiles`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#7f1d1d' }}>
              Has perdido inventario del directorio. Revisa si hay que recuperar la categoría.
            </p>

            <ul className="mt-3 space-y-1.5">
              {pending.slice(0, 8).map(d => (
                <li key={d.id} className="text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5" style={{ color: '#7f1d1d' }}>
                  <span className="font-bold">{roleLabel(d.role)}</span>
                  <span>· {d.zone || 'sin zona'}</span>
                  <span>· {new Date(d.deleted_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  {d.had_photo && <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(220,38,38,0.12)' }}>tenía foto</span>}
                  {d.was_verified && <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(220,38,38,0.12)' }}>verificado</span>}
                  {typeof d.days_active === 'number' && (
                    <span style={{ opacity: 0.75 }}>· {d.days_active === 0 ? 'mismo día' : `${d.days_active} días activo`}</span>
                  )}
                </li>
              ))}
              {pending.length > 8 && (
                <li className="text-xs" style={{ color: '#7f1d1d', opacity: 0.8 }}>y {pending.length - 8} más…</li>
              )}
            </ul>

            <div className="flex flex-wrap gap-2 mt-3">
            {onOpenDeletions && (
              <button
                onClick={onOpenDeletions}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: '#fff', color: '#991b1b', border: '1px solid #dc2626' }}
              >
                Ver detalle y motivos
              </button>
            )}
            <button
              onClick={markSeen}
              disabled={acking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity disabled:opacity-50"
              style={{ background: '#dc2626', color: '#fff' }}
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

export default AdminDeletionAlert;
