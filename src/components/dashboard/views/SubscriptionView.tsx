import { listaVentajas, proximamente, oficiosDe, planDe, ventajasAnual, CUENTA_XPEAK_ID } from '@/lib/ventajasPlan';
import { useNavigate } from 'react-router-dom';
import TarjetaReferidos from '@/components/dashboard/TarjetaReferidos';
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

// Tarjeta con entrada escalonada y foco de luz dorada que sigue al ratón.
const Tarjeta = ({ retraso, destacada, estilo, children }: { retraso: number; destacada?: boolean; estilo: CSSProperties; children: ReactNode }) => {
  const mover = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div className="plan-entra relative" style={{ animationDelay: `${retraso}ms` }}>
      {destacada && (
        <>
          <div aria-hidden className="plan-aura absolute -inset-6 rounded-[2rem] pointer-events-none hidden md:block"
            style={{ background: 'radial-gradient(closest-side, rgba(212,175,55,.5), rgba(212,175,55,0) 72%)' }} />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3.5 z-20 rounded-full px-4 py-1 text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap"
            style={{ background: '#8B6A00', color: '#FFF8E1', boxShadow: '0 6px 14px -4px rgba(90,66,0,.6)' }}>Recomendado</span>
        </>
      )}
      <div onMouseMove={mover}
        className={`group relative h-full rounded-2xl p-7 flex flex-col gap-3 transition-all duration-300 ${destacada ? 'md:-translate-y-3 md:scale-[1.03] hover:md:-translate-y-4' : 'hover:-translate-y-1.5'}`}
        style={estilo}>
        <div aria-hidden className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgba(212,175,55,.2), transparent 65%)' }} />
        <div className="relative flex flex-col gap-3 h-full">{children}</div>
      </div>
    </div>
  );
};

const SubscriptionView = () => {
  const { role, roles, subscription_tier, refresh } = useProfile();
  const navigate = useNavigate();
  const [ciclo, setCiclo] = useState<Ciclo>('mensual');
  const [sus, setSus] = useState<MiSuscripcion | null>(null);
  const tier = subscription_tier ?? 'free';
  const todos = [role, ...(roles ?? [])].filter(Boolean) as string[];
  const oficios = oficiosDe(todos);
  const profesional = oficios.profesional;
  const venta = profesional && !isNative && cobrosActivos();
  const ventajas = (p: PlanPago) => listaVentajas(planDe(p), oficios, { cobros: cobrosActivos() });

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
        <h2 className="text-3xl font-black mb-2">{NOMBRE[tier] ?? 'Sin suscripción'}</h2>
        {pagoOk && <p className="text-sm font-bold" style={{ color: '#059669' }}>Pago recibido. Tu plan se activa en unos segundos.</p>}
        {pagoCancelado && <p className="text-sm font-bold" style={{ color: '#8B6A00' }}>No has completado el pago. No se te ha cobrado nada.</p>}
        {sus?.cancela_al_final && sus.periodo_fin && (
          <p className="text-sm" style={{ color: '#8B6A00' }}>Tu plan termina el {new Date(sus.periodo_fin).toLocaleDateString('es-ES')}. Después pierdes las ventajas del plan.</p>
        )}
      </div>

      {!venta && (
        <div className="max-w-lg mx-auto rounded-2xl p-6" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-sm font-bold mb-4" style={{ color: '#222' }}>Incluido en tu cuenta</p>
          <Lista items={ventajas(tier === 'business' ? 'business' : 'starter')} proximos={proximamente(planDe(tier), oficios)} />
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
                  ? `Tu plan termina el ${fecha}. Después pasas a Esencial, sin más cobros.`
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
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full p-1" style={{ background: 'rgba(255,253,247,.65)', boxShadow: 'inset 0 1px 3px rgba(90,66,0,.18)' }} role="group" aria-label="Facturación">
              {(['mensual', 'anual'] as Ciclo[]).map(c => (
                <button key={c} type="button" aria-pressed={ciclo === c} onClick={() => setCiclo(c)}
                  className="rounded-full px-5 py-2 text-sm font-bold transition-all duration-200"
                  style={{ background: ciclo === c ? '#fff' : 'transparent', boxShadow: ciclo === c ? '0 2px 8px -2px rgba(90,66,0,.4)' : 'none' }}>
                  {c === 'mensual' ? 'Mensual' : esBlackFriday() ? 'Anual, -35 % en Black Friday' : 'Anual, ahorras 2 meses'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 md:items-stretch pt-4 max-w-3xl mx-auto">
            {(['starter', 'business'] as PlanPago[]).map((p, i) => {
              const plan = subscriptionPlans.find(x => x.id === p)!;
              const anual = ciclo === 'anual';
              const bf = anual && esBlackFriday();
              const primerAno = bf ? PRECIOS_BLACK_FRIDAY[p] : PRECIOS_ANUALES[p];
              const precio = anual ? primerAno / 12 : plan.monthlyPrice;
              const destacado = p === 'starter';
              const apagado = destacado ? '#6b5516' : '#6b6454';
              return (
                <Tarjeta key={p} retraso={130 * i} destacada={destacado}
                  estilo={destacado
                    ? { background: 'linear-gradient(180deg,#FFFCF0 0%,#FFF3CF 100%)', border: '2px solid #D4AF37', boxShadow: '0 4px 10px rgba(120,90,0,.16), 0 34px 64px -22px rgba(120,90,0,.6)' }
                    : { background: '#fff', border: '1px solid rgba(212,175,55,.5)', boxShadow: '0 2px 4px rgba(60,45,0,.07), 0 22px 44px -20px rgba(120,90,0,.4)' }}>
                  <p className="font-black text-lg">{NOMBRE[p]}</p>
                  <p className="text-4xl font-black">{euros(Math.round(precio * 100) / 100)} <span className="text-sm font-bold" style={{ color: apagado }}>/ mes</span></p>
                  <p className="text-xs" style={{ color: apagado }}>
                    IVA incluido · {!anual ? 'Facturación mensual'
                      : bf ? `${euros(PRECIOS_BLACK_FRIDAY[p])} el primer año con el 35 % de Black Friday. Después, ${euros(PRECIOS_ANUALES[p])} al año`
                      : `${euros(PRECIOS_ANUALES[p])} al año: ahorras 2 meses (${euros(ahorroAnual(p))})`}
                  </p>
                  <button type="button" onClick={() => iniciarPago(p, ciclo)}
                    className="rounded-xl py-3 font-bold transition-all duration-150 hover:brightness-105 active:translate-y-px"
                    style={destacado
                      ? { background: 'linear-gradient(180deg,#E6C75A 0%,#CFA52B 100%)', color: '#1d1a12', boxShadow: '0 10px 20px -6px rgba(120,90,0,.7), inset 0 1px 0 rgba(255,255,255,.5)' }
                      : { border: '1.5px solid #D4AF37', background: '#FFFDF7', boxShadow: '0 4px 10px -6px rgba(120,90,0,.4)' }}>
                    Elegir {NOMBRE[p]}
                  </button>
                  <p className="text-xs text-center font-bold" style={{ color: '#059669' }}>Sin permanencia. Cancela cuando quieras.</p>
                  <Lista items={[...ventajas(p), ...(anual ? ventajasAnual() : [])]} proximos={proximamente(planDe(p), oficios)} />
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
