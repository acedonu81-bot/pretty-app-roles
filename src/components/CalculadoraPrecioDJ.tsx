import { lazy, Suspense, useState } from 'react';
import { Calculator, Zap } from 'lucide-react';
import { logEvent, track } from '@/lib/track';

const ParticularRequestModal = lazy(() => import('@/components/ParticularRequestModal'));

/**
 * Calculadora del precio de un DJ (Ficha XDS 74,9, aprobada 24 oct 2026).
 *
 * El rango sale de las tarifas por hora que han puesto los propios DJs de
 * XPEAK, no de multiplicadores inventados (la calculadora anterior, de junio,
 * usaba "boda = 1.000 €" fijo y tuvo 4 visitas en 4 meses). Foto fija de la
 * base del 24 oct 2026: 25 DJs con tarifa real; se quitan los perfiles a 0 y
 * los 40 €/h, que es el valor por defecto del alta (handle_new_user) y no una
 * tarifa elegida. Al actualizar, rehacer la consulta y cambiar TARIFAS.
 *
 * Death line: 15 dic 2026, menos de 100 usos o 0 solicitudes enviadas desde
 * aquí, se quita. Se mide en analytics_events (event_name 'cta_click', detalle
 * 'calculadora_dj uso|pedir|enviada ...'): GA4 no recibe los eventos propios.
 */
export const TARIFAS = { p25: 60, mediana: 80, p75: 100, djs: 25, fecha: 'octubre de 2026' };

// Horas habituales por tipo de evento, solo para el valor inicial del selector.
const EVENTOS = [
  { id: 'boda', label: 'Boda', horas: 6, modal: 'Boda' },
  { id: 'empresa', label: 'Cena o evento de empresa', horas: 4, modal: '' },
  { id: 'cumple', label: 'Cumpleaños', horas: 4, modal: 'Cumpleaños' },
  { id: 'fiesta', label: 'Fiesta privada', horas: 5, modal: 'Fiesta privada' },
  { id: 'comunion', label: 'Comunión', horas: 4, modal: 'Comunión' },
] as const;

const eur = (n: number) => `${Math.round(n / 10) * 10} €`;

export default function CalculadoraPrecioDJ({ articlePath }: { articlePath: string }) {
  const [evento, setEvento] = useState<(typeof EVENTOS)[number]>(EVENTOS[0]);
  const [horas, setHoras] = useState<number>(EVENTOS[0].horas);
  const [usada, setUsada] = useState(false);
  const [pedir, setPedir] = useState(false);

  // Analítica propia (la que cuenta para la death line) y dataLayer por si GTM lo recoge.
  const medir = (paso: 'uso' | 'pedir' | 'enviada', e: string, h: number) => {
    track(`calculadora_${paso}`, { article_path: articlePath, evento: e, horas: h });
    void logEvent('cta_click', articlePath, `calculadora_dj ${paso} ${e} ${h}h`);
  };

  // Un único "uso" por visita, al primer cambio: mide uso real, no cada clic.
  const marcarUso = (e: string, h: number) => {
    if (usada) return;
    setUsada(true);
    medir('uso', e, h);
  };

  const elegirEvento = (e: (typeof EVENTOS)[number]) => {
    setEvento(e);
    setHoras(e.horas);
    marcarUso(e.id, e.horas);
  };

  const desde = horas * TARIFAS.p25;
  const hasta = horas * TARIFAS.p75;
  const tipico = horas * TARIFAS.mediana;

  return (
    <section id="calculadora" className="my-10 p-5 sm:p-7 rounded-2xl"
      style={{ background: '#FBF3DD', border: '2px solid #D4AF37' }}>
      <div className="flex items-center gap-2 mb-2">
        <Calculator size={18} style={{ color: '#8B6A00' }} />
        <h2 className="text-xl font-black" style={{ color: '#111' }}>Calcula cuánto te costará el DJ</h2>
      </div>
      <p className="text-sm mb-5" style={{ color: '#3d3d4e' }}>
        Con las tarifas reales de {TARIFAS.djs} DJs de XPEAK ({TARIFAS.fecha}).
      </p>

      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8B6A00' }}>Tipo de evento</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {EVENTOS.map(e => (
          <button key={e.id} type="button" onClick={() => elegirEvento(e)}
            className="px-3 py-2 rounded-xl text-sm font-bold transition-all"
            style={evento.id === e.id
              ? { background: '#D4AF37', color: '#000', border: '1.5px solid #D4AF37' }
              : { background: '#FFFDF7', color: '#333', border: '1.5px solid rgba(0,0,0,0.12)' }}>
            {e.label}
          </button>
        ))}
      </div>

      <label htmlFor="calc-horas" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8B6A00' }}>
        Horas de música: <span style={{ color: '#111' }}>{horas} h</span>
      </label>
      <input id="calc-horas" type="range" min={2} max={10} step={1} value={horas}
        onChange={ev => { const h = Number(ev.target.value); setHoras(h); marcarUso(evento.id, h); }}
        className="w-full mb-6 accent-[#D4AF37]" />

      <div className="p-5 rounded-xl mb-4 text-center" style={{ background: '#FFFDF7', border: '1px solid rgba(0,0,0,0.08)' }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#555' }}>
          {evento.label} de {horas} horas
        </p>
        <p className="text-3xl sm:text-4xl font-black mb-1" style={{ color: '#111' }}>
          {eur(desde)} a {eur(hasta)}
        </p>
        <p className="text-sm" style={{ color: '#3d3d4e' }}>
          Lo más habitual: <strong style={{ color: '#8B6A00' }}>unos {eur(tipico)}</strong>
        </p>
      </div>

      <p className="text-xs mb-5 leading-relaxed" style={{ color: '#555' }}>
        Cómo se calcula: horas por la tarifa por hora de los DJs de XPEAK. La mitad cobra entre {TARIFAS.p25} € y {TARIFAS.p75} € la hora,
        y la tarifa del medio es {TARIFAS.mediana} €. No incluye desplazamiento, IVA ni equipo de luces extra: cada DJ lo indica en su presupuesto.
      </p>

      <button type="button"
        onClick={() => { medir('pedir', evento.id, horas); setPedir(true); }}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-base transition-all hover:scale-[1.02] animate-pulse"
        style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
        <Zap size={17} /> Pide DJ con este presupuesto, gratis
      </button>
      <p className="text-xs text-center mt-2" style={{ color: '#555' }}>Sin registrarte y sin comisión. Te contestan DJs de tu zona.</p>

      {pedir && (
        <Suspense fallback={null}>
          <ParticularRequestModal onClose={() => setPedir(false)}
            onEnviado={() => medir('enviada', evento.id, horas)}
            inicial={{ service: 'DJ', eventType: evento.modal }} />
        </Suspense>
      )}
    </section>
  );
}
