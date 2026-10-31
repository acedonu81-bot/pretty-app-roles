import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

/**
 * Botón de los correos para particulares sin contraseña (31 oct 2026). El
 * enlace del correo es una firma duradera; el enlace de entrada de verdad se
 * pide AQUÍ al pulsar el botón (POST), no al abrir la página, para que los
 * antivirus del correo (Outlook/Hotmail) que abren los enlaces no lo gasten.
 */
export default function Acceso() {
  const [estado, setEstado] = useState<'listo' | 'entrando' | 'error'>('listo');
  const t = new URLSearchParams(window.location.search).get('t');

  const entrar = async () => {
    if (!t) { setEstado('error'); return; }
    setEstado('entrando');
    const { data, error } = await supabase.functions.invoke('acceso-particular', { body: { t } });
    if (error || !data?.ok || typeof data.url !== 'string') { setEstado('error'); return; }
    window.location.href = data.url;
  };

  return (
    <>
      <Helmet>
        <title>Entrar a mis conversaciones | XPEAK</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFFFFF', color: '#111' }}>
        <div className="w-full max-w-sm text-center">
          <a href="/" className="inline-block text-lg font-black tracking-tight mb-10" style={{ color: '#8B6A00' }}>XPEAK</a>

          {estado !== 'error' ? (
            <div>
              <h1 className="text-xl font-black mb-3">Tus conversaciones te esperan</h1>
              <p className="text-sm mb-8" style={{ color: '#374151' }}>
                Pulsa para entrar. No necesitas contraseña.
              </p>
              <button type="button" onClick={entrar} disabled={estado === 'entrando' || !t}
                className="w-full px-6 py-4 rounded-xl text-base font-black disabled:opacity-60"
                style={{ background: '#D4AF37', color: '#111' }}>
                {estado === 'entrando' ? 'Entrando…' : 'Entrar a mis conversaciones'}
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-black mb-3">Este enlace ya no sirve</h1>
              <p className="text-sm mb-6" style={{ color: '#374151' }}>
                Pide uno nuevo con tu correo y te lo mandamos al momento.
              </p>
              <a href="/auth?acceso=1" className="inline-block px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: '#FBF3DD', border: '1px solid rgba(122,98,22,0.16)', color: '#374151' }}>
                Recibir un enlace nuevo
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
