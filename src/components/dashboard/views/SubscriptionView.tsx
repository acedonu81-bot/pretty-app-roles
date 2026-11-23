import { listaVentajas, listaBase, proximamente, oficiosDe, planDe, ventajasAnual, CUENTA_XPEAK_ID } from '@/lib/ventajasPlan';
import { useMiPlan } from '@/hooks/useMiPlan';
import { useNavigate } from 'react-router-dom';
import TarjetaReferidos from '@/components/dashboard/TarjetaReferidos';
import AvisoBlackFriday from '@/components/AvisoBlackFriday';
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { CheckCircle, Clock, Lock } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { isNative } from '@/lib/capacitor';
import { iniciarPago, abrirPortal, leerMiSuscripcion, cobrosActivos, type Ciclo, type MiSuscripcion, type PlanPago } from '@/lib/pagos';
import { subscriptionPlans, PRECIOS_ANUALES, PRECIOS_BLACK_FRIDAY, esBlackFriday, ahorroAnual } from '@/lib/subscriptions';

const euros = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const NOMBRE: Record<string, string> = { starter: 'Profesional', business: 'Premium', agency: 'Premium' };

// Efectos de la pantalla de planes: entrada escalonada y aura que respira detrás
// de la recomendada. Se apagan con "reducir movimiento".
const ESTILOS = `
@keyframes plan-sube { from { opacity: 0; transform: translateY(20px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes plan-respira { 0%, 100% { opacity: .55; transform: scale(1); } 50% { opacity: .95; transform: scale(1.1); } }
.plan-entra { animation: plan-sube .65s cubic-bezier(.2,.7,.2,1) both; }
.plan-aura { animation: plan-respira 5.5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .plan-entra, .plan-aura { animation: none; } }
`;

// Fondo de toda la pantalla: beige oscuro con halo claro arriba y trama fina de puntos.
const Fondo = ({ activo, children }: { activo: boolean; children: ReactNode }) => {
  if (!activo) return <>{children}</>;
  return (
    <div className="relative -m-3 md:-m-6 p-3 md:p-6 overflow-hidden"
      style={{
        minHeight: 'calc(100vh - 6rem)',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,246,214,.95) 0%, rgba(255,246,214,0) 55%), radial-gradient(rgba(139,106,0,.13) 1px, transparent 1.2px), linear-gradient(180deg,#EDDDB2 0%,#E3CE96 100%)',
        backgroundSize: 'auto, 18px 18px, auto',
      }}>
      {children}
    </div>
  );
};

const Lista = ({ items, proximos = [] }: { items: string[]; proximos?: string[] }) => (
  <div className="flex flex-col gap-2">
    {items.map(f => /^Todo lo de /.test(f) ? (
      // "Todo lo de Profesional, más:" en dorado: separa lo heredado de lo propio de Premium.
      <p key={f} className="text-sm font-extrabold" style={{ color: '#8B6A00' }}>{f}</p>
    ) : (
      <div key={f} className="flex items-center gap-2">
        <CheckCircle size={15} style={{ color: '#059669', flexShrink: 0 }} />
        <span className="text-sm" style={{ color: '#444' }}>{f}</span>
      </div>
    ))}
    {proximos.map(f => (
      <div key={f} className="flex items-start gap-2">
        <Clock size={15} style={{ color: '#B8941E', flexShrink: 0, marginTop: 3 }} />
        <span className="text-sm" style={{ color: '#6b6454' }}>
          {f}{' '}
          <span className="inline-block align-middle rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ background: '#F3E6B8', color: '#7a5c00' }}>Próximamente</span>
        </span>
      </div>
    ))}
  </div>
);

// Colores de cada plan (paleta XPEAK: crema, dorado, azul; nada de negro).
// Estructura inspirada en las tarjetas de HeyGen: cabecera de color con nombre,
// precio y botón; debajo, las ventajas. La etiqueta "Recomendado" va dentro de
// la cabecera, junto al nombre, para que nada la tape.
const TEMA: Record<PlanPago, { cabecera: string; borde: string; texto: string; suave: string; etiqueta: CSSProperties; boton: CSSProperties; aura: string }> = {
  starter: {
    cabecera: 'linear-gradient(135deg,#FBE7A1 0%,#E9C75A 55%,#D4AF37 100%)',
    borde: '#D4AF37',
    texto: '#2a2108',
    suave: '#5a4716',
    etiqueta: { background: '#FFF8E1', color: '#7a5c00', boxShadow: '0 1px 0 rgba(255,255,255,.6) inset' },
    boton: { background: '#3a2c06', color: '#FFF8E1', boxShadow: '0 10px 20px -8px rgba(58,44,6,.8)' },
    aura: 'rgba(212,175,55,.5)',
  },
  business: {
    cabecera: 'linear-gradient(135deg,#DBEAFE 0%,#93C5FD 55%,#60A5FA 100%)',
    borde: '#60A5FA',
    texto: '#0b1f44',
    suave: '#1e3a6e',
    etiqueta: { background: '#EFF6FF', color: '#1d4ed8' },
    boton: { background: '#1e3a8a', color: '#EFF6FF', boxShadow: '0 10px 20px -8px rgba(30,58,138,.8)' },
    aura: 'rgba(96,165,250,.45)',
  },
};

