import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_ES, ROL_UI_A_SLUG, jobWord } from '@/lib/constants';

// Social-proof en la landing: "Nuevo bolo conseguido · DJ · 11-12 sept 2026".
// Solo rol + fechas, nunca nombre/empresa/ciudad — ver
// feedback_no_sacar_contacto_fuera_app. Si no hay contrataciones reales en
// los últimos 7 días (bolos_recientes_publico), no se muestra nada: nunca
// datos inventados.

interface Gig {
  role: string | null;
  event_date: string | null;
  event_dates: string[] | null;
}

const SHOW_MS = 6000;
const GAP_MS = 14000;

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

const GigWonPopup = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (supabase.rpc as any)('bolos_recientes_publico')
      .then(({ data }: { data: Gig[] | null }) => {
        if (!cancelled && data?.length) setGigs(data);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (gigs.length === 0 || dismissed) return;
    const showTimer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(showTimer);
  }, [gigs.length, dismissed]);

  const advance = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setIndex(i => (i + 1) % gigs.length);
      setVisible(true);
    }, GAP_MS);
  }, [gigs.length]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(advance, SHOW_MS);
    return () => clearTimeout(t);
  }, [visible, advance]);

  if (dismissed || gigs.length === 0) return null;
  const gig = gigs[index];
  const dates = fmtDates(gig);
  const slug = roleSlug(gig.role);
  const label = jobWord(slug);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -12 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed z-40 bottom-5 left-5 max-w-xs rounded-2xl overflow-hidden hidden sm:block"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GigWonPopup;
