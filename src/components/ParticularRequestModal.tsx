import { useState } from 'react';
import { X, Send, CheckCircle, PartyPopper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * "Soy particular" de la landing (Ficha XDS 73,6, aprobada 11 oct 2026; reparto
 * automático y chat por enlace 17 oct 2026).
 *
 * El particular no se registra: elige qué necesita, pone su ciudad, su nombre y
 * su email. La función particular-solicitud le crea una cuenta sin contraseña,
 * manda la solicitud a los profesionales de ese oficio (con email a cada uno) y,
 * cuando uno acepta, el particular recibe un enlace que entra directo al chat.
 * Si la función falla, cae al INSERT anónimo de antes (lead genérico sin
 * profesional asignado, que se reparte a mano): es el único INSERT anónimo que
 * permite la RLS desde el 9 sep ("Anon can insert generic leads only").
 *
 * 18 oct 2026: fecha y ciudad obligatorias y nada se reparte hasta que el
 * particular pulsa "Confirmar y enviar" en su email (página /solicitud-confirmada).
 *
 * La marca [Particular] al inicio de event_description es lo que mide la
 * death line de la ficha (menos de 10 en 30 días = no se construye el cobro).
 */

const SERVICES = [
  'DJ', 'Disco móvil', 'Música en directo', 'Fotógrafo / vídeo',
  'Camareros / catering', 'Food truck', 'Animación', 'Alquiler de equipo',
  'Varios / no lo sé',
];

// Cómo se nombra a quien recibe la solicitud en la frase "a dónde va".
const DESTINO: Record<string, string> = {
  'DJ': 'DJs', 'Disco móvil': 'discos móviles', 'Música en directo': 'grupos de música en directo',
  'Fotógrafo / vídeo': 'fotógrafos y videógrafos', 'Camareros / catering': 'camareros y catering',
  'Food truck': 'food trucks', 'Animación': 'animadores', 'Alquiler de equipo': 'empresas de alquiler de equipo',
};

const EVENT_TYPES = [
  'Boda', 'Cumpleaños', 'Comunión', 'Bautizo', 'Fiesta privada',
  'Despedida', 'Aniversario', 'Otro',
];

// Sugerencias de ciudad: se puede escribir otra, pero así casi nadie pone basura.
const CIUDADES = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma',
  'Las Palmas de Gran Canaria', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón',
  'A Coruña', 'Granada', 'Vitoria', 'Elche', 'Santa Cruz de Tenerife', 'Oviedo', 'Pamplona',
  'Almería', 'San Sebastián', 'Santander', 'Burgos', 'Castellón', 'Albacete', 'Logroño',
  'Badajoz', 'Salamanca', 'Huelva', 'Marbella', 'Tarragona', 'León', 'Cádiz', 'Jaén',
  'Ourense', 'Girona', 'Lleida', 'Cáceres', 'Toledo', 'Guadalajara', 'Torrejón de Ardoz',
  'Alcalá de Henares', 'Móstoles', 'Fuenlabrada', 'Leganés', 'Getafe', 'Alcorcón',
];

const hoy = () => new Date().toISOString().slice(0, 10);

const BUDGETS = ['Menos de 300 €', '300 a 600 €', '600 a 1.000 €', 'Más de 1.000 €', 'No lo sé'];

interface Props {
  onClose: () => void;
  // Para medir desde dónde llega la solicitud (p. ej. /auth) sin tocar la fila.
  onEnviado?: () => void;
}

