import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

export default function BajaEmails() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get('email');
    if (e) setEmail(e);
  }, []);

  async function handleUnsubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');
    try {
      const { error } = await supabase.functions.invoke('email-unsubscribe', {
        body: { email },
      });
      if (error) throw error;
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Helmet>
        <title>Anular suscripción | XPEAK</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFFFFF', color: '#111' }}>
        <div className="w-full max-w-sm text-center">
          <a href="/" className="inline-block text-lg font-black tracking-tight mb-10" style={{ color: '#8B6A00' }}>XPEAK</a>

          {status === 'done' ? (
            <div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <span style={{ fontSize: 22 }}>✓</span>
              </div>
              <h1 className="text-xl font-black mb-3">Suscripción anulada</h1>
              <p className="text-sm mb-6" style={{ color: '#374151' }}>
                Ya no recibirás emails de XPEAK en <strong style={{ color: '#374151' }}>{email}</strong>.
              </p>
              <p className="text-xs" style={{ color: '#6b7280' }}>
                ¿Fue un error? Escríbenos a{' '}
                <a href="mailto:info@xpeak.es" style={{ color: '#8B6A00' }}>info@xpeak.es</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe}>
              <h1 className="text-xl font-black mb-2">Anular suscripción</h1>
              <p className="text-sm mb-8" style={{ color: '#374151' }}>
                Confirma tu email para dejar de recibir comunicaciones de XPEAK.
              </p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm mb-4 outline-none"
                style={{
                  background: '#FFFDF7',
                  border: '1px solid rgba(122,98,22,0.16)',
                  color: '#111'}}
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email.includes('@')}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={{
                  background: status === 'loading'
                    ? '#FFFDF7'
                    : '#FBF3DD',
                  border: '1px solid rgba(122,98,22,0.16)',
                  color: status === 'loading' ? '#374151' : '#374151'}}
              >
                {status === 'loading' ? 'Procesando…' : 'Anular suscripción'}
              </button>
              {status === 'error' && (
                <p className="text-xs mt-4" style={{ color: '#ff5f56' }}>
                  Algo ha ido mal. Escríbenos a{' '}
                  <a href="mailto:info@xpeak.es" style={{ color: '#8B6A00' }}>info@xpeak.es</a>
                </p>
              )}
              <p className="text-xs mt-6" style={{ color: '#9ca3af' }}>
                Los emails de seguridad (verificación, contraseña) seguirán llegando.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
