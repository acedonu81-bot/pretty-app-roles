import { useState, useRef, useEffect } from 'react';
import { compressImage, MAX_RAW_IMAGE_MB } from '@/lib/image';
import { Camera, Bell, Shield, LogOut, ChevronRight, Trash2, AlertTriangle, Download, FileText, QrCode, Archive, BellOff, Users, Plus, Check, X } from 'lucide-react';
import NightlifeSelect from '@/components/ui/NightlifeSelect';
import { toast } from 'sonner';
import { exportUserDataZip } from '@/lib/exportUserData';
import QRCode from 'qrcode';
import { supabase } from '@/integrations/supabase/client';
import ExitSurveyModal from '@/components/dashboard/ExitSurveyModal';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { sanitizeInput, containsPhoneNumber } from '@/lib/contentFilter';
import { requestPushPermission, revokePushPermission, isPushSubscribed, showLocalNotification, isPushSupported } from '@/lib/pushNotifications';

const euLanguages = [
  '🇪🇸 Español', '🇬🇧 English', '🇩🇪 Deutsch', '🇫🇷 Français', '🇮🇹 Italiano',
  '🇵🇹 Português', '🇳🇱 Nederlands', '🇵🇱 Polski', '🇷🇴 Română', '🇬🇷 Ελληνικά',
  '🇨🇿 Čeština', '🇭🇺 Magyar', '🇸🇪 Svenska', '🇩🇰 Dansk', '🇫🇮 Suomi',
];

type ToggleRowProps = {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: () => void;
};
const ToggleRow = ({ label, desc, checked, onChange }: ToggleRowProps) => (
  <div className="flex items-center justify-between gap-3 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium leading-snug">{label}</p>
      {desc && <p className="text-xs text-muted-foreground leading-snug">{desc}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className="relative w-9 h-5 rounded-full transition-all"
        style={{ background: checked ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.08)', border: `1px solid ${checked ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.1)'}` }}>
        <div className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform"
          style={{ background: checked ? '#D4AF37' : '#3d3d4e', transform: checked ? 'translateX(16px)' : 'translateX(0)' }} />
      </div>
    </label>
  </div>
);

type SectionProps = { title: string; icon: React.ReactNode; children: React.ReactNode };
const Section = ({ title, icon, children }: SectionProps) => (
  <div className="glass-panel p-5 mb-4">
    <div className="flex items-center gap-2 mb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>
      <span style={{ color: '#8A6D0F' }}>{icon}</span>
      <h3 className="text-sm font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

// Faltaban roles reales del sistema (empresario, grupo musical, fotógrafo,
// photo-booth, mago, humorista, bailarín, speaker, vestuario...): quien
// quisiera un segundo perfil con uno de ellos no podía crearlo desde aquí.
const ROLE_OPTIONS = [
  { value: 'dj',              label: 'DJ / Artista / Productor' },
  { value: 'rookie',          label: 'Artista Promesa' },
  { value: 'grupo-musical',   label: 'Grupo musical' },
  { value: 'staff',           label: 'Camarero / Sala' },
  { value: 'azafata',         label: 'Azafata' },
  { value: 'event_manager',   label: 'Encargada de Eventos' },
  { value: 'promotor',        label: 'Promotor / RRPP' },
  { value: 'catering',        label: 'Catering / Cocina' },
  { value: 'media',           label: 'Media & Contenido' },
  { value: 'fotografo',       label: 'Fotógrafo' },
  { value: 'photo-booth',     label: 'Photo Booth' },
  { value: 'makeup',          label: 'Maquillaje' },
  { value: 'peluqueria',      label: 'Peluquería a Domicilio' },
  { value: 'vestuario',       label: 'Vestuario / Estilismo' },
  { value: 'mago',            label: 'Mago / Ilusionista' },
  { value: 'humorista',       label: 'Humorista' },
  { value: 'animador',        label: 'Animador' },
  { value: 'bailarin',        label: 'Bailarín / Instructor' },
  { value: 'speaker',         label: 'Speaker / Presentador' },
  { value: 'wedding-planner', label: 'Wedding Planner' },
  { value: 'design',          label: 'Diseño & Visuales' },
  { value: 'empresario',      label: 'Empresa / Sala' },
];

// Etiquetas legibles para pintar el rol de cada perfil (el valor crudo daba
// "Grupo-musical", "Photo-booth"...). Derivado de ROLE_OPTIONS para que no
// se desincronicen al añadir roles nuevos.
const PROFILE_ROLE_LABEL: Record<string, string> = Object.fromEntries(
  ROLE_OPTIONS.map(o => [o.value, o.label])
);

const MultiProfileSection = () => {
  const { allProfiles, maxProfiles, switchProfile, createProfile, profileId } = useProfile();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('dj');
  const [newZone, setNewZone] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error('Introduce un nombre'); return; }
    setSaving(true);
    const ok = await createProfile({ display_name: newName.trim(), role: newRole, zone: newZone || 'España', hourly_rate: 40 });
    setSaving(false);
    if (ok) { setAdding(false); setNewName(''); setNewRole('dj'); setNewZone(''); }
  };

  return (
    <Section title="Mis perfiles" icon={<Users size={15} />}>
      <p className="text-xs text-muted-foreground mb-3">
        Crea perfiles adicionales con roles distintos (ej. DJ y Fotógrafo) y cambia entre ellos cuando quieras.
      </p>
      <div className="space-y-2 mb-3">
        {allProfiles.map(p => (
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
            style={{ background: p.id === profileId ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${p.id === profileId ? 'rgba(212,175,55,0.25)' : 'rgba(0,0,0,0.05)'}` }}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{p.display_name}</p>
              {/* `capitalize` sobre el valor crudo daba "Grupo-musical" o
                  "Photo-booth" en vez del nombre real del rol. */}
              <p className="text-xs text-muted-foreground truncate">{PROFILE_ROLE_LABEL[p.role] ?? p.role}</p>
            </div>
            {p.id === profileId
              ? <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: '#8A6D0F' }}>ACTIVO</span>
              : <button onClick={() => switchProfile(p.id)} className="text-xs font-bold px-3 py-1 rounded-lg transition-all hover:scale-105"
                  style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#3d3d4e' }}>
                  Cambiar
                </button>
            }
          </div>
        ))}
      </div>

      {allProfiles.length < maxProfiles && !adding && (
        <button onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.01]"
          style={{ background: 'rgba(212,175,55,0.05)', border: '1px dashed rgba(212,175,55,0.25)', color: 'rgba(212,175,55,0.7)' }}>
          <Plus size={13} /> Añadir perfil ({allProfiles.length}/{maxProfiles})
        </button>
      )}

      {/* Al alcanzar el máximo el botón desaparecía sin decir nada, y como no
          hay forma de borrar un perfil el usuario se quedaba bloqueado sin
          entender por qué. */}
      {allProfiles.length >= maxProfiles && !adding && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Has alcanzado el máximo de {maxProfiles} perfiles. Para eliminar uno, escríbenos desde Soporte.
        </p>
      )}

      {adding && (
        <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-xs font-bold" style={{ color: '#8A6D0F' }}>Nuevo perfil</p>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre artístico o profesional"
            maxLength={60} className="nightlife-input !py-2.5 text-sm w-full" />
          <NightlifeSelect value={newRole} onChange={setNewRole} options={ROLE_OPTIONS} active />
          <input value={newZone} onChange={e => setNewZone(e.target.value)} placeholder="Ciudad (ej. Barcelona)"
            maxLength={80} className="nightlife-input !py-2.5 text-sm w-full" />
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#3d3d4e' }}>
              <X size={12} className="inline mr-1" />Cancelar
            </button>
            <button onClick={handleCreate} disabled={saving} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              {saving ? 'Creando...' : <><Check size={12} className="inline mr-1" />Crear perfil</>}
            </button>
          </div>
        </div>
      )}
    </Section>
  );
};

