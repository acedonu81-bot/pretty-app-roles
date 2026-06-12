import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Download, FileText, Euro, Calendar, User, RefreshCw, ScrollText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Booking {
  id: string;
  professional_name: string;
  professional_role: string | null;
  event_date: string | null;
  event_location: string | null;
  event_description: string | null;
  agreed_price: number | null;
  status: string | null;
  created_at: string | null;
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pendiente',  color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
  confirmed: { label: 'Confirmado', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  completed: { label: 'Completado', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  cancelled: { label: 'Cancelado',  color: '#ff5f56', bg: 'rgba(255,95,86,0.08)' },
};

const fmt = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const HistorialTab = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('flash_bookings')
      .select('id, professional_name, professional_role, event_date, event_location, event_description, agreed_price, status, created_at')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setLoading(false);
    if (error) { toast.error('Error al cargar el historial'); return; }
    setBookings(data ?? []);
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  /* ─── Export CSV ─── */
  const exportCSV = () => {
    if (bookings.length === 0) { toast.error('No hay contrataciones que exportar'); return; }
    const rows = [
      ['Profesional', 'Rol', 'Fecha Evento', 'Ubicación', 'Descripción', 'Caché (€)', 'Estado', 'Fecha Solicitud'],
      ...bookings.map(b => [
        b.professional_name,
        b.professional_role ?? '—',
        fmt(b.event_date),
        b.event_location ?? '—',
        b.event_description ?? '—',
        b.agreed_price != null ? b.agreed_price.toFixed(2) : '—',
        STATUS_LABEL[b.status ?? '']?.label ?? b.status ?? '—',
        fmt(b.created_at),
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XPEAK_historial_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${bookings.length} contrataciones exportadas`);
  };

  /* ─── Export PDF (in-browser) ─── */
  const exportPDF = () => {
    if (bookings.length === 0) { toast.error('No hay contrataciones que exportar'); return; }
    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const completed = bookings.filter(b => b.status === 'completed').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending   = bookings.filter(b => b.status === 'pending').length;

    const totalPDF = bookings.filter(b => b.agreed_price != null).reduce((s, b) => s + (b.agreed_price ?? 0), 0);
    const rows = bookings.map(b => {
      const s = STATUS_LABEL[b.status ?? ''] ?? { label: b.status ?? '—', color: '#8E8EA0', bg: '#222' };
      return `
        <tr>
          <td>${b.professional_name}</td>
          <td>${b.professional_role ?? '—'}</td>
          <td>${fmt(b.event_date)}</td>
          <td>${b.event_location ?? '—'}</td>
          <td>${b.agreed_price != null ? `<strong>€${b.agreed_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong>` : '—'}</td>
          <td><span style="color:${s.color};font-weight:700">${s.label}</span></td>
          <td>${fmt(b.created_at)}</td>
        </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>XPEAK — Historial de Contrataciones</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#111; padding:40px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; border-bottom:3px solid #D4AF37; padding-bottom:20px; }
  .logo { font-size:28px; font-weight:900; letter-spacing:2px; }
  .logo span { color:#D4AF37; }
  .meta { text-align:right; font-size:11px; color:#666; }
  .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
  .stat { background:#f8f8f8; border-left:4px solid #D4AF37; padding:14px 18px; border-radius:6px; }
  .stat-val { font-size:28px; font-weight:900; color:#D4AF37; }
  .stat-lbl { font-size:11px; color:#666; margin-top:2px; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  thead th { background:#111; color:#fff; padding:10px 12px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; }
  tbody tr:nth-child(even) { background:#f9f9f9; }
  tbody td { padding:10px 12px; border-bottom:1px solid #eee; vertical-align:top; }
  .footer { margin-top:32px; text-align:center; font-size:10px; color:#aaa; border-top:1px solid #eee; padding-top:16px; }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">X<span>PEAK</span></div>
    <div style="font-size:13px;color:#555;margin-top:4px;">Historial de Contrataciones</div>
  </div>
  <div class="meta">
    <div>Generado: ${today}</div>
    <div style="margin-top:4px;">Total registros: ${bookings.length}</div>
  </div>
</div>
<div class="stats">
  <div class="stat"><div class="stat-val">${bookings.length}</div><div class="stat-lbl">Total solicitudes</div></div>
  <div class="stat"><div class="stat-val" style="color:#22c55e">${completed}</div><div class="stat-lbl">Completadas</div></div>
  <div class="stat"><div class="stat-val" style="color:#3b82f6">${confirmed}</div><div class="stat-lbl">Confirmadas</div></div>
  <div class="stat"><div class="stat-val" style="color:#f59e0b">${pending}</div><div class="stat-lbl">Pendientes</div></div>
  ${totalPDF > 0 ? `<div class="stat"><div class="stat-val" style="color:#D4AF37">€${totalPDF.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div><div class="stat-lbl">Gasto total</div></div>` : ''}
</div>
<table>
  <thead>
    <tr>
      <th>Profesional</th><th>Rol</th><th>Fecha Evento</th><th>Ubicación</th><th>Caché (€)</th><th>Estado</th><th>Solicitud</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">XPEAK · Plataforma Profesional de Eventos · xpeak.es</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => { win.print(); };
      toast.success('Abre el diálogo de impresión y selecciona "Guardar como PDF"');
    } else {
      // Fallback: direct download of HTML
      const a = document.createElement('a');
      a.href = url;
      a.download = `XPEAK_historial_${new Date().toISOString().slice(0, 10)}.html`;
      a.click();
      toast.success('Historial descargado. Ábrelo en el navegador e imprime como PDF.');
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  /* ─── Contrato tipo ─── */
  const generarContrato = () => {
    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>XPEAK — Contrato de Prestación de Servicios</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Georgia', serif; background:#fff; color:#111; padding:50px 60px; font-size:12px; line-height:1.7; }
  .header { text-align:center; margin-bottom:36px; border-bottom:2px solid #D4AF37; padding-bottom:20px; }
  .logo { font-size:22px; font-weight:900; letter-spacing:3px; font-family:'Arial',sans-serif; }
  .logo span { color:#D4AF37; }
  .title { font-size:16px; font-weight:bold; margin-top:8px; text-transform:uppercase; letter-spacing:1px; }
  .subtitle { font-size:11px; color:#555; margin-top:4px; }
  h2 { font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px; color:#D4AF37; border-bottom:1px solid #eee; padding-bottom:6px; margin:24px 0 12px; }
  .field-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:8px; }
  .field { border-bottom:1px solid #ccc; min-height:24px; padding:2px 0; }
  .field-label { font-size:9px; color:#888; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px; }
  .clause { margin-bottom:14px; }
  .clause p { text-align:justify; }
  .clause strong { color:#111; }
  .signatures { display:grid; grid-template-columns:1fr 1fr; gap:60px; margin-top:50px; }
  .sig-block { border-top:1px solid #333; padding-top:8px; }
  .sig-label { font-size:9px; color:#888; text-transform:uppercase; letter-spacing:0.5px; }
  .sig-line { height:60px; border-bottom:1px dashed #ccc; margin:16px 0 8px; }
  .footer { margin-top:40px; text-align:center; font-size:9px; color:#aaa; border-top:1px solid #eee; padding-top:12px; }
  @media print { body { padding:30px 40px; } }
</style>
</head>
<body>
<div class="header">
  <div class="logo">X<span>PEAK</span></div>
  <div class="title">Contrato de Prestación de Servicios Profesionales</div>
  <div class="subtitle">Generado a través de la plataforma XPEAK · ${today}</div>
</div>

<h2>1. Partes Contratantes</h2>
<div class="field-row">
  <div>
    <div class="field-label">Empresario / Contratante (nombre o razón social)</div>
    <div class="field"></div>
  </div>
  <div>
    <div class="field-label">NIF / CIF</div>
    <div class="field"></div>
  </div>
</div>
<div class="field-row">
  <div>
    <div class="field-label">Domicilio</div>
    <div class="field"></div>
  </div>
  <div>
    <div class="field-label">Email de contacto</div>
    <div class="field"></div>
  </div>
</div>
<div class="field-row">
  <div>
    <div class="field-label">Profesional contratado (nombre artístico/profesional)</div>
    <div class="field"></div>
  </div>
  <div>
    <div class="field-label">NIF / NIE del profesional</div>
    <div class="field"></div>
  </div>
</div>
<div class="field-row">
  <div>
    <div class="field-label">Especialidad / Rol</div>
    <div class="field"></div>
  </div>
  <div>
    <div class="field-label">Teléfono / Email del profesional</div>
    <div class="field"></div>
  </div>
</div>

<h2>2. Objeto del Contrato</h2>
<div class="field-row">
  <div>
    <div class="field-label">Descripción del servicio</div>
    <div class="field" style="min-height:40px"></div>
  </div>
  <div>
    <div class="field-label">Nombre del evento / establecimiento</div>
    <div class="field"></div>
  </div>
</div>

<h2>3. Fecha, Lugar y Duración</h2>
<div class="field-row">
  <div>
    <div class="field-label">Fecha del evento</div>
    <div class="field"></div>
  </div>
  <div>
    <div class="field-label">Horario (inicio — fin)</div>
    <div class="field"></div>
  </div>
</div>
<div class="field-row">
  <div>
    <div class="field-label">Lugar de prestación del servicio (dirección completa)</div>
    <div class="field"></div>
  </div>
  <div>
    <div class="field-label">Aforo estimado</div>
    <div class="field"></div>
  </div>
</div>

<h2>4. Remuneración y Forma de Pago</h2>
<div class="field-row">
  <div>
    <div class="field-label">Importe acordado (€, IVA incluido)</div>
    <div class="field"></div>
  </div>
  <div>
    <div class="field-label">Forma de pago (efectivo / transferencia / otro)</div>
    <div class="field"></div>
  </div>
</div>
<div class="field-row">
  <div>
    <div class="field-label">Anticipo (% o importe fijo, si aplica)</div>
    <div class="field"></div>
  </div>
  <div>
    <div class="field-label">Fecha límite de pago del saldo restante</div>
    <div class="field"></div>
  </div>
</div>

<h2>5. Cláusulas</h2>
<div class="clause">
  <p><strong>5.1 Naturaleza del servicio.</strong> El profesional presta sus servicios como trabajador autónomo independiente o mediante su propia estructura empresarial. No existe relación laboral entre las partes. El profesional es responsable de sus obligaciones fiscales (emisión de factura, IVA, IRPF) y de Seguridad Social.</p>
</div>
<div class="clause">
  <p><strong>5.2 Intermediación XPEAK.</strong> El presente contrato ha sido facilitado a través de la plataforma XPEAK, que actúa exclusivamente como intermediario tecnológico. XPEAK no es parte de este contrato y no asume responsabilidad alguna por el cumplimiento de las obligaciones aquí recogidas.</p>
</div>
<div class="clause">
  <p><strong>5.3 Cancelación por el contratante.</strong> En caso de cancelación por parte del contratante con menos de <span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> días de antelación, éste abonará al profesional el <span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;</span>% del importe total acordado en concepto de penalización.</p>
</div>
<div class="clause">
  <p><strong>5.4 Cancelación por el profesional.</strong> En caso de cancelación por parte del profesional con menos de <span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> días de antelación, éste deberá devolver el anticipo percibido y abonar el <span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;</span>% del importe acordado en concepto de penalización.</p>
</div>
<div class="clause">
  <p><strong>5.5 Derechos de imagen y grabación.</strong> Salvo pacto expreso en contrario, el empresario podrá fotografiar o grabar el evento para uso en redes sociales y comunicación corporativa. El profesional autoriza el uso de su imagen en dicho contexto. Los derechos de retransmisión o explotación comercial requerirán acuerdo escrito adicional.</p>
</div>
<div class="clause">
  <p><strong>5.6 Propiedad intelectual musical.</strong> El profesional declara contar con las licencias o autorizaciones necesarias para la ejecución o reproducción pública de las obras musicales incluidas en su actuación, eximiendo al contratante de cualquier responsabilidad frente a entidades de gestión (SGAE, AIE, AGEDI u otras).</p>
</div>
<div class="clause">
  <p><strong>5.7 Condiciones técnicas.</strong> El contratante se compromete a proporcionar el equipo técnico necesario para la prestación del servicio según los requisitos técnicos del profesional (rider técnico), salvo que se haya pactado que el profesional aporta su propio equipo.</p>
</div>
<div class="clause">
  <p><strong>5.8 Legislación aplicable.</strong> El presente contrato se rige por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales del domicilio del contratante.</p>
</div>

<h2>6. Condiciones adicionales pactadas</h2>
<div class="field" style="min-height:60px; border:1px solid #ddd; border-radius:4px; padding:8px;"></div>

<div class="signatures">
  <div class="sig-block">
    <div class="sig-label">Firma del Empresario / Contratante</div>
    <div class="sig-line"></div>
    <div>Nombre: ________________________________</div>
    <div style="margin-top:4px">Fecha: ________________________________</div>
  </div>
  <div class="sig-block">
    <div class="sig-label">Firma del Profesional</div>
    <div class="sig-line"></div>
    <div>Nombre: ________________________________</div>
    <div style="margin-top:4px">Fecha: ________________________________</div>
  </div>
</div>

<div class="footer">
  XPEAK · Plataforma Profesional de Eventos · xpeak.es · legal@xpeak.es<br>
  Este documento es un modelo orientativo. Se recomienda consultar con un asesor legal para contratos de alto valor.
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => { win.print(); };
      toast.success('Contrato generado. Imprime como PDF para guardar o firmar.');
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = `XPEAK_contrato_tipo_${new Date().toISOString().slice(0, 10)}.html`;
      a.click();
      toast.success('Contrato descargado. Ábrelo en el navegador e imprime como PDF.');
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    setUpdating(id);
    const { error } = await supabase
      .from('flash_bookings' as any)
      .update({ status })
      .eq('id', id)
      .eq('created_by', user!.id);
    setUpdating(null);
    if (error) { toast.error('Error al actualizar'); return; }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(status === 'confirmed' ? '¡Solicitud confirmada!' : 'Solicitud rechazada');
  };

  /* ─── Stats ─── */
  const completed = bookings.filter(b => b.status === 'completed').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const totalGasto = bookings
    .filter(b => b.agreed_price != null)
    .reduce((sum, b) => sum + (b.agreed_price ?? 0), 0);
  const fmtEur = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      {/* Reputation card */}
      <div className="glass-panel p-5 relative overflow-hidden"
        style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.02)' }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
        <div className="flex items-center gap-4 relative">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
            <CheckCircle size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#D4AF37' }}>Reputación como Empleador</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black" style={{ color: '#D4AF37' }}>—</span>
              <span className="text-xs text-muted-foreground">/ 5.0 · {bookings.length} solicitudes</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Los profesionales te calificarán como empleador tras cada contratación completada.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-muted-foreground">Completadas</p>
            <p className="text-lg font-black" style={{ color: '#22c55e' }}>{completed}</p>
            <p className="text-[0.75rem] text-muted-foreground">de {bookings.length} totales</p>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          {[
            { label: 'Completadas', value: completed.toString() },
            { label: 'Confirmadas', value: confirmed.toString() },
            { label: 'Pendientes',  value: bookings.filter(b => b.status === 'pending').length.toString() },
            { label: 'Total',       value: bookings.length.toString() },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-base font-black" style={{ color: '#D4AF37' }}>{s.value}</p>
              <p className="text-[0.75rem] text-muted-foreground">{s.label}</p>
            </div>
          ))}
          <div className="text-center">
            <p className="text-base font-black" style={{ color: '#22c55e' }}>
              {totalGasto > 0 ? `€${fmtEur(totalGasto)}` : '—'}
            </p>
            <p className="text-[0.75rem] text-muted-foreground">Gasto total</p>
          </div>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={generarContrato}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
          <ScrollText size={13} /> Contrato tipo
        </button>
        {bookings.length > 0 && (
          <>
            <button onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <FileText size={13} /> Exportar PDF
            </button>
            <button onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              <Download size={13} /> Exportar CSV
            </button>
          </>
        )}
        <button onClick={fetchBookings}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)', color: '#8E8EA0' }}>
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Bookings list */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="text-xs text-muted-foreground animate-pulse">Cargando historial…</div>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="glass-panel p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <Clock size={22} style={{ color: 'rgba(212,175,55,0.5)' }} />
          </div>
          <p className="text-sm font-bold">Sin contrataciones aún</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Tu historial de contrataciones aparecerá aquí una vez que completes tu primer Flash Booking.
          </p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map(b => {
            const s = STATUS_LABEL[b.status ?? ''] ?? { label: b.status ?? '—', color: '#8E8EA0', bg: 'rgba(255,255,255,0.04)' };
            return (
              <div key={b.id} className="glass-panel p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <User size={16} style={{ color: '#D4AF37' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-bold truncate">{b.professional_name}</p>
                    {b.professional_role && (
                      <span className="text-[0.75rem] px-1.5 py-0.5 rounded font-bold uppercase"
                        style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                        {b.professional_role}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    {b.event_date && (
                      <span className="flex items-center gap-1"><Calendar size={10} /> {fmt(b.event_date)}</span>
                    )}
                    {b.event_location && (
                      <span className="truncate max-w-[160px]">{b.event_location}</span>
                    )}
                    {b.agreed_price != null && (
                      <span className="flex items-center gap-1 font-bold" style={{ color: '#22c55e' }}>
                        <Euro size={10} /> {fmtEur(b.agreed_price)}
                      </span>
                    )}
                  </div>
                  {b.event_description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{b.event_description}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                  <span className="text-[0.75rem] text-muted-foreground">{fmt(b.created_at)}</span>
                  {b.status === 'pending' && (
                    <div className="flex gap-1.5 mt-0.5">
                      <button
                        onClick={() => updateStatus(b.id, 'cancelled')}
                        disabled={updating === b.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#8E8EA0' }}>
                        <XCircle size={11} /> {updating === b.id ? '…' : 'Cancelar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-4 rounded-xl text-xs" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
        <p className="font-bold mb-1 flex items-center gap-1.5" style={{ color: '#D4AF37' }}>
          <Euro size={12} /> Tu reputación atrae mejor talento
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Los profesionales con puntuación 4.5+ en XPEAK priorizan empleadores con reputación alta.
          Valora a tus contratados y paga en el plazo acordado para subir tu score.
        </p>
      </div>
    </div>
  );
};

export default HistorialTab;
