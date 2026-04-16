import { X, Zap, Music, Users, Smile, Camera, Building2, Phone } from 'lucide-react';

interface Props {
  initialRole?: string;
  onClose: () => void;
}

const ROLES = [
  { value: 'dj',         label: 'DJ / Artista',    icon: Music,     color: '#D4AF37' },
  { value: 'staff',      label: 'Staff Técnico',    icon: Users,     color: '#60a5fa' },
  { value: 'makeup',     label: 'Makeup / Estilo',  icon: Smile,     color: '#c084fc' },
  { value: 'media',      label: 'Foto / Video',     icon: Camera,    color: '#34d399' },
  { value: 'ambassador', label: 'Ambassador / PR',  icon: Phone,     color: '#fb923c' },
  { value: 'empresario', label: 'Empresario',       icon: Building2, color: '#D4AF37' },
];

/* ── Shared micro-components ── */
const Panel = ({ children, gold, style }: { children: React.ReactNode; gold?: boolean; style?: React.CSSProperties }) => (
  <div style={{
    background: gold ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.025)',
    border: `1px solid ${gold ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: 12,
    padding: '12px 14px',
    marginBottom: 10,
    ...style,
  }}>{children}</div>
);

const Tag = ({ label, color = 'rgba(255,255,255,0.35)', bg = 'rgba(255,255,255,0.06)' }: { label: string; color?: string; bg?: string }) => (
  <span style={{
    display: 'inline-block',
    fontSize: 9,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 999,
    background: bg,
    color,
    border: `1px solid ${color}30`,
    marginRight: 4,
    marginBottom: 4,
  }}>{label}</span>
);

const KpiGrid = ({ items }: { items: { val: string; lbl: string }[] }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 8, marginBottom: 10 }}>
    {items.map(k => (
      <div key={k.lbl} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#D4AF37' }}>{k.val}</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{k.lbl}</div>
      </div>
    ))}
  </div>
);

const SbItem = ({ label, active, color = '#D4AF37' }: { label: string; active?: boolean; color?: string }) => (
  <div style={{
    padding: '6px 10px', borderRadius: 8, fontSize: 10,
    color: active ? color : 'rgba(255,255,255,0.3)',
    background: active ? `${color}18` : 'transparent',
    marginBottom: 2,
    display: 'flex', alignItems: 'center', gap: 6,
  }}>
    <span style={{ width: 5, height: 5, borderRadius: 999, background: active ? color : 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
    {label}
  </div>
);

const FlashCard = ({ urgent, title, sub, pay }: { urgent?: boolean; title: string; sub: string; pay: string }) => (
  <div style={{
    borderRadius: 10, padding: '10px 12px',
    background: urgent ? 'rgba(255,95,86,0.04)' : 'rgba(255,255,255,0.02)',
    border: `1px solid ${urgent ? 'rgba(255,95,86,0.2)' : 'rgba(255,255,255,0.07)'}`,
    marginBottom: 8,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
      <div>
        {urgent && <span style={{ fontSize: 8, fontWeight: 800, color: '#ff5f56', background: 'rgba(255,95,86,0.1)', border: '1px solid rgba(255,95,86,0.2)', borderRadius: 999, padding: '1px 6px', marginBottom: 4, display: 'inline-block' }}>URGENTE</span>}
        <div style={{ fontSize: 11, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#D4AF37', flexShrink: 0 }}>{pay}</div>
    </div>
  </div>
);

/* ── Role mock dashboards ── */
const MockDJ = () => (
  <>
    <Panel gold style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700 }}>Escenario en directo</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>127 espectadores · Tech House Set</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 24 }}>
        {[8,18,12,24,16,10,22].map((h, i) => (
          <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: '#D4AF37', opacity: 0.7 }} />
        ))}
      </div>
    </Panel>
    <KpiGrid items={[{ val: '147', lbl: 'Visitas' }, { val: '12', lbl: 'Bookings' }, { val: '8', lbl: 'Fans VIP' }, { val: '4.9', lbl: 'Rating' }]} />
    <Panel style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#D4AF37,#B8941E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', fontSize: 14, flexShrink: 0 }}>D</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700 }}>Dani-Tech · Madrid</div>
        <div style={{ marginTop: 4 }}>
          <Tag label="Tech House" color="#D4AF37" bg="rgba(212,175,55,0.1)" />
          <Tag label="Melodic Techno" />
          <Tag label="Deep House" />
        </div>
      </div>
    </Panel>
    <FlashCard urgent title="Club Mondo · Valentín Beato" sub="4h · Apertura + Main room" pay="€320" />
    <FlashCard title="Fabrik Madrid" sub="3h · Main room · Sáb 26" pay="€240" />
  </>
);

const MockStaff = () => (
  <>
    <Panel style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: '#22c55e', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700 }}>Disponible esta noche</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Visible en directorio · Madrid</div>
        </div>
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '3px 8px' }}>ACTIVO</div>
    </Panel>
    <KpiGrid items={[{ val: '34', lbl: 'Eventos' }, { val: '4.8', lbl: 'Rating' }, { val: '€22', lbl: '/hora' }]} />
    <Panel>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Certificaciones</div>
      {[
        { label: 'Técnico de sonido (ESAC)', ok: true },
        { label: 'Primeros auxilios (Cruz Roja)', ok: true },
        { label: 'Seguridad privada', ok: false },
      ].map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, background: c.ok ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${c.ok ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {c.ok && <span style={{ color: '#22c55e', fontSize: 9, fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontSize: 10, color: c.ok ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>{c.label}</span>
        </div>
      ))}
    </Panel>
    <FlashCard title="Sala Siroco · Técnico de sonido" sub="Montaje 20h + evento hasta 6h" pay="€180" />
  </>
);

const MockMakeup = () => (
  <>
    <Panel style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,rgba(192,84,252,0.4),rgba(139,92,246,0.2))', border: '1px solid rgba(192,84,252,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 14, flexShrink: 0 }}>S</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700 }}>Sara Gómez · Barcelona</div>
        <div style={{ marginTop: 4 }}>
          <Tag label="Body Paint" color="#c084fc" bg="rgba(192,132,252,0.1)" />
          <Tag label="Drag" />
          <Tag label="Editorial" />
        </div>
      </div>
    </Panel>
    <KpiGrid items={[{ val: '89', lbl: 'Sesiones' }, { val: '4.9', lbl: 'Rating' }, { val: '€85', lbl: '/sesión' }]} />
    <Panel>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Portfolio reciente</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5 }}>
        {[
          'rgba(212,175,55,0.15)',
          'rgba(96,165,250,0.12)',
          'rgba(168,85,247,0.12)',
          'rgba(34,197,94,0.1)',
        ].map((bg, i) => (
          <div key={i} style={{ aspectRatio: '1', borderRadius: 7, background: bg, border: '1px solid rgba(255,255,255,0.07)' }} />
        ))}
      </div>
    </Panel>
    <FlashCard title="Catalina Rave · Stage makeup" sub="Sáb 20 abr · 18:00h" pay="€120" />
  </>
);

const MockMedia = () => (
  <>
    <Panel style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#34d399', fontSize: 14, flexShrink: 0 }}>M</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700 }}>Miguel Frames · Valencia</div>
        <div style={{ marginTop: 4 }}>
          <Tag label="Fotografía" color="#60a5fa" bg="rgba(96,165,250,0.1)" />
          <Tag label="Video" />
          <Tag label="Drone" />
        </div>
      </div>
    </Panel>
    <KpiGrid items={[{ val: '156', lbl: 'Eventos' }, { val: '4.7K', lbl: 'Fotos' }, { val: '4.8', lbl: 'Rating' }, { val: '€200', lbl: '/evento' }]} />
    <Panel>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Últimos trabajos</div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 5 }}>
        <div style={{ aspectRatio: '16/9', borderRadius: 8, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 9, color: 'rgba(96,165,250,0.5)' }}>Fabrik · Abr 24</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ flex: 1, borderRadius: 7, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.1)' }} />
          <div style={{ flex: 1, borderRadius: 7, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.1)' }} />
        </div>
      </div>
    </Panel>
    <FlashCard urgent title="Teatro Barceló · Cobertura" sub="22h-3h · Fotos + redes" pay="€350" />
  </>
);

const MockAmbassador = () => (
  <>
    <Panel gold style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(212,175,55,0.6)', marginBottom: 4 }}>Comisiones · Abril 2026</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#D4AF37' }}>€347</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>generadas este mes</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#22c55e' }}>+23%</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>vs marzo</div>
      </div>
    </Panel>
    <KpiGrid items={[{ val: '84', lbl: 'Entradas' }, { val: '6', lbl: 'Eventos' }, { val: '€4.1', lbl: '/entrada' }, { val: '#3', lbl: 'Ranking' }]} />
    <Panel>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Eventos activos</div>
      {[
        { name: 'Club Mondo · Sáb 19', count: 12, code: 'DANI19', ok: true },
        { name: 'Fabrik · Sáb 26', count: 4, code: 'DANI26', ok: false },
      ].map(e => (
        <div key={e.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700 }}>{e.name}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{e.count} confirmados · Código: {e.code}</div>
          </div>
          <Tag label={e.ok ? 'Activo' : 'Pendiente'} color={e.ok ? '#22c55e' : '#D4AF37'} bg={e.ok ? 'rgba(34,197,94,0.1)' : 'rgba(212,175,55,0.1)'} />
        </div>
      ))}
    </Panel>
  </>
);

const MockEmpresario = () => (
  <>
    <Panel gold style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#D4AF37,#B8941E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', fontSize: 14, flexShrink: 0 }}>M</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700 }}>Mondo Club</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Madrid · Venue Premium · 2 salas</div>
      </div>
    </Panel>
    <KpiGrid items={[{ val: '8', lbl: 'Este mes' }, { val: '€1.2K', lbl: 'Contratado' }, { val: '4', lbl: 'Activos' }, { val: '12', lbl: 'Favoritos' }]} />
    <Panel>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Directorio · DJs disponibles</div>
      {[
        { name: 'Dani-Tech', role: 'Tech House · €80/h', rating: '4.9', ok: true },
        { name: 'Laura Synth', role: 'Melodic · €65/h', rating: '4.7', ok: true },
      ].map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#D4AF37,#B8941E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', fontSize: 11, flexShrink: 0 }}>{p.name[0]}</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{p.role}</div>
            </div>
          </div>
          <Tag label="Disponible" color="#22c55e" bg="rgba(34,197,94,0.1)" />
        </div>
      ))}
    </Panel>
    <div style={{ width: '100%', padding: '8px 0', borderRadius: 10, background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', fontSize: 11, fontWeight: 700, textAlign: 'center', cursor: 'default' }}>
      Lanzar Flash Booking urgente
    </div>
  </>
);

const MOCK_MAP: Record<string, React.ReactNode> = {
  dj:         <MockDJ />,
  staff:      <MockStaff />,
  makeup:     <MockMakeup />,
  media:      <MockMedia />,
  ambassador: <MockAmbassador />,
  empresario: <MockEmpresario />,
};

const SIDEBAR_MAP: Record<string, string[]> = {
  dj:         ['Mi Perfil', 'Escenario', 'Flash Booking', 'Fan Club', 'Mensajes', 'Stats'],
  staff:      ['Mi Perfil', 'Flash Booking', 'Mensajes', 'Calendario', 'Mapa'],
  makeup:     ['Mi Perfil', 'Flash Booking', 'Portfolio', 'Mensajes', 'Calendario'],
  media:      ['Mi Perfil', 'Flash Booking', 'Portfolio', 'Mensajes', 'Calendario'],
  ambassador: ['Mi Panel', 'Mi Lista', 'Comisiones', 'Eventos', 'Mensajes'],
  empresario: ['Panel', 'Directorio', 'Flash Booking', 'Contratos', 'Mapa', 'Mensajes'],
};

const FEATURES_MAP: Record<string, { label: string; highlight?: boolean }[]> = {
  dj:         [{ label: 'Perfil booking', highlight: true }, { label: 'Escenario Virtual live', highlight: true }, { label: 'Flash Booking urgente', highlight: true }, { label: 'Fan Club', highlight: true }, { label: 'Top Weekend' }, { label: 'Stats de perfil' }, { label: 'QR de perfil' }],
  staff:      [{ label: 'Perfil verificado', highlight: true }, { label: 'Flash Booking urgente', highlight: true }, { label: 'Certificaciones', highlight: true }, { label: 'Disponibilidad RT' }, { label: 'Historial de trabajo' }, { label: 'Mensajes directos' }],
  makeup:     [{ label: 'Portfolio visual', highlight: true }, { label: 'Bookings de artistas', highlight: true }, { label: 'Flash Booking', highlight: true }, { label: 'Especialidades' }, { label: 'Tarifa por sesión' }, { label: 'Calendario' }],
  media:      [{ label: 'Portfolio multimedia', highlight: true }, { label: 'Flash Booking', highlight: true }, { label: 'Grid de trabajos', highlight: true }, { label: 'Especialidades' }, { label: 'Calendario de rodajes' }, { label: 'Stats' }],
  ambassador: [{ label: 'Panel de comisiones', highlight: true }, { label: 'Gestión de lista', highlight: true }, { label: 'Códigos de invitación', highlight: true }, { label: 'Ranking de ventas' }, { label: 'Pago mensual directo' }, { label: 'Historial' }],
  empresario: [{ label: 'Directorio completo', highlight: true }, { label: 'Flash Booking', highlight: true }, { label: 'Contratos digitales', highlight: true }, { label: 'Mapa disponibilidad' }, { label: 'Valoraciones verificadas' }, { label: 'Multi-venue' }],
};

const RolePreviewModal = ({ initialRole = 'dj', onClose }: Props) => {
  const [activeRole, setActiveRole] = useState(initialRole);
  const roleData = ROLES.find(r => r.value === activeRole)!;
  const features = FEATURES_MAP[activeRole] ?? [];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, width: '100%', maxWidth: 780, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>
              Vista previa del dashboard · <span style={{ color: '#D4AF37' }}>¿Cómo queda tu perfil?</span>
            </h2>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>Así es tu espacio de trabajo desde el primer día</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Role tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '12px 20px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {ROLES.map(r => {
            const Icon = r.icon;
            const isActive = r.value === activeRole;
            return (
              <button key={r.value} onClick={() => setActiveRole(r.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                  border: `1px solid ${isActive ? `${r.color}50` : 'rgba(255,255,255,0.08)'}`,
                  background: isActive ? `${r.color}15` : 'rgba(255,255,255,0.02)',
                  color: isActive ? r.color : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'all .15s',
                }}>
                <Icon size={13} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Dashboard mockup */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Fake topbar */}
            <div style={{ height: 38, background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c => <span key={c} style={{ width: 8, height: 8, borderRadius: 999, background: c }} />)}
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', flex: 1, textAlign: 'center' }}>XPEAK · {roleData.label}</span>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Sidebar */}
              <div style={{ width: 140, background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.04)', padding: '12px 8px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: '#D4AF37', padding: '0 8px 10px', borderBottom: '1px solid rgba(212,175,55,0.12)', marginBottom: 8 }}>XPEAK</div>
                {(SIDEBAR_MAP[activeRole] ?? []).map((item, i) => (
                  <SbItem key={item} label={item} active={i === 0} color={roleData.color} />
                ))}
              </div>

              {/* Main mock */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px', background: '#050505', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
                {MOCK_MAP[activeRole]}
              </div>
            </div>
          </div>

          {/* Right panel: description + features */}
          <div style={{ width: 220, padding: '16px 16px', overflowY: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${roleData.color}20`, border: `1px solid ${roleData.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <roleData.icon size={15} style={{ color: roleData.color }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 900 }}>{roleData.label}</div>
            </div>

            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 14 }}>
              {activeRole === 'dj' && 'Tu perfil es tu booking page. Muestra géneros, tarifa y disponibilidad. Los empresarios te encuentran y contratan directamente.'}
              {activeRole === 'staff' && 'Portero, técnico de sonido, iluminación o seguridad. Muestra certificaciones y disponibilidad. Los venues te contratan sin intermediarios.'}
              {activeRole === 'makeup' && 'Artistas de maquillaje y estilismo para performances y festivales. Tu portfolio habla solo.'}
              {activeRole === 'media' && 'Cobertura fotográfica y audiovisual de eventos. Clubs, festivales y artistas te encuentran y te contratan.'}
              {activeRole === 'ambassador' && 'Gestiona tu lista de invitados, trackea comisiones por entrada y conecta con los venues que más pagan.'}
              {activeRole === 'empresario' && 'Encuentra profesionales verificados, lanza Flash Bookings urgentes y gestiona todos tus contratos desde un panel centralizado.'}
            </div>

            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>Funciones incluidas</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {features.map(f => (
                <span key={f.label} style={{
                  fontSize: 10,
                  fontWeight: f.highlight ? 700 : 400,
                  padding: '3px 9px',
                  borderRadius: 999,
                  background: f.highlight ? `${roleData.color}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${f.highlight ? `${roleData.color}30` : 'rgba(255,255,255,0.07)'}`,
                  color: f.highlight ? roleData.color : 'rgba(255,255,255,0.35)',
                }}>{f.label}</span>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: '10px 12px', borderRadius: 10, background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#D4AF37', marginBottom: 4 }}>Gratis para siempre</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>Plan base sin coste. Sin comisiones por contrato. Actualiza a PRO cuando quieras más visibilidad.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#080808' }}>
          <div style={{ display: 'flex', items: 'center', gap: 6 }}>
            <Zap size={12} style={{ color: '#D4AF37' }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Perfil activo en 2 minutos · Sin comisiones por contrato</span>
          </div>
          <button onClick={onClose}
            style={{ padding: '7px 18px', borderRadius: 9, background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Crear mi perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolePreviewModal;
