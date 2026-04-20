import { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, AlertCircle, Scale, ShieldCheck, BookOpen, ChevronRight, Download, Trash2, RefreshCw } from 'lucide-react';
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
  retencion: number | null;
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
  const [soonOpen, setSoonOpen] = useState(false);
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
    await supabase.from('contracts').delete().eq('id', id);
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const exportCsv = () => {
    const rows = contracts.filter(c => {
      const y = c.event_date ? new Date(c.event_date).getFullYear() : new Date(c.created_at).getFullYear();
      return y === csvYear;
    });
    if (!rows.length) return;
    const headers = ['Ref', 'Fecha evento', 'Profesional', 'Rol', 'Tipo evento', 'Evento', 'Local', 'Ciudad', 'Contratante', 'Empresa', 'Base imponible (€)', 'Retención IRPF (%)', 'Generado'];
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
        c.retencion ?? '',
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
                      <button type="button"
                        onClick={() => deleteContract(c.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10">
                        <Trash2 size={13} style={{ color: 'rgba(239,68,68,0.5)' }} />
                      </button>
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

      {/* Coming soon features */}
      <div className="glass-panel" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <button type="button" onClick={() => setSoonOpen(o => !o)}
          className="w-full flex items-center justify-between p-5 text-left"
          style={{ background: 'transparent' }}>
          <h3 className="text-base font-bold">Próximamente en Contratos</h3>
          <ChevronRight size={16} className="transition-transform" style={{ transform: soonOpen ? 'rotate(90deg)' : 'rotate(0deg)', color: '#8E8EA0' }} />
        </button>
        {soonOpen && (
          <div className="px-5 pb-5 space-y-3">
            {[
              'Firma digital con certificado cualificado (eIDAS)',
              'Envío al profesional para contra-firma',
              'Generación automática desde Flash Booking confirmado',
            ].map(f => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.3)' }} />
                <span className="text-sm text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ContractModal professional={professional} onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
};

export default ContractView;
