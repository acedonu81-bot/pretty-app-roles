import { CheckCircle } from 'lucide-react';

const FEATURES = [
  'Perfil público en el directorio europeo',
  'Flash Booking — contratos en tiempo real',
  'Mensajería directa con clientes y profesionales',
  'Calendario y gestión de contratos',
  'Estadísticas de visitas a tu perfil',
  'Escenario virtual y directos embebidos',
];

const SubscriptionView = () => (
  <div className="max-w-lg mx-auto py-10 px-4">
    <div className="text-center mb-8">
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8A6D0F' }}>Plan actual</p>
      <h2 className="text-3xl font-black mb-2">Plataforma gratuita</h2>
      <p className="text-sm" style={{ color: '#222' }}>
        XPEAK es completamente gratis durante su fase de crecimiento.<br />
        Todas las funciones disponibles sin coste ni comisiones.
      </p>
    </div>

    <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
      <p className="text-sm font-bold mb-4" style={{ color: '#222' }}>Incluido en tu cuenta</p>
      <div className="flex flex-col gap-3">
        {FEATURES.map(f => (
          <div key={f} className="flex items-center gap-3">
            <CheckCircle size={16} style={{ color: '#8A6D0F', flexShrink: 0 }} />
            <span className="text-sm" style={{ color: '#444' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>

    <p className="text-center text-xs" style={{ color: '#333' }}>
      Sin tarjeta de crédito · Sin contratos · Cancela cuando quieras
    </p>
  </div>
);

export default SubscriptionView;
