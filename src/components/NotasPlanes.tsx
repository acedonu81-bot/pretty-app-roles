// Notas de los planes, al estilo de las tablas de precios de las plataformas de suscripción:
// una comparativa de lo que hace cada plan y, debajo, las condiciones numeradas (IVA,
// permanencia, plan anual, Black Friday, año de fundadores). Se usa en /precios y en
// "Mi plan", con los mismos números que el pago: nada se escribe a mano aquí.
// Sin "gratis" ni rayas largas en el texto (reglas de copy de XPEAK).
import { Check, Minus } from 'lucide-react';
import { ventajasDe } from '@/lib/ventajasPlan';
import { esBlackFriday, PRECIOS_ANUALES, PRECIOS_BLACK_FRIDAY, subscriptionPlans } from '@/lib/subscriptions';

const euros = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const mensual = (id: 'starter' | 'business') => subscriptionPlans.find(p => p.id === id)!.monthlyPrice;

type Celda = string | boolean;
type Clave = 'iva' | 'anual' | 'bf' | 'oficios' | 'equipo' | 'fundadores';
type Fila = { etiqueta: string; profesional: Celda; premium: Celda; nota?: Clave };

export function filasComparativa(): Fila[] {
  const p = ventajasDe('starter');
  const q = ventajasDe('business');
  const sets = (n: number) => (Number.isFinite(n) ? `${n}` : 'Ilimitados');
  return [
    { etiqueta: 'Precio al mes', profesional: `${euros(mensual('starter'))}`, premium: `${euros(mensual('business'))}`, nota: 'iva' },
    { etiqueta: 'Precio al año', profesional: `${euros(PRECIOS_ANUALES.starter)}`, premium: `${euros(PRECIOS_ANUALES.business)}`, nota: 'anual' },
    { etiqueta: 'Perfil verificado en el directorio, mensajes y reseñas', profesional: true, premium: true },
    { etiqueta: 'Ofertas Flash Booking', profesional: true, premium: true, nota: 'oficios' },
    { etiqueta: 'Tu Instagram, TikTok y Facebook en tu ficha', profesional: p.redesVisibles, premium: q.redesVisibles },
    { etiqueta: 'Fotos y vídeos en el portafolio', profesional: `${p.fotos}`, premium: `${q.fotos}` },
    { etiqueta: 'Sets en tu perfil (música)', profesional: sets(p.sets), premium: sets(q.sets), nota: 'oficios' },
    { etiqueta: 'Estadísticas', profesional: 'Básicas', premium: 'Avanzadas y exportables' },
    { etiqueta: 'Por delante en el directorio, con aro dorado', profesional: false, premium: q.posicionDestacada },
    { etiqueta: 'Destacado en el Inicio de XPEAK', profesional: false, premium: q.destacadoInicio },
    { etiqueta: 'Publicaciones al mes en las redes de XPEAK', profesional: `${p.publicacionesRedesMes}`, premium: `${q.publicacionesRedesMes}`, nota: 'equipo' },
    { etiqueta: 'Directos al mes en XPEAK', profesional: `${p.directosMes}`, premium: `${q.directosMes}`, nota: 'equipo' },
    { etiqueta: 'Sello de eventos confirmados en tu ficha', profesional: false, premium: q.trayectoriaConfirmada },
    { etiqueta: 'Banner propio en la cabecera (DJ)', profesional: false, premium: q.bannerCabecera, nota: 'oficios' },
    { etiqueta: 'Soporte prioritario con el equipo', profesional: false, premium: true },
    { etiqueta: 'Concursos y sorteos de XPEAK', profesional: true, premium: true },
  ];
}

function Valor({ v }: { v: Celda }) {
  if (v === true) return <Check size={16} className="inline" style={{ color: '#059669' }} aria-label="Incluido" />;
  if (v === false) return <Minus size={16} className="inline" style={{ color: '#9ca3af' }} aria-label="No incluido" />;
  return <span className="font-bold">{v}</span>;
}

