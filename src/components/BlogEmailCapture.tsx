import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BlogEmailCaptureProps {
  intent?: 'contratar-dj' | 'ser-profesional' | 'contratar-staff' | 'contratar-makeup' | 'contratar-fotografo' | 'contratar-musico' | 'contratar-bailarin' | 'general';
  articlePath?: string;
  variant?: 'presupuestos' | 'plantilla' | 'guia';
}

const PROFILE_LABEL: Record<string, string> = {
  'contratar-dj': 'DJs',
  'contratar-staff': 'profesionales de staff',
  'contratar-makeup': 'maquilladoras',
  'contratar-fotografo': 'fotógrafos',
  'contratar-musico': 'músicos',
  'contratar-bailarin': 'bailarines e instructores',
  'ser-profesional': 'profesionales',
  'general': 'profesionales',
};

const COPY = {
  'presupuestos': {
    headline: (label: string) => `Recibe 3 presupuestos de ${label} verificados gratis`,
    sub: 'Sin registro. Sin compromiso. En menos de 24 horas.',
    cta: 'Enviar presupuestos a mi email →',
    badge: 'Gratis · Sin spam',
  },
  'plantilla': {
    headline: () => 'Descarga la plantilla de contrato gratis',
    sub: 'Formato Word editable con todas las cláusulas legales. Sin registro.',
    cta: 'Descargar plantilla gratis →',
    badge: 'PDF + Word · Actualizado 2026',
  },
  'guia': {
    headline: () => 'Guía completa de precios 2026 — gratis',
    sub: 'Tarifas reales por ciudad, tipo de evento y horas. Descárgala al instante.',
    cta: 'Recibir guía en mi email →',
    badge: 'Gratis · Sin spam',
  },
};

export default function BlogEmailCapture({
  intent = 'general',
  articlePath = '',
  variant = 'presupuestos',
}: BlogEmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const c = COPY[variant as keyof typeof COPY] ?? COPY.presupuestos;
  const profileLabel = PROFILE_LABEL[intent] ?? PROFILE_LABEL.general;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Introduce un email válido');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.from('leads').upsert(
      { email: email.toLowerCase().trim(), source: 'blog', article_path: articlePath, intent },
      { onConflict: 'email' }
    );

    if (error && error.code !== '23505') {
      setStatus('error');
      setErrorMsg('Error al guardar. Inténtalo de nuevo.');
      return;
    }

    // Enviar email de bienvenida (fire-and-forget, no bloquea el flujo)
    supabase.functions.invoke('send-email', {
      body: {
        type: 'lead_welcome',
        data: { email: email.toLowerCase().trim(), intent, variant, article_path: articlePath },
      },
    }).catch(() => {}); // silencioso si falla

    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="my-8 rounded-2xl p-6 text-center"
        style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <p className="text-2xl mb-2">✓</p>
        <p className="text-sm font-black mb-1" style={{ color: '#22c55e' }}>¡Listo! Revisa tu bandeja de entrada</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {variant === 'presupuestos'
            ? `Te pondremos en contacto con ${profileLabel} verificados en menos de 24h.`
            : 'Te hemos enviado el enlace de descarga a tu email.'}
        </p>
        <p className="text-xs mt-3">
          <a href="/auth?mode=register" className="underline font-bold" style={{ color: '#D4AF37' }}>
            Crear perfil completo en XPEAK →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)', border: '1px solid rgba(212,175,55,0.25)' }}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[0.6rem] font-black uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.7)' }}>
            XPEAK
          </span>
          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
            {c.badge}
          </span>
        </div>
        <p className="text-base font-black leading-snug mb-1.5" style={{ color: '#fff' }}>{c.headline(profileLabel)}</p>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{c.sub}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
            placeholder="tu@email.com"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            {status === 'loading' ? 'Enviando...' : c.cta}
          </button>
        </form>

        {errorMsg && (
          <p className="text-xs mt-2" style={{ color: '#ff5f56' }}>{errorMsg}</p>
        )}

        <p className="text-[0.6rem] mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Sin spam. Puedes darte de baja en cualquier momento.
        </p>
      </div>
    </div>
  );
}