export default function ParticularRequestModal({ onClose, onEnviado }: Props) {
  const [form, setForm] = useState({
    name: '', email: '', eventType: '', service: '', date: '', location: '',
    budget: '', message: '', website: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [enviadas, setEnviadas] = useState<number | null>(null);
  // La función pide confirmar el email antes de repartir (18 oct 2026).
  const [verificar, setVerificar] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const ciudadOk = /\p{L}{3}/u.test(form.location.trim());
  const listo = !!form.service && ciudadOk && !!form.date && form.name.trim().length >= 2 && emailOk;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!listo) return;
    // Honeypot: campo oculto que un humano nunca rellena, pero un bot sí.
    if (form.website.trim()) { onClose(); return; }
    setStatus('sending');

    const tipo = form.eventType || 'Otro';
    const { data: res, error: fnError } = await supabase.functions.invoke('particular-solicitud', {
      body: { ...form, eventType: tipo },
    });

    if (fnError || !res?.ok) {
      // La función puede rechazar con un motivo claro (email falso, demasiadas
      // solicitudes): se enseña. Un fallo técnico cae al lead genérico de antes.
      const motivo = await motivoDeError(fnError, res);
      if (motivo) { setStatus('error'); setErrorMsg(motivo); return; }
      const ok = await enviarComoLeadGenerico(tipo);
      if (!ok) { setStatus('error'); return; }
    } else {
      setVerificar(!!res.verificar);
      setEnviadas(typeof res.enviadas === 'number' ? res.enviadas : null);
    }

    setStatus('done');
    onEnviado?.();
    if (typeof window !== 'undefined') {
      (window as any).fbq?.('track', 'Lead', { content_name: 'particular' });
      (window as any).gtag?.('event', 'generate_lead', { lead_type: 'particular', service: form.service });
    }
  }

  // Mensaje de error que la función quiso enseñar al usuario (400/429), si lo hay.
  async function motivoDeError(fnError: unknown, res: { error?: string } | null): Promise<string | null> {
    if (res?.error) return res.error;
    const ctx = (fnError as { context?: Response } | null)?.context;
    if (ctx && ctx.status >= 400 && ctx.status < 500) {
      try { const j = await ctx.clone().json(); return typeof j?.error === 'string' ? j.error : null; } catch { return null; }
    }
    return null;
  }

  async function enviarComoLeadGenerico(tipo: string): Promise<boolean> {
    const extras = [form.budget && `Presupuesto: ${form.budget}`, form.message.trim()].filter(Boolean).join(' · ');
    const payload = {
      professional_name: `Solicitud particular: ${form.service}`,
      professional_role: 'general',
      requester_name: form.name.trim(),
      requester_contact: form.email.trim(),
      event_date: form.date || 'Por confirmar',
      event_location: form.location.trim(),
      event_description: `[Particular] [${tipo}] [${form.service}] ${extras}`.trim(),
      agreed_price: null,
      status: 'pending',
      created_by: null,
    };
    const { error } = await supabase.from('flash_bookings' as any).insert(payload);
    if (error) { console.warn('[ParticularRequestModal] insert failed:', error); return false; }
    supabase.functions.invoke('send-email', { body: { type: 'flash_booking', data: payload } })
      .catch((err: unknown) => console.warn('[ParticularRequestModal] admin email failed:', err));
    supabase.functions.invoke('send-email', { body: { type: 'flash_booking_confirm', data: payload } })
      .catch((err: unknown) => console.warn('[ParticularRequestModal] confirm email failed:', err));
    return true;
  }

  const labelCls = 'text-xs font-bold uppercase tracking-wide mb-1 block';
  const inputCls = 'nightlife-input text-base !py-2.5 w-full';

  const destino = DESTINO[form.service];
  const ciudad = form.location.trim();

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
            <CheckCircle size={44} className="mx-auto mb-4" style={{ color: '#22c55e' }} />
            {verificar ? (
              <>
                <h3 className="text-lg font-black mb-2" style={{ color: '#111' }}>Último paso, {form.name.trim().split(' ')[0]}</h3>
                <p className="text-sm mb-2" style={{ color: '#333' }}>
                  Te hemos mandado un email a <strong>{form.email.trim()}</strong>.
                </p>
                <p className="text-sm mb-6" style={{ color: '#333' }}>
                  Pulsa <strong>Confirmar y enviar</strong> en ese correo y se lo mandamos a los profesionales. Si no lo ves, mira en spam.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-black mb-2" style={{ color: '#111' }}>Enviado, {form.name.trim().split(' ')[0]}</h3>
                <p className="text-sm mb-2" style={{ color: '#333' }}>
                  {enviadas
                    ? `Se lo hemos mandado a ${enviadas} ${enviadas === 1 ? 'profesional' : 'profesionales'}${destino ? ` (${destino})` : ''}.`
                    : 'Estamos buscando a quién mandárselo.'}
                </p>
                <p className="text-sm mb-6" style={{ color: '#333' }}>
                  Cuando uno diga que sí, te escribimos a <strong>{form.email.trim()}</strong> con un botón para hablar con él. No tienes que hacer nada más.
                </p>
              </>
            )}
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
              <h3 className="text-lg font-black" style={{ color: '#111' }}>¿Qué necesitas?</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: '#333' }}>
              5 datos y listo. Sin registro ni contraseña.
            </p>

            {/* 1. Qué necesita: botones grandes, un toque. */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {SERVICES.map(s => {
                const activo = form.service === s;
                return (
                  <button key={s} type="button" onClick={() => set('service', s)} aria-pressed={activo}
                    className="px-3 py-3 rounded-xl text-sm font-bold text-left transition-all"
                    style={{
                      background: activo ? 'linear-gradient(135deg,#D4AF37,#B8941E)' : '#faf8f1',
                      color: activo ? '#000' : '#222',
                      border: activo ? '2px solid #8A6D0F' : '1px solid rgba(0,0,0,0.12)',
                    }}>
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Ciudad del evento *</label>
                  <input value={form.location} onChange={e => set('location', e.target.value)} list="ciudades-particular"
                    placeholder="Madrid, Valencia..." autoComplete="address-level2" className={inputCls} required minLength={3} />
                  <datalist id="ciudades-particular">
                    {CIUDADES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Fecha *</label>
                  <input type="date" value={form.date} min={hoy()} onChange={e => set('date', e.target.value)}
                    className={inputCls} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Tu nombre *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Nombre" autoComplete="given-name" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls} style={{ color: '#222' }}>Tu email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="tu@email.com" autoComplete="email" inputMode="email" className={inputCls} required />
                </div>
              </div>

              {/* Tipo de evento, presupuesto y notas son opcionales: plegados para
                  que el formulario no se vea largo (quien lo ve largo se va). */}
              <details className="rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                <summary className="px-3 py-2.5 text-xs font-bold cursor-pointer select-none" style={{ color: '#222' }}>
                  Añadir más detalles (opcional)
                </summary>
                <div className="px-3 pb-3 space-y-3">
                  <div>
                    <label className={labelCls} style={{ color: '#222' }}>Tipo de evento</label>
                    <select value={form.eventType} onChange={e => set('eventType', e.target.value)}
                      className={`${inputCls} appearance-none`}>
                      <option value="">Sin indicar</option>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
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
              </details>
            </div>

            {/* A dónde va lo que se manda: cambia según lo que elige. */}
            <p className="text-xs mt-4 rounded-lg px-3 py-2" style={{ background: 'rgba(22,163,74,0.08)', color: '#14532d' }}>
              {destino
                ? <>Se lo enviamos directamente a los <strong>{destino}</strong>{ciudad ? <> de <strong>{ciudad}</strong></> : ''}. Confirmas tu email y, cuando uno diga que sí, habláis por el chat de XPEAK.</>
                : 'Elige qué necesitas y se lo enviamos directamente a los profesionales de ese oficio. Te avisamos por email cuando uno diga que sí.'}
            </p>

            {status === 'error' && (
              <p className="text-xs mt-3" style={{ color: '#b91c1c' }}>
                {errorMsg ?? 'No se ha podido enviar. Prueba otra vez en un momento.'}
              </p>
            )}

            <button type="submit" disabled={status === 'sending' || !listo}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-black text-base transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Send size={16} /> {status === 'sending' ? 'Enviando...' : 'Enviar'}
            </button>
            <p className="text-[0.75rem] mt-3 text-center" style={{ color: '#555' }}>
              Usamos tu email solo para esta solicitud y para que hables con el profesional.{' '}
              <a href="/privacidad" className="underline">Privacidad</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
