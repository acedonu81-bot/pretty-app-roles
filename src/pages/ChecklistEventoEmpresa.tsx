import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Send, ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FooterPublic from '@/components/FooterPublic';

const LS_KEY = 'xpeak_checklist_empresa_v1';

const CHECKLIST_PHASES = [
  { phase: '8-12 semanas', color: '#e74c3c', label: 'Urgente', tasks: ['Definir objetivo, aforo y presupuesto total', 'Reservar espacio o local', 'Contactar catering y pedir 2-3 presupuestos', 'Bloquear la fecha con los proveedores clave antes de que se agote su disponibilidad'] },
  { phase: '4-8 semanas', color: '#e67e22', label: 'Esencial', tasks: ['Cerrar DJ, música en vivo o entretenimiento', 'Confirmar staff y personal de sala', 'Definir producción audiovisual (pantallas, sonido, iluminación)', 'Reservar fotógrafo o videógrafo si el evento lo requiere'] },
  { phase: '2-4 semanas', color: '#f39c12', label: 'Importante', tasks: ['Firmar contratos con todos los proveedores', 'Confirmar número final de asistentes al catering', 'Preparar timing detallado del evento', 'Enviar invitaciones o confirmaciones a los asistentes'] },
  { phase: 'Última semana', color: '#3498db', label: 'Final', tasks: ['Briefing final con cada proveedor', 'Confirmar horarios de montaje y acceso', 'Tener un plan B para imprevistos', 'Designar una persona de contacto el día del evento'] },
];

const faqStructured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Con cuánta antelación hay que empezar a organizar un evento de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'Para eventos de más de 50 personas, entre 2 y 3 meses de antelación. Para cenas o presentaciones pequeñas, 3-4 semanas suelen ser suficientes. La antelación depende sobre todo de si necesitas reservar espacio y catering, que son los proveedores que antes se agotan en fechas populares.' } },
    { '@type': 'Question', name: '¿Qué proveedores hay que contratar primero?', acceptedAnswer: { '@type': 'Answer', text: 'El espacio y el catering se reservan primero porque son los que antes se agotan y condicionan la fecha disponible. Después DJ o música en vivo, y por último staff, fotografía y decoración, que suelen tener más disponibilidad de última hora.' } },
    { '@type': 'Question', name: '¿Cuánto cuesta organizar un evento de empresa?', acceptedAnswer: { '@type': 'Answer', text: 'El coste varía mucho según aforo y ambición, pero como referencia orientativa: catering suele ser la partida mayor, seguido de espacio, entretenimiento (DJ o música en vivo) y staff. Pedir presupuesto directo a varios profesionales sin intermediarios es la forma más rápida de ajustar el precio real a tu evento.' } },
    { '@type': 'Question', name: '¿Se puede organizar un evento de empresa sin agencia?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, especialmente para eventos de hasta 100-150 personas. Con un checklist claro y comparando proveedores directamente, es perfectamente viable gestionarlo internamente y ahorrar la comisión de agencia.' } },
    { '@type': 'Question', name: '¿Qué pasa si un proveedor cancela a última hora?', acceptedAnswer: { '@type': 'Answer', text: 'Por eso conviene tener un plan B identificado desde la fase de "Última semana": un segundo contacto de la misma categoría (DJ, catering, staff) al que puedas recurrir con poca antelación. Tener varios profesionales verificados guardados de la fase de presupuestos ayuda a reaccionar rápido.' } },
  ],
};

const ALL_TASKS = CHECKLIST_PHASES.flatMap((p, pi) => p.tasks.map((t, ti) => ({ id: `${pi}-${ti}`, text: t, color: p.color, phase: p.phase })));

function daysUntil(ds: string): number | null {
  if (!ds) return null;
  const target = new Date(ds);
  const diff = Math.ceil((target.getTime() - Date.now()) / 86400000);
  return diff > 0 ? diff : null;
}

// Fase activa según los días restantes hasta el evento — resalta qué bloque toca ahora mismo.
function activePhaseIndex(days: number | null): number {
  if (days === null) return -1;
  if (days > 56) return 0;
  if (days > 28) return 1;
  if (days > 14) return 2;
  return 3;
}

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Checklist para organizar un evento de empresa con countdown',
  description: 'Checklist interactivo con cuenta atrás por fecha para organizar un evento de empresa: qué contratar y cuándo, paso a paso.',
  datePublished: '2026-07-19',
  dateModified: '2026-07-19',
  author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
  publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
};

