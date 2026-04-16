import { useState, useRef, useEffect } from 'react';
import { Camera, Bell, Volume2, Shield, Trophy, CreditCard, LogOut, ChevronRight, Trash2, AlertTriangle, Download, FileText, QrCode, Archive, BellOff } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { subscriptionPlans, mapSubscriptionTierToPlan } from '@/lib/subscriptions';
import { sanitizeInput, containsPhoneNumber } from '@/lib/contentFilter';
import { requestPushPermission, revokePushPermission, isPushSubscribed, showLocalNotification } from '@/lib/pushNotifications';

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
  <div className="flex items-center justify-between gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium leading-snug">{label}</p>
      {desc && <p className="text-xs text-muted-foreground leading-snug">{desc}</p>}
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

  // Notification prefs — backed by localStorage + Web Push
  const [pushEnabled, setPushEnabled] = useState(() => isPushSubscribed());
  const [notifMessages, setNotifMessages] = useState(() => localStorage.getItem('xpeak_notif_messages') !== 'false');
  const [notifFlash, setNotifFlash] = useState(() => localStorage.getItem('xpeak_notif_flash') !== 'false');
  const [notifTopWeekend, setNotifTopWeekend] = useState(() => localStorage.getItem('xpeak_notif_topweekend') !== 'false');
  const [notifMarketing, setNotifMarketing] = useState(() => localStorage.getItem('xpeak_notif_marketing') === 'true');
  const [notifSMS, setNotifSMS] = useState(() => localStorage.getItem('xpeak_notif_sms') === 'true');

  // Audio quality — persisted in localStorage
  const [audioQuality, setAudioQuality] = useState(() => localStorage.getItem('xpeak_audio_quality') ?? 'high');

  // Account deletion
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [deleting, setDeleting] = useState(false);

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

  /* ── RGPD Art. 20 — Portabilidad de datos ── */
  const handleExportData = async () => {
    if (!user) return;
    toast.info('Recopilando tus datos…');
    try {
      const [profileRes, favRes, bookingsRes, convsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('favorites').select('*').eq('user_id', user.id),
        supabase.from('flash_bookings').select('*').eq('created_by', user.id),
        supabase.from('conversations').select('*').or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`),
      ]);

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

  /* ── CSV Múltiple ZIP ── */
  const handleExportCSVZip = async () => {
    if (!user) return;
    toast.info('Recopilando datos…');
    try {
      const [profileRes, favRes, bookingsRes, convsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('favorites').select('*').eq('user_id', user.id),
        supabase.from('flash_bookings').select('*').eq('created_by', user.id),
        supabase.from('conversations').select('*').or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`),
      ]);

      const p = profileRes.data as Record<string, unknown> | null ?? {};
      const today = new Date().toISOString().slice(0, 10);
      const exportedAt = new Date().toISOString();
      const displayName = (p.display_name as string) ?? '';
      const slug = (p.slug as string) || displayName.toLowerCase().replace(/\s+/g, '-') || user.id.slice(0, 8);
      const hourlyRate = Number(p.hourly_rate ?? 0);

      const csv = (rows: (string | number | boolean | null | undefined)[][]): string =>
        rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');

      // ── 1. perfil.csv ──────────────────────────────────────────────────
      const perfilCsv = csv([
        ['campo', 'valor', 'notas'],
        ['user_id',          user.id,                              'Identificador único XPEAK'],
        ['email',            user.email ?? '',                     'Email de autenticación'],
        ['nombre_artistico', displayName,                          ''],
        ['rol',              (p.role as string) ?? '',             'dj · staff · makeup · media · ambassador'],
        ['zona',             (p.zone as string) ?? '',             'Ciudad/zona base de actividad'],
        ['bio',              ((p.bio as string) ?? '').replace(/\n/g, ' '), ''],
        ['tarifa_hora',      String(p.hourly_rate ?? ''),          'EUR · tarifa base orientativa'],
        ['suscripcion',      (p.subscription_tier as string) ?? 'free', 'free · pro · elite'],
        ['verificado',       p.is_verified ? 'sí' : 'no',         'Verificación manual por XPEAK'],
        ['disponible',       p.is_live ? 'sí' : 'no',             'Visible en directorio ahora mismo'],
        ['generos',          Array.isArray(p.genres) ? (p.genres as string[]).join('; ') : '', 'Separados por punto y coma'],
        ['instagram',        (p.instagram as string) ?? '',        ''],
        ['url_perfil',       `https://xpeak.site/p/${slug}`,       'URL pública permanente'],
        ['fecha_registro',   (p.created_at as string)?.slice(0, 10) ?? '', ''],
        ['exportado_el',     exportedAt,                           'ISO 8601 UTC'],
        ['base_legal',       'RGPD Art. 20',                       'Derecho a la portabilidad de los datos'],
      ]);

      // ── 2. bookings.csv ────────────────────────────────────────────────
      const bookings = (bookingsRes.data ?? []) as Record<string, unknown>[];
      const bookingsByMonth: Record<string, number> = {};
      let totalEarnings = 0;
      const citiesSet = new Set<string>();

      bookings.forEach(b => {
        const month = String(b.event_date ?? '').slice(0, 7);
        if (month) bookingsByMonth[month] = (bookingsByMonth[month] ?? 0) + 1;
        if (b.location) citiesSet.add(String(b.location).split('·')[1]?.trim() ?? String(b.location));
        if ((b.status === 'aceptado' || b.status === 'accepted') && hourlyRate > 0) {
          const hrs = Number(b.duration_hours ?? 3);
          totalEarnings += hourlyRate * hrs;
        }
      });

      const accepted  = bookings.filter(b => b.status === 'aceptado' || b.status === 'accepted');
      const rejected  = bookings.filter(b => b.status === 'rechazado' || b.status === 'rejected');
      const pending   = bookings.filter(b => b.status === 'pendiente' || b.status === 'pending');
      const acceptRate = bookings.length > 0 ? Math.round((accepted.length / bookings.length) * 100) : 0;

      const bookingsCsv = csv([
        ['id', 'fecha_evento', 'descripcion', 'ubicacion', 'estado', 'duracion_horas', 'ingreso_estimado_eur', 'solicitado_por', 'fecha_solicitud', 'notas'],
        ...bookings.map(b => {
          const hrs = Number(b.duration_hours ?? 3);
          const earning = (b.status === 'aceptado' || b.status === 'accepted') && hourlyRate > 0 ? (hourlyRate * hrs).toFixed(2) : '';
          return [
            b.id ?? '',
            String(b.event_date ?? '').slice(0, 10),
            b.description ?? '',
            b.location ?? '',
            b.status ?? '',
            hrs,
            earning,
            b.requested_by ?? '',
            String(b.created_at ?? '').slice(0, 10),
            b.notes ?? '',
          ];
        }),
      ]);

      // ── 3. favoritos.csv ───────────────────────────────────────────────
      const favs = (favRes.data ?? []) as Record<string, unknown>[];
      const convs = (convsRes.data ?? []) as Record<string, unknown>[];
      const allOtherIds = [...new Set([
        ...favs.map(f => f.target_user_id as string),
        ...convs.map(c => (c.participant_a === user.id ? c.participant_b : c.participant_a) as string),
      ].filter(Boolean))];

      const profilesMap: Record<string, Record<string, unknown>> = {};
      if (allOtherIds.length > 0) {
        const { data: others } = await supabase
          .from('profiles')
          .select('user_id, display_name, role, zone, is_verified, hourly_rate')
          .in('user_id', allOtherIds);
        (others ?? []).forEach((pr: Record<string, unknown>) => {
          profilesMap[pr.user_id as string] = pr;
        });
      }

      const favsCsv = csv([
        ['nombre', 'rol', 'zona', 'tarifa_hora_eur', 'verificado', 'url_perfil', 'user_id', 'guardado_el'],
        ...favs.map(f => {
          const tid = f.target_user_id as string ?? '';
          const pr = profilesMap[tid] ?? {};
          return [
            (pr.display_name as string) ?? '',
            (pr.role as string) ?? '',
            (pr.zone as string) ?? '',
            pr.hourly_rate ?? '',
            pr.is_verified ? 'sí' : 'no',
            tid ? `https://xpeak.site/p/${tid}` : '',
            tid,
            String(f.created_at ?? '').slice(0, 10),
          ];
        }),
      ]);

      // ── 4. conversaciones.csv ──────────────────────────────────────────
      const convsCsv = csv([
        ['conversation_id', 'nombre_contraparte', 'rol_contraparte', 'zona_contraparte', 'user_id_contraparte', 'inicio_conversacion'],
        ...convs.map(c => {
          const other = (c.participant_a === user.id ? c.participant_b : c.participant_a) as string ?? '';
          const pr = profilesMap[other] ?? {};
          return [
            c.id ?? '',
            (pr.display_name as string) ?? '',
            (pr.role as string) ?? '',
            (pr.zone as string) ?? '',
            other,
            String(c.created_at ?? '').slice(0, 10),
          ];
        }),
      ]);

      // ── 5. resumen_anual.csv ───────────────────────────────────────────
      const currentYear = new Date().getFullYear();
      const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const resumenRows: (string | number)[][] = [
        ['seccion', 'indicador', 'valor', 'unidad'],
        ['', '', '', ''],
        ['PERFIL', 'Nombre artístico',   displayName,                       ''],
        ['PERFIL', 'Rol',                (p.role as string) ?? '',           ''],
        ['PERFIL', 'Zona base',          (p.zone as string) ?? '',           ''],
        ['PERFIL', 'Plan activo',        (p.subscription_tier as string) ?? 'free', ''],
        ['PERFIL', 'Perfil verificado',  p.is_verified ? 'sí' : 'no',       ''],
        ['PERFIL', 'Miembro desde',      (p.created_at as string)?.slice(0, 10) ?? '', ''],
        ['', '', '', ''],
        ['ACTIVIDAD', 'Total bookings solicitados',  bookings.length,        'contratos'],
        ['ACTIVIDAD', 'Bookings aceptados',          accepted.length,        'contratos'],
        ['ACTIVIDAD', 'Bookings rechazados',         rejected.length,        'contratos'],
        ['ACTIVIDAD', 'Bookings pendientes',         pending.length,         'contratos'],
        ['ACTIVIDAD', 'Tasa de aceptación',          `${acceptRate}%`,       ''],
        ['ACTIVIDAD', 'Ciudades distintas',          citiesSet.size,         'ciudades'],
        ['ACTIVIDAD', 'Ingreso estimado total',      totalEarnings > 0 ? totalEarnings.toFixed(2) : 'n/d', 'EUR (orientativo)'],
        ['ACTIVIDAD', 'Tarifa base por hora',        hourlyRate > 0 ? hourlyRate : 'n/d', 'EUR/hora'],
        ['', '', '', ''],
        ['RED', 'Perfiles guardados (favoritos)',  favs.length,   'perfiles'],
        ['RED', 'Conversaciones activas',          convs.length,  'chats'],
        ['', '', '', ''],
        ['ACTIVIDAD MENSUAL', 'Mes', 'Bookings', ''],
        ...Array.from({ length: 12 }, (_, i) => {
          const key = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
          const prevKey = `${currentYear - 1}-${String(i + 1).padStart(2, '0')}`;
          return ['ACTIVIDAD MENSUAL', monthNames[i], (bookingsByMonth[key] ?? bookingsByMonth[prevKey] ?? 0), ''];
        }),
        ['', '', '', ''],
        ['META', 'Exportado el',   exportedAt,         'ISO 8601 UTC'],
        ['META', 'Base legal',     'RGPD Art. 20',     'Portabilidad de datos'],
        ['META', 'Plataforma',     'XPEAK',            'xpeak.site'],
        ['META', 'Nota fiscal',    'Este documento no constituye certificado fiscal oficial. Consulta con tu asesor/a.', ''],
      ];
      const resumenCsv = csv(resumenRows);

      // ── 6. README.txt ──────────────────────────────────────────────────
      const readme = `XPEAK — Exportación de datos personales
========================================
Exportado el: ${exportedAt}
Usuario: ${displayName} (${user.email})
Base legal: RGPD Art. 20 — Derecho a la portabilidad de los datos

ARCHIVOS INCLUIDOS
------------------
perfil.csv
  Todos tus datos de perfil: nombre, rol, zona, bio, tarifa, géneros,
  suscripción, estado de verificación y URL pública permanente.

bookings.csv
  Historial completo de Flash Bookings: fecha, descripción, ubicación,
  estado (aceptado/rechazado/pendiente), duración e ingreso estimado.

favoritos.csv
  Perfiles que has guardado: nombre, rol, zona, tarifa y URL de perfil
  de cada profesional guardado.

conversaciones.csv
  Registro de conversaciones: nombre y rol de la contraparte por cada
  chat iniciado en la plataforma.

resumen_anual.csv
  Resumen ejecutivo con KPIs de actividad, estadísticas de red,
  desglose mensual de bookings y nota fiscal orientativa.

NOTA LEGAL
----------
Este archivo fue generado automáticamente en respuesta a una solicitud
de portabilidad de datos conforme al Art. 20 del Reglamento General de
Protección de Datos (RGPD / GDPR). No constituye un certificado fiscal
oficial. Para el derecho al olvido (Art. 17), usa la opción "Eliminar
cuenta" en Ajustes > Zona de peligro.

Para cualquier duda: soporte@xpeak.site
`;

      // ── Generar ZIP ────────────────────────────────────────────────────
      const zip = new JSZip();
      zip.file('README.txt',            readme);
      zip.file('perfil.csv',            '\uFEFF' + perfilCsv);
      zip.file('bookings.csv',          '\uFEFF' + bookingsCsv);
      zip.file('favoritos.csv',         '\uFEFF' + favsCsv);
      zip.file('conversaciones.csv',    '\uFEFF' + convsCsv);
      zip.file('resumen_anual.csv',     '\uFEFF' + resumenCsv);

      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `XPEAK_datos_${slug}_${today}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('ZIP con 6 archivos descargado correctamente.');
    } catch {
      toast.error('Error al generar el ZIP. Inténtalo de nuevo.');
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
        supabase.from('flash_bookings').select('*').eq('created_by', user.id),
      ]);
      const p = profileRes.data as Record<string, unknown> | null ?? {};
      const bookings = ((bookingsRes.data ?? []) as Record<string, unknown>[])
        .filter(b => String(b.event_date ?? '').startsWith(String(reportYear)));
      const accepted = bookings.filter(b => b.status === 'aceptado' || b.status === 'accepted');
      const cities = [...new Set(bookings.map(b => b.location as string).filter(Boolean))];
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
  .hdr-right{text-align:right;font-size:11px;color:rgba(255,255,255,0.4)}
  .avail{font-size:10px;padding:4px 10px;border-radius:999px;background:rgba(212,175,55,0.1);color:#D4AF37;border:1px solid rgba(212,175,55,0.3);margin-top:6px;display:inline-block}
  .prof-card{display:flex;align-items:center;gap:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:32px}
  .avatar{width:64px;height:64px;border-radius:14px;background:linear-gradient(135deg,#D4AF37,#B8941E);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#000;flex-shrink:0}
  .prof-name{font-size:20px;font-weight:800;margin-bottom:4px}
  .prof-meta{font-size:12px;color:rgba(255,255,255,0.5)}
  .badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(212,175,55,0.12);color:#D4AF37;border:1px solid rgba(212,175,55,0.25);margin-top:6px}
  .kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
  .kpi{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;text-align:center}
  .kpi-val{font-size:24px;font-weight:900;color:#D4AF37}
  .kpi-lbl{font-size:10px;color:rgba(255,255,255,0.45);margin-top:4px}
  .sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(212,175,55,0.7);margin-bottom:14px}
  table{width:100%;border-collapse:collapse;margin-bottom:32px;font-size:12px}
  th{text-align:left;padding:8px 10px;color:rgba(255,255,255,0.35);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,0.06)}
  td{padding:10px;border-bottom:1px solid rgba(255,255,255,0.04)}
  .status{font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px}
  .st-ok{background:rgba(34,197,94,0.1);color:#22c55e;border:1px solid rgba(34,197,94,0.2)}
  .st-pend{background:rgba(212,175,55,0.1);color:#D4AF37;border:1px solid rgba(212,175,55,0.2)}
  .st-rej{background:rgba(255,95,86,0.1);color:#ff5f56;border:1px solid rgba(255,95,86,0.2)}
  .chart-wrap{margin-bottom:32px}
  .bar-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
  .bar-lbl{font-size:10px;color:rgba(255,255,255,0.4);width:28px;flex-shrink:0;text-align:right}
  .bar-track{flex:1;height:14px;background:rgba(255,255,255,0.04);border-radius:4px;overflow:hidden}
  .bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#D4AF37,#B8941E)}
  .bar-count{font-size:10px;color:rgba(255,255,255,0.5);width:16px;flex-shrink:0}
  .fiscal{background:rgba(212,175,55,0.04);border:1px solid rgba(212,175,55,0.12);border-radius:12px;padding:16px;margin-bottom:32px;font-size:11px;color:rgba(255,255,255,0.45);line-height:1.7}
  .fiscal strong{color:rgba(212,175,55,0.7)}
  .ftr{text-align:center;font-size:10px;color:rgba(255,255,255,0.2);padding-top:24px;border-top:1px solid rgba(255,255,255,0.05)}
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
      <span class="badge">${((p.subscription_tier as string) ?? 'free').toUpperCase()}</span>
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
      const stClass = b.status === 'aceptado' || b.status === 'accepted' ? 'st-ok' : b.status === 'pendiente' || b.status === 'pending' ? 'st-pend' : 'st-rej';
      const stLabel = b.status === 'aceptado' || b.status === 'accepted' ? 'Aceptado' : b.status === 'pendiente' || b.status === 'pending' ? 'Pendiente' : 'Rechazado';
      return `<tr><td>${String(b.event_date ?? '').slice(0,10)}</td><td>${String(b.description ?? '').slice(0,35)}</td><td>${String(b.location ?? '').slice(0,20)}</td><td><span class="status ${stClass}">${stLabel}</span></td></tr>`;
    }).join('')}
  </table>` : '<p style="font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:32px">Sin bookings registrados en ' + reportYear + '</p>'}

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

  <div class="ftr">XPEAK · xpeak.site · ${user.id} · Exportado el ${new Date().toISOString()}</div>
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
      const profileUrl = `https://xpeak.site/p/${slug}`;
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

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (deleteConfirmEmail.trim().toLowerCase() !== user.email?.toLowerCase()) {
      toast.error('El email no coincide con el de tu cuenta');
      return;
    }
    setDeleting(true);
    try {
      // 1. Anonymize profile (RGPD Art. 17 — borrado/anonimización de datos personales)
      await supabase.from('profiles').update({
        display_name: 'Usuario eliminado',
        bio: null,
        photo_url: null,
        phone: null,
        instagram: null,
        zone: null,
        specialty: null,
        genres: null,
        is_live: false,
        is_verified: false,
      } as any).eq('user_id', user.id);

      // 2. Borrar favoritos
      await supabase.from('favorites').delete().eq('user_id', user.id);

      // 3. Cerrar sesión
      await signOut();
      toast.success('Cuenta eliminada. Tus datos han sido anonimizados conforme al RGPD. El registro de autenticación se purgará en 30 días.');
    } catch {
      toast.error('Error al eliminar la cuenta. Contacta con soporte.');
      setDeleting(false);
    }
  };

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
        {/* Push permission master toggle */}
        <div className="rounded-xl p-4 mb-4 flex items-center justify-between gap-3"
          style={{ background: pushEnabled ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${pushEnabled ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {pushEnabled
              ? <Bell size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
              : <BellOff size={16} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />}
            <div className="min-w-0">
              <p className="text-sm font-bold">{pushEnabled ? 'Notificaciones push activas' : 'Notificaciones push desactivadas'}</p>
              <p className="text-xs text-muted-foreground leading-snug">
                {pushEnabled
                  ? 'Recibirás alertas aunque la app esté cerrada'
                  : Notification.permission === 'denied'
                    ? 'Bloqueadas en el navegador — cámbialas en Configuración del sitio'
                    : 'Actívalas para recibir alertas de mensajes y Flash Bookings'}
              </p>
            </div>
          </div>
          {Notification.permission !== 'denied' && (
            <button type="button"
              onClick={async () => {
                if (pushEnabled) {
                  await revokePushPermission();
                  setPushEnabled(false);
                  toast.success('Notificaciones push desactivadas.');
                } else {
                  const ok = await requestPushPermission();
                  if (ok) {
                    setPushEnabled(true);
                    await showLocalNotification('XPEAK', 'Las notificaciones push están activas.', '/dashboard');
                    toast.success('Notificaciones push activadas.');
                  } else {
                    toast.error('No se pudo activar. Permite las notificaciones en tu navegador.');
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
          )}
        </div>

        <ToggleRow label="Mensajes nuevos" desc="Alerta cuando recibes un mensaje directo" checked={notifMessages}
          onChange={() => { const v = !notifMessages; setNotifMessages(v); localStorage.setItem('xpeak_notif_messages', String(v)); }} />
        <ToggleRow label="Flash Booking" desc="Ofertas urgentes de empresarios" checked={notifFlash}
          onChange={() => { const v = !notifFlash; setNotifFlash(v); localStorage.setItem('xpeak_notif_flash', String(v)); }} />
        <ToggleRow label="Top Weekend" desc="Cuando tu perfil asciende al ranking" checked={notifTopWeekend}
          onChange={() => { const v = !notifTopWeekend; setNotifTopWeekend(v); localStorage.setItem('xpeak_notif_topweekend', String(v)); }} />
        <ToggleRow label="Novedades y promociones" desc="Ofertas, descuentos y actualizaciones de XPEAK" checked={notifMarketing}
          onChange={() => { const v = !notifMarketing; setNotifMarketing(v); localStorage.setItem('xpeak_notif_marketing', String(v)); }} />
        <ToggleRow label="SMS de verificación" desc="Solo para verificación de identidad" checked={notifSMS}
          onChange={() => { const v = !notifSMS; setNotifSMS(v); localStorage.setItem('xpeak_notif_sms', String(v)); }} />
      </Section>

      {/* ── Privacy ── */}
      <Section title="Privacidad" icon={<Shield size={15} />}>
        <ToggleRow label="Perfil público en el directorio" desc="Si está desactivado, solo eres visible para empresarios" checked={profilePublic} onChange={() => setProfilePublic(v => !v)} />
        <ToggleRow label="Mostrar tarifa en mi ficha" desc="Visible para todos los usuarios" checked={showRate} onChange={() => setShowRate(v => !v)} />
        <ToggleRow label="Disponible en Flash Booking" desc="Empresarios pueden enviarte solicitudes urgentes" checked={allowFlash} onChange={() => setAllowFlash(v => !v)} />
        <ToggleRow label="Mostrar estado en línea" desc="Indica si estás activo en la plataforma" checked={showOnline} onChange={() => setShowOnline(v => !v)} />
        <div className="pt-3 mt-1 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tus derechos RGPD</p>

          {/* JSON export */}
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5">
              <Download size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold">Exportar JSON (Art. 20)</p>
                <p className="text-[0.6rem] text-muted-foreground">Todos tus datos en un archivo JSON completo</p>
              </div>
            </div>
            <button onClick={handleExportData}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
              Descargar
            </button>
          </div>

          {/* CSV ZIP export */}
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5">
              <Archive size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold">CSV múltiple (ZIP)</p>
                <p className="text-[0.6rem] text-muted-foreground">perfil · bookings · favoritos · conversaciones</p>
              </div>
            </div>
            <button onClick={handleExportCSVZip}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
              Descargar
            </button>
          </div>

          {/* Informe Anual */}
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5">
              <FileText size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold">Informe Anual PDF</p>
                <p className="text-[0.6rem] text-muted-foreground">KPIs, bookings, actividad mensual · Disponible ene. 2027</p>
              </div>
            </div>
            <button onClick={handleExportInformeAnual}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
              Generar
            </button>
          </div>

          {/* QR de perfil */}
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5">
              <QrCode size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold">QR de Perfil</p>
                <p className="text-[0.6rem] text-muted-foreground">PNG 400×500px con tu URL pública · Gratis siempre</p>
              </div>
            </div>
            <button onClick={handleDownloadQR}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
              Descargar
            </button>
          </div>
        </div>
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
            Próximamente
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

            <div>
              <p className="text-xs text-muted-foreground mb-1.5">
                Escribe tu email <span className="font-bold" style={{ color: '#ff5f56' }}>{user?.email}</span> para confirmar:
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
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirmEmail.trim().toLowerCase() !== user?.email?.toLowerCase()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-80 disabled:opacity-30"
              style={{ background: 'rgba(255,95,86,0.1)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.25)' }}
            >
              <Trash2 size={14} />
              {deleting ? 'Eliminando...' : 'Eliminar cuenta definitivamente'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
