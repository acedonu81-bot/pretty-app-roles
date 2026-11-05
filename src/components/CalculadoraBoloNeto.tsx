import { useRef, useState } from 'react';
import { logEvent } from '@/lib/track';

/**
 * Calculadora "cuánto te queda de cada bolo" para DJs que buscan trabajo o se
 * van a dar de alta. Todo se calcula en el navegador, sin guardar nada.
 * Supuestos a la vista del lector (no se esconde ninguno):
 *  - el IVA lo cobras y lo ingresas, no es tuyo;
 *  - la cuota de autónomo es un dato que elige el lector (tarifa plana 80 € o
 *    una cuota normal orientativa) y es gasto deducible;
 *  - el IRPF se reserva al 20 % del rendimiento, que es el pago fraccionado
 *    del modelo 130. La cifra final de la renta puede salir distinta.
 */
const num = (v: string) => {
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const eur = (n: number) => `${Math.round(n).toLocaleString('es-ES')} €`;

export default function CalculadoraBoloNeto({ articlePath }: { articlePath: string }) {
  const [precio, setPrecio] = useState('400');
  const [bolos, setBolos] = useState('4');
  const [gastoBolo, setGastoBolo] = useState('40');
  const [gastoFijo, setGastoFijo] = useState('100');
  const [cuota, setCuota] = useState<'80' | '200'>('80');
  const [objetivo, setObjetivo] = useState('1200');
  const usada = useRef(false);

  const tocar = (set: (v: string) => void) => (v: string) => {
    set(v);
    if (!usada.current) {
      usada.current = true;
      void logEvent('cta_click', articlePath, 'calculadora_bolo usada');
    }
  };

  const p = num(precio);
  const b = Math.max(1, Math.round(num(bolos)));
  const gb = num(gastoBolo);
  const gf = num(gastoFijo);
  const c = Number(cuota);
  const obj = num(objetivo);

  const facturado = p * b;
  const gastos = gf + gb * b;
  const rendimiento = facturado - gastos - c;
  const irpf = Math.max(0, rendimiento) * 0.2;
  const neto = rendimiento - irpf;
  // Precio mínimo por bolo (sin IVA) para quedarte con "obj" netos al mes.
  const minimo = (obj / 0.8 + c + gf + gb * b) / b;

  const campo = (id: string, label: string, valor: string, set: (v: string) => void, sufijo: string) => (
    <div>
      <label htmlFor={id} className="block text-xs font-bold mb-1" style={{ color: '#3d3d4e' }}>{label}</label>
      <div className="flex items-center gap-2">
        <input id={id} type="text" inputMode="decimal" value={valor} onChange={(e) => tocar(set)(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ border: '1px solid rgba(122,98,22,0.35)', background: '#fff', color: '#111' }} />
        <span className="text-xs shrink-0" style={{ color: '#3d3d4e' }}>{sufijo}</span>
      </div>
    </div>
  );

  return (
    <section className="rounded-2xl p-5 sm:p-6" style={{ background: '#FBF3DD', border: '2px solid #D4AF37' }} aria-label="Calculadora de lo que te queda por bolo">
      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8B6A00' }}>Calculadora</p>
      <h3 className="text-lg sm:text-xl font-black mb-1" style={{ color: '#111' }}>¿Cuánto te queda de verdad de cada bolo?</h3>
      <p className="text-sm mb-5" style={{ color: '#3d3d4e' }}>Cambia los números por los tuyos. Se calcula en tu navegador y no se guarda nada.</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        {campo('cb-precio', 'Precio por bolo, sin IVA', precio, setPrecio, '€')}
        {campo('cb-bolos', 'Bolos al mes', bolos, setBolos, 'bolos')}
        {campo('cb-gbolo', 'Gastos por bolo (viaje, ayudante)', gastoBolo, setGastoBolo, '€')}
        {campo('cb-gfijo', 'Gastos fijos al mes (equipo, seguro)', gastoFijo, setGastoFijo, '€')}
      </div>

      <fieldset className="mb-5">
        <legend className="text-xs font-bold mb-2" style={{ color: '#3d3d4e' }}>Tu cuota de autónomo</legend>
        <div className="flex flex-wrap gap-2">
          {([['80', 'Tarifa plana: 80 €/mes'], ['200', 'Cuota normal: unos 200 €/mes']] as const).map(([v, t]) => (
            <label key={v} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer"
              style={{ background: cuota === v ? '#fff' : 'transparent', border: `1px solid ${cuota === v ? '#D4AF37' : 'rgba(122,98,22,0.3)'}`, color: '#111' }}>
              <input type="radio" name="cb-cuota" value={v} checked={cuota === v} onChange={() => { tocar(() => {})(''); setCuota(v); }} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-3 mb-5">
        <div className="p-4 rounded-xl" style={{ background: '#fff', border: '1px solid rgba(122,98,22,0.25)' }}>
          <p className="text-xs font-bold mb-1" style={{ color: '#3d3d4e' }}>Facturas al mes (sin IVA)</p>
          <p className="text-2xl font-black" style={{ color: '#111' }}>{eur(facturado)}</p>
          <p className="text-xs mt-1" style={{ color: '#3d3d4e' }}>El cliente verá {eur(p * 1.21)} por bolo con el IVA del 21 %, que no es tuyo.</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: '#fff', border: '1px solid rgba(122,98,22,0.25)' }}>
          <p className="text-xs font-bold mb-1" style={{ color: '#3d3d4e' }}>Reserva para Hacienda (IRPF)</p>
          <p className="text-2xl font-black" style={{ color: '#111' }}>{eur(irpf)}</p>
          <p className="text-xs mt-1" style={{ color: '#3d3d4e' }}>El 20 % de lo que te queda tras gastos y cuota, como el pago trimestral.</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: '#ECFDF5', border: '2px solid #059669' }}>
          <p className="text-xs font-bold mb-1" style={{ color: '#065F46' }}>Te queda al mes</p>
          <p className="text-2xl font-black" style={{ color: '#065F46' }}>{rendimiento < 0 ? `-${eur(-rendimiento)}` : eur(neto)}</p>
          <p className="text-xs mt-1" style={{ color: '#065F46' }}>{b > 0 && rendimiento > 0 ? `Unos ${eur(neto / b)} por bolo.` : 'Con estos números pierdes dinero.'}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl mb-3" style={{ background: '#fff', border: '1px solid rgba(122,98,22,0.25)' }}>
        <label htmlFor="cb-obj" className="block text-sm font-bold mb-2" style={{ color: '#111' }}>Y al revés: ¿cuánto quieres llevarte limpio al mes?</label>
        <div className="flex items-center gap-2 mb-3">
          <input id="cb-obj" type="text" inputMode="decimal" value={objetivo} onChange={(e) => tocar(setObjetivo)(e.target.value)}
            className="w-28 px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(122,98,22,0.35)', background: '#fff', color: '#111' }} />
          <span className="text-sm" style={{ color: '#3d3d4e' }}>€ al mes</span>
        </div>
        <p className="text-sm" style={{ color: '#111' }}>
          Con {b} {b === 1 ? 'bolo' : 'bolos'} al mes, tu bolo no puede bajar de <strong>{eur(minimo)}</strong> sin IVA.
        </p>
      </div>

      <p className="text-xs" style={{ color: '#3d3d4e' }}>
        Cálculo orientativo. La cuota depende de tus ingresos reales y el IRPF final sale en tu declaración de la renta. Consúltalo con una gestoría antes de fijar tus tarifas.
      </p>
    </section>
  );
}
