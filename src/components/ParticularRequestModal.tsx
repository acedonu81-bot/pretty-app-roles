import { useState } from 'react';
import { X, Send, CheckCircle, PartyPopper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * "Soy particular" de la landing (Ficha XDS 73,6, aprobada 11 oct 2026).
 *
 * El particular no se registra: deja su email y lo que necesita, y la
 * solicitud llega a XPEAK como lead genérico (sin profesional asignado) para
 * repartirla a mano. Es el único INSERT anónimo que permite la RLS desde el
 * 9 sep ("Anon can insert generic leads only"): contactar a un profesional
 * concreto sigue exigiendo cuenta.
 *
 * La marca [Particular] al inicio de event_description es lo que mide la
 * death line de la ficha (menos de 10 en 30 días = no se construye el cobro).
 */

const EVENT_TYPES = [
  'Boda', 'Cumpleaños', 'Comunión', 'Bautizo', 'Fiesta privada',
  'Despedida', 'Aniversario', 'Otro',
];

const SERVICES = [
  'DJ', 'Disco móvil', 'Música en directo', 'Fotógrafo / vídeo',
  'Camareros / catering', 'Food truck', 'Animación', 'Alquiler de equipo',
  'Varios / no lo sé',
];

const BUDGETS = ['Menos de 300 €', '300 a 600 €', '600 a 1.000 €', 'Más de 1.000 €', 'No lo sé'];

interface Props {
  onClose: () => void;
}

export default function ParticularRequestModal({ onClose }: Props) {
  const [form, setForm] = useState({
    name: '', email: '', eventType: '', service: '', date: '', location: '',
    budget: '', message: '', website: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !emailOk || !form.eventType || !form.service) return;
    // Honeypot: campo oculto que un humano nunca rellena, pero un bot sí.
    if (form.website.trim()) { onClose(); return; }
    setStatus('sending');

    const extras = [
      form.budget && `Presupuesto: ${form.budget}`,
      form.message.trim(),
    ].filter(Boolean).join(' · ');
    const payload = {
      professional_name: `Solicitud particular: ${form.service}`,
      professional_role: 'general',
      requester_name: form.name.trim(),
      requester_contact: form.email.trim(),
      event_date: form.date || 'Por confirmar',
      event_location: form.location.trim(),
      event_description: `[Particular] [${form.eventType}] [${form.service}] ${extras}`.trim(),
      agreed_price: null,
      status: 'pending',
      created_by: null,
    };

    const { error } = await supabase.from('flash_bookings' as any).insert(payload);
    if (error) {
      console.warn('[ParticularRequestModal] insert failed:', error);
      setStatus('error');
      return;
    }
    setStatus('done');

    if (typeof window !== 'undefined') {
      (window as any).fbq?.('track', 'Lead', { content_name: 'particular' });
      (window as any).gtag?.('event', 'generate_lead', { lead_type: 'particular', service: form.service });
    }

    supabase.functions.invoke('send-email', { body: { type: 'flash_booking', data: payload } })
      .catch((err: unknown) => console.warn('[ParticularRequestModal] admin email failed:', err));
    supabase.functions.invoke('send-email', { body: { type: 'flash_booking_confirm', data: payload } })
      .catch((err: unknown) => console.warn('[ParticularRequestModal] confirm email failed:', err));
  }

  const labelCls = 'text-xs font-bold uppercase tracking-wide mb-1 block';
  const inputCls = 'nightlife-input text-base !py-2 w-full';

  // z por encima del CookieBanner (z-[9999]): en la primera visita tapaba
  // "Enviar solicitud" en móvil.
  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6 relative max-h-[92vh] overflow-y-auto"
        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/5">
          <X size={16} style={{ color: '#333' }} />
        </button>

        {status === 'done' ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#22c55e' }} />
            <h3 className="text-lg font-black mb-2" style={{ color: '#111' }}>Recibido, {form.name.trim().split(' ')[0]}</h3>
            <p className="text-sm mb-6" style={{ color: '#333' }}>
              Buscamos profesionales disponibles para tu fecha y te escribimos a {form.email.trim()}. Te hemos mandado una copia de tu solicitud.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: '#f5f4f0', border: '1px solid rgba(0,0,0,0.08)', color: '#222' }}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Honeypot anti-bot: invisible para humanos, los bots lo rellenan */}
            <input type="text" name="website" value={form.website} onChange={e => set('website', e.target.value)}
              tabIndex={-1} autoComplete="off" aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#8A6D0F' }}>
                <PartyPopper size={15} />
              </div>
              <h3 className="text-lg font-black" style={{ color: '#111' }}>Cuéntanos tu evento</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: '#333' }}>
              Sin registro, solo tu email. Buscamos por ti a los profesionales disponibles y te escribimos.
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Tu nombre *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Nombre" autoComplete="given-name" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="tu@email.com" autoComplete="email" inputMode="email" className={inputCls} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Tipo de evento *</label>
                  <select value={form.eventType} onChange={e => set('eventType', e.target.value)}
                    className={`${inputCls} appearance-none`} required>
                    <option value="">Selecciona...</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Qué necesitas *</label>
                  <select value={form.service} onChange={e => set('service', e.target.value)}
                    className={`${inputCls} appearance-none`} required>
                    <option value="">Selecciona...</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Fecha</label>
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Ciudad</label>
                  <input value={form.location} onChange={e => set('location', e.target.value)}
                    placeholder="Madrid..." className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls} style={{ color: '#222' }}>Presupuesto aproximado</label>
                <select value={form.budget} onChange={e => set('budget', e.target.value)}
                  className={`${inputCls} appearance-none`}>
                  <option value="">Sin indicar</option>
                  {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls} style={{ color: '#222' }}>Algo más</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value.slice(0, 600))}
                  rows={3} placeholder="Número de invitados, horario, estilo de música..."
                  className={`${inputCls} resize-none`} />
              </div>
            </div>

            {status === 'error' && (
              <p className="text-xs mt-3" style={{ color: '#b91c1c' }}>
                No se ha podido enviar. Prueba otra vez en un momento.
              </p>
            )}

            <button type="submit" disabled={status === 'sending' || !emailOk || !form.name.trim() || !form.eventType || !form.service}
              className="w-full mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Send size={15} /> {status === 'sending' ? 'Enviando...' : 'Enviar solicitud'}
            </button>
            <p className="text-[0.7rem] mt-3 text-center" style={{ color: '#555' }}>
              Usamos tu email solo para responderte sobre este evento.{' '}
              <a href="/privacidad" className="underline">Privacidad</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
