import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

/**
 * Respuesta del particular desde el correo, sin entrar (18 nov 2026, ficha XDS
 * 78,7). El correo trae "Me interesa" / "No, gracias" con una firma; aquí se
 * enseña quién le ha contestado y la respuesta solo se manda al pulsar (POST),
 * para que un antivirus que abra el enlace no conteste por el cliente.
 */
type Info = { nombre: string; foto?: string | null; oficio?: string | null; zona?: string | null; ya: 'si' | 'no' | null; chat?: string | null };

export default function Responder() {
  const params = new URLSearchParams(window.location.search);
  const t = params.get('t');
  const elegida = params.get('r') === 'no' ? 'no' : 'si';
  const [info, setInfo] = useState<Info | null>(null);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'enviando' | 'hecho' | 'error'>('cargando');

  useEffect(() => {
    if (!t) { setEstado('error'); return; }
    supabase.functions.invoke('particular-responder', { body: { t, accion: 'ver' } }).then(({ data, error }) => {
      if (error || !data?.ok) { setEstado('error'); return; }
      setInfo(data as Info);
      setEstado(data.ya ? 'hecho' : 'listo');
    });
  }, [t]);

  const responder = async (r: 'si' | 'no') => {
    setEstado('enviando');
    const { data, error } = await supabase.functions.invoke('particular-responder', { body: { t, accion: 'responder', r } });
    if (error || !data?.ok) { setEstado('error'); return; }
    setInfo(prev => prev ? { ...prev, ya: data.ya, chat: data.chat ?? prev.chat } : prev);
    setEstado('hecho');
  };

  const verChat = info?.chat && /^https:\/\/xpeak\.es\/acceso\?t=/.test(info.chat) ? info.chat : '/auth?acceso=1';
  const primario = { background: '#D4AF37', color: '#111' };
  const secundario = { background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#374151' };

  return (
    <>
      <Helmet>
        <title>Responder | XPEAK</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFFFFF', color: '#111' }}>
        <div className="w-full max-w-sm text-center">
          <a href="/" className="inline-block text-lg font-black tracking-tight mb-10" style={{ color: '#8B6A00' }}>XPEAK</a>

          {estado === 'cargando' && <p className="text-sm" style={{ color: '#374151' }}>Cargando…</p>}

          {(estado === 'listo' || estado === 'enviando') && info && (
            <div>
              {info.foto
                ? <img src={info.foto} alt={info.nombre} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
                : null}
              <h1 className="text-xl font-black mb-1">{elegida === 'si' ? `¿Le dices a ${info.nombre} que te interesa?` : `¿Le dices a ${info.nombre} que de momento no?`}</h1>
              {(info.oficio || info.zona) && (
                <p className="text-sm mb-6" style={{ color: '#6B7280' }}>{[info.oficio, info.zona].filter(Boolean).join(' · ')}</p>
              )}
              <div className="flex flex-col gap-3 mt-6">
                <button type="button" disabled={estado === 'enviando'} onClick={() => responder(elegida)}
                  className="w-full px-6 py-4 rounded-xl text-base font-black disabled:opacity-60" style={primario}>
                  {estado === 'enviando' ? 'Enviando…' : elegida === 'si' ? 'Sí, me interesa' : 'No, gracias'}
                </button>
                <button type="button" disabled={estado === 'enviando'} onClick={() => responder(elegida === 'si' ? 'no' : 'si')}
                  className="w-full px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-60" style={secundario}>
                  {elegida === 'si' ? 'No, gracias' : 'Sí, me interesa'}
                </button>
              </div>
            </div>
          )}

          {estado === 'hecho' && info && (
            <div>
              <h1 className="text-xl font-black mb-3">{info.ya === 'si' ? `${info.nombre} ya sabe que te interesa` : 'Respuesta enviada'}</h1>
              <p className="text-sm mb-8" style={{ color: '#374151' }}>
                {info.ya === 'si'
                  ? 'Te escribirá con el presupuesto. Puedes seguir la conversación desde tus mensajes.'
                  : `Le hemos dicho a ${info.nombre} que de momento no lo necesitas.`}
              </p>
              <a href={verChat} className="inline-block w-full px-6 py-4 rounded-xl text-base font-black" style={primario}>
                Ver la conversación
              </a>
            </div>
          )}

          {estado === 'error' && (
            <div>
              <h1 className="text-xl font-black mb-3">Este enlace ya no sirve</h1>
              <p className="text-sm mb-6" style={{ color: '#374151' }}>
                Entra con tu correo y verás tus conversaciones.
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
