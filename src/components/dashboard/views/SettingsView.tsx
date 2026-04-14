import { useState, useRef, useEffect } from 'react';
import { Camera, Bell, Volume2, Shield, Trophy, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { subscriptionPlans, mapSubscriptionTierToPlan } from '@/lib/subscriptions';
import { sanitizeInput, containsPhoneNumber } from '@/lib/contentFilter';

const euLanguages = [
  '🇪🇸 Español', '🇬🇧 English', '🇩🇪 Deutsch', '🇫🇷 Français', '🇮🇹 Italiano',
  '🇵🇹 Português', '🇳🇱 Nederlands', '🇵🇱 Polski', '🇷🇴 Română', '🇬🇷 Ελληνικά',
  '🇨🇿 Čeština', '🇭🇺 Magyar', '🇸🇪 Svenska', '🇩🇰 Dansk', '🇫🇮 Suomi',
];

const AUDIO_QUALITIES = [
  { id: 'standard', label: 'Estándar', desc: '128 kbps · Menos datos' },
  { id: 'high', label: 'Alta calidad', desc: '320 kbps · Recomendado' },
  { id: 'lossless', label: 'Sin pérdidas', desc: 'FLAC / WAV · Máxima fidelidad' },
];

type ToggleRowProps = {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: () => void;
};
const ToggleRow = ({ label, desc, checked, onChange }: ToggleRowProps) => (
  <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <div>
      <p className="text-sm font-medium">{label}</p>
      {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className="relative w-9 h-5 rounded-full transition-all"
        style={{ background: checked ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)', border: `1px solid ${checked ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
        <div className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform"
          style={{ background: checked ? '#D4AF37' : '#8E8EA0', transform: checked ? 'translateX(16px)' : 'translateX(0)' }} />
      </div>
    </label>
  </div>
);

type SectionProps = { title: string; icon: React.ReactNode; children: React.ReactNode };
const Section = ({ title, icon, children }: SectionProps) => (
  <div className="glass-panel p-5 mb-4">
    <div className="flex items-center gap-2 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
      <span style={{ color: '#D4AF37' }}>{icon}</span>
      <h3 className="text-sm font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

const SettingsView = () => {
  const { user, signOut } = useAuth();
  const profile = useProfile();
  const photoRef = useRef<HTMLInputElement>(null);

  // Profile fields
  const [localName, setLocalName] = useState<string | null>(null);
  const [localCity, setLocalCity] = useState<string | null>(null);
  const [localRate, setLocalRate] = useState<number | null>(null);
  const [localBirthday, setLocalBirthday] = useState<string | null>(null);
  const [localPhone, setLocalPhone] = useState<string | null>(null);

  // Notification prefs
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifFlash, setNotifFlash] = useState(true);
  const [notifTopWeekend, setNotifTopWeekend] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [notifSMS, setNotifSMS] = useState(false);

  // Audio quality — persisted in localStorage
  const [audioQuality, setAudioQuality] = useState(() => localStorage.getItem('xpeak_audio_quality') ?? 'high');

  // Privacy
  const [saving, setSaving] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [showRate, setShowRate] = useState(false);
  const [allowFlash, setAllowFlash] = useState(true);
  const [showOnline, setShowOnline] = useState(true);

  // Persist audio quality when it changes
  useEffect(() => { localStorage.setItem('xpeak_audio_quality', audioQuality); }, [audioQuality]);

  const displayName = localName ?? profile.display_name;
  const city = localCity ?? profile.zone ?? 'Madrid Centro';
  const rate = localRate ?? profile.hourly_rate;
  const rawPhoto = profile.photo_url;
  const photoUrl = rawPhoto && rawPhoto.length > 5 ? rawPhoto : null;
  const initials = displayName ? displayName.charAt(0).toUpperCase() : 'X';
  const currentPlanId = mapSubscriptionTierToPlan(profile.subscription_tier);
  const currentPlan = subscriptionPlans.find(p => p.id === currentPlanId);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten imágenes.'); return; }
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED.includes(file.type)) { toast.error('Formato no permitido. Usa JPG, PNG, WebP o GIF.'); return; }
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
    if (!user || saving) return;
    // Validate text fields
    if (localName !== null) {
      const { clean, reason } = sanitizeInput(localName, 'name');
      if (!clean) { toast.error(reason); return; }
    }
    if (localCity !== null) {
      const { clean, reason } = sanitizeInput(localCity, 'default');
      if (!clean) { toast.error(reason); return; }
    }
    // Phone: store only if it looks like a real phone number (7–15 digits), block text-obfuscated attempts
    if (localPhone !== null && localPhone.trim()) {
      const digitsOnly = localPhone.replace(/[\s\-.()+]/g, '');
      if (!/^\d{7,15}$/.test(digitsOnly)) {
        toast.error('Formato de teléfono no válido. Introduce solo dígitos.');
        return;
      }
    }
    const updates: Record<string, unknown> = {};
    if (localName !== null) updates.display_name = localName;
    if (localCity !== null) updates.zone = localCity;
    if (localRate !== null) updates.hourly_rate = localRate;
    if (localBirthday !== null) updates.birthday = localBirthday || null;
    if (localPhone !== null) updates.phone = localPhone || null;
    if (Object.keys(updates).length > 0) {
      setSaving(true);
      await profile.updateField(updates);
      setSaving(false);
    }
    toast.success('Cambios guardados.');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease] max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1"><span className="text-gradient">Ajustes</span></h2>
        <p className="text-sm text-muted-foreground">Perfil, preferencias, privacidad y cuenta.</p>
      </div>

      {/* ── Profile section ── */}
      <Section title="Cuenta y Perfil" icon={<Camera size={15} />}>
        {/* Photo */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative cursor-pointer group" onClick={() => photoRef.current?.click()}>
            <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center text-xl font-bold"
              style={{ background: photoUrl ? undefined : 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              {photoUrl ? <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" /> : initials}
            </div>
            <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold">Foto de perfil</p>
            <p className="text-xs text-muted-foreground">Haz clic para cambiar · máx 5MB</p>
          </div>
          <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Nombre artístico</label>
            <input type="text" value={displayName ?? ''} onChange={e => setLocalName(e.target.value)} className="nightlife-input text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Email</label>
            <input type="email" defaultValue={user?.email || ''} className="nightlife-input text-sm opacity-60" readOnly />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Ubicación base</label>
            <input type="text" value={city} onChange={e => setLocalCity(e.target.value)} className="nightlife-input text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Teléfono</label>
            <input type="tel" value={localPhone ?? profile.phone ?? ''} onChange={e => setLocalPhone(e.target.value)} placeholder="+34 600 000 000" className="nightlife-input text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Fecha de cumpleaños</label>
            <input type="date" value={localBirthday ?? profile.birthday ?? ''} onChange={e => setLocalBirthday(e.target.value)} className="nightlife-input text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium" style={{ color: '#D4AF37' }}>Caché base (€/hora)</label>
            <input type="number" value={rate ?? ''} onChange={e => setLocalRate(Number(e.target.value))} min={20} step={5} className="nightlife-input text-sm font-bold" style={{ color: '#D4AF37' }} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Idioma de la interfaz</label>
          <select
            className="nightlife-input text-sm cursor-pointer"
            defaultValue={localStorage.getItem('xpeak_language') ?? '🇪🇸 Español'}
            onChange={e => { localStorage.setItem('xpeak_language', e.target.value); toast.success('Idioma guardado.'); }}
          >
            {euLanguages.map(lang => <option key={lang}>{lang}</option>)}
          </select>
        </div>

        <button className="btn-nightlife-primary w-full text-sm py-2.5 disabled:opacity-60" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </Section>

      {/* ── Audio quality ── */}
      <Section title="Calidad de Audio" icon={<Volume2 size={15} />}>
        <p className="text-xs text-muted-foreground mb-3">Afecta la reproducción de mixes y sesiones en el Escenario Virtual.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AUDIO_QUALITIES.map(q => (
            <button key={q.id} onClick={() => { setAudioQuality(q.id); toast.success(`Calidad: ${q.label}`); }}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background: audioQuality === q.id ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${audioQuality === q.id ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.07)'}`,
              }}>
              <p className="text-xs font-bold" style={{ color: audioQuality === q.id ? '#D4AF37' : undefined }}>{q.label}</p>
              <p className="text-[0.6rem] text-muted-foreground mt-0.5">{q.desc}</p>
              {audioQuality === q.id && (
                <span className="text-[0.55rem] font-black mt-1 block" style={{ color: '#D4AF37' }}>● ACTIVO</span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notificaciones" icon={<Bell size={15} />}>
        <ToggleRow label="Mensajes nuevos" desc="Alerta cuando recibes un mensaje directo" checked={notifMessages} onChange={() => setNotifMessages(v => !v)} />
        <ToggleRow label="Flash Booking" desc="Ofertas urgentes de empresarios" checked={notifFlash} onChange={() => setNotifFlash(v => !v)} />
        <ToggleRow label="Top Weekend" desc="Cuando tu perfil asciende al ranking" checked={notifTopWeekend} onChange={() => setNotifTopWeekend(v => !v)} />
        <ToggleRow label="Novedades y promociones" desc="Ofertas, descuentos y actualizaciones de XPEAK" checked={notifMarketing} onChange={() => setNotifMarketing(v => !v)} />
        <ToggleRow label="SMS de verificación" desc="Solo para verificación de identidad" checked={notifSMS} onChange={() => setNotifSMS(v => !v)} />
      </Section>

      {/* ── Privacy ── */}
      <Section title="Privacidad" icon={<Shield size={15} />}>
        <ToggleRow label="Perfil público en el directorio" desc="Si está desactivado, solo eres visible para empresarios" checked={profilePublic} onChange={() => setProfilePublic(v => !v)} />
        <ToggleRow label="Mostrar tarifa en mi ficha" desc="Visible para todos los usuarios" checked={showRate} onChange={() => setShowRate(v => !v)} />
        <ToggleRow label="Disponible en Flash Booking" desc="Empresarios pueden enviarte solicitudes urgentes" checked={allowFlash} onChange={() => setAllowFlash(v => !v)} />
        <ToggleRow label="Mostrar estado en línea" desc="Indica si estás activo en la plataforma" checked={showOnline} onChange={() => setShowOnline(v => !v)} />
      </Section>

      {/* ── Top Weekend promo ── */}
      <Section title="Top Weekend" icon={<Trophy size={15} />}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,148,30,0.1))', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Trophy size={20} style={{ color: '#D4AF37' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold mb-1">Destaca este fin de semana</p>
            <p className="text-xs text-muted-foreground mb-2">
              Tu perfil aparece en la posición #1 del directorio durante el fin de semana. Los perfiles TOP generan <strong style={{ color: '#D4AF37' }}>3× más contactos</strong>.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black" style={{ color: '#D4AF37' }}>9,99€</span>
              <span className="text-xs text-muted-foreground">por fin de semana</span>
            </div>
          </div>
          <button disabled className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold cursor-not-allowed"
            style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.2)' }}>
            🔒 Próximamente
          </button>
        </div>
      </Section>

      {/* ── Subscription ── */}
      <Section title="Plan y Facturación" icon={<CreditCard size={15} />}>
        <div className="flex items-center justify-between p-3 rounded-lg mb-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p className="text-sm font-bold">{currentPlan?.name ?? 'Gratuito'}</p>
            <p className="text-xs text-muted-foreground">
              {currentPlan?.monthlyPrice === 0 ? 'Plan gratuito activo' : `${currentPlan?.monthlyPrice?.toFixed(2).replace('.', ',')}€/mes`}
            </p>
          </div>
          <span className="text-[0.6rem] font-bold px-2 py-1 rounded"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
            ACTIVO
          </span>
        </div>
        <button className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          onClick={() => toast.info('La pasarela de pagos estará disponible pronto.')}>
          <span>Ver todos los planes</span>
          <ChevronRight size={14} className="text-muted-foreground" />
        </button>
      </Section>

      {/* ── Sign out ── */}
      <div className="glass-panel p-4">
        <button
          onClick={async () => { await signOut(); toast.info('Sesión cerrada.'); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-80"
          style={{ background: 'rgba(255,95,86,0.06)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.15)' }}
        >
          <LogOut size={14} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
