import { useState } from 'react';
import { X, Send, CheckCircle, Users, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Lead centralizado: el organizador rellena UN formulario y la solicitud se
 * envía a la vez a todos los profesionales reales de la categoría/ciudad.
 * Invierte la carga de trabajo — en vez de que el organizador elija a quién
 * escribir (fricción alta, causa del 0% de conversión histórico), son los
 * profesionales quienes compiten por responder primero. Modelo GigSalad/Thumbtack.
 */

interface TargetPro {
  user_id: string;
  display_name: string;
  role: string;
}

interface Props {
  categoryLabel: string;   // "DJs", "Fotógrafos"...
  city: string;            // "Todas" o ciudad concreta
  pros: TargetPro[];       // profesionales reales (sin seed) de la lista actual
  onClose: () => void;
}

const EVENT_TYPES = [
  'Boda', 'Cumpleaños', 'Evento corporativo', 'Comunión', 'Fiesta privada',
  'Festival / Concierto', 'Inauguración', 'Otro',
];

export default function MultiRequestModal({ categoryLabel, city, pros, onClose }: Props) {
  const [form, setForm] = useState({ name: '', contact: '', eventType: '', date: '', location: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [sentCount, setSentCount] = useState(0);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Grupo común para trazar que estas N solicitudes son un mismo lead — sin
  // necesitar columna nueva: va en event_description como marca [grupo:xxxx].
  const groupTag = () => `g${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.eventType) return;
    if (pros.length === 0) return;
    // Honeypot: campo oculto que un humano nunca rellena, pero un bot sí.
    if (form.website.trim()) { onClose(); return; }
    setStatus('sending');

    // Si hay sesión, la solicitud queda atada a esa cuenta. Fijarlo a null
    // hacía la fila ilegible para siempre del lado del organizador (la RLS
    // filtra por created_by = auth.uid()): su Historial salía vacío aunque
    // acabara de enviar la solicitud.
    const { data: { user: sessionUser } } = await supabase.auth.getUser();
    const grp = groupTag();
    const locationText = form.location.trim() || (city !== 'Todas' ? city : '');
    const rows = pros.map(p => ({
      professional_name: p.display_name,
      professional_role: p.role,
      professional_user_id: p.user_id,
      requester_name: form.name.trim(),
      requester_contact: form.contact.trim(),
      event_date: form.date || 'Por confirmar',
      event_location: locationText,
      event_description: `[${form.eventType}] ${form.message.trim()} [grupo:${grp}]`.trim(),
      status: 'pending',
      created_by: sessionUser?.id ?? null,
    }));

    const { error } = await supabase.from('flash_bookings' as any).insert(rows);
    if (error) {
      console.error('[MultiRequestModal] insert error:', error);
      setStatus('error');
      return;
    }

    setSentCount(rows.length);
    setStatus('done');

    // Aviso a admin del lead centralizado (un solo email resumen).
    supabase.functions.invoke('send-email', {
      body: {
        type: 'flash_booking',
        data: {
          professional_name: `${rows.length} ${categoryLabel} (lead centralizado)`,
          requester_name: form.name.trim(),
          requester_contact: form.contact.trim(),
          event_date: form.date || 'Por confirmar',
          event_location: locationText,
          event_description: rows[0].event_description,
        },
      },
    }).catch((err: unknown) => console.warn('[MultiRequestModal] admin email failed:', err));

    // Notificación a cada profesional (best-effort, nunca bloquea el flujo).
    pros.forEach(p => {
      supabase.functions.invoke('send-email', {
        body: {
          type: 'booking_received',
          data: {
            professional_user_id: p.user_id,
            professional_name: p.display_name,
            requester_name: form.name.trim(),
            requester_contact: form.contact.trim(),
            event_date: form.date || 'Por confirmar',
            event_location: locationText,
          },
        },
      }).catch(() => { /* silencioso */ });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6 relative"
        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/5">
          <X size={16} style={{ color: '#333' }} />
        </button>

        {status === 'done' ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#22c55e' }} />
            <h3 className="text-lg font-black mb-2" style={{ color: '#111' }}>Enviado a {sentCount} profesional{sentCount > 1 ? 'es' : ''}</h3>
            <p className="text-sm mb-6" style={{ color: '#333' }}>
              Los que estén disponibles para tu fecha te contactarán directamente. Recibirás varias respuestas — quédate con la que más te convenza.
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
              tabIndex={-1} autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#8A6D0F' }}>
                <Users size={15} />
              </div>
              <h3 className="text-lg font-black" style={{ color: '#111' }}>Pide presupuesto a varios</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: '#333' }}>
              Un solo formulario. Lo enviamos a {pros.length} {categoryLabel.toLowerCase()}{city !== 'Todas' ? ` de ${city}` : ''} y te responden los disponibles. Sin registro, gratis.
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: '#222' }}>Tu nombre *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Nombre" className="nightlife-input text-sm !py-2 w-full" required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: '#222' }}>Contacto (tel/email) *</label>
                  <input value={form.contact} onChange={e => set('contact', e.target.value)}
                    placeholder="+34 600... / tu@email" className="nightlife-input text-sm !py-2 w-full" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: '#222' }}>Tipo de evento *</label>
                <select value={form.eventType} onChange={e => set('eventType', e.target.value)}
                  className="nightlife-input text-sm !py-2 w-full appearance-none" required>
                  <option value="">Selecciona...</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: '#222' }}>Fecha</label>
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                    className="nightlife-input text-sm !py-2 w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: '#222' }}>Lugar / ciudad</label>
                  <input value={form.location} onChange={e => set('location', e.target.value)}
                    placeholder={city !== 'Todas' ? city : 'Ciudad'} className="nightlife-input text-sm !py-2 w-full" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1 block" style={{ color: '#222' }}>Cuéntales qué necesitas (opcional)</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)}
                  placeholder="Nº de invitados, horario, estilo, presupuesto aproximado..." rows={3}
                  className="nightlife-input text-sm !py-2 w-full resize-none" />
              </div>
            </div>

            {status === 'error' && (
              <p className="text-xs mt-3 text-center" style={{ color: '#ff5f56' }}>Error al enviar. Inténtalo de nuevo.</p>
            )}

            <button type="submit" disabled={status === 'sending' || pros.length === 0}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              {status === 'sending'
                ? 'Enviando...'
                : <><Zap size={15} /> Pedir presupuesto a {pros.length}</>}
            </button>
            <p className="text-center text-[0.7rem] mt-2" style={{ color: '#666' }}>
              Sin registro · Sin comisión · Te responden directamente
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
