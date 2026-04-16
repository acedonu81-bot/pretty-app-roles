import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

export const exportUserDataZip = async (user: User) => {
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
    const pending   = bookings.filter(b => b.status === 'pendiente'  || b.status === 'pending');
    const acceptRate = bookings.length > 0 ? Math.round((accepted.length / bookings.length) * 100) : 0;

    const bookingsCsv = csv([
      ['id', 'fecha_evento', 'descripcion', 'ubicacion', 'estado', 'duracion_horas', 'ingreso_estimado_eur', 'solicitado_por', 'fecha_solicitud', 'notas'],
      ...bookings.map(b => {
        const hrs = Number(b.duration_hours ?? 3);
        const earning = (b.status === 'aceptado' || b.status === 'accepted') && hourlyRate > 0 ? (hourlyRate * hrs).toFixed(2) : '';
        return [b.id ?? '', String(b.event_date ?? '').slice(0, 10), b.description ?? '', b.location ?? '',
          b.status ?? '', hrs, earning, b.requested_by ?? '', String(b.created_at ?? '').slice(0, 10), b.notes ?? ''];
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
        return [(pr.display_name as string) ?? '', (pr.role as string) ?? '', (pr.zone as string) ?? '',
          pr.hourly_rate ?? '', pr.is_verified ? 'sí' : 'no',
          tid ? `https://xpeak.site/p/${tid}` : '', tid, String(f.created_at ?? '').slice(0, 10)];
      }),
    ]);

    // ── 4. conversaciones.csv ──────────────────────────────────────────
    const convsCsv = csv([
      ['conversation_id', 'nombre_contraparte', 'rol_contraparte', 'zona_contraparte', 'user_id_contraparte', 'inicio_conversacion'],
      ...convs.map(c => {
        const other = (c.participant_a === user.id ? c.participant_b : c.participant_a) as string ?? '';
        const pr = profilesMap[other] ?? {};
        return [c.id ?? '', (pr.display_name as string) ?? '', (pr.role as string) ?? '',
          (pr.zone as string) ?? '', other, String(c.created_at ?? '').slice(0, 10)];
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
perfil.csv         — Todos tus datos de perfil
bookings.csv       — Historial completo de Flash Bookings
favoritos.csv      — Perfiles que has guardado
conversaciones.csv — Registro de conversaciones
resumen_anual.csv  — KPIs de actividad y resumen ejecutivo

NOTA LEGAL
----------
Este archivo fue generado automáticamente conforme al Art. 20 del RGPD.
No constituye un certificado fiscal oficial.
Para el derecho al olvido (Art. 17): Ajustes > Zona de peligro > Eliminar cuenta.
Soporte: soporte@xpeak.site
`;

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
    toast.success('ZIP con 6 archivos descargado.');
  } catch {
    toast.error('Error al generar el ZIP. Inténtalo de nuevo.');
  }
};
