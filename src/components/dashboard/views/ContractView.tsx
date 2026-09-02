import { useState, useEffect, useCallback } from 'react';
import { FileText, AlertCircle, Scale, ShieldCheck, BookOpen, Download, Trash2, RefreshCw, ChevronRight } from 'lucide-react';
import ExcelJS from 'exceljs';
import ContractModal from '@/components/dashboard/ContractModal';
import type { Profile } from '@/data/profiles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const DEMO_PROFESSIONAL: Profile = {
  id: 0,
  userId: '',
  name: 'Profesional XPEAK',
  role: 'dj',
  specialty: 'Tech House / Melodic Techno',
  rating: 0,
  reviews: 0,
  location: 'España',
  zone: '',
  experience: '',
  price: 500,
  priceUnit: '/hora',
  avatar: 'X',
  gradient: 'linear-gradient(135deg,#D4AF37,#B8941E)',
  badges: [],
  description: '',
  phone: '',
  instagram: '',
  topWeekend: false,
  photo: '',
  subscriptionTier: 'free',
  isFlashActive: false,
  profileViews: 0,
  contactClicks: 0,
  isLive: false,
  isPremium: false,
  languages: [],
  tiktok: '',
  category: 'professional',
  isVerified: false,
};

const LEGAL_CARDS = [
  {
    icon: Scale,
    color: '#4285F4',
    title: 'Naturaleza mercantil',
    body: 'Los profesionales de la plataforma son autónomos (RETA). El contrato es de prestación de servicios entre empresas/particulares, nunca laboral (art. 1.1 ET). XPEAK no es empleador.',
  },
  {
    icon: ShieldCheck,
    color: '#34D399',
    title: 'IVA + IRPF autónomo',
    body: 'Toda factura lleva IVA 21%. El contratante aplica retención IRPF: 7% (primeros 2 años alta) o 15% (general). El profesional declara ingresos en RENTA trimestral (mod. 130) y anual.',
  },
  {
    icon: BookOpen,
    color: '#8A6D0F',
    title: 'Propiedad intelectual',
    body: 'La comunicación pública de música en el evento requiere licencia SGAE/AIE/AGEDI (a cargo del local). El DJ retiene derechos sobre sus propias grabaciones (LPI, RDL 1/1996).',
  },
  {
    icon: ShieldCheck,
    color: '#A78BFA',
    title: 'RGPD / LOPDGDD',
    body: 'Datos de las partes tratados conforme al RGPD 2016/679 y LO 3/2018. XPEAK actúa como encargada del tratamiento. Los contratos generados son documentos privados entre las partes.',
  },
];

interface ContractRow {
  id: string;
  ref: string;
  professional_name: string | null;
  professional_role: string | null;
  event_type: string | null;
  event_name: string | null;
  event_date: string | null;
  venue: string | null;
  city: string | null;
  contratante_nombre: string | null;
  empresa_nombre: string | null;
  precio_neto: number | null;
  created_at: string;
}

const ROLE_LABEL: Record<string, string> = {
  dj: 'DJ / Artista', rookie: 'DJ Promesa', staff: 'Staff / RRPP',
  event_manager: 'Encargada de Eventos',
  bailarin: 'Instructor / Bailarín',
  makeup: 'Maquillaje', peluqueria: 'Peluquería a Domicilio', media: 'Foto / Vídeo',
  mago: 'Mago / Ilusionista', humorista: 'Humorista', animador: 'Animador / Payaso',
  catering: 'Catering / Chef', vestuario: 'Vestuario / Estilismo',
  promotor: 'Promotor / RRPP', ambassador: 'Promotor / Embajador',
  speaker: 'Speaker / Presentador', design: 'Diseño & Visuales',
  monologo: 'Monologuista', empresario: 'Empresa / Sala',
  azafata: 'Azafata', 'grupo-musical': 'Grupo musical', 'photo-booth': 'Photo Booth',
  fotografo: 'Fotógrafo', 'wedding-planner': 'Wedding Planner',
  'diseno-grafico': 'Diseño gráfico', promotores: 'Promotor / RRPP',
  maquillaje: 'Maquillaje',
};

