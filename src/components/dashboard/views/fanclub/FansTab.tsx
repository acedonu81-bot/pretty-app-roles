import { Heart, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface FanSub { id: string; fan_id: string; status: string; amount: number; created_at: string; }

interface Props {
  fans: FanSub[];
  loading: boolean;
}

const FansTab = ({ fans, loading }: Props) => (
  <motion.div key="fans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
    {/* VIP One to One — shown when Stripe Connect is live */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Crown size={14} style={{ color: '#fff' }} />
        <p className="text-sm font-bold">Fan Top VIP · One to One</p>
        <span className="text-[0.55rem] font-black px-1.5 py-0.5 rounded-full ml-1"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
          €59,90/mes
        </span>
      </div>
      <div className="glass-panel p-5 text-center py-10">
        <Crown size={28} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm text-muted-foreground">Tus fans VIP aparecerán aquí</p>
        <p className="text-xs text-muted-foreground mt-1">Disponible cuando Stripe Connect esté activo</p>
      </div>
    </div>

    <div className="glass-panel p-5">
      <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
        <Heart size={14} style={{ color: '#D4AF37' }} /> Suscriptores Fan
        <span className="ml-auto text-xs text-muted-foreground">{fans.length} fans · €4,99/mes</span>
      </h4>
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-8 animate-pulse">Cargando...</p>
      ) : fans.length === 0 ? (
        <div className="text-center py-14">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <Heart size={28} style={{ color: 'rgba(212,175,55,0.3)' }} />
          </div>
          <p className="text-sm font-bold mb-1">Aún sin suscriptores Fan</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Cuando activemos Stripe Connect, tus fans podrán suscribirse desde tu perfil público a 4,99€/mes.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {fans.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', fontSize: 13 }}>
                {f.fan_id.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Fan #{f.fan_id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">Desde {new Date(f.created_at).toLocaleDateString('es-ES')}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: '#22c55e' }}>€{Number(f.amount).toFixed(2)}/mes</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

export default FansTab;
