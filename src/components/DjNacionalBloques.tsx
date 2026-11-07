import { useEffect, useState, lazy, Suspense } from 'react';
import { Zap, MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toSlug } from '@/data/profiles';
import { passesPhotoGate } from '@/lib/constants';
import { apareceEnRol } from '@/lib/rolesVisibles';
import { ROLE_MAP } from '@/lib/rolesPorCategoria';
import { precioValido, type EstadPrecio } from '@/lib/precioReal';
import { ProfGrid, contar, TIPOS_EVENTO, type Prof } from '@/pages/CityLanding';

const ParticularRequestModal = lazy(() => import('@/components/ParticularRequestModal'));

// /contratar-dj (8 nov 2026): la página nacional de DJ deja de ser la plantilla
// común (estilos de club + "desde 40 €/hora" fijo) y pasa a usar los DJs reales,
// igual que /contratar-dj/madrid. Search Console (10 ago a 4 nov): "contratar dj"
// 388 apariciones en posición 34, 0 clics, y un racimo de búsquedas parecidas
// (contratación, alquiler, agencia, profesional) en posición 30-75.

export type DjNacional = Prof & { ciudadRef?: string | null };

declare global {
  // eslint-disable-next-line no-var
  var __PRERENDER_PROFILES__: { profs: Prof[]; suggestions: Prof[] } | undefined;
}

// Mismo criterio que useCityProfessionals (CityLanding.tsx) pero sin filtrar por
// ciudad. En el prerender los DJs ya vienen resueltos en la variable global.
export function useDjsNacional(activo: boolean) {
  const preloaded = activo && typeof globalThis !== 'undefined' ? globalThis.__PRERENDER_PROFILES__ : undefined;
  const [profs, setProfs] = useState<DjNacional[]>((preloaded?.profs as DjNacional[] | undefined) ?? []);
  const [loaded, setLoaded] = useState(!!preloaded);

  useEffect(() => {
    if (!activo || preloaded) return;
    const roles = ROLE_MAP.dj ?? ['dj'];
    const roleFilter = [
      ...roles.map(r => `role.eq.${r}`),
      ...roles.map(r => `roles.cs.{${r}}`),
    ].join(',');
    supabase
      .from('profiles')
      .select('user_id,display_name,photo_url,bio,zone,city_ref,role,roles,score,is_verified,hourly_rate,genres')
      .or(roleFilter)
      .neq('role', 'empresario')
      .or('is_public.is.null,is_public.eq.true')
      .order('is_primary', { ascending: false })
      .order('score', { ascending: false })
      .limit(300)
      .then(({ data }) => {
        const vistos = new Set<string>();
        const filas = (data ?? [])
          .filter(p => apareceEnRol(p as { role?: string | null; roles?: string[] | null }, roles))
          .filter(p => passesPhotoGate(p))
          .filter(p => !vistos.has(p.user_id) && !!vistos.add(p.user_id));
        setProfs(filas.map(p => ({
          id: p.user_id,
          display_name: p.display_name ?? 'Profesional',
          photo_url: p.photo_url,
          bio: p.bio,
          city: p.zone,
          role: p.role,
          score: p.score ?? 0,
          slug: toSlug(p.display_name ?? p.user_id),
          is_verified: p.is_verified ?? false,
          precioHora: p.hourly_rate ?? null,
          estilos: p.genres ?? null,
          ciudadRef: p.city_ref ?? null,
        })));
        setLoaded(true);
      });
  }, [activo]);

  return { profs, loaded };
}

