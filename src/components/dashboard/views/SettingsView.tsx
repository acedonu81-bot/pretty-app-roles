import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

const SettingsView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          <span className="text-gradient">Ajustes</span>
        </h2>
        <p className="text-sm text-muted-foreground">Gestiona preferencias, idioma y configuración de cuenta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold mb-5">Cuenta e Idioma</h3>
          <div className="mb-4">
            <label className="block text-xs text-muted-foreground mb-1.5">Idioma</label>
            <select className="nightlife-input cursor-pointer text-sm">
              <option>🇪🇸 Español</option>
              <option>🇬🇧 English</option>
              <option>🇩🇪 Deutsch</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
            <input type="email" defaultValue="alex@djaethel.com" className="nightlife-input text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-muted-foreground mb-1.5">Ubicación Base</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" defaultValue="Madrid, España" className="nightlife-input pl-8 text-sm" />
            </div>
          </div>
          <div className="mb-4 pt-4" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
            <label className="block text-xs text-muted-foreground mb-1.5">Caché Base (Por Hora)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
              <input type="number" defaultValue={150} min={30} step={5}
                className="nightlife-input pl-7 text-base font-bold" style={{ color: '#D4AF37' }} />
            </div>
          </div>
          <button className="btn-nightlife-primary w-full text-sm" onClick={() => toast.info('Guardado.')}>
            Guardar Cambios
          </button>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold mb-5">Suscripción</h3>
          {[
            { name: 'Free', price: 'Gratis', desc: 'Perfil básico visible en el directorio', current: false },
            { name: 'Premium', price: '9,95€/mes', desc: 'Flash Booking + Estadísticas básicas', current: false },
            { name: 'Elite', price: '24,95€/mes', desc: 'Top 12 posiciones + TOP Weekend + Stats avanzadas', current: true },
          ].map(plan => (
            <div key={plan.name} className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <div>
                <h4 className="text-sm font-bold">{plan.name}</h4>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>{plan.price}</p>
                {plan.current && (
                  <span className="text-[0.5rem] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>ACTIVO</span>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => toast.info('Sesión cerrada.')}
            className="w-full py-2.5 rounded-lg font-medium text-xs mt-4"
            style={{ background: 'rgba(255,95,86,0.06)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.15)' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
