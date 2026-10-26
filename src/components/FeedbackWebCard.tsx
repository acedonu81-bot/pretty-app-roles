import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { logEvent } from '@/lib/track';
import FeedbackWebForm from '@/components/FeedbackWebForm';

/**
 * Tarjeta de feedback del panel (Ficha XDS 78,3, 26 oct 2026). Sale sola UNA vez,
 * el tercer día distinto que la persona entra al panel, y se recuerda si la
 * cierra o responde. Cualquier sitio puede abrirla con abrirFeedback() (enlace
 * "¿Qué te falta?"). Nunca sale en el chat (oculto) ni a visitantes sin cuenta.
 */
export const FEEDBACK_EVENT = 'xpeak:feedback';
export const abrirFeedback = () => window.dispatchEvent(new Event(FEEDBACK_EVENT));

const HECHO = 'xpeak_fb_hecho';
const DIAS = 'xpeak_fb_dias';

const leer = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const guardar = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } };

export default function FeedbackWebCard({ rol, oculto }: { rol?: string | null; oculto?: boolean }) {
  const [abierta, setAbierta] = useState(false);
  const [gracias, setGracias] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (leer(HECHO)) return;
    const hoy = new Date().toISOString().slice(0, 10);
    const dias = new Set((leer(DIAS) ?? '').split(',').filter(Boolean));
    dias.add(hoy);
    guardar(DIAS, [...dias].slice(-10).join(','));
    if (dias.size < 3) return;
    const t = setTimeout(() => { setAbierta(true); void logEvent('cta_click', location.pathname, 'feedback abre auto'); }, 25000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const abrir = () => { setManual(true); setAbierta(true); setGracias(false); void logEvent('cta_click', location.pathname, 'feedback abre enlace'); };
    window.addEventListener(FEEDBACK_EVENT, abrir);
    return () => window.removeEventListener(FEEDBACK_EVENT, abrir);
  }, []);

  if (!abierta || (oculto && !manual)) return null;

  const cerrar = () => {
    setAbierta(false);
    if (!gracias) void logEvent('cta_click', location.pathname, 'feedback cierra');
    guardar(HECHO, '1');
  };

  return (
    <div role="dialog" aria-label="Feedback"
      className="fixed z-[60] left-3 right-3 sm:right-auto sm:w-80 p-4 rounded-2xl shadow-lg"
      style={{ bottom: 'calc(88px + env(safe-area-inset-bottom))', background: '#FFFDF7', border: '2px solid #D4AF37' }}>
      <button type="button" onClick={cerrar} aria-label="Cerrar" className="absolute top-2 right-2 p-1" style={{ color: '#374151' }}>
        <X size={16} />
      </button>
      {gracias ? (
        <p className="text-sm font-bold pr-5" style={{ color: '#111' }}>Gracias, lo leemos todo.</p>
      ) : (
        <FeedbackWebForm momento={manual ? 'enlace' : 'dashboard'} rol={rol}
          onEnviado={() => { setGracias(true); guardar(HECHO, '1'); setTimeout(() => setAbierta(false), 2500); }} />
      )}
    </div>
  );
}
