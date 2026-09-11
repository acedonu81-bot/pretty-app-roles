import { useEffect, useState } from 'react';
import { PartyPopper, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_ES, ROL_UI_A_SLUG, jobWord } from '@/lib/constants';

// Social-proof: "Nuevo bolo conseguido · DJ · 11-12 sept 2026". Solo rol +
// fechas, nunca nombre/empresa/ciudad — ver feedback_no_sacar_contacto_fuera_app.
// Si no hay contrataciones reales en los últimos 7 días (bolos_recientes_publico),
// no se muestra nada: nunca datos inventados.
//
// Estático a propósito (11 sep 2026): la primera versión aparecía/desaparecía
// sola cada pocos segundos y resultaba molesta — el usuario pidió quitar la
// animación de temporizador. Ahora se muestra el más reciente una vez, fijo,
// hasta que se cierra a mano.

interface Gig {
  role: string | null;
  event_date: string | null;
  event_dates: string[] | null;
}

const roleLabel = (roleUI: string | null): string => {
  if (!roleUI) return 'un profesional';
  const slug = ROL_UI_A_SLUG[roleUI];
  return slug ? (ROLE_ES[slug] ?? roleUI) : roleUI;
};

const roleSlug = (roleUI: string | null): string | undefined => ROL_UI_A_SLUG[roleUI ?? ''];

const fmtDates = (g: Gig): string => {
  const dates = (g.event_dates?.length ? g.event_dates : g.event_date ? [g.event_date] : [])
    .map(d => new Date(d))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  if (dates.length === 0) return '';
  const fmt = (d: Date, withMonth: boolean) =>
    withMonth
      ? d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      : String(d.getDate());
  if (dates.length === 1) return fmt(dates[0], true);
  const first = dates[0], last = dates[dates.length - 1];
  const sameMonth = first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear();
  return sameMonth
    ? `${fmt(first, false)}-${fmt(last, true)}`
    : `${fmt(first, true)} - ${fmt(last, true)}`;
};

interface GigWonPopupProps {
  /** 'bottom-left' en la landing pública; 'top-left' en el dashboard, junto
   * a la barra de búsqueda del topbar. */
  position?: 'bottom-left' | 'top-left';
}

const GigWonPopup = ({ position = 'bottom-left' }: GigWonPopupProps) => {
  const [gig, setGig] = useState<Gig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (supabase.rpc as any)('bolos_recientes_publico')
      .then(({ data }: { data: Gig[] | null }) => {
        if (!cancelled && data?.length) setGig(data[0]);
      });
    return () => { cancelled = true; };
  }, []);

  if (dismissed || !gig) return null;
  const dates = fmtDates(gig);
  const slug = roleSlug(gig.role);
  const label = jobWord(slug);

  return (
    <div
      className={`fixed z-40 ${position === 'top-left' ? 'top-20 left-5' : 'bottom-5 left-5'} max-w-xs rounded-2xl overflow-hidden hidden sm:block`}
      style={{ background: '#0a0908', border: '1px solid rgba(212,175,55,0.35)', boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.15)' }}>
          <PartyPopper size={16} style={{ color: '#D4AF37' }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: '#fff' }}>
            Nuevo {label} conseguido
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {roleLabel(gig.role)}{dates ? ` · ${dates}` : ''}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 -mr-1 -mt-1"
          aria-label="Cerrar"
        >
          <X size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </button>
      </div>
    </div>
  );
};

export default GigWonPopup;
