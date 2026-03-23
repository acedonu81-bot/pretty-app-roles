import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

const SettingsView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1">
          Configuración y <span className="text-gradient">Ajustes</span>
        </h2>
        <p className="text-muted-foreground">Gestiona tus preferencias, idioma, notificaciones y métodos de pago.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account & Language */}
        <div className="glass-panel p-8 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Cuenta e Idioma</h3>

          <div className="mb-5">
            <label className="block text-sm text-muted-foreground mb-2">Idioma de la Plataforma</label>
            <select className="nightlife-input cursor-pointer">
              <option>🇪🇸 Español (Predeterminado)</option>
              <option>🇬🇧 English (US/UK)</option>
              <option>🇩🇪 Deutsch</option>
              <option>🇫🇷 Français</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-sm text-muted-foreground mb-2">Email de Notificaciones</label>
            <input type="email" defaultValue="alex@djaethel.com" className="nightlife-input" />
          </div>

          <div className="mb-5">
            <label className="block text-sm text-muted-foreground mb-2">Ubicación Base</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" defaultValue="Madrid, España" className="nightlife-input pl-9" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Define los alquileres P2P más cercanos y el Check-In.</p>
          </div>

          <div className="mb-5 pt-5" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
            <label className="block text-sm text-muted-foreground mb-2">Caché Profesional Base (Por Hora)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-extrabold text-lg">€</span>
              <input type="number" defaultValue={150} min={30} step={5}
                className="nightlife-input pl-8 text-lg font-extrabold"
                style={{ color: '#00ff88' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Mínimo ético irrompible: <strong style={{ color: 'var(--nightlife-primary)' }}>€30/hora</strong>
            </p>
          </div>

          <button
            className="btn-nightlife-primary w-full"
            onClick={() => toast.info('Preferencias guardadas de forma segura.')}
          >
            Guardar Cambios
          </button>
        </div>

        {/* Security */}
        <div className="glass-panel p-8 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Seguridad y Privacidad</h3>

          {[
            {
              title: 'Verificación KYC',
              desc: 'DNI electrónico validado con Polaroid',
              badge: '✓ VERIFICADO',
              badgeColor: '#00ff88',
            },
            {
              title: 'Autenticación 2FA',
              desc: 'Protege tus pagos Escrow y Smart Contracts',
              toggle: true,
            },
          ].map((item) => (
            <div key={item.title} className="flex justify-between items-center mb-6 pb-5" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <div>
                <h4 className="font-semibold mb-0.5">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              {item.badge && (
                <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl"
                  style={{
                    background: 'rgba(0,255,136,0.15)',
                    color: item.badgeColor,
                    border: `1px solid ${item.badgeColor}`,
                  }}
                >
                  {item.badge}
                </span>
              )}
              {item.toggle && (
                <div className="w-11 h-6 rounded-full relative cursor-pointer"
                  style={{ background: 'var(--nightlife-primary)', boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)' }}
                >
                  <span className="absolute h-[18px] w-[18px] right-[3px] bottom-[3px] bg-white rounded-full shadow" />
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => toast.info('Sesión cerrada correctamente.')}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'rgba(255,95,86,0.1)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.3)' }}
          >
            Cerrar Sesión de Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
