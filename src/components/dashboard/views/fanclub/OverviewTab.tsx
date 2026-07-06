import { Users, TrendingUp, Zap, Star, Play, Music, Image, FileText, Lock, ChevronRight } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
// LotterySection imported when ready to launch
// import LotterySection from './LotterySection';

interface FanSub { id: string; fan_id: string; status: string; amount: number; created_at: string; }

interface Props {
  fans: FanSub[];
  totalRevenue: number;
  myShare: number;
}

const OverviewTab = ({ fans, totalRevenue, myShare }: Props) => {
  const profile = useProfile();

  return (
    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Fans activos', value: fans.length, icon: <Users size={18} />, color: '#8A6D0F' },
          { label: 'Ingresos / mes', value: `€${totalRevenue.toFixed(0)}`, icon: <TrendingUp size={18} />, color: '#22c55e' },
          { label: 'Tu parte (80%)', value: `€${myShare.toFixed(0)}`, icon: <Zap size={18} />, color: '#8A6D0F' },
          { label: 'Rating medio', value: '—', icon: <Star size={18} />, color: '#8A6D0F' },
        ].map(kpi => (
          <div key={kpi.label} className="glass-panel p-4 flex items-center gap-3"
            style={{ border: `1px solid ${kpi.color}22` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${kpi.color}15`, color: kpi.color }}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-5" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <p className="text-sm font-bold mb-4 flex items-center gap-2">
          <Play size={14} style={{ color: '#8A6D0F' }} />
          Así ven tu Fan Club los visitantes de tu perfil
          <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
            PREVIEW
          </span>
        </p>
        <div className="rounded-xl overflow-hidden p-4 space-y-3"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              {profile.display_name?.charAt(0)?.toUpperCase() ?? 'X'}
            </div>
            <div>
              <p className="text-sm font-bold">{profile.display_name || 'Tu nombre'}</p>
              <p className="text-xs text-muted-foreground">{fans.length} fans · {profile.role?.toUpperCase()}</p>
            </div>
            <div className="ml-auto">
              <div className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Suscribirse · 4,99€
              </div>
            </div>
          </div>
          {[
            { label: 'Set exclusivo — Club privado 2h', type: 'audio', locked: false },
            { label: 'Backstage · Foto exclusiva', type: 'photo', locked: true },
            { label: 'Mensaje personal a mis fans', type: 'text', locked: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg"
              style={{ background: item.locked ? 'rgba(0,0,0,0.3)' : 'rgba(212,175,55,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: item.locked ? 'rgba(0,0,0,0.05)' : 'rgba(212,175,55,0.1)', color: item.locked ? '#555' : '#D4AF37' }}>
                {item.type === 'audio' ? <Music size={14} /> : item.type === 'photo' ? <Image size={14} /> : <FileText size={14} />}
              </div>
              <p className="text-xs flex-1" style={{ color: item.locked ? 'rgba(0,0,0,0.1)' : 'rgba(22,20,18,0.75)' }}>
                {item.label}
              </p>
              {item.locked && <Lock size={12} style={{ color: '#555' }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5 flex items-center gap-5"
        style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
          <Zap size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Activa Stripe Connect para cobrar</p>
          <p className="text-xs text-muted-foreground mt-0.5">Conecta tu cuenta bancaria y empieza a recibir pagos de fans automáticamente cada mes.</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-xs font-bold flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.25)' }}
          onClick={() => toast.info('Próximamente disponible')}>
          Próximamente <ChevronRight size={12} className="inline" />
        </button>
      </div>

    </motion.div>
  );
};

export default OverviewTab;