const caja = { background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' };

export default function DjNacionalBloques({ profs, st, ciudades }: { profs: DjNacional[]; st: EstadPrecio | null; ciudades: { name: string; slug: string }[] }) {
  const [pedir, setPedir] = useState(false);
  // En el escaparate, primero los DJs con tarifa y estilos publicados: son los que dan información útil.
  const destacados = [...profs].sort((a, b) => Number(precioValido(b.precioHora) && !!b.estilos?.length) - Number(precioValido(a.precioHora) && !!a.estilos?.length)).slice(0, 12);
  const estilos = contar(profs.flatMap(p => p.estilos ?? [])).slice(0, 12);
  const porCiudad = ciudades
    .map(c => ({
      ...c,
      n: profs.filter(p => p.ciudadRef === c.name || (p.city ?? '').toLowerCase().includes(c.name.toLowerCase())).length,
    }))
    .filter(c => c.n > 0)
    .sort((a, b) => b.n - a.n);

  return (
    <>
      {st && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black mb-3">Cuánto cuesta contratar un DJ en España</h2>
          <p className="text-sm sm:text-base mb-6 leading-relaxed max-w-3xl" style={{ color: '#374151' }}>
            Precios reales de los {st.n} DJs que publican su tarifa en XPEAK. Se actualizan solos cuando un DJ cambia la suya.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { l: 'La mitad cobra', v: `${st.p25}-${st.p75} €/h` },
              { l: 'Precio más habitual', v: `${st.tipico} €/h` },
              { l: 'Fiesta de 4 horas', v: `${st.p25 * 4}-${st.p75 * 4} €` },
            ].map(x => (
              <div key={x.l} className="p-5 rounded-xl" style={caja}>
                <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#6b7280' }}>{x.l}</p>
                <p className="text-2xl font-black" style={{ color: '#8B6A00' }}>{x.v}</p>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: '#4b5563' }}>
            Van de {st.min} € a {st.max} € la hora. Lo que más cambia el precio: si lleva equipo propio, las horas, el desplazamiento y la experiencia.
            Para afinar por tipo de evento usa la <a href="/blog/calculadora-tarifa-dj" style={{ color: '#8B6A00', fontWeight: 700 }}>calculadora de tarifa de DJ</a> o
            lee <a href="/blog/cuanto-cobra-un-dj-en-espana" style={{ color: '#8B6A00', fontWeight: 700 }}>cuánto cobra un DJ</a>.
          </p>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h2 className="text-xl sm:text-2xl font-black mb-2">DJs de XPEAK con su precio por hora</h2>
        <p className="text-sm mb-6" style={{ color: '#4b5563' }}>
          {profs.length} DJs con foto, estilos y tarifa. Abre un perfil para escuchar sus mezclas y hablar con él.
        </p>
        <ProfGrid profs={destacados} detalle />
        <div className="text-center mt-6">
          <a href="/directorio/dj"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Ver los {profs.length} DJs <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="text-xl sm:text-2xl font-black mb-6">Qué DJ necesitas según tu evento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIPOS_EVENTO.map(e => (
            <div key={e.t} className="p-5 rounded-xl" style={caja}>
              <h3 className="text-base font-black mb-2">DJ para {e.t.toLowerCase()}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{e.d}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button type="button" onClick={() => setPedir(true)}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            <Zap size={15} /> Pide DJ para tu fecha
          </button>
        </div>
      </section>

      {estilos.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-3">DJs por estilo de música</h2>
          <p className="text-sm mb-5" style={{ color: '#4b5563' }}>Toca un estilo para ver solo los DJs que lo pinchan.</p>
          <div className="flex flex-wrap gap-2">
            {estilos.map(([nombre, n]) => (
              <a key={nombre} href={`/directorio/dj?genero=${encodeURIComponent(nombre)}`}
                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ ...caja, color: '#111', textDecoration: 'none' }}>
                DJ {nombre} <span style={{ color: '#8B6A00' }}>({n})</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
        <h2 className="text-xl sm:text-2xl font-black mb-3">DJ directo o agencia de DJ: qué cambia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl" style={caja}>
            <h3 className="text-base font-black mb-2">Con una agencia</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
              Suele decidir ella qué DJ va a tu evento y gestiona la reserva a cambio de un margen sobre la tarifa. A menudo no sabes quién pincha hasta que firmas.
            </p>
          </div>
          <div className="p-5 rounded-xl" style={caja}>
            <h3 className="text-base font-black mb-2">Con XPEAK</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
              Ves el perfil de cada DJ, con sus fotos, estilos y tarifa por hora, y hablas con él por el chat antes de decidir. El contrato se cierra directamente entre las partes.
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed mt-5 max-w-3xl" style={{ color: '#4b5563' }}>
          Si no sabes a quién elegir, pide DJ: se lo mandamos a los DJs de tu zona y te responde quien tiene la fecha libre.
        </p>
      </section>

      {porCiudad.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Contratar DJ por ciudad</h2>
          <p className="text-sm mb-6" style={{ color: '#4b5563' }}>
            Dónde tienen su base los DJs de XPEAK. Cada ciudad tiene su guía con precios y preguntas frecuentes.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {porCiudad.map(c => (
              <a key={c.slug} href={`/contratar-dj/${c.slug}`}
                className="flex flex-col gap-1 p-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ ...caja, color: '#111', textDecoration: 'none' }}>
                <span className="flex items-center gap-2"><MapPin size={13} style={{ color: '#8B6A00' }} /> DJ en {c.name}</span>
                <span className="text-xs font-normal" style={{ color: '#6b7280' }}>{c.n} {c.n === 1 ? 'DJ' : 'DJs'}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {pedir && (
        <Suspense fallback={null}>
          <ParticularRequestModal onClose={() => setPedir(false)} inicial={{ service: 'DJ' }} />
        </Suspense>
      )}
    </>
  );
}
