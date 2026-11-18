import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_ES } from '@/lib/constants';
import { fotoOptimizada } from '@/lib/imagen';
import { etiquetaAlta, imagenSegura, siguienteIndice, combinarDestacados, type Destacado, type NuevoProfesional } from '@/lib/nuevosEnXpeak';

// 16 nov 2026: tarjeta compacta en el Inicio con los profesionales que acaban
// de entrar (últimos 7 días, hasta 5) y tienen el perfil completo. Los datos
// vienen de nuevos_profesionales_panel, que ya filtra calidad y privacidad.
// Sin nadie nuevo no se pinta nada. Rota con fundido suave; se pausa con el
// ratón o el foco, y con "reducir movimiento" solo se cambia con los puntos.
// 18 nov 2026: delante salen los profesionales Premium (premium_profesionales_panel),
// rotulados como Premium: es posición de pago y tiene que verse (Reglamento UE 2019/1150).
const CADA_MS = 7000;

const NuevoEnXpeak = () => {
  const [lista, setLista] = useState<Destacado[]>([]);
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const leer = async (fn: string) => {
          try {
            const { data } = await (supabase.rpc as any)(fn);
            return Array.isArray(data) ? (data as NuevoProfesional[]) : [];
          } catch { return []; }
        };
        const [premium, nuevos] = await Promise.all([leer('premium_profesionales_panel'), leer('nuevos_profesionales_panel')]);
        if (!vivo) return;
        setLista(combinarDestacados(premium, nuevos));
        setAhora(Date.now());
      } catch { /* sin datos no se muestra */ }
    })();
    return () => { vivo = false; };
  }, []);

  const n = lista.length;
  useEffect(() => {
    if (n < 2 || pausado) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setI(x => siguienteIndice(x, n)), CADA_MS);
    return () => window.clearInterval(t);
  }, [n, pausado]);

  if (!n) return null;
  const p = lista[Math.min(i, n - 1)];
  const oficio = (ROLE_ES as Record<string, string>)[p.role] ?? 'Profesional';
  const zona = p.zone && p.zone.trim() && p.zone.trim() !== 'España' ? p.zone.trim() : null;
  const portada = imagenSegura(p.portada_url);
  const foto = imagenSegura(p.photo_url);
  const esPremium = p.tipo === 'premium';
  const alta = esPremium ? '' : etiquetaAlta(p.creado, ahora);

  return (
    <section className="relative mb-6" aria-label="Profesionales destacados y nuevos en XPEAK"
      onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)} onBlur={() => setPausado(false)}>
      <Link to={`/p/${p.user_id}?v=${esPremium ? 'inicio_premium' : 'inicio_nuevo'}`} key={p.user_id}
        className="group relative block overflow-hidden rounded-2xl motion-safe:[animation:nuevoFundido_.45s_ease-out]"
        style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)', boxShadow: '0 8px 26px -14px rgba(139,106,0,0.45)' }}>
        <div aria-hidden="true" className={`absolute inset-y-0 right-0 w-[55%] bg-cover bg-center sm:w-[40%] ${portada ? 'opacity-35 sm:opacity-90' : ''}`}
          style={{
            backgroundImage: portada ? `url(${fotoOptimizada(portada, 700)})` : 'linear-gradient(120deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.22) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 65%)',
            maskImage: 'linear-gradient(to right, transparent 0%, #000 65%)',
          }} />
        <div className="relative flex items-center gap-3.5 px-4 py-4 sm:gap-4 sm:px-5">
          {foto ? (
            <img src={fotoOptimizada(foto, 160)} alt="" loading="lazy" width={64} height={64}
              className="h-14 w-14 flex-shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
              style={{ boxShadow: '0 0 0 2px #FFFDF7, 0 0 0 3.5px #D4AF37' }} />
          ) : (
            <span aria-hidden="true" className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full font-display text-xl font-black text-white sm:h-16 sm:w-16"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', boxShadow: '0 0 0 2px #FFFDF7, 0 0 0 3.5px #D4AF37' }}>
              {p.display_name.trim().charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1 pr-10 sm:pr-0">
            <p className="truncate text-[0.68rem] font-black uppercase tracking-[0.2em] sm:text-[0.72rem]" style={{ color: '#8B6A00' }}>
              {esPremium ? 'Profesional Premium' : `Nuevo en XPEAK${alta ? ` · ${alta}` : ''}`}
            </p>
            <p className="mt-0.5 truncate font-display text-lg font-black leading-tight sm:text-xl" style={{ color: '#0a0908', letterSpacing: '-0.01em' }}>
              {p.display_name}
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-sm" style={{ color: 'rgba(10,9,8,0.62)' }}>
              <span className="truncate">{oficio}{zona ? ` · ${zona}` : ''}</span>
              <span className="hidden flex-shrink-0 items-center gap-1 text-[0.8rem] font-bold transition-transform group-hover:translate-x-0.5 sm:inline-flex" style={{ color: '#8B6A00' }}>
                Ver su perfil <ArrowRight size={13} strokeWidth={2.75} />
              </span>
            </p>
          </div>
        </div>
      </Link>
      {n > 1 && (
        <div className="absolute bottom-2 right-3 flex items-center rounded-full px-1" role="group" aria-label="Elegir profesional"
          style={{ background: 'rgba(255,253,247,0.9)', boxShadow: '0 1px 6px rgba(139,106,0,0.18)' }}>
          {lista.map((f, k) => (
            <button key={f.user_id} type="button" onClick={() => setI(k)}
              aria-label={`Ver a ${f.display_name}`} aria-current={k === i ? 'true' : undefined}
              className="flex h-5 w-5 items-center justify-center">
              <span className="block rounded-full transition-all"
                style={{ width: k === i ? 14 : 6, height: 6, background: k === i ? '#B8941E' : 'rgba(139,106,0,0.35)' }} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default NuevoEnXpeak;