const SettingsView = ({ onNavigate }: { onNavigate?: (view: string) => void }) => {
  const { user, signOut } = useAuth();
  const profile = useProfile();
  const photoRef = useRef<HTMLInputElement>(null);

  // Profile fields
  const [localName, setLocalName] = useState<string | null>(null);
  const [localCity, setLocalCity] = useState<string | null>(null);
  const [localRate, setLocalRate] = useState<number | null>(null);
  const [localBirthday, setLocalBirthday] = useState<string | null>(null);
  const [localPhone, setLocalPhone] = useState<string | null>(null);

  // Notification prefs — backed by localStorage + Web Push
  const [pushEnabled, setPushEnabled] = useState(() => isPushSubscribed());
  const [notifMessages, setNotifMessages] = useState(() => localStorage.getItem('xpeak_notif_messages') !== 'false');
  const [notifFlash, setNotifFlash] = useState(() => localStorage.getItem('xpeak_notif_flash') !== 'false');
  const [notifTopWeekend, setNotifTopWeekend] = useState(() => localStorage.getItem('xpeak_notif_topweekend') !== 'false');


  // Account deletion
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showExitSurvey, setShowExitSurvey] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

  // Privacy
  const [saving, setSaving] = useState(false);
  // Inicializados desde el perfil real: antes arrancaban siempre en `true`, así
  // que un usuario que había desactivado algo lo veía activado al volver.
  const [profilePublic, setProfilePublic] = useState(profile.is_public ?? true);
  const [showRate, setShowRate] = useState(() => (profile.hourly_rate ?? 0) > 0);
  const [allowFlash, setAllowFlash] = useState(profile.is_flash_active ?? true);
  const [showOnline, setShowOnline] = useState(profile.show_online ?? true);

  // Las preferencias de notificación viven en alert_preferences (server-side)
  // porque los emails y las push salen del servidor y no pueden leer el
  // localStorage del navegador. localStorage se mantiene como espejo para
  // pintar la UI al instante, igual que hace CalendarView.
  const persistNotifPref = async (column: string, lsKey: string, value: boolean) => {
    localStorage.setItem(lsKey, String(value));
    if (!user) return;
    const { error } = await supabase.from('alert_preferences' as any).upsert({
      user_id: user.id,
      [column]: value,
      updated_at: new Date().toISOString(),
    });
    // Si la migración 20260829c aún no está aplicada, la columna no existe:
    // el espejo en localStorage ya quedó guardado, así que la UI no miente
    // más de lo que lo hacía antes y no se rompe nada.
    if (error) console.warn('[SettingsView] notif pref not persisted server-side:', error.message);
  };

  // Carga inicial desde servidor: es la fuente de verdad, y así la preferencia
  // viaja entre dispositivos en vez de quedarse en un solo navegador.
  useEffect(() => {
    if (!user) return;
    supabase.from('alert_preferences' as any)
      .select('notif_messages, notif_flash, notif_top_weekend')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) return;
        const row = data as any;
        if (typeof row.notif_messages === 'boolean') setNotifMessages(row.notif_messages);
        if (typeof row.notif_flash === 'boolean') setNotifFlash(row.notif_flash);
        if (typeof row.notif_top_weekend === 'boolean') setNotifTopWeekend(row.notif_top_weekend);
      });
  }, [user]);

  // El perfil llega asíncrono: sin esto, el valor inicial (calculado en el
  // primer render, cuando aún son los defaults) se quedaría fijo y los toggles
  // mostrarían "activado" aunque el usuario lo tuviera desactivado en BD.
  useEffect(() => {
    setProfilePublic(profile.is_public ?? true);
    setAllowFlash(profile.is_flash_active ?? true);
    setShowOnline(profile.show_online ?? true);
  }, [profile.is_public, profile.is_flash_active, profile.show_online]);

  // Persist audio quality when it changes

  const isEmpresario = profile.role === 'empresario';
  const displayName = localName ?? profile.display_name;
  const city = localCity ?? profile.zone ?? 'Madrid Centro';
  const rate = localRate ?? profile.hourly_rate;
  const rawPhoto = profile.photo_url;
  const photoUrl = rawPhoto && rawPhoto.length > 5 ? rawPhoto : null;
  const initials = displayName ? displayName.charAt(0).toUpperCase() : 'X';
  /* ── RGPD Art. 20 — Portabilidad de datos ── */
  const handleExportData = async () => {
    if (!user) return;
    toast.info('Recopilando tus datos…');
    try {
      const [profileRes, favRes, bookingsRes, convsRes, msgsRes, reviewsRes, jobsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('favorites').select('*').eq('user_id', user.id),
        // Un booking pertenece al usuario tanto si lo creó (empresario) como si es
        // el profesional contratado — filtrar solo por created_by dejaba vacíos
        // los datos exportados de cualquier profesional (el caso de uso principal).
        supabase.from('flash_bookings').select('*').or(`created_by.eq.${user.id},professional_user_id.eq.${user.id}`),
        supabase.from('conversations').select('*').or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`),
        // Faltaban: se exportaban las conversaciones pero no los MENSAJES (el
        // dato personal más relevante), ni las reseñas escritas ni las ofertas
        // publicadas. Art. 20 exige entregar los datos que el usuario aportó.
        supabase.from('messages').select('*').eq('sender_id', user.id),
        supabase.from('reviews').select('*').eq('reviewer_id', user.id),
        supabase.from('flash_jobs').select('*').eq('employer_id', user.id),
      ]);

      // Supabase devuelve { error } en vez de lanzar: sin comprobarlo, un fallo
      // de RLS producía un JSON con listas vacías y un "exportado correctamente".
      const failed = [profileRes, favRes, bookingsRes, convsRes, msgsRes, reviewsRes, jobsRes].filter(r => r.error);
      if (failed.length > 0) {
        failed.forEach(r => console.error('[SettingsView] export step failed:', r.error?.message));
        toast.error('No se pudieron recuperar todos tus datos. Inténtalo de nuevo o escribe a soporte.');
        return;
      }

      const exportData = {
        meta: {
          exported_at: new Date().toISOString(),
          platform: 'XPEAK',
          legal_basis: 'RGPD Art. 20 — Derecho a la portabilidad de los datos',
          user_id: user.id,
          email: user.email,
        },
        profile: profileRes.data ?? null,
        favorites: favRes.data ?? [],
        flash_bookings: bookingsRes.data ?? [],
        conversations: convsRes.data ?? [],
        messages: msgsRes.data ?? [],
        reviews: reviewsRes.data ?? [],
        flash_jobs: jobsRes.data ?? [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `XPEAK_mis_datos_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Datos exportados correctamente.');
    } catch {
      toast.error('Error al exportar datos. Inténtalo de nuevo.');
    }
  };


  /* ── Informe Anual PDF ── */
  const handleExportInformeAnual = async () => {
    if (!user) return;
    const currentYear = new Date().getFullYear();
    // Report is for prior year, available from Jan 1 of current year
    const reportYear = currentYear - 1;
    if (reportYear < 2026) {
      toast.info('El Informe Anual 2026 estará disponible a partir del 1 de enero de 2027.');
      return;
    }
    toast.info('Generando informe anual…');
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        // Igual que en el export ZIP: un booking es del usuario tanto si lo creó
        // (empresario) como si es el profesional contratado.
        supabase.from('flash_bookings').select('*').or(`created_by.eq.${user.id},professional_user_id.eq.${user.id}`),
      ]);
      const p = profileRes.data as Record<string, unknown> | null ?? {};
      const bookings = ((bookingsRes.data ?? []) as Record<string, unknown>[])
        .filter(b => String(b.event_date ?? '').startsWith(String(reportYear)));
      const accepted = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
      const cities = [...new Set(bookings.map(b => b.event_location as string).filter(Boolean))];
      const initials = ((p.display_name as string) ?? 'X').charAt(0).toUpperCase();

      // Monthly counts for bar chart
      const monthly = Array(12).fill(0);
      bookings.forEach(b => {
        const m = new Date(b.event_date as string).getMonth();
        if (!isNaN(m)) monthly[m]++;
      });
      const maxM = Math.max(...monthly, 1);
      const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

      const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Informe Anual ${reportYear} · XPEAK</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#000;color:#f4f1eb;font-family:'Segoe UI',system-ui,sans-serif;padding:48px 0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .doc{max-width:680px;margin:0 auto;padding:0 32px}
  .hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid rgba(212,175,55,0.3)}
  .logo{font-size:22px;font-weight:900;letter-spacing:2px;color:#D4AF37}
  .hdr-right{text-align:right;font-size:11px;color:#333}
  .avail{font-size:10px;padding:4px 10px;border-radius:999px;background:rgba(212,175,55,0.1);color:#D4AF37;border:1px solid rgba(212,175,55,0.3);margin-top:6px;display:inline-block}
  .prof-card{display:flex;align-items:center;gap:20px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.08);border-radius:16px;padding:24px;margin-bottom:32px}
  .avatar{width:64px;height:64px;border-radius:14px;background:linear-gradient(135deg,#D4AF37,#B8941E);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#000;flex-shrink:0}
  .prof-name{font-size:20px;font-weight:800;margin-bottom:4px}
  .prof-meta{font-size:12px;color:#333}
  .badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(212,175,55,0.12);color:#D4AF37;border:1px solid rgba(212,175,55,0.25);margin-top:6px}
  .kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
  .kpi{background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.06);border-radius:12px;padding:16px;text-align:center}
  .kpi-val{font-size:24px;font-weight:900;color:#D4AF37}
  .kpi-lbl{font-size:10px;color:#333;margin-top:4px}
  .sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(212,175,55,0.7);margin-bottom:14px}
  table{width:100%;border-collapse:collapse;margin-bottom:32px;font-size:12px}
  th{text-align:left;padding:8px 10px;color:#333;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid rgba(0,0,0,0.05)}
  td{padding:10px;border-bottom:1px solid rgba(0,0,0,0.04)}
  .status{font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px}
  .st-ok{background:rgba(34,197,94,0.1);color:#22c55e;border:1px solid rgba(34,197,94,0.2)}
  .st-pend{background:rgba(212,175,55,0.1);color:#D4AF37;border:1px solid rgba(212,175,55,0.2)}
  .st-rej{background:rgba(255,95,86,0.1);color:#ff5f56;border:1px solid rgba(255,95,86,0.2)}
  .chart-wrap{margin-bottom:32px}
  .bar-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
  .bar-lbl{font-size:10px;color:#333;width:28px;flex-shrink:0;text-align:right}
  .bar-track{flex:1;height:14px;background:rgba(0,0,0,0.04);border-radius:4px;overflow:hidden}
  .bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#D4AF37,#B8941E)}
  .bar-count{font-size:10px;color:#333;width:16px;flex-shrink:0}
  .fiscal{background:rgba(212,175,55,0.04);border:1px solid rgba(212,175,55,0.12);border-radius:12px;padding:16px;margin-bottom:32px;font-size:11px;color:#333;line-height:1.7}
  .fiscal strong{color:rgba(212,175,55,0.7)}
  .ftr{text-align:center;font-size:10px;color:rgba(0,0,0,0.1);padding-top:24px;border-top:1px solid rgba(0,0,0,0.05)}
  @media print{body{background:#000!important;padding:0}@page{margin:10mm;size:A4}}
</style></head>
<body><div class="doc">
  <div class="hdr">
    <div class="logo">XPEAK</div>
    <div class="hdr-right">
      <div>Informe Anual ${reportYear}</div>
      <div class="avail">Generado el ${new Date().toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}</div>
    </div>
  </div>

  <div class="prof-card">
    <div class="avatar">${initials}</div>
    <div>
      <div class="prof-name">${(p.display_name as string) ?? 'Usuario'}</div>
      <div class="prof-meta">${(p.role as string) ?? ''} · ${(p.zone as string) ?? ''} · ${user.email}</div>
      <span class="badge">XPEAK</span>
    </div>
  </div>

  <div class="kpi-row">
    <div class="kpi"><div class="kpi-val">${bookings.length}</div><div class="kpi-lbl">Bookings ${reportYear}</div></div>
    <div class="kpi"><div class="kpi-val">${accepted.length}</div><div class="kpi-lbl">Aceptados</div></div>
    <div class="kpi"><div class="kpi-val">${cities.length}</div><div class="kpi-lbl">Ciudades</div></div>
    <div class="kpi"><div class="kpi-val">${bookings.length > 0 ? Math.round((accepted.length / bookings.length) * 100) : 0}%</div><div class="kpi-lbl">Tasa aceptación</div></div>
  </div>

  <div class="sec-title">Historial de bookings ${reportYear}</div>
  ${bookings.length > 0 ? `
  <table>
    <tr><th>Fecha</th><th>Descripción</th><th>Ubicación</th><th>Estado</th></tr>
    ${bookings.slice(0, 20).map(b => {
      const stClass = b.status === 'confirmed' || b.status === 'completed' ? 'st-ok' : b.status === 'pending' ? 'st-pend' : 'st-rej';
      const stLabel = b.status === 'confirmed' || b.status === 'completed' ? 'Completado' : b.status === 'pending' ? 'Pendiente' : 'Cancelado';
      return `<tr><td>${String(b.event_date ?? '').slice(0,10)}</td><td>${String(b.event_description ?? '').slice(0,35)}</td><td>${String(b.event_location ?? '').slice(0,20)}</td><td><span class="status ${stClass}">${stLabel}</span></td></tr>`;
    }).join('')}
  </table>` : '<p style="font-size:12px;color:#333;margin-bottom:32px">Sin bookings registrados en ' + reportYear + '</p>'}

  <div class="chart-wrap">
    <div class="sec-title">Actividad mensual ${reportYear}</div>
    ${monthly.map((count, i) => `
    <div class="bar-row">
      <div class="bar-lbl">${monthNames[i]}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round((count/maxM)*100)}%"></div></div>
      <div class="bar-count">${count}</div>
    </div>`).join('')}
  </div>

  <div class="fiscal">
    <strong>Nota fiscal (orientativa):</strong> Este informe no constituye una declaración fiscal oficial.
    Si ejerces como autónomo/a, consulta con tu asesor/a fiscal para incluir estos ingresos en tu declaración del IRPF
    (modelo 130 trimestral / modelo 100 anual). XPEAK no actúa como agente de retención.
    Para certificados oficiales de actividad, contacta con soporte.
  </div>

  <div class="ftr">XPEAK · xpeak.es · ${user.id} · Exportado el ${new Date().toISOString()}</div>
</div>
<script>window.print();</script>
</body></html>`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) toast.info('Permite las ventanas emergentes para generar el PDF.');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      toast.success(`Informe ${reportYear} listo. Usa Ctrl+P / Cmd+P → "Guardar como PDF".`);
    } catch {
      toast.error('Error al generar el informe. Inténtalo de nuevo.');
    }
  };

  /* ── QR de Perfil ── */
  const handleDownloadQR = async () => {
    if (!user) return;
    try {
      const p = profile as Record<string, unknown>;
      const slug = (p.slug as string) || String(user.id);
      const profileUrl = `https://xpeak.es/p/${slug}`;
      const displayName = (p.display_name as string) ?? 'Mi Perfil';
      const role = (p.role as string) ?? '';
      const zone = (p.zone as string) ?? '';

      // Generate QR as data URL (400px)
      const qrDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#1a1a1a', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });

      // Draw card on canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 500;
      const ctx = canvas.getContext('2d')!;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.roundRect(0, 0, 400, 500, 20);
      ctx.fill();

      // Top gold bar
      ctx.fillStyle = '#D4AF37';
      ctx.roundRect(0, 0, 400, 8, [20, 20, 0, 0]);
      ctx.fill();

      // XPEAK logo text
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.letterSpacing = '3px';
      ctx.textAlign = 'center';
      ctx.fillText('XPEAK', 200, 48);

      // QR image
      const qrImg = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = reject;
        qrImg.src = qrDataUrl;
      });
      ctx.drawImage(qrImg, 50, 65, 300, 300);

      // Name
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.letterSpacing = '0px';
      ctx.textAlign = 'center';
      ctx.fillText(displayName.slice(0, 30), 200, 400);

      // Role + Zone
      ctx.fillStyle = '#888888';
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillText([role, zone].filter(Boolean).join(' · ').slice(0, 40) || 'XPEAK', 200, 422);

      // URL
      ctx.fillStyle = '#D4AF37';
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText(profileUrl.replace('https://', ''), 200, 445);

      // Bottom note
      ctx.fillStyle = '#cccccc';
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillText('Escanea para ver perfil completo', 200, 475);

      // Download
      const link = document.createElement('a');
      link.download = `XPEAK_QR_${slug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('QR descargado como PNG.');
    } catch {
      toast.error('Error al generar el QR. Inténtalo de nuevo.');
    }
  };

  const handleSendDeleteOtp = async () => {
    if (!user) return;
    if (deleteConfirmEmail.trim().toLowerCase() !== user.email?.toLowerCase()) {
      toast.error('El email no coincide con el de tu cuenta');
      return;
    }
    setSendingOtp(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: user.email!,
      options: { shouldCreateUser: false },
    });
    setSendingOtp(false);
    if (error) {
      toast.error('No se pudo enviar el código. Inténtalo de nuevo.');
      return;
    }
    setOtpSent(true);
    toast.success(`Código enviado a ${user.email}. Revisa tu bandeja de entrada.`);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!otpCode.trim()) { toast.error('Introduce el código de confirmación'); return; }
    setDeleting(true);
    try {
      // 1. Verificar OTP (prueba de acceso al correo)
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: user.email!,
        token: otpCode.trim(),
        type: 'email',
      });
      if (otpError) {
        toast.error('Código incorrecto o expirado. Solicita uno nuevo.');
        setDeleting(false);
        return;
      }

      // 2. Eliminar datos personales (RGPD Art. 17 — derecho de supresión)
      //
      // flash_bookings donde este usuario es el profesional contratado
      // (professional_user_id) NO se borran — pertenecen también al empresario
      // que los creó y forman parte de su propio historial/contabilidad
      // (Historial, Gastos). En su lugar se anonimiza el nombre para que no
      // quede ningún dato personal identificable, conforme al Art. 17.
      // Supabase NO lanza excepción ante un error de RLS: devuelve { error }.
      // Ignorarlos (como se hacía) significaba cerrar sesión y afirmar que
      // todo se había suprimido aunque no fuera cierto, con el usuario ya sin
      // sesión para reintentar. Ahora se comprueba cada operación.
      const ops = await Promise.all([
        supabase.from('profiles').delete().eq('user_id', user.id),
        supabase.from('favorites').delete().eq('user_id', user.id),
        supabase.from('flash_bookings').delete().eq('created_by', user.id),
        supabase.from('flash_bookings')
          .update({ professional_name: 'Profesional eliminado', professional_user_id: null } as any)
          .eq('professional_user_id', user.id),
        // Estas tablas quedaban fuera del borrado y conservaban datos
        // personales: el contenido de los chats, reseñas escritas, ofertas
        // publicadas y días bloqueados. Las cascadas de auth.users no aplican
        // porque esa cuenta no se elimina desde el cliente.
        supabase.from('messages').delete().eq('sender_id', user.id),
        supabase.from('reviews').delete().eq('reviewer_id', user.id),
        supabase.from('flash_jobs').delete().eq('employer_id', user.id),
        supabase.from('availability').delete().eq('user_id', user.id),
      ]);

      const failed = ops.filter(r => r.error);
      if (failed.length > 0) {
        failed.forEach(r => console.error('[SettingsView] delete step failed:', r.error?.message));
        toast.error('No se pudieron borrar todos tus datos. No se ha cerrado la sesión: escribe a soporte para completar la supresión.');
        setDeleting(false);
        return;
      }

      // 3. Encuesta de salida antes de cerrar sesión: record_exit_survey valida
      // auth.uid() contra el claim de la baja, así que necesita la sesión viva.
      // Es opcional — el modal se puede cerrar sin responder.
      setShowExitSurvey(true);
    } catch {
      toast.error('Error al eliminar la cuenta. Contacta con soporte.');
      setDeleting(false);
    }
  };

  // Cierra sesión al terminar (o saltarse) la encuesta de salida.
  const finishAccountDeletion = async () => {
    setShowExitSurvey(false);
    await signOut();
    toast.success('Datos personales suprimidos y sesión cerrada (RGPD Art. 17). La baja definitiva de la cuenta de acceso se completa desde soporte.');
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten imágenes.'); return; }
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED.includes(file.type)) { toast.error('Formato no permitido. Usa JPG, PNG, WebP o GIF.'); return; }
    if (file.size > MAX_RAW_IMAGE_MB * 1024 * 1024) { toast.error(`Máximo ${MAX_RAW_IMAGE_MB}MB para la foto`); return; }

    const compressed = await compressImage(file);
    const safeName = compressed.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${user.id}/avatar-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, compressed);
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
    // Edad mínima: XPEAK conecta con salas y eventos nocturnos, no aceptamos menores de 18.
    if (localBirthday) {
      const age = Math.floor((Date.now() - new Date(localBirthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        toast.error('Debes ser mayor de 18 años para tener un perfil profesional en XPEAK.');
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
      const ok = await profile.updateField(updates);
      setSaving(false);
      // Sin comprobar el resultado se mostraba "Cambios guardados." aunque el
      // guardado hubiera fallado: el usuario veía el toast de error y el de
      // éxito a la vez, y se iba creyendo que sus datos estaban salvados.
      if (!ok) return;
    }
    toast.success('Cambios guardados.');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease] max-w-3xl mx-auto">
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
            <p className="text-xs text-muted-foreground">Haz clic para cambiar · se optimiza automáticamente</p>
          </div>
          <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{isEmpresario ? 'Nombre de la empresa o sala' : 'Nombre artístico'}</label>
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
          {!isEmpresario && (
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium" style={{ color: '#8A6D0F' }}>Caché base (€/hora)</label>
            <input type="number" value={rate ?? ''} onChange={e => setLocalRate(Number(e.target.value))} min={20} step={5} className="nightlife-input text-sm font-bold" style={{ color: '#8A6D0F' }} />
          </div>
          )}
        </div>

        {/* XPEAK aún no tiene traducciones: el selector guardaba el idioma y
            decía "Idioma guardado", pero la interfaz seguía en español y el
            valor no lo lee nadie. Se deja como preferencia declarada, sin
            prometer un cambio que no ocurre. */}
        <div className="mb-4">
          <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Idioma preferido</label>
          <NightlifeSelect
            value={localStorage.getItem('xpeak_language') ?? '🇪🇸 Español'}
            onChange={v => { localStorage.setItem('xpeak_language', v); toast.success('Preferencia guardada.'); }}
            options={euLanguages.map(l => ({ value: l, label: l }))}
            active
          />
          <p className="text-[0.7rem] text-muted-foreground mt-1.5">
            La interfaz está disponible en español. Guardamos tu preferencia para avisarte cuando añadamos tu idioma.
          </p>
        </div>

        <button className="btn-nightlife-primary w-full text-sm py-2.5 disabled:opacity-60" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notificaciones" icon={<Bell size={15} />}>
        {(() => {
          const supported = isPushSupported();
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isStandalone = ('standalone' in navigator) && (navigator as any).standalone;
          const permission = supported ? (Notification as any).permission : 'unsupported';
          const isBlocked = permission === 'denied';
          const isIosNotPWA = isIOS && !isStandalone;

          if (!supported || isIosNotPWA) {
            return (
              <div className="rounded-xl p-4 mb-4 space-y-3"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-3">
                  <BellOff size={16} style={{ color: '#333', flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-bold">
                      {isIosNotPWA ? 'Instala XPEAK para activar notificaciones' : 'Notificaciones no disponibles en este navegador'}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                      {isIosNotPWA
                        ? 'En iPhone/iPad las notificaciones solo funcionan si añades XPEAK a la pantalla de inicio.'
                        : 'Abre XPEAK en Chrome, Safari o Firefox para activar alertas push.'}
                    </p>
                  </div>
                </div>
                {isIosNotPWA && (
                  <div className="rounded-lg p-3 space-y-1.5 text-xs"
                    style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <p className="font-bold" style={{ color: '#8A6D0F' }}>Cómo instalar en iPhone/iPad:</p>
                    {['1. Pulsa el icono de compartir ↑ en Safari', '2. Selecciona "Añadir a pantalla de inicio"', '3. Abre XPEAK desde el icono nuevo', '4. Vuelve a Ajustes → Notificaciones'].map(s => (
                      <p key={s} className="text-muted-foreground">{s}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (isBlocked) {
            return (
              <div className="rounded-xl p-4 mb-4 space-y-3"
                style={{ background: 'rgba(255,95,86,0.04)', border: '1px solid rgba(255,95,86,0.15)' }}>
                <div className="flex items-center gap-3">
                  <BellOff size={16} style={{ color: '#ff5f56', flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#ff5f56' }}>Notificaciones bloqueadas</p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                      Has bloqueado los permisos. Para reactivarlas tienes que cambiarlas manualmente en tu navegador.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg p-3 space-y-1.5 text-xs"
                  style={{ background: 'rgba(255,95,86,0.06)', border: '1px solid rgba(255,95,86,0.12)' }}>
                  <p className="font-bold" style={{ color: '#ff5f56' }}>Cómo desbloquear:</p>
                  {[
                    'Chrome: haz clic en el 🔒 de la barra de dirección → Permisos del sitio → Notificaciones → Permitir',
                    'Safari Mac: Safari → Ajustes → Sitios web → Notificaciones → xpeak.es → Permitir',
                    'Firefox: icono 🔒 → Limpiar permiso de notificaciones → Recarga la página',
                  ].map(s => <p key={s} className="text-muted-foreground leading-relaxed">{s}</p>)}
                </div>
              </div>
            );
          }

          return (
            <div className="rounded-xl p-4 mb-4 flex items-center justify-between gap-3"
              style={{ background: pushEnabled ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${pushEnabled ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.06)'}` }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {pushEnabled
                  ? <Bell size={16} style={{ color: '#8A6D0F', flexShrink: 0 }} />
                  : <BellOff size={16} style={{ color: '#333', flexShrink: 0 }} />}
                <div className="min-w-0">
                  <p className="text-sm font-bold">{pushEnabled ? 'Notificaciones activas' : 'Notificaciones desactivadas'}</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {pushEnabled ? 'Recibirás alertas de mensajes y Flash Bookings' : 'Actívalas para no perderte nada importante'}
                  </p>
                </div>
              </div>
              <button type="button"
                onClick={async () => {
                  if (pushEnabled) {
                    await revokePushPermission();
                    setPushEnabled(false);
                    toast.success('Notificaciones desactivadas.');
                  } else {
                    if (!user) return;
                    const ok = await requestPushPermission(user.id);
                    if (ok) {
                      setPushEnabled(true);
                      await showLocalNotification('XPEAK', '¡Notificaciones activas! Te avisaremos cuando lleguen mensajes o bookings.', '/dashboard');
                      toast.success('Notificaciones activadas.');
                    } else {
                      toast.error('No se pudo activar. Revisa los permisos del sitio en tu navegador.');
                    }
                  }
                }}
                className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  background: pushEnabled ? 'rgba(255,95,86,0.08)' : 'linear-gradient(90deg,#D4AF37,#B8941E)',
                  color: pushEnabled ? '#ff5f56' : '#000',
                  border: pushEnabled ? '1px solid rgba(255,95,86,0.2)' : 'none',
                }}>
                {pushEnabled ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          );
        })()}

        <ToggleRow label="Mensajes nuevos" desc="Alerta cuando recibes un mensaje directo" checked={notifMessages}
          onChange={() => { const v = !notifMessages; setNotifMessages(v); persistNotifPref('notif_messages', 'xpeak_notif_messages', v); }} />
        <ToggleRow
          label="Flash Booking"
          desc={isEmpresario ? 'Respuestas a tus publicaciones de trabajo urgente' : 'Ofertas urgentes de empresarios'}
          checked={notifFlash}
          onChange={() => { const v = !notifFlash; setNotifFlash(v); persistNotifPref('notif_flash', 'xpeak_notif_flash', v); }} />
        {!isEmpresario && (
          <ToggleRow label="Top Weekend" desc="Cuando tu perfil asciende al ranking" checked={notifTopWeekend}
            onChange={() => { const v = !notifTopWeekend; setNotifTopWeekend(v); persistNotifPref('notif_top_weekend', 'xpeak_notif_topweekend', v); }} />
        )}
        <ToggleRow label="Emails de mensajes" desc="Recibir email cuando alguien te escribe por chat"
          checked={!profile.email_opt_out}
          onChange={async () => {
            const next = !profile.email_opt_out;
            await profile.updateField({ email_opt_out: next });
            toast.success(next ? 'Emails de mensajes desactivados' : 'Emails de mensajes activados');
          }} />
      </Section>

      {/* ── Mis perfiles ── */}
      <MultiProfileSection />

      {/* ── Privacy ── */}
      <Section title="Privacidad" icon={<Shield size={15} />}>
        <ToggleRow label="Perfil público en el directorio" desc="Si está desactivado, no apareces en el directorio público" checked={profilePublic} onChange={async () => {
          const next = !profilePublic;
          setProfilePublic(next);
          const ok = await profile.updateField({ is_public: next });
          if (!ok) { setProfilePublic(!next); return; }
          toast.success(next ? 'Tu perfil vuelve a ser público' : 'Tu perfil ya no aparece en el directorio');
        }} />
        {!isEmpresario && (
        <ToggleRow label="Mostrar tarifa en mi ficha" desc="Si está desactivado, aparece 'A consultar' en tu perfil" checked={showRate} onChange={async () => {
          const next = !showRate;
          setShowRate(next);
          const newRate = next ? (localRate ?? profile.hourly_rate ?? 40) : 0;
          setLocalRate(newRate);
          await profile.updateField({ hourly_rate: newRate });
        }} />
        )}
        {!isEmpresario && (
        <ToggleRow label="Disponible en Flash Booking" desc="Empresarios pueden enviarte solicitudes urgentes" checked={allowFlash} onChange={async () => {
          const next = !allowFlash;
          setAllowFlash(next);
          const ok = await profile.updateField({ is_flash_active: next });
          if (!ok) setAllowFlash(!next);
        }} />
        )}
        <ToggleRow label="Mostrar estado en línea" desc="Indica si estás activo en la plataforma" checked={showOnline} onChange={async () => {
          const next = !showOnline;
          setShowOnline(next);
          const ok = await profile.updateField({ show_online: next });
          if (!ok) setShowOnline(!next);
        }} />
        <div className="pt-3 mt-1 space-y-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tus derechos RGPD</p>

          {/* JSON export */}
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2.5">
              <Download size={14} style={{ color: '#8A6D0F', flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold">Exportar JSON (Art. 20)</p>
                <p className="text-xs text-muted-foreground">Todos tus datos en un archivo JSON completo</p>
              </div>
            </div>
            <button onClick={handleExportData}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.25)' }}>
              Descargar
            </button>
          </div>

          {/* CSV ZIP export */}
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2.5">
              <Archive size={14} style={{ color: '#8A6D0F', flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold">CSV múltiple (ZIP)</p>
                <p className="text-xs text-muted-foreground">perfil · bookings · favoritos · conversaciones</p>
              </div>
            </div>
            <button onClick={() => user && exportUserDataZip(user)}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.25)' }}>
              Descargar
            </button>
          </div>

          {/* Informe Anual */}
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2.5">
              <FileText size={14} style={{ color: '#8A6D0F', flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold">Informe Anual PDF</p>
                <p className="text-xs text-muted-foreground">KPIs, bookings, actividad mensual · Disponible ene. 2027</p>
              </div>
            </div>
            <button onClick={handleExportInformeAnual}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.25)' }}>
              Generar
            </button>
          </div>

          {/* QR de perfil */}
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2.5">
              <QrCode size={14} style={{ color: '#8A6D0F', flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold">QR de Perfil</p>
                <p className="text-xs text-muted-foreground">PNG 400×500px con tu URL pública · Gratis siempre</p>
              </div>
            </div>
            <button onClick={handleDownloadQR}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.25)' }}>
              Descargar
            </button>
          </div>
        </div>
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

      {/* ── Zona de peligro — RGPD Art. 17 ── */}
      <div className="glass-panel p-5" style={{ border: '1px solid rgba(255,95,86,0.12)' }}>
        <button
          onClick={() => setShowDeleteZone(!showDeleteZone)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} style={{ color: '#ff5f56' }} />
            <span className="text-sm font-bold" style={{ color: '#ff5f56' }}>Zona de peligro</span>
          </div>
          <ChevronRight size={14} className="text-muted-foreground transition-transform"
            style={{ transform: showDeleteZone ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </button>

        {showDeleteZone && (
          <div className="mt-4 space-y-3 animate-[fadeIn_0.2s_ease]">
            <div className="p-3 rounded-lg text-xs leading-relaxed"
              style={{ background: 'rgba(255,95,86,0.04)', border: '1px solid rgba(255,95,86,0.1)' }}>
              <p className="font-bold mb-1" style={{ color: '#ff5f56' }}>Eliminar cuenta permanentemente</p>
              <p className="text-muted-foreground">
                Al eliminar tu cuenta, todos tus datos personales serán anonimizados de forma inmediata conforme al{' '}
                <span className="font-bold">RGPD Art. 17</span> (derecho al olvido). El registro de autenticación
                se purgará en un plazo de 30 días. Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Paso 1 — verificar email */}
            {!otpSent ? (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Paso 1 — Escribe tu email{' '}
                    <span className="font-bold" style={{ color: '#ff5f56' }}>{user?.email}</span>{' '}
                    para recibir el código de confirmación:
                  </p>
                  <input
                    type="email"
                    value={deleteConfirmEmail}
                    onChange={e => setDeleteConfirmEmail(e.target.value)}
                    placeholder="Tu email de cuenta"
                    maxLength={100}
                    className="nightlife-input text-sm w-full"
                    style={{ borderColor: 'rgba(255,95,86,0.3)' }}
                  />
                </div>
                <button
                  onClick={handleSendDeleteOtp}
                  disabled={sendingOtp || deleteConfirmEmail.trim().toLowerCase() !== user?.email?.toLowerCase()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-80 disabled:opacity-30"
                  style={{ background: 'rgba(255,95,86,0.08)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.2)' }}
                >
                  {sendingOtp ? 'Enviando…' : 'Enviar código de confirmación por email'}
                </button>
              </>
            ) : (
              /* Paso 2 — introducir OTP */
              <>
                <div className="p-3 rounded-lg text-xs"
                  style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <p style={{ color: '#22c55e' }} className="font-bold mb-0.5">Código enviado</p>
                  <p className="text-muted-foreground">
                    Revisa la bandeja de entrada de <span className="font-bold text-white">{user?.email}</span>.
                    El código expira en 10 minutos.
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Paso 2 — Introduce el código de 6 dígitos:
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="nightlife-input text-sm w-full text-center tracking-[0.4em] font-bold"
                    style={{ borderColor: 'rgba(255,95,86,0.3)', fontSize: '1.1rem' }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
                    style={{ background: 'rgba(0,0,0,0.03)', color: '#3d3d4e', border: '1px solid var(--nightlife-border)' }}
                  >
                    Reenviar código
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting || otpCode.length < 6}
                    className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-80 disabled:opacity-30"
                    style={{ background: 'rgba(255,95,86,0.1)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.25)' }}
                  >
                    <Trash2 size={14} />
                    {deleting ? 'Eliminando…' : 'Eliminar cuenta definitivamente'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showExitSurvey && <ExitSurveyModal onDone={finishAccountDeletion} />}
    </div>
  );
};

export default SettingsView;