// Tarjeta con entrada escalonada y foco de luz que sigue al ratón.
const Tarjeta = ({ retraso, plan, destacada, cabecera, children }: { retraso: number; plan: PlanPago; destacada?: boolean; cabecera: ReactNode; children: ReactNode }) => {
  const t = TEMA[plan];
  const mover = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div className="plan-entra relative" style={{ animationDelay: `${retraso}ms` }}>
      {destacada && (
        <div aria-hidden className="plan-aura absolute -inset-6 rounded-[2.2rem] pointer-events-none hidden md:block"
          style={{ background: `radial-gradient(closest-side, ${t.aura}, transparent 72%)` }} />
      )}
      <div onMouseMove={mover}
        className="group relative h-full rounded-[1.75rem] p-2 flex flex-col transition-all duration-300 hover:-translate-y-1.5"
        style={{ background: '#FFFDF7', border: `1.5px solid ${t.borde}`, boxShadow: '0 2px 4px rgba(60,45,0,.07), 0 30px 60px -24px rgba(90,66,0,.45)' }}>
        <div aria-hidden className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), ${t.aura.replace(/[\d.]+\)$/, '.18)')}, transparent 65%)` }} />
        <div className="relative rounded-[1.35rem] p-5 flex flex-col gap-3" style={{ background: t.cabecera, color: t.texto }}>
          {cabecera}
        </div>
        <div className="relative flex flex-col gap-3 h-full px-4 pt-4 pb-3">{children}</div>
      </div>
    </div>
  );
};

const LEMA: Record<PlanPago, string> = {
  starter: 'Para que te encuentren y te contraten',
  business: 'Para destacar en el directorio y llegar a más clientes',
};

const SubscriptionView = () => {
  const { id: profileId, role, roles, subscription_tier, refresh } = useProfile();
  const navigate = useNavigate();
  // En Black Friday la oferta es del anual: se abre ya marcado.
  const [ciclo, setCiclo] = useState<Ciclo>(() => (esBlackFriday() ? 'anual' : 'mensual'));
  const [sus, setSus] = useState<MiSuscripcion | null>(null);
  const tier = subscription_tier ?? 'free';
  const todos = [role, ...(roles ?? [])].filter(Boolean) as string[];
  const oficios = oficiosDe(todos);
  const profesional = oficios.profesional;
  const venta = profesional && !isNative && cobrosActivos();
  const ventajas = (p: PlanPago) => listaVentajas(planDe(p), oficios, { cobros: cobrosActivos() });
  // Plan efectivo según la BD (lanzamiento, fundador o pago). Sin pagar: antes del
  // lanzamiento ('pre') y los fundadores tienen Profesional; el resto, el nivel base.
  // Mientras carga o si falla, manda la suscripción (nunca se quita nada por un fallo).
  const efectivo = useMiPlan(profileId);
  const sinPagar = tier !== 'starter' && planDe(tier) !== 'business';
  const esBase = sinPagar && efectivo === 'free';
  const esFundador = sinPagar && efectivo === 'starter';
  const titulo = !sinPagar ? (NOMBRE[tier] ?? 'Premium') : esBase ? 'Nivel base' : 'Profesional';

  useEffect(() => {
    if (!venta) return;
    leerMiSuscripcion().then(setSus).catch(() => setSus(null));
    if (new URLSearchParams(window.location.search).get('pago') !== 'ok') return;
    const t = [setTimeout(refresh, 3000), setTimeout(refresh, 8000)];
    return () => t.forEach(clearTimeout);
  }, [venta, refresh]);

  const pagoOk = venta && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pago') === 'ok';
  const pagoCancelado = venta && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pago') === 'cancelado';

  return (
    <Fondo activo={!!venta}>
    <div className="max-w-5xl mx-auto py-10 px-4">
      <style>{ESTILOS}</style>
      <div className="text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8A6D0F' }}>Tu plan</p>
        <h2 className="text-3xl font-black mb-2">{titulo}</h2>
        {esFundador && <p className="text-sm font-bold" style={{ color: '#8B6A00' }}>Eres fundador: tienes Profesional sin pagar durante tu primer año.</p>}
        {pagoOk && <p className="text-sm font-bold" style={{ color: '#059669' }}>Pago recibido. Tu plan se activa en unos segundos.</p>}
        {pagoCancelado && <p className="text-sm font-bold" style={{ color: '#8B6A00' }}>No has completado el pago. No se te ha cobrado nada.</p>}
        {sus?.cancela_al_final && sus.periodo_fin && (
          <p className="text-sm" style={{ color: '#8B6A00' }}>Tu plan termina el {new Date(sus.periodo_fin).toLocaleDateString('es-ES')}. Después pierdes las ventajas del plan.</p>
        )}
      </div>

      {(!venta || esBase) && (
        <div className="max-w-lg mx-auto rounded-2xl p-6 mb-8" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-sm font-bold mb-4" style={{ color: '#222' }}>Incluido en tu cuenta</p>
          {esBase
            ? <Lista items={listaBase(oficios)} />
            : <Lista items={ventajas(tier === 'business' ? 'business' : 'starter')} proximos={proximamente(planDe(tier), oficios)} />}
        </div>
      )}

      {venta && tier !== 'free' && (() => {
        const p: PlanPago = tier === 'starter' ? 'starter' : 'business';
        const anual = sus?.ciclo === 'anual';
        const precio = anual ? PRECIOS_ANUALES[p] : subscriptionPlans.find(x => x.id === p)!.monthlyPrice;
        const fecha = sus?.periodo_fin ? new Date(sus.periodo_fin).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
        return (
          <div className="max-w-xl mx-auto rounded-2xl p-7 flex flex-col gap-4"
            style={{ background: 'linear-gradient(180deg,#FFFCF0 0%,#FFF3CF 100%)', border: '2px solid #D4AF37', boxShadow: '0 4px 10px rgba(120,90,0,.14), 0 30px 60px -22px rgba(120,90,0,.5)' }}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-black text-xl">{NOMBRE[p]}</p>
              <span className="rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest" style={{ background: '#8B6A00', color: '#FFF8E1' }}>
                {anual ? 'Anual' : 'Mensual'}
              </span>
            </div>
            {fecha && (
              <p className="text-sm font-bold" style={{ color: sus?.cancela_al_final ? '#8B6A00' : '#5a4716' }}>
                {sus?.cancela_al_final
                  ? `Tu plan termina el ${fecha}. Después pasas al nivel base, sin más cobros.`
                  : `Se renueva el ${fecha} por ${euros(precio)}${anual ? ' al año' : ' al mes'}, IVA incluido.`}
              </p>
            )}
            <div className="pt-3" style={{ borderTop: '1px dashed rgba(122,98,22,.3)' }}>
              <p className="text-[11px] font-extrabold uppercase tracking-widest mb-3" style={{ color: '#8A6D0F' }}>Incluido en tu plan</p>
              <Lista items={ventajas(p)} proximos={proximamente(planDe(p), oficios)} />
            </div>
            <button type="button" onClick={() => abrirPortal()} className="rounded-xl py-3 font-bold transition-all duration-150 hover:brightness-105"
              style={{ background: 'linear-gradient(180deg,#E6C75A 0%,#CFA52B 100%)', color: '#1d1a12', boxShadow: '0 10px 20px -6px rgba(120,90,0,.6)' }}>
              Gestionar mi plan
            </button>
            <p className="text-xs text-center" style={{ color: '#6b6454' }}>Cambiar de plan, pasar a anual, cambiar la tarjeta, ver facturas o cancelar.</p>
            {p === 'business' && (
              <button type="button" onClick={() => navigate(`/dashboard?view=messages&con=${CUENTA_XPEAK_ID}&nombre=${encodeURIComponent('Equipo XPEAK')}`)}
                className="rounded-xl py-3 font-bold transition-all duration-150 hover:brightness-105"
                style={{ border: '1.5px solid #D4AF37', background: '#FFFDF7', boxShadow: '0 4px 10px -6px rgba(120,90,0,.4)' }}>
                Escribir al equipo de XPEAK (soporte prioritario)
              </button>
            )}
          </div>
        );
      })()}

      {venta && tier === 'free' && (
        <div>
          <AvisoBlackFriday className="max-w-3xl mx-auto mb-6" />
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 rounded-full pl-5 pr-2 py-2"
              style={{ background: '#FFFDF7', boxShadow: '0 2px 10px -3px rgba(90,66,0,.35)', border: '1px solid rgba(212,175,55,.45)' }}>
              <button type="button" onClick={() => setCiclo('mensual')} aria-pressed={ciclo === 'mensual'}
                className="text-sm font-bold" style={{ color: ciclo === 'mensual' ? '#111' : '#8a8170' }}>Mensual</button>
              <button type="button" role="switch" aria-checked={ciclo === 'anual'} aria-label="Pagar por años"
                onClick={() => setCiclo(ciclo === 'anual' ? 'mensual' : 'anual')}
                className="relative w-11 h-6 rounded-full transition-colors duration-200"
                style={{ background: ciclo === 'anual' ? '#D4AF37' : '#E5DCC3' }}>
                <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200"
                  style={{ left: ciclo === 'anual' ? 22 : 2, boxShadow: '0 1px 3px rgba(0,0,0,.25)' }} />
              </button>
              <button type="button" onClick={() => setCiclo('anual')} aria-pressed={ciclo === 'anual'}
                className="text-sm font-bold" style={{ color: ciclo === 'anual' ? '#111' : '#8a8170' }}>Anual</button>
              <span className="rounded-full px-3 py-1 text-xs font-extrabold whitespace-nowrap"
                style={{ background: 'linear-gradient(90deg,#D1FAE5,#BFDBFE)', color: '#065f46' }}>
                {esBlackFriday() ? '-35 % Black Friday' : 'Ahorras 2 meses'}
              </span>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 md:items-stretch max-w-3xl mx-auto">
            {(['starter', 'business'] as PlanPago[]).map((p, i) => {
              const plan = subscriptionPlans.find(x => x.id === p)!;
              const t = TEMA[p];
              const anual = ciclo === 'anual';
              const bf = anual && esBlackFriday();
              const primerAno = bf ? PRECIOS_BLACK_FRIDAY[p] : PRECIOS_ANUALES[p];
              const precio = anual ? primerAno / 12 : plan.monthlyPrice;
              const destacado = p === 'starter';
              return (
                <Tarjeta key={p} retraso={130 * i} plan={p} destacada={destacado}
                  cabecera={<>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <p className="font-black text-2xl leading-none">{NOMBRE[p]}</p>
                        {destacado && (
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap" style={t.etiqueta}>Recomendado</span>
                        )}
                        {bf && (
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap"
                            style={{ background: '#FFFDF7', color: '#7a5c00', border: '1.5px solid #B8941E' }}>Black Friday -35 %</span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-2xl leading-none whitespace-nowrap">
                          {euros(Math.round(precio * 100) / 100)}<span className="text-xs font-bold" style={{ color: t.suave }}>/mes</span>
                        </p>
                        {bf && (
                          <p className="text-xs font-bold mt-1 whitespace-nowrap" style={{ color: t.suave }}>
                            antes <s>{euros(Math.round(PRECIOS_ANUALES[p] / 12 * 100) / 100)}</s>
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: t.suave }}>{LEMA[p]}</p>
                    <button type="button" onClick={() => iniciarPago(p, ciclo)}
                      className="mt-1 rounded-full py-3 font-bold transition-all duration-150 hover:brightness-110 active:translate-y-px"
                      style={t.boton}>
                      Elegir {NOMBRE[p]}
                    </button>
                  </>}>
                  <p className="text-xs" style={{ color: '#6b6454' }}>
                    IVA incluido · {!anual ? 'Facturación mensual'
                      : bf ? `${euros(PRECIOS_BLACK_FRIDAY[p])} el primer año con el 35 % de Black Friday. Después, ${euros(PRECIOS_ANUALES[p])} al año`
                      : `${euros(PRECIOS_ANUALES[p])} al año: ahorras 2 meses (${euros(ahorroAnual(p))})`}
                  </p>
                  <p className="text-xs font-bold" style={{ color: '#059669' }}>Sin permanencia. Cancela cuando quieras.</p>
                  <div className="pt-3" style={{ borderTop: '1px dashed rgba(122,98,22,.3)' }}>
                    <Lista items={[...ventajas(p), ...(anual ? ventajasAnual() : [])]} proximos={proximamente(planDe(p), oficios)} />
                  </div>
                </Tarjeta>
              );
            })}
          </div>
          <p className="text-center text-xs mt-8" style={{ color: '#6b5a1e' }}>
            Al pagar aceptas las <a href="/condiciones-suscripcion" className="underline">condiciones de contratación</a>.
          </p>
        </div>
      )}
      {venta && (
        <div className="max-w-2xl mx-auto mt-12">
          <TarjetaReferidos suscrito={tier !== 'free'} />
        </div>
      )}
    </div>
    </Fondo>
  );
};

export default SubscriptionView;
