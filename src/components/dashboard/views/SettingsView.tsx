import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const euLanguages = [
  '🇪🇸 Español', '🇬🇧 English', '🇩🇪 Deutsch', '🇫🇷 Français', '🇮🇹 Italiano',
  '🇵🇹 Português', '🇳🇱 Nederlands', '🇵🇱 Polski', '🇷🇴 Română', '🇬🇷 Ελληνικά',
  '🇨🇿 Čeština', '🇭🇺 Magyar', '🇸🇪 Svenska', '🇩🇰 Dansk', '🇫🇮 Suomi',
  '🇧🇬 Български', '🇭🇷 Hrvatski', '🇸🇰 Slovenčina', '🇸🇮 Slovenščina',
  '🇱🇹 Lietuvių', '🇱🇻 Latviešu', '🇪🇪 Eesti', '🇲🇹 Malti', '🇮🇪 Gaeilge',
];

const SettingsView = () => {
  const { user, signOut } = useAuth();
  const profile = useProfile();
  const photoRef = useRef<HTMLInputElement>(null);

  const [localName, setLocalName] = useState<string | null>(null);
  const [localCity, setLocalCity] = useState<string | null>(null);
  const [localRate, setLocalRate] = useState<number | null>(null);

  const displayName = localName ?? profile.display_name;
  const city = localCity ?? profile.zone ?? 'Madrid Centro';
  const rate = localRate ?? profile.hourly_rate;
  const rawPhoto = profile.photo_url;
  const photoUrl = rawPhoto && rawPhoto.length > 5 ? rawPhoto : null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB para la foto'); return; }

    const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${user.id}/avatar-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    if (error) { toast.error('Error al subir foto'); return; }
    const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
    await profile.updateField({ photo_url: urlData.publicUrl });
    toast.success('Foto de perfil guardada.');
  };

  const handleSave = async () => {
    if (!user) return;
    const updates: any = {};
    if (localName !== null) updates.display_name = localName;
    if (localCity !== null) updates.zone = localCity;
    if (localRate !== null) updates.hourly_rate = localRate;
    if (Object.keys(updates).length > 0) {
      await profile.updateField(updates);
    }
    toast.success('Ajustes guardados.');
  };

  const initials = displayName ? displayName.charAt(0).toUpperCase() : 'X';

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          <span className="text-gradient">Ajustes</span>
        </h2>
        <p className="text-base text-muted-foreground">Gestiona preferencias, idioma y configuración de cuenta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-panel p-6">
          <h3 className="text-base font-bold mb-5">Cuenta e Idioma</h3>

          {/* Photo */}
          <div className="mb-5 flex items-center gap-4">
            <div className="relative cursor-pointer group" onClick={() => photoRef.current?.click()}>
              <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center text-xl font-bold"
                style={{ background: photoUrl ? undefined : 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {photoUrl ? <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" /> : initials}
              </div>
              <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold">Foto de perfil</p>
              <p className="text-xs text-muted-foreground">Haz clic para cambiar (máx 5MB)</p>
            </div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1.5">Nombre artístico</label>
            <input type="text" value={displayName} onChange={e => setLocalName(e.target.value)} className="nightlife-input text-base" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1.5">Idioma</label>
            <select className="nightlife-input cursor-pointer text-base">
              {euLanguages.map(lang => <option key={lang}>{lang}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
            <input type="email" defaultValue={user?.email || ''} className="nightlife-input text-base" readOnly />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1.5">Ubicación Base</label>
            <input type="text" value={city} onChange={e => setLocalCity(e.target.value)} className="nightlife-input text-base pl-3" />
          </div>
          <div className="mb-4 pt-4" style={{ borderTop: '1px solid var(--nightlife-border)' }}>
            <label className="block text-sm text-muted-foreground mb-1.5">Caché Base (€/hora)</label>
            <input type="number" value={rate} onChange={e => setLocalRate(Number(e.target.value))} min={20} step={5}
              className="nightlife-input text-base pl-3 font-bold" style={{ color: '#D4AF37' }} />
          </div>
          <button className="btn-nightlife-primary w-full text-base" onClick={handleSave}>
            Guardar Cambios
          </button>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-base font-bold mb-5">Suscripción</h3>
          {[
            { name: 'Básico', price: 'Gratis', desc: 'Perfil básico visible en el directorio', current: true },
            { name: 'Pase Diario', price: '4,99€/día', desc: 'Posicionamiento prioritario 24h', current: false },
            { name: 'Pase Weekend', price: '8,99€/finde', desc: 'TOP viernes a domingo + streaming', current: false },
            { name: 'Pro', price: '29,99€/mes', desc: 'Posicionamiento + Streaming + Sello PRO', current: false },
            { name: 'Business', price: '59,99€/mes', desc: 'Multiperfil + TOP Weekend + Soporte prioritario', current: false },
          ].map(plan => (
            <div key={plan.name} className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <div>
                <h4 className="text-sm font-bold">{plan.name}</h4>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: plan.current ? '#8E8EA0' : '#D4AF37' }}>{plan.price}</p>
                {plan.current ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: '#8E8EA0' }}>ACTIVO</span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}>PRÓXIMAMENTE</span>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={async () => { await signOut(); toast.info('Sesión cerrada.'); }}
            className="w-full py-2.5 rounded-lg font-medium text-sm mt-4"
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
