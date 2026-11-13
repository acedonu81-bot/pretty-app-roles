import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { isNative } from '@/lib/capacitor';
import { iniciarPago, abrirPortal, leerMiSuscripcion, cobrosActivos, type Ciclo, type MiSuscripcion, type PlanPago } from '@/lib/pagos';
import { subscriptionPlans, PRECIOS_ANUALES, PRECIOS_ANUALES_PRIMER_ANO } from '@/lib/subscriptions';

const NO_PROFESIONALES = ['empresario', 'particular', 'local_eventos', 'event_manager', 'organizador', 'pending'];
const MUSICA = ['dj', 'grupo-musical', 'disco-movil'];

const euros = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const VENTAJAS: Record<'free' | PlanPago, { comun: string[]; musica: string[] }> = {
  free: {
    comun: ['Perfil en el directorio', 'Verificación de perfil', 'Mensajes y reseñas', 'Ofertas Flash Booking', 'Portafolio de 6 fotos'],
    musica: ['Hasta 3 sets en tu perfil', 'Concursos de DJs de XPEAK'],
  },
  starter: {
    comun: ['Avisos por WhatsApp de trabajo', 'Tu Instagram, TikTok y web visibles', 'Verificación ampliada', 'Estadísticas de visitas y mensajes', 'Portafolio de 12 fotos', 'Sorteos entre suscriptores'],
    musica: ['Hasta 10 sets en tu perfil', 'Hasta 3 links de sesión'],
  },
  business: {
    comun: ['Todo lo de Profesional', 'Posición destacada y aro dorado', 'Prioridad en los comunicados', 'Ficha con vídeo de fondo', 'Estadísticas avanzadas', 'Portafolio de 20 fotos'],
    musica: ['Sets ilimitados', 'Links de sesión ilimitados'],
  },
};

const NOMBRE: Record<string, string> = { free: 'Esencial', starter: 'Profesional', business: 'Premium', agency: 'Premium' };

const Lista = ({ items }: { items: string[] }) => (
  <div className="flex flex-col gap-2">
    {items.map(f => (
      <div key={f} className="flex items-center gap-2">
        <CheckCircle size={15} style={{ color: '#059669', flexShrink: 0 }} />
        <span className="text-sm" style={{ color: '#444' }}>{f}</span>
      </div>
    ))}
  </div>
);

const SubscriptionView = () => {
  const { role, roles, subscription_tier, refresh } = useProfile();
  const [ciclo, setCiclo] = useState<Ciclo>('mensual');
  const [sus, setSus] = useState<MiSuscripcion | null>(null);
  const tier = subscription_tier ?? 'free';
  const todos = [role, ...(roles ?? [])].filter(Boolean) as string[];
  const profesional = todos.some(r => !NO_PROFESIONALES.includes(r));
  const musica = todos.some(r => MUSICA.includes(r));
  const venta = profesional && !isNative && cobrosActivos();
  const ventajas = (p: 'free' | PlanPago) => [...VENTAJAS[p].comun, ...(musica ? VENTAJAS[p].musica : [])];

  useEffect(() => {
    if (!venta) return;
    leerMiSuscripcion().then(setSus).catch(() => setSus(null));
    if (new URLSearchParams(window.location.search).get('pago') !== 'ok') return;
    const t = [setTimeout(refresh, 3000), setTimeout(refresh, 8000)];
    return () => t.forEach(clearTimeout);
  }, [venta, refresh]);

  const pagoOk = venta && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pago') === 'ok';

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8A6D0F' }}>Tu plan</p>
        <h2 className="text-3xl font-black mb-2">{NOMBRE[tier] ?? 'Esencial'}</h2>
        {pagoOk && <p className="text-sm font-bold" style={{ color: '#059669' }}>Pago recibido. Tu plan se activa en unos segundos.</p>}
        {sus?.cancela_al_final && sus.periodo_fin && (
          <p className="text-sm" style={{ color: '#8B6A00' }}>Tu plan termina el {new Date(sus.periodo_fin).toLocaleDateString('es-ES')}. Después pasas a Esencial.</p>
        )}
      </div>

      {!venta && (
        <div className="max-w-lg mx-auto rounded-2xl p-6" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-sm font-bold mb-4" style={{ color: '#222' }}>Incluido en tu cuenta</p>
          <Lista items={ventajas(tier === 'starter' || tier === 'business' ? tier : 'free')} />
        </div>
      )}

      {venta && tier !== 'free' && (
        <div className="flex justify-center mb-8">
          <button type="button" onClick={() => abrirPortal()} className="rounded-xl px-6 py-3 font-bold" style={{ background: '#D4AF37', color: '#1d1a12' }}>
            Gestionar mi plan
          </button>
        </div>
      )}

      {venta && tier === 'free' && (
        <>
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-full p-1" style={{ background: '#FBF3DD' }} role="group" aria-label="Facturación">
              {(['mensual', 'anual'] as Ciclo[]).map(c => (
                <button key={c} type="button" aria-pressed={ciclo === c} onClick={() => setCiclo(c)}
                  className="rounded-full px-5 py-2 text-sm font-bold" style={{ background: ciclo === c ? '#fff' : 'transparent' }}>
                  {c === 'mensual' ? 'Mensual' : 'Anual, -15 % el 1er año'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: '#fff', border: '1px solid rgba(122,98,22,.18)' }}>
              <p className="font-black text-lg">Esencial</p>
              <p className="text-sm" style={{ color: '#6b6454' }}>Tu plan actual</p>
              <Lista items={ventajas('free')} />
            </div>
            {(['starter', 'business'] as PlanPago[]).map(p => {
              const plan = subscriptionPlans.find(x => x.id === p)!;
              const anual = ciclo === 'anual';
              const precio = anual ? PRECIOS_ANUALES_PRIMER_ANO[p] / 12 : plan.monthlyPrice;
              return (
                <div key={p} className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: '#fff', border: p === 'starter' ? '2px solid #D4AF37' : '1px solid rgba(122,98,22,.18)' }}>
                  <p className="font-black text-lg">{NOMBRE[p]}</p>
                  <p className="text-3xl font-black">{euros(Math.round(precio * 100) / 100)} <span className="text-sm font-bold" style={{ color: '#6b6454' }}>/ mes</span></p>
                  <p className="text-xs" style={{ color: '#6b6454' }}>
                    IVA incluido · {anual ? `${euros(PRECIOS_ANUALES_PRIMER_ANO[p])} el primer año. Después, ${euros(PRECIOS_ANUALES[p])} al año` : 'Facturación mensual'}
                  </p>
                  <button type="button" onClick={() => iniciarPago(p, ciclo)} className="rounded-xl py-3 font-bold"
                    style={p === 'starter' ? { background: '#D4AF37', color: '#1d1a12' } : { border: '1.5px solid #D4AF37' }}>
                    Elegir {NOMBRE[p]}
                  </button>
                  <p className="text-xs text-center font-bold" style={{ color: '#059669' }}>Sin permanencia. Cancela cuando quieras.</p>
                  <Lista items={ventajas(p)} />
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs mt-6" style={{ color: '#6b6454' }}>
            Al pagar aceptas las <a href="/condiciones-suscripcion" className="underline">condiciones de contratación</a>.
          </p>
        </>
      )}
    </div>
  );
};

export default SubscriptionView;
