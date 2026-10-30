import { lazy, Suspense, useRef, useState } from 'react';
import { Send, Scale } from 'lucide-react';
import { logEvent, track } from '@/lib/track';
import { usePrecioReal } from '@/lib/precioReal';

const ParticularRequestModal = lazy(() => import('@/components/ParticularRequestModal'));

/**
 * Primer paso por rol en los blogs de precio (Ficha XDS 74,9, aprobada 26 oct
 * 2026). Hasta hoy todos los botones del blog llevaban a "crear cuenta" y de
 * 101 sesiones en 7 días solo 2 pulsaron algo. Aquí cada lector tiene un paso
 * pequeño que encaja con lo que vino a buscar:
 *  - quien contrata: pide para su fecha sin registro (flujo del particular);
 *  - el profesional: compara su tarifa con las que hay publicadas en XPEAK.
 * La comparación sale de tarifas_publicas (solo con 5 o más tarifas reales);
 * si no las hay no se da cifra, no se inventa.
 *
 * Death line: 14 días tras desplegar, menos del 3% de las sesiones de los 3
 * artículos con más tráfico pulsa aquí o 0 solicitudes/altas, se quita. Se mide
 * en analytics_events (event_name 'cta_click', detalle 'primer_paso <paso> <rol>').
 */
export type RolPrimerPaso = 'dj' | 'staff' | 'azafata' | 'limpieza';

const CONFIG: Record<RolPrimerPaso, {
  oficio: string; roles: string[]; servicio: string; registro: string; contratar: string; ejemplo: string;
}> = {
  dj: { oficio: 'DJs', roles: ['dj', 'disco-movil'], servicio: 'DJ', registro: '/auth?mode=register&role=dj', contratar: 'DJs', ejemplo: '60' },
  staff: { oficio: 'camareros', roles: ['staff', 'camarero'], servicio: 'Camareros', registro: '/auth?mode=register&role=staff', contratar: 'camareros', ejemplo: '60' },
  azafata: { oficio: 'azafatas', roles: ['azafata'], servicio: 'Azafatas', registro: '/auth?mode=register&role=azafata', contratar: 'azafatas', ejemplo: '60' },
  limpieza: { oficio: 'empresas de limpieza', roles: ['limpieza'], servicio: 'Limpieza', registro: '/auth?mode=register&role=limpieza', contratar: 'empresas de limpieza', ejemplo: '20' },
};

export default function BlogPrimerPaso({ rol, articlePath }: { rol: RolPrimerPaso; articlePath: string }) {
  const c = CONFIG[rol];
  const st = usePrecioReal(c.roles);
  const [pedir, setPedir] = useState(false);
  const [tarifa, setTarifa] = useState('');
  const comparada = useRef(false);

  const medir = (paso: 'pide_abre' | 'pide_enviada' | 'tarifa' | 'crea_perfil') => {
    track(`primer_paso_${paso}`, { article_path: articlePath, rol });
    void logEvent('cta_click', articlePath, `primer_paso ${paso} ${rol}`);
  };

  const valor = Number(tarifa.replace(',', '.'));
  const hayValor = tarifa.trim() !== '' && Number.isFinite(valor) && valor >= 5 && valor <= 2000;

  const cambiarTarifa = (v: string) => {
    setTarifa(v);
    const n = Number(v.replace(',', '.'));
    if (!comparada.current && Number.isFinite(n) && n >= 5 && n <= 2000) {
      comparada.current = true;
      medir('tarifa');
    }
  };

  let lectura: string | null = null;
  if (hayValor) {
    if (!st) {
      lectura = `Todavía no hay bastantes tarifas publicadas de ${c.oficio} para compararte con cifras fiables. Publica la tuya y serás de los primeros.`;
    } else if (valor < st.p25) {
      lectura = `Cobras por debajo de lo que pone la mitad de los ${st.n} perfiles de XPEAK (entre ${st.p25} y ${st.p75} €/h, mediana ${st.tipico} €/h).`;
    } else if (valor > st.p75) {
      lectura = `Cobras por encima de lo que pone la mitad de los ${st.n} perfiles de XPEAK (entre ${st.p25} y ${st.p75} €/h, mediana ${st.tipico} €/h).`;
    } else {
      lectura = `Estás dentro de lo que cobra la mitad de los ${st.n} perfiles de XPEAK (entre ${st.p25} y ${st.p75} €/h, mediana ${st.tipico} €/h).`;
    }
  }

  return (
    <section className="my-5 grid gap-3 sm:grid-cols-2" aria-label="Primer paso">
      <div className="p-4 rounded-2xl" style={{ background: '#FBF3DD', border: '2px solid #D4AF37' }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#8B6A00' }}>Voy a contratar</p>
        <p className="text-sm font-bold mb-3" style={{ color: '#111' }}>
          Cuéntanos tu fecha y se lo mandamos a {c.contratar} de XPEAK. Sin crear cuenta.
        </p>
        <button type="button"
          onClick={() => { medir('pide_abre'); setPedir(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1a1405' }}>
          <Send size={15} /> Pedir para mi fecha
        </button>
      </div>

      <div className="p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '2px solid #D4AF37' }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#8B6A00' }}>Soy profesional</p>
        <label htmlFor={`tarifa-${rol}`} className="text-sm font-bold block mb-2" style={{ color: '#111' }}>
          <Scale size={14} className="inline mr-1.5 -mt-0.5" style={{ color: '#8B6A00' }} />
          ¿Cuánto cobras por hora? Mira dónde estás.
        </label>
        <div className="flex items-center gap-2 mb-2">
          <input id={`tarifa-${rol}`} type="text" inputMode="decimal" value={tarifa}
            onChange={(e) => cambiarTarifa(e.target.value)} placeholder={`Ej. ${c.ejemplo}`}
            className="w-24 px-3 py-2 rounded-lg text-sm"
            style={{ border: '1px solid rgba(122,98,22,0.35)', background: '#fff', color: '#111' }} />
          <span className="text-sm" style={{ color: '#374151' }}>€/hora</span>
        </div>
        {lectura && <p className="text-sm mb-3" style={{ color: '#374151' }}>{lectura}</p>}
        <a href={c.registro} onClick={() => medir('crea_perfil')}
          className="inline-block px-4 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105"
          style={hayValor
            ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#1a1405' }
            : { background: '#FBF3DD', border: '1px solid rgba(122,98,22,0.3)', color: '#374151' }}>
          Crear mi perfil con mi tarifa
        </a>
      </div>

      {pedir && (
        <Suspense fallback={null}>
          <ParticularRequestModal
            onClose={() => setPedir(false)}
            onEnviado={() => medir('pide_enviada')}
            inicial={{ service: c.servicio }}
          />
        </Suspense>
      )}
    </section>
  );
}
