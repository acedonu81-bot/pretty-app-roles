import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HZ_PLANES, type HZPlan } from '@/data/healthyZone';
import { HZ, clay, clayButton, clayInset, GREEN_RGB, SURFACE_RGB } from './clay';

const PERSONAS = ['Menos de 20', '20-50', '50-100', 'Más de 100'];

const fieldStyle = {
  background: HZ.inputBg,
  boxShadow: clayInset,
  border: 'none',
  color: HZ.ink,
  fontFamily: 'inherit',
} as const;

// Formulario "¿Qué quieres montar?". Guarda en leads con source
// 'healthy_zone' y la página de origen, que es lo que mide la fase 1.
// stacked: título encima del formulario (columnas estrechas, como en las guías).
export default function HZLeadForm({ origin, title, defaultPlan = 'Tardeo', stacked = false }: { origin: string; title: string; defaultPlan?: HZPlan; stacked?: boolean }) {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<string>(defaultPlan);
  const [personas, setPersonas] = useState('');
  const [cuando, setCuando] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('error'); return; }
    setStatus('loading');
    const detalle = [`plan: ${plan}`, personas && `personas: ${personas}`, cuando.trim() && `cuándo: ${cuando.trim()}`]
      .filter(Boolean)
      .join(' · ');
    const { error } = await supabase.from('leads').insert({
      email: email.toLowerCase().trim(),
      source: 'healthy_zone',
      article_path: origin,
      intent: detalle.slice(0, 500),
    });
    // 23505: ese email ya envió una solicitud antes; para quien la manda es un éxito.
    if (error && error.code !== '23505') { setStatus('error'); return; }
    setStatus('success');
  };

  return (
    <section
      id="plan"
      className={`scroll-mt-6 rounded-[36px] sm:rounded-[48px] p-6 sm:p-12 flex flex-col gap-8 ${stacked ? '' : 'lg:flex-row lg:gap-14'}`}
      style={{ background: HZ.surface, boxShadow: clay(SURFACE_RGB, 'lg') }}
    >
      <div className={`flex flex-col gap-3 shrink-0 ${stacked ? '' : 'lg:w-[380px]'}`}>
        <h2 className="m-0 text-3xl sm:text-[42px] leading-[1.05]" style={{ fontFamily: HZ.display, fontWeight: 800, letterSpacing: '-1px' }}>{title}</h2>
        <p className="m-0 text-base sm:text-[17px] leading-relaxed" style={{ color: HZ.inkSoft }}>
          Cuéntanos el plan y te ayudamos a encontrar a los profesionales: DJ, camareros, catering y más.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex-1 flex flex-col justify-center gap-2 rounded-[28px] p-8" style={{ background: '#C8EED8', boxShadow: clay(GREEN_RGB, 'md') }}>
          <p className="m-0 text-2xl" style={{ fontFamily: HZ.display, fontWeight: 800 }}>Recibido</p>
          <p className="m-0 text-base" style={{ color: HZ.inkSoft }}>Te escribimos por email para ver qué necesitas y qué profesionales encajan.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>
          <label className="flex flex-col gap-2 text-sm" style={{ fontWeight: 800 }}>
            Tu email
            <input
              type="email" required value={email} placeholder="tu@email.com" autoComplete="email"
              onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
              className="rounded-[22px] px-5 py-4 text-base outline-none" style={fieldStyle}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm" style={{ fontWeight: 800 }}>
            Tipo de plan
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="rounded-[22px] px-5 py-4 text-base outline-none" style={fieldStyle}>
              {HZ_PLANES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm" style={{ fontWeight: 800 }}>
            Personas
            <select value={personas} onChange={(e) => setPersonas(e.target.value)} className="rounded-[22px] px-5 py-4 text-base outline-none" style={fieldStyle}>
              <option value="">Aún no lo sé</option>
              {PERSONAS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm" style={{ fontWeight: 800 }}>
            Cuándo, más o menos
            <input
              type="text" value={cuando} maxLength={120} placeholder="Octubre, un sábado"
              onChange={(e) => setCuando(e.target.value)}
              className="rounded-[22px] px-5 py-4 text-base outline-none" style={fieldStyle}
            />
          </label>
          <button
            type="submit" disabled={status === 'loading'}
            className="sm:col-span-2 rounded-full py-4 text-lg transition-transform hover:scale-[1.01] disabled:opacity-60"
            style={{ background: HZ.green, color: '#fff', fontWeight: 800, border: 'none', fontFamily: 'inherit', cursor: 'pointer', boxShadow: clayButton(GREEN_RGB) }}
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar mi plan'}
          </button>
          {status === 'error' && (
            <p className="sm:col-span-2 m-0 text-sm" style={{ color: '#B42318', fontWeight: 700 }}>Revisa el email o inténtalo de nuevo.</p>
          )}
        </form>
      )}
    </section>
  );
}
