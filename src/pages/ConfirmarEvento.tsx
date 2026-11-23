import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

/**
 * Trayectoria verificada (22 nov 2026): el organizador confirma desde el correo,
 * sin cuenta, que un profesional trabajó en su evento. Como en /responder, abrir
 * el enlace solo enseña los datos; se confirma al pulsar el botón (POST), para
 * que un antivirus que abra el correo no confirme por nadie.
 */
type Info = { nombre: string; titulo: string; fecha: string; ciudad?: string | null; lugar?: string | null; foto?: string | null; oficio?: string | null; ya: boolean };

// Solo fotos del Storage público del proyecto de XPEAK (dominio propio o el host
// del proyecto de Supabase), por https: una foto de otro origen sería un píxel
// de rastreo para quien abre el correo. No vale cualquier *.supabase.co.
const HOSTS_FOTO = (() => {
  const hosts = ['auth.xpeak.es', 'ddrqhwravupjzysriblq.supabase.co'];
  try { const h = new URL(String(import.meta.env.VITE_SUPABASE_URL ?? '')).hostname; if (h) hosts.push(h); } catch { /* sin variable */ }
  return hosts;
})();
const fotoSegura = (u?: string | null) => {
  try {
    const x = new URL(u ?? '');
    return x.protocol === 'https:' && HOSTS_FOTO.includes(x.hostname) && x.pathname.startsWith('/storage/v1/object/public/');
  } catch { return false; }
};

const fechaLarga = (f: string) => {
  const d = new Date(`${f}T12:00:00`);
  return Number.isNaN(d.getTime()) ? f : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function ConfirmarEvento() {
  // El token se lee una vez y se quita de la barra de direcciones: así no viaja en
  // el historial, en capturas ni en el Referer de lo que cargue la página.
  const [t] = useState(() => {
    const valor = new URLSearchParams(window.location.search).get('t');
    if (valor) window.history.replaceState({}, '', window.location.pathname);
    return valor;
  });
  const [info, setInfo] = useState<Info | null>(null);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'enviando' | 'hecho' | 'error'>(t ? 'cargando' : 'error');

  useEffect(() => {
    if (!t) return;
    supabase.functions.invoke('trayectoria-confirmar', { body: { t, accion: 'ver' } }).then(({ data, error }) => {
      if (error || !data?.ok) { setEstado('error'); return; }
      setInfo(data as Info);
      setEstado(data.ya ? 'hecho' : 'listo');
    });
  }, [t]);

  const confirmar = async () => {
    setEstado('enviando');
    const { data, error } = await supabase.functions.invoke('trayectoria-confirmar', { body: { t, accion: 'confirmar' } });
    setEstado(error || !data?.ok ? 'error' : 'hecho');
  };

  return (
    <>
      <Helmet>
        <title>Confirmar evento | XPEAK</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FBF3DD', color: '#111' }}>
        <div className="w-full max-w-sm text-center">
          <a href="/" className="inline-block text-lg font-black tracking-tight mb-10" style={{ color: '#8B6A00', fontFamily: 'Syne, Inter, sans-serif' }}>XPEAK</a>

          {estado === 'cargando' && <p className="text-sm" style={{ color: '#374151' }}>Cargando…</p>}

          {(estado === 'listo' || estado === 'enviando') && info && (
            <div className="rounded-2xl p-6" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.35)' }}>
              {fotoSegura(info.foto) ? <img src={info.foto!} alt={info.nombre} referrerPolicy="no-referrer" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" /> : null}
              <h1 className="text-xl font-black mb-2" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>{`¿Trabajó ${info.nombre} en ${info.titulo}?`}</h1>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                {[fechaLarga(info.fecha), info.lugar, info.ciudad].filter(Boolean).join(' · ')}
              </p>
              <button type="button" onClick={confirmar} disabled={estado === 'enviando'}
                className="w-full rounded-xl py-3 font-bold" style={{ background: '#D4AF37', color: '#111' }}>
                Sí, trabajó en mi evento
              </button>
              <p className="text-xs mt-4" style={{ color: '#6B7280' }}>Si no es así, cierra esta página y no se confirmará nada.</p>
            </div>
          )}

          {estado === 'hecho' && (
            <div>
              <h1 className="text-xl font-black mb-2" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>Gracias, queda confirmado</h1>
              <p className="text-sm" style={{ color: '#374151' }}>Tu confirmación ayuda a otros organizadores a contratar con confianza.</p>
            </div>
          )}

          {estado === 'error' && (
            <div>
              <h1 className="text-xl font-black mb-2" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>El enlace no es válido</h1>
              <p className="text-sm" style={{ color: '#374151' }}>Puede que haya caducado. Si crees que es un error, escríbenos a info@xpeak.site.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
