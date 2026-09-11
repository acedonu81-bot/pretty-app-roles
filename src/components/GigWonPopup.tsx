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
// animación de temporizador. Ahora se muestra el más reciente una vez, con
// un pulso de intensidad mayor→menor en bucle (tipo llamada entrante, ver
// @keyframes callPulse en index.css) en vez de quedarse liso, y solo se
// cierra a mano con la X.
//
// El cierre se recuerda en localStorage con la firma del bolo concreto (rol +
// fechas — la RPC no devuelve id, a propósito no identifica a nadie), mismo
// patrón que AdminInvisibleProfilesAlert: si vuelve a aparecer el MISMO bolo
// no se repite, pero uno nuevo sí — el usuario pidió que no "salte" otra vez
// en sesiones futuras tras cerrarlo.
const DISMISS_KEY = 'xpeak_gigwon_dismissed';

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
  /** 'landing' queda fixed, pegado bajo el nav público (el hero tiene texto
   * grande justo debajo, no hay hueco centrado libre para superponerlo).
   * 'inline' no usa position:fixed — fluye en el flujo normal del padre,
   * pensado para el topbar del dashboard, a la derecha de la búsqueda. */
  variant?: 'landing' | 'inline';
}

const signatureOf = (g: Gig) => `${g.role ?? ''}|${g.event_date ?? ''}|${(g.event_dates ?? []).join(',')}`;

const GigWonPopup = ({ variant = 'landing' }: GigWonPopupProps) => {
  const [gig, setGig] = useState<Gig | null>(null);
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
    (supabase.rpc as any)('bolos_recientes_publico')
      .then(({ data }: { data: Gig[] | null }) => {
        if (!cancelled && data?.length) setGig(data[0]);
      });
    return () => { cancelled = true; };
  }, []);

  if (!gig) return null;
  const signature = signatureOf(gig);
  if (dismissedSignature === signature) return null;

  const handleDismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, signature); } catch { /* no persiste, no rompe nada */ }
    setDismissedSignature(signature);
  };

  const dates = fmtDates(gig);
  const slug = roleSlug(gig.role);
  const label = jobWord(slug);

  return (
    <div
      className={`rounded-full overflow-hidden hidden sm:block flex-shrink-0 ${
        variant === 'landing' ? 'fixed z-[60] top-3 left-1/2 -translate-x-1/2' : ''
      }`}
      style={{
        background: '#0f3d2e',
        border: '1px solid rgba(74,222,128,0.35)',
        animation: 'callPulse 2.4s ease-in-out infinite',
      }}
    >
      <div className="flex items-center gap-2 pl-3 pr-2 py-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(74,222,128,0.18)' }}>
          <PartyPopper size={13} style={{ color: '#4ade80' }} />
        </div>
        <p className="text-xs font-bold whitespace-nowrap" style={{ color: '#fff' }}>
          Nuevo {label} conseguido
          <span className="font-normal ml-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {roleLabel(gig.role)}{dates ? ` · ${dates}` : ''}
          </span>
        </p>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10"
          aria-label="Cerrar"
        >
          <X size={12} style={{ color: 'rgba(255,255,255,0.55)' }} />
        </button>
      </div>
    </div>
  );
};

export default GigWonPopup;
