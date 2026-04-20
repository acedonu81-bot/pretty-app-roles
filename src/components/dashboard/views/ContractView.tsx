import { useState } from 'react';
import { FileText, Plus, AlertCircle, Scale, ShieldCheck, BookOpen, ChevronRight } from 'lucide-react';
import ContractModal from '@/components/dashboard/ContractModal';
import type { Profile } from '@/data/profiles';

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

const ContractView = () => {
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState<string>('dj');

  const professional: Profile = {
    ...DEMO_PROFESSIONAL,
    name: customName.trim() || 'Profesional',
    role: customRole as Profile['role'],
  };

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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all w-full sm:w-auto justify-center"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <Plus size={16} /> Nuevo Contrato
        </button>
      </div>

      {/* Quick-start panel */}
      <div className="glass-panel p-5 mb-6" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={14} style={{ color: '#D4AF37' }} />
          <h3 className="text-sm font-bold">Generar contrato rápido</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Nombre del profesional
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              placeholder="Ej: DJ Leinad"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Tipo de profesional
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <FileText size={14} /> Abrir generador de contrato
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Legal notice */}
      <div className="glass-panel p-4 mb-6 flex items-start gap-3"
        style={{ border: '1px solid rgba(255,188,0,0.2)', background: 'rgba(255,188,0,0.03)' }}>
        <AlertCircle size={14} style={{ color: '#ffbc00', flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <span style={{ color: '#ffbc00', fontWeight: 700 }}>Aviso legal:</span>{' '}
          Los contratos generados son modelos orientativos conforme a legislación española vigente.
          XPEAK no ejerce como despacho de abogados ni ofrece asesoramiento jurídico vinculante.
          Se recomienda la revisión por letrado colegiado antes de su firma, especialmente en contratos superiores a €3.000.
        </p>
      </div>

      {/* Legal framework cards */}
      <h3 className="text-sm font-bold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>MARCO LEGAL APLICABLE</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {LEGAL_CARDS.map(card => (
          <div key={card.title} className="glass-panel p-4"
            style={{ border: `1px solid ${card.color}20` }}>
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={14} style={{ color: card.color }} />
              <p className="text-xs font-bold" style={{ color: card.color }}>{card.title}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>

      {/* Coming soon features */}
      <div className="glass-panel p-5" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-bold mb-3">Próximamente en Contratos</h3>
        <div className="space-y-2">
          {[
            'Firma digital con certificado cualificado (eIDAS)',
            'Envío al profesional para contra-firma',
            'Historial de contratos firmados',
            'Plantillas por tipo de evento (festival, club, boda, corporativo)',
            'Generación automática desde Flash Booking confirmado',
          ].map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.3)' }} />
              <span className="text-xs text-muted-foreground">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <ContractModal professional={professional} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default ContractView;
