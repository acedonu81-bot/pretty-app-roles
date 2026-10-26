import { useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logEvent } from '@/lib/track';

/**
 * Feedback de la web (Ficha XDS 78,3, aprobada 26 oct 2026): una sola pregunta
 * abierta. Se guarda en feedback_web (cualquiera inserta, solo el admin lee).
 * Antes de enviar se quitan emails y números largos para no guardar datos
 * personales por accidente.
 */
export const limpiarFeedback = (t: string) =>
  t.replace(/\S+@\S+/g, '[email]').replace(/\d[\d\s.-]{5,}\d/g, '[num]').trim().slice(0, 1000);

interface Props {
  momento: 'dashboard' | 'solicitud' | 'enlace';
  rol?: string | null;
  onEnviado: () => void;
}

export default function FeedbackWebForm({ momento, rol, onEnviado }: Props) {
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(false);

  const enviar = async () => {
    const limpio = limpiarFeedback(texto);
    if (limpio.length < 3 || enviando) return;
    setEnviando(true);
    setError(false);
    const sb = supabase as unknown as {
      from: (t: string) => { insert: (v: Record<string, unknown>) => Promise<{ error: unknown }> };
    };
    const { error: e } = await sb.from('feedback_web').insert({
      texto: limpio, momento, rol: rol ?? null, path: location.pathname.slice(0, 200),
    });
    setEnviando(false);
    if (e) { setError(true); return; }
    void logEvent('cta_click', location.pathname, `feedback envia ${momento}`);
    onEnviado();
  };

  return (
    <div>
      <label htmlFor={`fb-${momento}`} className="block text-sm font-bold mb-2" style={{ color: '#111' }}>
        ¿Qué es lo que más te falta o te ha frenado?
      </label>
      <textarea id={`fb-${momento}`} value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={1000} rows={3}
        placeholder="Cuéntanoslo con tus palabras"
        className="w-full px-3 py-2 rounded-lg text-sm mb-2"
        style={{ border: '1px solid rgba(122,98,22,0.35)', background: '#fff', color: '#111' }} />
      {error && <p className="text-xs mb-2" style={{ color: '#B91C1C' }}>No se ha podido enviar. Prueba otra vez.</p>}
      <button type="button" onClick={enviar} disabled={enviando || texto.trim().length < 3}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black disabled:opacity-50"
        style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1a1405' }}>
        <Send size={14} /> {enviando ? 'Enviando…' : 'Enviar'}
      </button>
    </div>
  );
}