export default function ChecklistEventoEmpresa() {
  const [eventDate, setEventDate] = useState('');
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: '', contact: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.eventDate) setEventDate(data.eventDate);
        if (data.checkedTasks) setCheckedTasks(new Set(data.checkedTasks));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ eventDate, checkedTasks: [...checkedTasks] }));
  }, [eventDate, checkedTasks]);

  const days = useMemo(() => daysUntil(eventDate), [eventDate]);
  const activePhase = useMemo(() => activePhaseIndex(days), [days]);
  const doneCount = checkedTasks.size;
  const totalCount = ALL_TASKS.length;

  const toggleTask = (id: string) => setCheckedTasks(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) return;
    setSending(true);
    const payload = {
      professional_name: 'Solicitud general — Evento de empresa',
      professional_role: 'general',
      requester_name: form.name,
      requester_contact: form.contact,
      event_date: eventDate || 'Por confirmar',
      event_location: '',
      event_description: `[Evento de empresa] Checklist completado: ${doneCount}/${totalCount} tareas`,
      agreed_price: null,
      status: 'pending',
      created_by: null,
    };
    const { error } = await supabase.from('flash_bookings' as any).insert(payload);
    setSending(false);
    if (error) return;
    supabase.functions.invoke('send-email', { body: { type: 'flash_booking', data: payload } })
      .catch((err: unknown) => console.warn('[Checklist] admin email failed:', err));
    if (form.contact.includes('@')) {
      supabase.functions.invoke('send-email', { body: { type: 'flash_booking_confirm', data: payload } })
        .catch((err: unknown) => console.warn('[Checklist] confirm email failed:', err));
    }
    setSent(true);
  }

  return (
    <>
      <Helmet>
        <title>Checklist para organizar un evento de empresa (2026) | XPEAK</title>
        <meta name="description" content="Checklist interactivo con cuenta atrás por fecha para organizar un evento de empresa: qué contratar y cuándo, paso a paso. Gratis, sin registro." />
        <link rel="canonical" href="https://xpeak.es/checklist-evento-empresa" />
        <meta property="og:title" content="Checklist para organizar un evento de empresa — XPEAK" />
        <meta property="og:description" content="Checklist interactivo con cuenta atrás: qué contratar y cuándo para tu evento de empresa." />
        <meta property="og:url" content="https://xpeak.es/checklist-evento-empresa" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-4xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <a href="/auth?mode=register&role=empresario" className="px-3 py-2 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>Eventos de empresa · Checklist con countdown</p>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2" style={{ lineHeight: 1.15 }}>
            Checklist para organizar tu evento de empresa
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Marca las tareas hechas, pon la fecha de tu evento y sabrás exactamente qué toca esta semana. Se guarda automáticamente en tu navegador.
          </p>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <div className="rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.12),rgba(184,148,30,0.06))', border: '1px solid rgba(212,175,55,0.3)' }}>
            <div className="flex items-center gap-3">
              <ClipboardList size={20} style={{ color: '#D4AF37' }} />
              <div>
                <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Fecha de tu evento</p>
                {days !== null ? (
                  <p className="text-xl font-black" style={{ color: '#D4AF37' }}>{days} días para el evento</p>
                ) : (
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Añade la fecha para activar la cuenta atrás</p>
                )}
              </div>
            </div>
            <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: eventDate ? '#D4AF37' : 'rgba(255,255,255,0.3)', outline: 'none', colorScheme: 'dark' }} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <div className="mb-6 rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-black" style={{ color: '#D4AF37' }}>Progreso</p>
              <p className="text-sm font-black" style={{ color: '#D4AF37' }}>{doneCount}/{totalCount}</p>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round((doneCount / totalCount) * 100)}%`, background: 'linear-gradient(90deg,#D4AF37,#B8941E)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHECKLIST_PHASES.map((phase, pi) => {
              const phaseTasks = ALL_TASKS.filter(t => t.phase === phase.phase);
              const phaseDone = phaseTasks.filter(t => checkedTasks.has(t.id)).length;
              const isActive = pi === activePhase;
              return (
                <div key={phase.phase} className="rounded-xl p-4"
                  style={{
                    background: isActive ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)',
                    border: isActive ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    borderTop: `3px solid ${phase.color}`,
                  }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-black" style={{ color: phase.color }}>{phase.phase} {isActive && '· ahora'}</p>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{phaseDone}/{phase.tasks.length}</span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>{phase.label}</p>
                  <div className="space-y-2">
                    {phaseTasks.map(task => {
                      const done = checkedTasks.has(task.id);
                      return (
                        <button key={task.id} onClick={() => toggleTask(task.id)} className="w-full flex items-start gap-2.5 text-left">
                          <div className="w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center"
                            style={{ background: done ? phase.color : 'transparent', border: `1.5px solid ${done ? phase.color : 'rgba(255,255,255,0.2)'}` }}>
                            {done && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <p className="text-xs" style={{ color: done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)', textDecoration: done ? 'line-through' : 'none' }}>{task.text}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
          <h2 className="text-xl sm:text-2xl font-black mb-3" style={{ color: '#D4AF37' }}>Cómo usar este checklist</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
            El checklist está dividido en cuatro fases según el tiempo que falta para tu evento: desde las 8-12 semanas de antelación, cuando toca bloquear espacio y catering antes de que se agote la disponibilidad, hasta la última semana, donde el foco pasa a briefings y planes B. Introduce la fecha de tu evento arriba y la fase activa se resaltará automáticamente para que sepas qué tareas tocan ahora mismo.
          </p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
            El orden importa: el espacio y el catering condicionan la fecha y son los primeros en agotarse, así que se reservan antes que el resto. DJ, música en vivo y producción audiovisual van en la fase intermedia, y el staff, la fotografía y la decoración suelen tener más margen para cerrarse más tarde.
          </p>
          <h2 className="text-xl sm:text-2xl font-black mb-3 mt-6" style={{ color: '#D4AF37' }}>Proveedores que necesitarás</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
            La mayoría de eventos de empresa —presentaciones, cenas, team building, galas o congresos— comparten un núcleo de proveedores: catering, staff de sala, DJ o música en vivo, y producción audiovisual. Puedes comparar profesionales verificados directamente en el directorio, sin comisión:
          </p>
          <ul className="text-sm leading-relaxed mb-3 list-disc pl-5 space-y-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <li><a href="/contratar-catering/madrid" className="underline hover:opacity-80" style={{ color: '#D4AF37' }}>Catering para eventos en Madrid</a></li>
            <li><a href="/contratar-camareros/madrid" className="underline hover:opacity-80" style={{ color: '#D4AF37' }}>Camareros y staff de sala en Madrid</a></li>
            <li><a href="/organizar-eventos" className="underline hover:opacity-80" style={{ color: '#D4AF37' }}>Guía completa para organizar cualquier tipo de evento</a></li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-black mb-4 mt-8" style={{ color: '#D4AF37' }}>Preguntas frecuentes</h2>
          <div className="space-y-4 mb-10">
            {faqStructured.mainEntity.map((f) => (
              <div key={f.name} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-black mb-1" style={{ color: '#fff' }}>{f.name}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-12">
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.18)' }}>
            {sent ? (
              <div className="text-center py-6">
                <CheckCircle size={40} style={{ color: '#D4AF37', marginBottom: 12 }} />
                <p className="text-xl font-black mb-2" style={{ color: '#D4AF37' }}>Solicitud enviada</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Los profesionales disponibles te contactarán. También puedes buscarlos tú directamente en el directorio.</p>
                <a href="/directorio/staff" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl text-sm font-black" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  Ver directorio →
                </a>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-5">
                  <Send size={20} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-lg font-black" style={{ lineHeight: 1.2 }}>¿Quieres que los profesionales te contacten?</p>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Solo tu nombre y contacto. Sin comisión.
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input required placeholder="Tu nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="nightlife-input" style={{ colorScheme: 'dark' }} />
                  <input required placeholder="Email o teléfono" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    className="nightlife-input" style={{ colorScheme: 'dark' }} />
                  <button type="submit" disabled={sending}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                    {sending ? 'Enviando...' : 'Solicitar presupuesto →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
