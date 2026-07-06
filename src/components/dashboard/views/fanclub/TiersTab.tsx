import { Heart, Crown, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TIERS = [
  {
    id: 'fan',
    name: 'Fan',
    price: 4.99,
    color: '#8A6D0F',
    glow: 'rgba(212,175,55,0.15)',
    border: 'rgba(212,175,55,0.3)',
    icon: <Heart size={18} />,
    features: [
      'Acceso a todas las sesiones de audio del artista',
      'Posts y fotos exclusivas (no públicas)',
      'Mensaje directo al artista',
      'Badge "Fan" visible en tu perfil XPEAK',
    ],
  },
  {
    id: 'vip',
    name: 'VIP · One to One',
    price: 59.90,
    color: '#222',
    glow: 'rgba(0,0,0,0.08)',
    border: 'rgba(0,0,0,0.1)',
    icon: <Crown size={18} />,
    features: [
      'Todo el nivel Fan incluido',
      'Sesión privada 1:1 en directo — 1 hora al mes (no grabada)',
      'Vídeos exclusivos subidos por el artista',
      'Prioridad en Flash Booking',
      'Mención pública en redes del artista',
      'Regalo sorpresa mensual exclusivo',
    ],
  },
];

const TiersTab = () => (
  <motion.div key="tiers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
    <p className="text-xs text-muted-foreground">
      Configura los niveles de suscripción de tu Fan Club. Los precios y beneficios son personalizables.
    </p>
    {TIERS.map(tier => (
      <div key={tier.id} className="glass-panel p-5"
        style={{ border: `1px solid ${tier.border}`, background: tier.glow }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${tier.color}22`, color: tier.color, border: `1px solid ${tier.border}` }}>
            {tier.icon}
          </div>
          <div className="flex-1">
            <p className="font-bold" style={{ color: tier.color }}>{tier.name}</p>
            <p className="text-2xl font-black" style={{ color: tier.color }}>€{tier.price}<span className="text-xs font-normal text-muted-foreground">/mes</span></p>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>
            Próximamente
          </span>
        </div>
        <div className="space-y-2">
          {tier.features.map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle size={12} style={{ color: tier.color, flexShrink: 0 }} /> {f}
            </div>
          ))}
        </div>
      </div>
    ))}
    <div className="p-4 rounded-xl text-xs space-y-2" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
      <p className="font-bold" style={{ color: '#8A6D0F' }}>Reparto de ingresos</p>
      <p className="text-muted-foreground">
        Tú recibes el <strong style={{ color: '#22c55e' }}>80%</strong> de cada suscripción. XPEAK retiene un <strong>20%</strong> por plataforma y procesamiento.
      </p>
      <div className="grid grid-cols-2 gap-2 pt-1">
        {[
          { tier: 'Fan · 4,99€/mes', tuParte: '3,99€', xpeak: '1,00€' },
          { tier: 'VIP · 59,90€/mes', tuParte: '47,92€', xpeak: '11,98€' },
        ].map(r => (
          <div key={r.tier} className="rounded-lg p-2.5"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <p className="font-bold mb-1" style={{ color: '#8A6D0F' }}>{r.tier}</p>
            <p className="text-muted-foreground">Tú: <strong style={{ color: '#22c55e' }}>{r.tuParte}</strong></p>
            <p className="text-muted-foreground">XPEAK: {r.xpeak}</p>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground pt-1">
        <strong>1 fan VIP</strong> vale lo mismo que <strong>12 fans básicos</strong>. Calidad sobre cantidad.
      </p>
    </div>
  </motion.div>
);

export default TiersTab;
