import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import TarjetaOrganizador from '@/components/dashboard/TarjetaOrganizador';

// Invitación visible para que una empresa elija mostrarse a los profesionales
// (29 oct 2026). Antes solo existía "Perfil público en el directorio" en Ajustes,
// que para un empresario no hacía nada. Es opcional y empieza apagada.

export default function TarjetaMostrarMarca() {
  const profile = useProfile();
  const [contrataciones, setContrataciones] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const activo = !!profile.mostrar_organizador;

  useEffect(() => {
    let cancelled = false;
    (supabase.rpc as any)('mis_contrataciones_organizador').then(({ data }: { data: number | string | null }) => {
      if (!cancelled) setContrataciones(Number(data ?? 0));
    });
    return () => { cancelled = true; };
  }, []);

  const cambiar = async () => {
    if (guardando) return;
    setGuardando(true);
    const ok = await profile.updateField({ mostrar_organizador: !activo });
    setGuardando(false);
    if (ok) toast.success(!activo ? 'Tu empresa ya aparece para los profesionales.' : 'Tu empresa ya no aparece para los profesionales.');
  };

  const zona = profile.zone && profile.zone !== 'España' ? profile.zone : null;
  const faltan = [
    !profile.photo_url && 'el logo',
    !zona && 'la ciudad',
    !profile.bio?.trim() && 'una descripción corta de los eventos que organizas',
  ].filter(Boolean) as string[];

  return (
    <div className="rounded-2xl p-5 mb-6 bg-white border" style={{ borderColor: activo ? 'rgba(4,120,87,0.35)' : 'rgba(212,175,55,0.4)' }}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-base font-extrabold" style={{ color: '#1f2937' }}>Muestra tu empresa a los profesionales</p>
          <p className="text-sm" style={{ color: '#4b5563' }}>
            Es opcional. Si lo activas, tu empresa sale en la sección Organizadores que ven los profesionales de XPEAK. Puedes quitarla cuando quieras.
          </p>
        </div>
        <button type="button" onClick={cambiar} disabled={guardando} aria-pressed={activo}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-60 flex-shrink-0"
          style={activo
            ? { background: 'rgba(4,120,87,0.1)', border: '1px solid rgba(4,120,87,0.4)', color: '#047857' }
            : { background: '#D4AF37', border: '1px solid #D4AF37', color: '#1f2937' }}>
          {activo ? <EyeOff size={15} /> : <Eye size={15} />}
          {activo ? 'Dejar de mostrar mi empresa' : 'Mostrar mi empresa'}
        </button>
      </div>

      <p className="text-xs font-bold mb-3" style={{ color: activo ? '#047857' : '#6b7280' }}>
        {activo ? 'Ahora mismo: activado. Los profesionales te ven.' : 'Ahora mismo: desactivado. No apareces en ningún sitio.'}
      </p>

      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="text-sm space-y-3" style={{ color: '#374151' }}>
          <div>
            <p className="font-bold" style={{ color: '#111' }}>Qué verán</p>
            <p>Tu logo, el nombre de tu empresa, tu ciudad, una descripción corta y cuántas contrataciones has hecho en XPEAK.</p>
          </div>
          <div>
            <p className="font-bold" style={{ color: '#111' }}>Qué no verán</p>
            <p>Tu teléfono ni tu email. Para hablar contigo usarán el chat de XPEAK y tú decides si respondes.</p>
          </div>
          {faltan.length > 0 && (
            <p className="text-xs rounded-lg p-2.5" style={{ background: 'rgba(217,119,6,0.08)', color: '#92400e' }}>
              Te falta {faltan.join(', ')}. Complétalo en <Link to="/dashboard?view=profile" className="underline font-bold">Mis datos</Link> para que tu ficha se vea bien.
            </p>
          )}
        </div>
        <div>
          <p className="text-xs font-bold mb-1.5" style={{ color: '#6b7280' }}>Así te verán</p>
          <TarjetaOrganizador org={{
            user_id: profile.user_id,
            nombre: profile.display_name?.trim() || 'Tu empresa',
            logo: profile.photo_url || null,
            ciudad: zona,
            descripcion: profile.bio?.trim() ? profile.bio.trim().slice(0, 160) : null,
            contrataciones,
          }} />
        </div>
      </div>
    </div>
  );
}