// Orden alineado con DashboardSidebar.tsx — evita que el selector quede
// desactualizado cuando se añaden roles nuevos al sistema.
// Faltaban azafata, grupo musical, photo-booth y wedding planner: quien
// contratara uno de esos tenía que elegir "Staff / RRPP", y esa etiqueta
// equivocada acababa impresa en el PDF del contrato.
const CONTRACT_ROLE_OPTIONS = [
  'dj', 'grupo-musical', 'staff', 'azafata', 'event_manager', 'bailarin',
  'makeup', 'peluqueria', 'media', 'fotografo', 'photo-booth',
  'mago', 'humorista', 'monologo', 'animador', 'catering', 'vestuario',
  'promotor', 'speaker', 'wedding-planner', 'design', 'diseno-grafico',
];

const fmtDate = (iso: string) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return iso; }
};

const fmtEur = (n: number | null) => n != null ? `€${n.toFixed(2).replace('.', ',')}` : '—';

interface ProSearchResult {
  user_id: string;
  display_name: string | null;
  role: string | null;
  photo_url: string | null;
  zone: string | null;
  specialty: string | null;
  hourly_rate: number | null;
  phone: string | null;
  instagram: string | null;
}

const ContractView = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState<string>('dj');
  // Profesional REAL de XPEAK seleccionado en el buscador. Sin esto, el
  // contrato se generaba con userId vacío y ContractModal se saltaba los tres
  // efectos que dependen de él: alta en el calendario del profesional, aviso
  // "Nuevo trabajo" y email contract_generated. Es decir: se generaba el
  // contrato y el profesional no se enteraba nunca.
  const [selectedPro, setSelectedPro] = useState<ProSearchResult | null>(null);
  const [proQuery, setProQuery] = useState('');
  const [proResults, setProResults] = useState<ProSearchResult[]>([]);
  const [searchingPros, setSearchingPros] = useState(false);
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  // Arranca en true: con `false` se pintaba "Sin contratos aún" en el primer
  // render, antes de que llegara la respuesta (parpadeo de historial vacío).
  const [loading, setLoading] = useState(true);
  const [csvYear, setCsvYear] = useState(new Date().getFullYear());

  const searchPros = useCallback(async (q: string) => {
    setProQuery(q);
    setSelectedPro(null);
    if (q.trim().length < 2) { setProResults([]); return; }
    setSearchingPros(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, role, photo_url, zone, specialty, hourly_rate, phone, instagram')
      .ilike('display_name', `%${q.trim()}%`)
      .neq('role', 'empresario')
      .not('display_name', 'is', null)
      .limit(8);
    setSearchingPros(false);
    if (error) { console.error('[ContractView] search failed:', error.message); return; }
    setProResults((data ?? []) as ProSearchResult[]);
  }, []);

  const professional: Profile = selectedPro
    ? {
        ...DEMO_PROFESSIONAL,
        userId: selectedPro.user_id,
        name: selectedPro.display_name || 'Profesional',
        role: (selectedPro.role as Profile['role']) || 'dj',
        specialty: selectedPro.specialty ?? '',
        zone: selectedPro.zone ?? '',
        location: selectedPro.zone ?? 'España',
        price: selectedPro.hourly_rate ?? 0,
        phone: selectedPro.phone ?? '',
        instagram: selectedPro.instagram ?? '',
        photo: selectedPro.photo_url ?? '',
      }
    : {
        ...DEMO_PROFESSIONAL,
        name: customName.trim() || 'Profesional',
        role: customRole as Profile['role'],
      };

  const fetchContracts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    // Sin comprobar `error`, un fallo de red o RLS mostraba "Sin contratos aún"
    // y el usuario podía creer que había perdido su historial.
    if (error) {
      console.error('[ContractView] fetch failed:', error.message);
      toast.error('No se pudieron cargar tus contratos. Inténtalo de nuevo.');
      setLoading(false);
      return;
    }
    setContracts((data as ContractRow[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const handleSaved = () => { fetchContracts(); setShowModal(false); };

  const deleteContract = async (id: string, ref: string) => {
    if (!user) return;
    if (!window.confirm(`¿Eliminar el contrato ${ref}? Esta acción no se puede deshacer.`)) return;
    await supabase.from('contracts').delete().eq('id', id).eq('user_id', user.id);
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const exportXlsx = async () => {
    const rows = contracts.filter(c => {
      const y = c.event_date ? new Date(c.event_date).getFullYear() : new Date(c.created_at).getFullYear();
      return y === csvYear;
    });
    if (!rows.length) return;

    const GOLD = 'FFD4AF37';
    const DARK = 'FF0A0908';

    const wb = new ExcelJS.Workbook();
    wb.creator = 'XPEAK';
    wb.created = new Date();
    const ws = wb.addWorksheet(`Contratos ${csvYear}`, {
      views: [{ state: 'frozen', ySplit: 3 }],
      pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    });

    // ── Título de marca ──
    ws.mergeCells('A1:N1');
    const titleCell = ws.getCell('A1');
    titleCell.value = `XPEAK — Resumen de contratos ${csvYear}`;
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    ws.getRow(1).height = 28;

    ws.mergeCells('A2:N2');
    const subtitleCell = ws.getCell('A2');
    subtitleCell.value = `Generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} · ${rows.length} contrato${rows.length !== 1 ? 's' : ''} · xpeak.es`;
    subtitleCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: GOLD } };
    subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    ws.getRow(2).height = 16;

    // ── Cabecera de columnas ──
    const headers = ['Ref', 'Fecha evento', 'Profesional', 'Rol', 'Tipo evento', 'Evento', 'Local', 'Ciudad', 'Contratante', 'Empresa', 'Base imponible', 'IVA 21%', 'Total con IVA', 'Generado'];
    const headerRow = ws.getRow(3);
    headerRow.values = headers;
    headerRow.eachCell(cell => {
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1A1208' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GOLD } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFB8941E' } } };
    });
    headerRow.height = 20;

    // ── Filas de datos ──
    rows.forEach((c, i) => {
      const row = ws.addRow([
        c.ref,
        c.event_date ? new Date(c.event_date) : null,
        c.professional_name ?? '—',
        ROLE_LABEL[c.professional_role ?? ''] ?? c.professional_role ?? '—',
        c.event_type ?? '—',
        c.event_name ?? '—',
        c.venue ?? '—',
        c.city ?? '—',
        c.contratante_nombre ?? '—',
        c.empresa_nombre ?? '—',
        c.precio_neto ?? null,
        c.precio_neto != null ? c.precio_neto * 0.21 : null,
        c.precio_neto != null ? c.precio_neto * 1.21 : null,
        new Date(c.created_at),
      ]);
      row.eachCell(cell => { cell.font = { name: 'Calibri', size: 10 }; cell.alignment = { vertical: 'middle' }; });
      row.getCell(2).numFmt = 'dd/mm/yyyy';
      row.getCell(11).numFmt = '€ #,##0.00';
      row.getCell(12).numFmt = '€ #,##0.00';
      row.getCell(13).numFmt = '€ #,##0.00';
      row.getCell(13).font = { name: 'Calibri', size: 10, bold: true };
      row.getCell(14).numFmt = 'dd/mm/yyyy';
      if (i % 2 === 1) row.eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F5EF' } }; });
    });

    // ── Fila de totales ──
    const totalBase = rows.reduce((s, c) => s + (c.precio_neto ?? 0), 0);
    const totalRow = ws.addRow(['', '', '', '', '', '', '', '', '', 'TOTAL', totalBase, totalBase * 0.21, totalBase * 1.21, '']);
    totalRow.eachCell(cell => { cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1A1208' } }; cell.border = { top: { style: 'medium', color: { argb: GOLD } } }; });
    totalRow.getCell(10).alignment = { horizontal: 'right' };
    totalRow.getCell(11).numFmt = '€ #,##0.00';
    totalRow.getCell(12).numFmt = '€ #,##0.00';
    totalRow.getCell(13).numFmt = '€ #,##0.00';

    // ── Anchos de columna ──
    const widths = [14, 12, 20, 18, 14, 22, 18, 14, 20, 18, 14, 12, 14, 12];
    ws.columns.forEach((col, i) => { col.width = widths[i]; });

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `contratos_xpeak_${csvYear}.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadPdf = async (c: ContractRow) => {
    const safe = (v: string | null | undefined) =>
      String(v ?? '—').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const iva = c.precio_neto != null ? (c.precio_neto * 0.21).toFixed(2) : '—';
    const total = c.precio_neto != null ? (c.precio_neto * 1.21).toFixed(2) : '—';
    const s = 'padding:6px 8px;';
    const sh = s + 'font-weight:bold;width:38%;color:#444;';
    const row = (label: string, val: string, valStyle = s) =>
      `<tr><td style="${sh}">${label}</td><td style="${valStyle}">${val}</td></tr>`;

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;top:0;width:720px;background:#fff;';
    const inner = document.createElement('div');
    inner.style.cssText = 'font-family:Georgia,serif;padding:40px;color:#111;line-height:1.7;font-size:13px;background:#fff;';
    const tStyle = 'width:100%;border-collapse:collapse;margin-top:8px;';
    const h2Style = 'font-size:13px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:4px;margin-top:28px;color:#333;';
    inner.innerHTML = [
      `<h1 style="font-size:20px;text-align:center;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Contrato de Prestación de Servicios</h1>`,
      `<p style="text-align:center;color:#555;font-size:11px;margin-bottom:32px;">Plataforma XPEAK · xpeak.es</p>`,
      `<div style="text-align:center;margin-bottom:24px;"><span style="font-family:monospace;background:#f5f5f0;border:1px solid #ddd;display:inline-block;padding:4px 12px;border-radius:4px;font-size:12px;">REF: ${safe(c.ref)}</span></div>`,
      `<h2 style="${h2Style}">Partes</h2>`,
      `<table style="${tStyle}">${row('Contratante',safe(c.contratante_nombre))}${row('Empresa / Sala',safe(c.empresa_nombre))}${row('Profesional',safe(c.professional_name))}${row('Rol',safe(ROLE_LABEL[c.professional_role ?? ''] ?? c.professional_role))}</table>`,
      `<h2 style="${h2Style}">Evento</h2>`,
      `<table style="${tStyle}">${row('Nombre del evento',safe(c.event_name))}${row('Tipo',safe(c.event_type))}${row('Fecha',safe(c.event_date ? fmtDate(c.event_date) : '—'))}${row('Local / Venue',safe(c.venue))}${row('Ciudad',safe(c.city))}</table>`,
      `<h2 style="${h2Style}">Precio y Facturación</h2>`,
      `<table style="${tStyle}">${row('Base imponible',fmtEur(c.precio_neto),s+'font-size:14px;font-weight:bold;')}${row('IVA 21 %',safe(c.precio_neto != null ? '€'+iva : '—'))}${row('Total con IVA',safe(c.precio_neto != null ? '€'+total : '—'),s+'font-size:14px;font-weight:bold;')}</table>`,
      `<h2 style="${h2Style}">Cláusulas</h2>`,
      `<p style="margin:6px 0;">1. El profesional se compromete a prestar los servicios descritos en la fecha y lugar indicados.</p>`,
      `<p style="margin:6px 0;">2. El contratante abonará el importe acordado antes o en el momento de la prestación del servicio, salvo pacto expreso en contrario.</p>`,
      `<p style="margin:6px 0;">3. La relación entre las partes es de carácter mercantil (autónomo RETA). No existe vínculo laboral (art. 1.1 ET).</p>`,
      `<p style="margin:6px 0;">4. El profesional es responsable de sus obligaciones fiscales (IVA mod. 303, IRPF mod. 130).</p>`,
      `<p style="margin:6px 0;">5. En caso de cancelación con menos de 48h de antelación, el contratante abonará el 50% del importe pactado.</p>`,
      `<p style="margin:6px 0;">6. Los datos de ambas partes se tratan conforme al RGPD 2016/679 y LO 3/2018 (LOPDGDD).</p>`,
      `<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:56px;">`,
      `<div style="border-top:1px solid #333;padding-top:8px;font-size:11px;color:#555;"><p>Firma del Contratante</p><br/><br/><p>${safe(c.contratante_nombre)}</p></div>`,
      `<div style="border-top:1px solid #333;padding-top:8px;font-size:11px;color:#555;"><p>Firma del Profesional</p><br/><br/><p>${safe(c.professional_name)}</p></div>`,
      `</div>`,
      `<p style="margin-top:48px;font-size:11px;color:#888;border-top:1px solid #ddd;padding-top:12px;text-align:center;">Generado el ${safe(fmtDate(c.created_at))} · XPEAK — xpeak.es · Documento orientativo, no vinculante sin firma</p>`,
    ].join('');
    container.appendChild(inner);
    document.body.appendChild(container);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import('html2pdf.js')).default as any;
      await html2pdf().set({
        margin: 0,
        filename: `XPEAK_contrato_${c.ref}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(inner).save();
    } finally {
      document.body.removeChild(container);
    }
  };

  const availableYears = Array.from(
    new Set(contracts.map(c => {
      const d = c.event_date ?? c.created_at;
      return d ? new Date(d).getFullYear() : new Date().getFullYear();
    }))
  ).sort((a, b) => b - a);

  useEffect(() => {
    if (availableYears.length && !availableYears.includes(csvYear)) setCsvYear(availableYears[0]);
  }, [availableYears, csvYear]);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          <span className="text-gradient">Contratos</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Genera contratos de prestación de servicios conformes a la legislación española.
        </p>
      </div>

      {/* Quick-start panel */}
      <div className="glass-panel p-6 mb-6" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-2 mb-5">
          <FileText size={16} style={{ color: '#8A6D0F' }} />
          <h3 className="text-base font-bold">Generar contrato rápido</h3>
        </div>
        {/* Buscador de profesionales de XPEAK. Es el camino principal: solo
            así el contrato queda vinculado a un usuario real y el profesional
            recibe el aviso y el alta en su calendario. */}
        <div className="mb-4">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Buscar profesional en XPEAK
          </label>
          {selectedPro ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {selectedPro.photo_url
                  ? <img src={selectedPro.photo_url} alt={selectedPro.display_name ?? 'Profesional'} className="w-full h-full object-cover" />
                  : (selectedPro.display_name || 'P').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate" style={{ color: '#222' }}>{selectedPro.display_name}</p>
                <p className="text-xs truncate" style={{ color: '#333' }}>
                  {ROLE_LABEL[selectedPro.role ?? ''] ?? selectedPro.role}
                  {selectedPro.zone ? ` · ${selectedPro.zone}` : ''}
                </p>
              </div>
              <button onClick={() => { setSelectedPro(null); setProQuery(''); setProResults([]); }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#333' }}>
                Cambiar
              </button>
            </div>
          ) : (
            <>
              <input
                className="w-full px-4 py-3 rounded-lg text-base outline-none"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#222' }}
                placeholder="Escribe un nombre — ej: DJ Leinad"
                value={proQuery}
                onChange={e => searchPros(e.target.value)}
              />
              {searchingPros && <p className="text-xs text-muted-foreground mt-2">Buscando…</p>}
              {!searchingPros && proResults.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 max-h-56 overflow-y-auto">
                  {proResults.map(p => (
                    <button key={p.user_id} onClick={() => { setSelectedPro(p); setProResults([]); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all hover:scale-[1.01]"
                      style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 overflow-hidden"
                        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                        {p.photo_url
                          ? <img src={p.photo_url} alt={p.display_name ?? 'Profesional'} className="w-full h-full object-cover" />
                          : (p.display_name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#222' }}>{p.display_name}</p>
                        <p className="text-xs truncate" style={{ color: '#333' }}>
                          {ROLE_LABEL[p.role ?? ''] ?? p.role}{p.zone ? ` · ${p.zone}` : ''}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {!searchingPros && proQuery.trim().length >= 2 && proResults.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Sin resultados en XPEAK. Puedes rellenarlo a mano abajo (el profesional no recibirá aviso automático).
                </p>
              )}
            </>
          )}
        </div>

        {/* Alta manual: para contratar a alguien que no está en XPEAK. Se deja
            claro que en ese caso no hay aviso automático. */}
        {!selectedPro && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 pt-4"
            style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div>
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                O nombre manual
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg text-base outline-none"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#222' }}
                placeholder="Ej: DJ Leinad"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Tipo de profesional
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg text-base outline-none"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#222', cursor: 'pointer' }}
                value={customRole}
                onChange={e => setCustomRole(e.target.value)}>
                {CONTRACT_ROLE_OPTIONS.map(id => (
                  <option key={id} value={id} style={{ background: '#0a0a0e' }}>{ROLE_LABEL[id]}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <FileText size={16} /> Abrir generador de contrato
          <ChevronRight size={16} />
        </button>
        <p className="text-xs mt-3" style={{ color: selectedPro ? '#15803d' : '#333' }}>
          {selectedPro
            ? `✓ ${selectedPro.display_name} recibirá el aviso del contrato y se le añadirá el evento a su calendario.`
            : 'Sin seleccionar un profesional de XPEAK, el contrato se genera igual pero nadie recibe aviso automático.'}
        </p>
      </div>

      {/* ── Contract history ── */}
      <div className="glass-panel mb-6" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-4"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={15} style={{ color: '#8A6D0F' }} />
            <h3 className="text-base font-bold">Historial de contratos</h3>
            {contracts.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.25)' }}>
                {contracts.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {contracts.length > 0 && (
              <>
                <select
                  value={csvYear}
                  onChange={e => setCsvYear(Number(e.target.value))}
                  className="text-xs px-2 py-1.5 rounded-lg outline-none"
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#222', cursor: 'pointer' }}>
                  {availableYears.map(y => (
                    <option key={y} value={y} style={{ background: '#0a0a0e' }}>{y}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={exportXlsx}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                  <Download size={12} /> Excel {csvYear}
                </button>
              </>
            )}
            <button type="button" onClick={fetchContracts}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5">
              <RefreshCw size={13} style={{ color: '#333', ...(loading ? { animation: 'spin 1s linear infinite' } : {}) }} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-10 text-center text-sm text-muted-foreground">Cargando...</div>
        )}

        {!loading && contracts.length === 0 && (
          <div className="py-12 text-center">
            <FileText size={32} className="mx-auto mb-3" style={{ color: 'rgba(0,0,0,0.08)' }} />
            <p className="text-sm font-bold mb-1" style={{ color: '#333' }}>Sin contratos aún</p>
            <p className="text-xs text-muted-foreground">Los contratos que generes aparecerán aquí</p>
          </div>
        )}

        {/* Móvil: tarjetas. La tabla de 8 columnas obligaba a hacer scroll
            horizontal a ciegas hasta la última columna para descargar el PDF. */}
        {!loading && contracts.length > 0 && (
          <div className="sm:hidden flex flex-col gap-2 p-3">
            {contracts.map(c => (
              <div key={c.id} className="rounded-xl p-3"
                style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{c.professional_name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {ROLE_LABEL[c.professional_role ?? ''] ?? c.professional_role ?? ''}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold flex-shrink-0" style={{ color: '#8A6D0F' }}>{c.ref}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                  {c.event_name && <span className="truncate max-w-full">{c.event_name}</span>}
                  {c.event_date && <span>{fmtDate(c.event_date)}</span>}
                  {c.venue && <span className="truncate max-w-full">{c.venue}</span>}
                </div>
                <div className="flex items-center justify-between gap-2 pt-2"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <span className="text-sm font-bold" style={{ color: c.precio_neto ? '#8A6D0F' : '#333' }}>
                    {fmtEur(c.precio_neto)}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button type="button" onClick={() => downloadPdf(c)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#8A6D0F' }}>
                      <Download size={12} /> PDF
                    </button>
                    <button type="button" onClick={() => deleteContract(c.id, c.ref)}
                      title="Eliminar contrato"
                      className="p-1.5 rounded-lg"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <Trash2 size={12} style={{ color: 'rgba(239,68,68,0.7)' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && contracts.length > 0 && (
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  {['Ref', 'Profesional', 'Evento', 'Fecha evento', 'Local', 'Base imponible', 'Generado', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: '#333' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contracts.map((c, i) => (
                  <tr key={c.id}
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-bold" style={{ color: '#8A6D0F' }}>{c.ref}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{c.professional_name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{ROLE_LABEL[c.professional_role ?? ''] ?? c.professional_role ?? ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{c.event_name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground capitalize">{c.event_type ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {c.event_date ? fmtDate(c.event_date) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{c.venue ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{c.city ?? ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold" style={{ color: c.precio_neto ? '#D4AF37' : '#333' }}>
                        {fmtEur(c.precio_neto)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {fmtDate(c.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button type="button"
                          onClick={() => downloadPdf(c)}
                          title="Descargar PDF"
                          className="p-1.5 rounded-lg transition-colors hover:bg-white/5">
                          <Download size={13} style={{ color: 'rgba(212,175,55,0.6)' }} />
                        </button>
                        <button type="button"
                          onClick={() => deleteContract(c.id, c.ref)}
                          title="Eliminar contrato"
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10">
                          <Trash2 size={13} style={{ color: 'rgba(239,68,68,0.5)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legal notice */}
      <div className="glass-panel p-5 mb-6 flex items-start gap-3"
        style={{ border: '1px solid rgba(255,188,0,0.2)', background: 'rgba(255,188,0,0.03)' }}>
        <AlertCircle size={16} style={{ color: '#ffbc00', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm leading-relaxed" style={{ color: '#222' }}>
          <span style={{ color: '#ffbc00', fontWeight: 700 }}>Aviso legal:</span>{' '}
          Los contratos generados son modelos orientativos conforme a legislación española vigente.
          XPEAK no ejerce como despacho de abogados ni ofrece asesoramiento jurídico vinculante.
          Se recomienda la revisión por letrado colegiado antes de su firma, especialmente en contratos superiores a €3.000.
        </p>
      </div>

      {/* Legal framework cards */}
      <h3 className="text-sm font-bold mb-4" style={{ color: '#333' }}>MARCO LEGAL APLICABLE</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {LEGAL_CARDS.map(card => (
          <div key={card.title} className="glass-panel p-5"
            style={{ border: `1px solid ${card.color}20` }}>
            <div className="flex items-center gap-2 mb-3">
              <card.icon size={16} style={{ color: card.color }} />
              <p className="text-sm font-bold" style={{ color: card.color }}>{card.title}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>


      {showModal && (
        <ContractModal professional={professional} onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
};

export default ContractView;
