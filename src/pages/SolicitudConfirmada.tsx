import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FeedbackWebForm from '@/components/FeedbackWebForm';

/**
 * Botón "Confirmar y enviar" del email del particular (18 oct 2026). Hasta que
 * lo pulsa no se reparte su solicitud: así no llegan pruebas ni emails falsos
 * a los profesionales. La confirmación la hace esta página con JS (POST) y no
 * el enlace en sí, para que los antivirus del correo que abren los enlaces
 * (Outlook/Hotmail) no la confirmen solos.
 */
export default function SolicitudConfirmada() {
  const [estado, setEstado] = useState<'cargando' | 'ok' | 'error'>('cargando');
  const [enviadas, setEnviadas] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fbHecho, setFbHecho] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t');
    if (!t) { setEstado('error'); return; }
    (async () => {
      const { data, error: fnError } = await supabase.functions.invoke('particular-solicitud', { body: { confirmar: t } });
      if (fnError || !data?.ok) {
        let motivo: string | null = data?.error ?? null;
        const ctx = (fnError as { context?: Response } | null)?.context;
        if (!motivo && ctx) {
          try { const j = await ctx.clone().json(); motivo = typeof j?.error === 'string' ? j.error : null; } catch { /* sin motivo */ }
        }
        setError(motivo);
        setEstado('error');
        return;
      }
      setEnviadas(typeof data.enviadas === 'number' ? data.enviadas : null);
      setEstado('ok');
      (window as any).gtag?.('event', 'generate_lead', { lead_type: 'particular_confirmado' });
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Solicitud confirmada | XPEAK</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFFFFF', color: '#111' }}>
        <div className="w-full max-w-sm text-center">
          <a href="/" className="inline-block text-lg font-black tracking-tight mb-10" style={{ color: '#8B6A00' }}>XPEAK</a>

          {estado === 'cargando' && <p className="text-sm" style={{ color: '#374151' }}>Enviando tu solicitud…</p>}

          {estado === 'ok' && (
            <div>
              <CheckCircle size={48} className="mx-auto mb-5" style={{ color: '#059669' }} />
              <h1 className="text-xl font-black mb-3">Solicitud enviada</h1>
              <p className="text-sm mb-3" style={{ color: '#374151' }}>
                {enviadas
                  ? `Se la hemos mandado a ${enviadas} ${enviadas === 1 ? 'profesional' : 'profesionales'}.`
                  : 'La estamos revisando para mandársela a los profesionales adecuados.'}
              </p>
              <p className="text-sm mb-8" style={{ color: '#374151' }}>
                Cuando uno diga que sí, te escribimos con un botón para hablar con él. No tienes que hacer nada más.
              </p>
              <div className="text-left mb-8 p-4 rounded-2xl" style={{ background: '#FBF3DD', border: '1px solid rgba(122,98,22,0.16)' }}>
                {fbHecho
                  ? <p className="text-sm font-bold text-center" style={{ color: '#111' }}>Gracias, lo leemos todo.</p>
                  : <FeedbackWebForm momento="solicitud" rol="particular" onEnviado={() => setFbHecho(true)} />}
              </div>
              <a href="/" className="inline-block px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: '#FBF3DD', border: '1px solid rgba(122,98,22,0.16)', color: '#374151' }}>
                Volver a XPEAK
              </a>
            </div>
          )}

          {estado === 'error' && (
            <div>
              <h1 className="text-xl font-black mb-3">No se ha podido enviar</h1>
              <p className="text-sm mb-6" style={{ color: '#374151' }}>
                {error ?? 'El enlace no es válido. Vuelve a enviar la solicitud desde xpeak.es.'}
              </p>
              <p className="text-xs" style={{ color: '#6b7280' }}>
                ¿Dudas? Escríbenos a{' '}
                <a href="mailto:info@xpeak.site" style={{ color: '#8B6A00' }}>info@xpeak.site</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
