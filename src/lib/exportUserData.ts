import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import { buildCsv, fmtDateISO } from '@/lib/csvExport';

export const exportUserDataZip = async (user: User) => {
  if (!user) return;
  toast.info('Recopilando datos…');
  try {
    const [profileRes, favRes, bookingsRes, convsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('favorites').select('*').eq('user_id', user.id),
      // Un booking pertenece al usuario tanto si lo creó (empresario) como si es
      // el profesional contratado — filtrar solo por created_by dejaba vacío
      // este export para cualquier profesional (el caso de uso principal).
      supabase.from('flash_bookings').select('*').or(`created_by.eq.${user.id},professional_user_id.eq.${user.id}`),
      supabase.from('conversations').select('*').or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`),
    ]);

    const p = profileRes.data as Record<string, unknown> | null ?? {};
    const isEmpresarioAccount = p.role === 'empresario';
    const today = new Date().toISOString().slice(0, 10);
    const displayName = (p.display_name as string) ?? '';
    const slug = (p.slug as string) || displayName.toLowerCase().replace(/\s+/g, '-') || user.id.slice(0, 8);

    // ── 1. perfil.csv ──────────────────────────────────────────────────
    const perfilCsv = buildCsv('Datos de Perfil', [
      {
        header: ['Campo', 'Valor'],
        rows: [
          ['user_id', user.id],
          ['Email', user.email ?? ''],
          ['Nombre', displayName],
          ['Rol', (p.role as string) ?? ''],
          ['Zona', (p.zone as string) ?? ''],
          ['Bio', ((p.bio as string) ?? '').replace(/\n/g, ' ')],
          ['Tarifa €/hora', isEmpresarioAccount ? 'n/a' : String(p.hourly_rate ?? '')],
          ['Suscripción', (p.subscription_tier as string) ?? 'free'],
          ['Verificado', p.is_verified ? 'sí' : 'no'],
          ['Visible ahora', p.is_live ? 'sí' : 'no'],
          ['Géneros', Array.isArray(p.genres) ? (p.genres as string[]).join('; ') : ''],
          ['Instagram', (p.instagram as string) ?? ''],
          ['URL perfil público', `https://xpeak.es/p/${slug}`],
          ['Fecha de registro', fmtDateISO(p.created_at as string)],
        ],
      },
    ]);

    // ── 2. bookings.csv ────────────────────────────────────────────────
    const bookings = (bookingsRes.data ?? []) as Record<string, unknown>[];
    const bookingsByMonth: Record<string, number> = {};
    let totalEarnings = 0;
    const citiesSet = new Set<string>();

    bookings.forEach(b => {
      const month = String(b.event_date ?? '').slice(0, 7);
      if (month) bookingsByMonth[month] = (bookingsByMonth[month] ?? 0) + 1;
      if (b.event_location) citiesSet.add(String(b.event_location));
      if ((b.status === 'confirmed' || b.status === 'completed') && b.agreed_price != null) {
        totalEarnings += Number(b.agreed_price);
      }
    });

    const completed = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const cancelled = bookings.filter(b => b.status === 'cancelled');
    const pending   = bookings.filter(b => b.status === 'pending');
    const acceptRate = bookings.length > 0 ? Math.round((completed.length / bookings.length) * 100) : 0;

    const bookingsCsv = buildCsv('Flash Bookings', [
      {
        header: ['Contraparte', 'Rol', 'Fecha evento', 'Ubicación', 'Descripción', 'Importe (€)', 'Estado', 'Fecha solicitud'],
        rows: bookings.map(b => [
          (b.created_by === user.id ? b.professional_name : displayName) as string ?? '',
          (b.professional_role as string) ?? '',
          fmtDateISO(b.event_date as string),
          (b.event_location as string) ?? '',
          (b.event_description as string) ?? '',
          b.agreed_price != null ? Number(b.agreed_price).toFixed(2) : '',
          (b.status as string) ?? '',
          fmtDateISO(b.created_at as string),
        ]),
      },
    ]);

    // ── 3. favoritos.csv ───────────────────────────────────────────────
    const favs = (favRes.data ?? []) as Record<string, unknown>[];
    const convs = (convsRes.data ?? []) as Record<string, unknown>[];
    const allOtherIds = [...new Set([
      ...favs.map(f => f.profile_id as string),
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

    const favsCsv = buildCsv('Favoritos', [
      {
        header: ['Nombre', 'Rol', 'Zona', 'Tarifa €/hora', 'Verificado', 'URL perfil', 'Guardado el'],
        rows: favs.map(f => {
          const tid = f.profile_id as string ?? '';
          const pr = profilesMap[tid] ?? {};
          return [
            (pr.display_name as string) ?? '',
            (pr.role as string) ?? '',
            (pr.zone as string) ?? '',
            pr.hourly_rate != null ? String(pr.hourly_rate) : '',
            pr.is_verified ? 'sí' : 'no',
            tid ? `https://xpeak.es/p/${tid}` : '',
            fmtDateISO(f.created_at as string),
          ];
        }),
      },
    ]);

    // ── 4. conversaciones.csv ──────────────────────────────────────────
    const convsCsv = buildCsv('Conversaciones', [
      {
        header: ['Contraparte', 'Rol', 'Zona', 'Iniciada el'],
        rows: convs.map(c => {
          const other = (c.participant_a === user.id ? c.participant_b : c.participant_a) as string ?? '';
          const pr = profilesMap[other] ?? {};
          return [
            (pr.display_name as string) ?? '',
            (pr.role as string) ?? '',
            (pr.zone as string) ?? '',
            fmtDateISO(c.created_at as string),
          ];
        }),
      },
    ]);

    // ── 5. resumen_anual.csv ───────────────────────────────────────────
    const currentYear = new Date().getFullYear();
    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const resumenCsv = buildCsv('Resumen Anual', [
      {
        title: 'PERFIL',
        header: ['Indicador', 'Valor'],
        rows: [
          ['Nombre', displayName],
          ['Rol', (p.role as string) ?? ''],
          ['Zona', (p.zone as string) ?? ''],
          ['Plan activo', (p.subscription_tier as string) ?? 'free'],
          ['Perfil verificado', p.is_verified ? 'sí' : 'no'],
          ['Miembro desde', fmtDateISO(p.created_at as string)],
        ],
      },
      {
        title: 'ACTIVIDAD',
        header: ['Indicador', 'Valor'],
        rows: [
          ['Total bookings', bookings.length],
          ['Completados', completed.length],
          ['Cancelados', cancelled.length],
          ['Pendientes', pending.length],
          ['Tasa de éxito', `${acceptRate}%`],
          ['Ciudades distintas', citiesSet.size],
          ['Importe total (€)', totalEarnings > 0 ? totalEarnings.toFixed(2) : 'n/d'],
        ],
      },
      {
        title: 'RED',
        header: ['Indicador', 'Valor'],
        rows: [
          ['Perfiles guardados', favs.length],
          ['Conversaciones', convs.length],
        ],
      },
      {
        title: 'ACTIVIDAD MENSUAL',
        header: ['Mes', 'Bookings'],
        rows: Array.from({ length: 12 }, (_, i) => {
          const key = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
          const prevKey = `${currentYear - 1}-${String(i + 1).padStart(2, '0')}`;
          return [monthNames[i], bookingsByMonth[key] ?? bookingsByMonth[prevKey] ?? 0];
        }),
      },
    ]);

    // ── 6. README.txt ──────────────────────────────────────────────────
    const readme = `XPEAK — Exportación de datos personales
========================================
Exportado el: ${new Date().toISOString()}
Usuario: ${displayName} (${user.email})
Base legal: RGPD Art. 20 — Derecho a la portabilidad de los datos

ARCHIVOS INCLUIDOS
------------------
perfil.csv         — Todos tus datos de perfil
bookings.csv       — Historial completo de Flash Bookings, tanto los que
                      has creado como empresario como aquellos en los que
                      te contrataron como profesional
favoritos.csv      — Perfiles que has guardado
conversaciones.csv — Registro de conversaciones
resumen_anual.csv  — KPIs de actividad y resumen ejecutivo

NOTA LEGAL
----------
Este archivo fue generado automáticamente conforme al Art. 20 del RGPD.
Para el derecho al olvido (Art. 17): Ajustes > Zona de peligro > Eliminar cuenta.
Soporte: soporte@xpeak.es
`;

    const zip = new JSZip();
    zip.file('README.txt',            readme);
    zip.file('perfil.csv',            '﻿' + perfilCsv);
    zip.file('bookings.csv',          '﻿' + bookingsCsv);
    zip.file('favoritos.csv',         '﻿' + favsCsv);
    zip.file('conversaciones.csv',    '﻿' + convsCsv);
    zip.file('resumen_anual.csv',     '﻿' + resumenCsv);

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