export function TablaComparativaPlanes({ className = '', ahora = new Date() }: { className?: string; ahora?: Date }) {
  const filas = filasComparativa();
  const num = numerosNotas(ahora, true);
  return (
    <div className={`overflow-x-auto rounded-2xl ${className}`} style={{ border: '1px solid rgba(122,98,22,0.16)', background: '#FFFDF7' }}>
      <table className="w-full text-xs sm:text-sm">
        <caption className="sr-only">Comparativa de los planes Profesional y Premium de XPEAK</caption>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(122,98,22,0.16)' }}>
            <th scope="col" className="text-left p-3 sm:p-4 font-semibold" style={{ color: '#6b6454' }}>Qué incluye</th>
            <th scope="col" className="p-3 sm:p-4 font-black text-center">Profesional</th>
            <th scope="col" className="p-3 sm:p-4 font-black text-center" style={{ color: '#8B6A00' }}>Premium</th>
          </tr>
        </thead>
        <tbody>
          {filas.map(f => (
            <tr key={f.etiqueta} style={{ borderBottom: '1px solid rgba(122,98,22,0.08)' }}>
              <th scope="row" className="text-left p-3 sm:p-4 font-medium" style={{ color: '#111' }}>
                {f.etiqueta}{f.nota && num[f.nota] ? <sup className="ml-0.5">{num[f.nota]}</sup> : null}
              </th>
              <td className="p-3 sm:p-4 text-center"><Valor v={f.profesional} /></td>
              <td className="p-3 sm:p-4 text-center"><Valor v={f.premium} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Qué notas se enseñan y con qué número. En "Mi plan" (conOficios=false) no va la nota de
// oficios, porque ahí cada tarjeta ya enseña solo lo que aplica al oficio de la persona.
function clavesVisibles(ahora: Date, conOficios: boolean): Clave[] {
  const out: Clave[] = ['iva', 'anual'];
  if (esBlackFriday(ahora)) out.push('bf');
  if (conOficios) out.push('oficios', 'equipo');
  out.push('fundadores');
  return out;
}
function numerosNotas(ahora: Date, conOficios: boolean): Partial<Record<Clave, number>> {
  return Object.fromEntries(clavesVisibles(ahora, conOficios).map((k, i) => [k, i + 1]));
}

export function NotasPlanes({ ahora = new Date(), className = '', conOficios = true }: { ahora?: Date; className?: string; conOficios?: boolean }) {
  const textos: Record<Clave, JSX.Element> = {
    iva: <>Precios con IVA incluido y sin permanencia. Puedes cancelar cuando quieras desde Mi plan y conservas el plan hasta el final del periodo ya pagado.</>,
    anual: <>En el plan anual pagas 10 meses de los 12 (ahorras 2 meses) y se renueva cada año a ese mismo precio, salvo que canceles antes. Incluye un regalo de bienvenida de merchandising de XPEAK, que enviamos a la dirección que indicas al pagar.</>,
    bf: <>Oferta de Black Friday: del 25 al 30 de noviembre de 2026 hasta las 23:59 (hora de Madrid), 35 % menos solo el primer año del plan anual: Profesional {euros(PRECIOS_BLACK_FRIDAY.starter)} y Premium {euros(PRECIOS_BLACK_FRIDAY.business)}. Después, la renovación es al precio anual normal ({euros(PRECIOS_ANUALES.starter)} y {euros(PRECIOS_ANUALES.business)}), salvo que canceles antes.</>,
    oficios: <>Las ofertas Flash Booking llegan a los oficios que las reciben; los sets son para música, y el banner de cabecera, para DJ con Premium.</>,
    equipo: <>Las publicaciones y los directos del mes se coordinan con el equipo de XPEAK.</>,
    fundadores: <>Los perfiles de oficio verificados y con foto que ya estaban en XPEAK en el lanzamiento (23 de noviembre de 2026) tienen Profesional sin coste hasta el 23 de noviembre de 2027. Les avisamos por correo 30 días antes de que termine; después pasan al nivel base, salvo que contraten un plan.</>,
  };
  const claves = clavesVisibles(ahora, conOficios);
  return (
    <div className={`text-[11px] sm:text-xs leading-relaxed space-y-1.5 ${className}`} style={{ color: '#6b6454' }}>
      {claves.map((k, i) => <p key={k}><sup>{i + 1}</sup> {textos[k]}</p>)}
    </div>
  );
}
