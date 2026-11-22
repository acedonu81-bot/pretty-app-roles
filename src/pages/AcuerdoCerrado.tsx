import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

/**
 * "¿Se cerró el acuerdo?" desde el correo, sin cuenta (22 nov 2026). Se pregunta a
 * las dos partes de una contratación para medir cuántos acuerdos salen de XPEAK.
 * Como en /responder, abrir el enlace solo enseña la pregunta: se responde al
 * pulsar (POST). El token se quita de la barra de direcciones y queda en memoria.
 */
type Info = { titulo: string; fecha: string; respuesta: 'si' | 'no' | null; esProfesional: boolean; anadido: boolean };

export default function AcuerdoCerrado() {
  const [t] = useState(() => {
    const valor = new URLSearchParams(window.location.search).get('t');
    if (valor) window.history.replaceState({}, '', window.location.pathname);
    return valor;
  });
  const [info, setInfo] = useState<Info | null>(null);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'enviando' | 'error'>(t ? 'cargando' : 'error');

  const llamar = async (cuerpo: Record<string, unknown>) => {
    setEstado('enviando');
    const { data, error } = await supabase.functions.invoke('acuerdo-cerrado-responder', { body: { t, ...cuerpo } });
    if (error || !data?.ok) { setEstado('error'); return; }
    setInfo(data as Info);
    setEstado('listo');
  };

  useEffect(() => {
    if (!t) return;
    supabase.functions.invoke('acuerdo-cerrado-responder', { body: { t, accion: 'ver' } }).then(({ data, error }) => {
      if (error || !data?.ok) { setEstado('error'); return; }
      setInfo(data as Info);
      setEstado('listo');
    });
  }, [t]);

  const titulo = { fontFamily: 'Syne, Inter, sans-serif' };
  return (
    <>
      <Helmet>
        <title>¿Se cerró el acuerdo? | XPEAK</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FBF3DD', color: '#111' }}>
        <div className="w-full max-w-sm text-center">
          <a href="/" className="inline-block text-lg font-black tracking-tight mb-10" style={{ color: '#8B6A00', ...titulo }}>XPEAK</a>

          {estado === 'cargando' && <p className="text-sm" style={{ color: '#374151' }}>Cargando…</p>}

          {(estado === 'listo' || estado === 'enviando') && info && !info.respuesta && (
            <div className="rounded-2xl p-6" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.35)' }}>
              <h1 className="text-xl font-black mb-2" style={titulo}>{`¿Se cerró el acuerdo para ${info.titulo}?`}</h1>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Nos ayuda a saber si XPEAK sirve para cerrar eventos. Solo usamos tu respuesta para eso.</p>
              <button type="button" disabled={estado === 'enviando'} onClick={() => llamar({ accion: 'responder', r: 'si' })}
                className="w-full rounded-xl py-3 font-bold mb-2" style={{ background: '#D4AF37', color: '#111' }}>Sí, se cerró</button>
              <button type="button" disabled={estado === 'enviando'} onClick={() => llamar({ accion: 'responder', r: 'no' })}
                className="w-full rounded-xl py-3 font-bold" style={{ background: '#fff', border: '1px solid #E5E7EB', color: '#374151' }}>No se cerró</button>
            </div>
          )}

          {(estado === 'listo' || estado === 'enviando') && info?.respuesta && (
            <div>
              <h1 className="text-xl font-black mb-2" style={titulo}>Gracias por contestar</h1>
              {info.respuesta === 'si' && info.esProfesional && !info.anadido && (
                <>
                  <p className="text-sm mb-5" style={{ color: '#374151' }}>¿Quieres que {info.titulo} salga en tu trayectoria?</p>
                  <button type="button" disabled={estado === 'enviando'} onClick={() => llamar({ accion: 'anadir' })}
                    className="w-full rounded-xl py-3 font-bold" style={{ background: '#D4AF37', color: '#111' }}>Añadir a mi trayectoria</button>
                </>
              )}
              {info.anadido && <p className="text-sm" style={{ color: '#374151' }}>Añadido a tu trayectoria</p>}
            </div>
          )}

          {estado === 'error' && (
            <div>
              <h1 className="text-xl font-black mb-2" style={titulo}>El enlace no es válido</h1>
              <p className="text-sm" style={{ color: '#374151' }}>Puede que haya caducado. Si crees que es un error, escríbenos a info@xpeak.site.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
