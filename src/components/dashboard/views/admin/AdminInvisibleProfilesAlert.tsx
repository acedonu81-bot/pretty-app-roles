import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EyeOff, Camera, MapPin, Check } from 'lucide-react';
import { ROLE_ES } from '@/lib/constants';

const DISMISS_KEY = 'xpeak_admin_invisible_profiles_dismissed';

// Firma del conjunto actual (no solo el conteo): si cambia un solo user_id
// —entra uno nuevo o se completa uno de los que había— el "visto" se invalida
// y el aviso vuelve a aparecer, aunque el total dé la misma cifra.
const signatureOf = (perfiles: Perfil[]) =>
  perfiles.map(p => p.user_id).sort().join(',');

// Aviso PERMANENTE de perfiles que no aparecen en ningún directorio de ciudad
// hoy, sea el alta de ayer o de hace tres meses.
//
// AdminNewProfileAlert ya avisaba de "sin foto"/"sin comunidad", pero solo
// mientras el alta está sin marcar como revisada — en cuanto se marca, el
// aviso desaparece aunque el perfil SIGA incompleto para siempre. Medido el
// 5 sep 2026: los 8 camareros reales estaban todos "revisados" y 7 sin foto,
// 5 sin ciudad real, y ese hueco se había vuelto invisible para el propio
// panel de admin.
//
// Naranja apagado, no rojo: no es una alarma de sistema roto, es trabajo
// pendiente de captación — la razón de ser de este banner es precisamente
// recordar seguir aquí mientras el problema exista, sin fecha de caducidad.

interface Perfil {
  user_id: string;
  display_name: string | null;
  role: string | null;
  zone: string | null;
  created_at: string;
  sin_foto: boolean;
  sin_ciudad_real: boolean;
}

const roleLabel = (r: string | null) => (r ? ROLE_ES[r] ?? r : 'Sin rol');

const AdminInvisibleProfilesAlert = ({ onOpenUsers }: { onOpenUsers?: () => void } = {}) => {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [dismissedSignature, setDismissedSignature] = useState<string | null>(null);

  useEffect(() => {
    try {
      setDismissedSignature(localStorage.getItem(DISMISS_KEY));
    } catch {
      // localStorage inaccesible (Safari privado, etc.) — el aviso se muestra siempre
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (supabase.from('admin_perfiles_invisibles' as any) as any)
      .select('user_id, display_name, role, zone, created_at, sin_foto, sin_ciudad_real')
      .then(({ data }: { data: Perfil[] | null }) => {
        if (!cancelled) setPerfiles(data ?? []);
      });
    return () => { cancelled = true; };
  }, []);

  if (perfiles.length === 0) return null;
  if (dismissedSignature !== null && dismissedSignature === signatureOf(perfiles)) return null;

  const handleDismiss = () => {
    const signature = signatureOf(perfiles);
    try {
      localStorage.setItem(DISMISS_KEY, signature);
    } catch {
      // localStorage inaccesible — el click no persiste, pero no rompe nada
    }
    setDismissedSignature(signature);
  };

  return (
    <div
      role="status"
      className="mb-6 rounded-2xl overflow-hidden"
      style={{ background: '#fff7ed', border: '2px solid #c2410c', boxShadow: '0 4px 16px rgba(194,65,12,0.14)' }}
    >
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <EyeOff size={22} strokeWidth={2.5} style={{ color: '#c2410c', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <p className="text-base font-extrabold" style={{ color: '#7c2d12' }}>
              {perfiles.length === 1
                ? '1 profesional no aparece en ningún directorio de ciudad'
                : `${perfiles.length} profesionales no aparecen en ningún directorio de ciudad`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#9a3412' }}>
              Sin foto o sin ciudad real, quien busque "camareros en Madrid" (o su categoría) no los encuentra.
              Este aviso no caduca: sigue aquí hasta que se complete el perfil.
            </p>

            <ul className="mt-3 space-y-1.5">
              {perfiles.slice(0, 10).map(p => (
                <li key={p.user_id} className="text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5" style={{ color: '#9a3412' }}>
                  <span className="font-bold">{p.display_name || 'Sin nombre'}</span>
                  <span>· {roleLabel(p.role)}</span>
                  <span>· alta {new Date(p.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                  {p.sin_foto && (
                    <span className="px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1"
                      style={{ background: 'rgba(194,65,12,0.14)', color: '#9a3412' }}>
                      <Camera size={10} strokeWidth={3} /> sin foto
                    </span>
                  )}
                  {p.sin_ciudad_real && (
                    <span className="px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1"
                      style={{ background: 'rgba(194,65,12,0.14)', color: '#9a3412' }}>
                      <MapPin size={10} strokeWidth={3} /> sin ciudad
                    </span>
                  )}
                </li>
              ))}
              {perfiles.length > 10 && (
                <li className="text-xs" style={{ color: '#9a3412', opacity: 0.8 }}>y {perfiles.length - 10} más…</li>
              )}
            </ul>

            <div className="flex flex-wrap gap-2 mt-3">
              {onOpenUsers && (
                <button
                  onClick={onOpenUsers}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: '#fff', color: '#7c2d12', border: '1px solid #c2410c' }}
                >
                  Ver usuarios
                </button>
              )}
              <button
                onClick={handleDismiss}
                title="Ocultar hasta que cambie la lista de perfiles"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'transparent', color: '#9a3412' }}
              >
                <Check size={12} strokeWidth={3} /> Visto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvisibleProfilesAlert;
