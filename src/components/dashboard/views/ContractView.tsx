import { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, AlertCircle, Scale, ShieldCheck, BookOpen, Download, Trash2, RefreshCw, ChevronRight } from 'lucide-react';
import ContractModal from '@/components/dashboard/ContractModal';
import type { Profile } from '@/data/profiles';
import { supabase } from '@/integrations/supabase/client';
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
    color: '#D4AF37',
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
  dj: 'DJ / Artista', rookie: 'DJ Promesa', staff: 'Staff',
  makeup: 'Maquillaje', media: 'Foto / Vídeo', ambassador: 'Promotor',
};

const fmtDate = (iso: string) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return iso; }
};

const fmtEur = (n: number | null) => n != null ? `€${n.toFixed(2).replace('.', ',')}` : '—';

const escCsv = (v: unknown) => {
  const s = String(v ?? '');
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
};

const ContractView = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState<string>('dj');
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [csvYear, setCsvYear] = useState(new Date().getFullYear());

  const professional: Profile = {
    ...DEMO_PROFESSIONAL,
    name: customName.trim() || 'Profesional',
    role: customRole as Profile['role'],
  };

  const fetchContracts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setContracts((data as ContractRow[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const handleSaved = () => { fetchContracts(); setShowModal(false); };

  const deleteContract = async (id: string) => {
    if (!user) return;
    await supabase.from('contracts').delete().eq('id', id).eq('user_id', user.id);
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const exportCsv = () => {
    const rows = contracts.filter(c => {
      const y = c.event_date ? new Date(c.event_date).getFullYear() : new Date(c.created_at).getFullYear();
      return y === csvYear;
    });
    if (!rows.length) return;
    const headers = ['Ref', 'Fecha evento', 'Profesional', 'Rol', 'Tipo evento', 'Evento', 'Local', 'Ciudad', 'Contratante', 'Empresa', 'Base imponible (€)', 'IVA 21% (€)', 'Total con IVA (€)', 'Generado'];
    const lines = [
      headers.join(','),
      ...rows.map(c => [
        c.ref,
        c.event_date ?? '',
        c.professional_name ?? '',
        ROLE_LABEL[c.professional_role ?? ''] ?? c.professional_role ?? '',
        c.event_type ?? '',
        c.event_name ?? '',
        c.venue ?? '',
        c.city ?? '',
        c.contratante_nombre ?? '',
        c.empresa_nombre ?? '',
        c.precio_neto ?? '',
        c.precio_neto != null ? (c.precio_neto * 0.21).toFixed(2) : '',
        c.precio_neto != null ? (c.precio_neto * 1.21).toFixed(2) : '',
        c.created_at ? new Date(c.created_at).toLocaleDateString('es-ES') : '',
      ].map(escCsv).join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `contratos_xpeak_${csvYear}.csv`;
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

  if (availableYears.length && !availableYears.includes(csvYear)) setCsvYear(availableYears[0]);

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            <span className="text-gradient">Contratos</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Genera contratos de prestación de servicios conformes a la legislación española.
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base hover:scale-105 transition-all w-full sm:w-auto justify-center"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <Plus size={18} /> Nuevo Contrato
        </button>
      </div>

      {/* Quick-start panel */}
      <div className="glass-panel p-6 mb-6" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-2 mb-5">
          <FileText size={16} style={{ color: '#D4AF37' }} />
          <h3 className="text-base font-bold">Generar contrato rápido</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Nombre del profesional
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg text-base outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
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
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
              value={customRole}
              onChange={e => setCustomRole(e.target.value)}>
              <option value="dj" style={{ background: '#0a0a0e' }}>DJ / Artista</option>
              <option value="rookie" style={{ background: '#0a0a0e' }}>DJ Promesa</option>
              <option value="staff" style={{ background: '#0a0a0e' }}>Staff / RRPP</option>
              <option value="makeup" style={{ background: '#0a0a0e' }}>Maquillaje / Peluquería</option>
              <option value="media" style={{ background: '#0a0a0e' }}>Foto / Vídeo</option>
              <option value="ambassador" style={{ background: '#0a0a0e' }}>Promotor / Embajador</option>
            </select>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <FileText size={16} /> Abrir generador de contrato
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Contract history ── */}
      <div className="glass-panel mb-6" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <FileText size={15} style={{ color: '#D4AF37' }} />
            <h3 className="text-base font-bold">Historial de contratos</h3>
            {contracts.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
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
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}>
                  {availableYears.map(y => (
                    <option key={y} value={y} style={{ background: '#0a0a0e' }}>{y}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={exportCsv}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                  <Download size={12} /> CSV {csvYear}
                </button>
              </>
            )}
            <button type="button" onClick={fetchContracts}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5">
              <RefreshCw size={13} style={{ color: 'rgba(255,255,255,0.3)', ...(loading ? { animation: 'spin 1s linear infinite' } : {}) }} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-10 text-center text-sm text-muted-foreground">Cargando...</div>
        )}

        {!loading && contracts.length === 0 && (
          <div className="py-12 text-center">
            <FileText size={32} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
            <p className="text-sm font-bold mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Sin contratos aún</p>
            <p className="text-xs text-muted-foreground">Los contratos que generes aparecerán aquí</p>
          </div>
        )}

        {!loading && contracts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Ref', 'Profesional', 'Evento', 'Fecha evento', 'Local', 'Base imponible', 'Generado', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contracts.map((c, i) => (
                  <tr key={c.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-bold" style={{ color: '#D4AF37' }}>{c.ref}</span>
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
                      <span className="text-sm font-bold" style={{ color: c.precio_neto ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}>
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
                          onClick={() => deleteContract(c.id)}
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
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <span style={{ color: '#ffbc00', fontWeight: 700 }}>Aviso legal:</span>{' '}
          Los contratos generados son modelos orientativos conforme a legislación española vigente.
          XPEAK no ejerce como despacho de abogados ni ofrece asesoramiento jurídico vinculante.
          Se recomienda la revisión por letrado colegiado antes de su firma, especialmente en contratos superiores a €3.000.
        </p>
      </div>

      {/* Legal framework cards */}
      <h3 className="text-sm font-bold mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>MARCO LEGAL APLICABLE</h3>
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
