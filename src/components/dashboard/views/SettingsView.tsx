import { useState, useRef } from 'react';
import { MapPin, Sun, Moon, Camera } from 'lucide-react';
import { toast } from 'sonner';

const SettingsView = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.style.setProperty('--background', '0 0% 98%');
      document.documentElement.style.setProperty('--foreground', '0 0% 10%');
      document.documentElement.style.setProperty('--card', '0 0% 96%');
      document.documentElement.style.setProperty('--muted-foreground', '0 0% 40%');
    } else {
      document.documentElement.style.setProperty('--background', '240 10% 3.9%');
      document.documentElement.style.setProperty('--foreground', '0 0% 98%');
      document.documentElement.style.setProperty('--card', '240 10% 3.9%');
      document.documentElement.style.setProperty('--muted-foreground', '240 5% 55%');
    }
    toast.info(`Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}.`);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB para la foto'); return; }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    toast.success('Foto actualizada.');
  };

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

          {/* Photo */}
          <div className="mb-5 flex items-center gap-4">
            <div className="relative cursor-pointer group" onClick={() => photoRef.current?.click()}>
              <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center text-xl font-bold"
                style={{ background: photoPreview ? undefined : 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {photoPreview ? <img src={photoPreview} alt="Foto" className="w-full h-full object-cover" /> : 'A'}
              </div>
              <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold">Foto de perfil</p>
              <p className="text-[0.6rem] text-muted-foreground">Haz clic para cambiar (máx 5MB)</p>
            </div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>

          {/* Theme */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold">Tema</label>
              <p className="text-[0.6rem] text-muted-foreground">Modo oscuro o claro</p>
            </div>
            <button onClick={handleThemeToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
              {theme === 'dark' ? <><Sun size={14} /> Modo Claro</> : <><Moon size={14} /> Modo Oscuro</>}
            </button>
          </div>

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
            <input type="text" defaultValue="Madrid, España" className="nightlife-input text-sm pl-3" />
          </div>
          <div className="mb-4 pt-4" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
            <label className="block text-xs text-muted-foreground mb-1.5">Caché Base (€/hora)</label>
            <input type="number" defaultValue={150} min={30} step={5}
              className="nightlife-input text-sm pl-3 font-bold" style={{ color: '#D4AF37' }} />
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
