import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import OverviewTab from './fanclub/OverviewTab';
import PostsTab from './fanclub/PostsTab';
import FansTab from './fanclub/FansTab';
import TiersTab from './fanclub/TiersTab';

interface FanSub { id: string; fan_id: string; status: string; amount: number; created_at: string; }

const FanClubView = () => {
  const { user } = useAuth();
  const [fans, setFans] = useState<FanSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'posts' | 'fans' | 'tiers'>('overview');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: prof, error: profError } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle();
      if (profError) { toast.error('Error al cargar tu perfil'); setLoading(false); return; }
      if (!prof) { setLoading(false); return; }
      const { data, error: fansError } = await supabase.from('fan_subscriptions' as any).select('*').eq('professional_profile_id', prof.id).eq('status', 'active');
      if (fansError) { toast.error('Error al cargar tus fans'); setLoading(false); return; }
      setFans((data as FanSub[]) ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  const totalRevenue = fans.reduce((s, f) => s + Number(f.amount), 0);
  const myShare = totalRevenue * 0.8;

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">Fan <span className="text-gradient">Club</span></h2>
            <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full tracking-widest"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>BETA</span>
          </div>
          <p className="text-sm text-muted-foreground">Tu canal de contenido exclusivo · Monetiza tu talento</p>
        </div>
        <div className="flex gap-2">
          {(['overview','posts','fans','tiers'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
              style={{
                background: tab === t ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${tab === t ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: tab === t ? '#D4AF37' : 'rgba(255,255,255,0.4)',
              }}>
              {t === 'overview' ? 'Resumen' : t === 'posts' ? 'Publicar' : t === 'fans' ? 'Fans' : 'Niveles'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'overview' && <OverviewTab fans={fans} totalRevenue={totalRevenue} myShare={myShare} />}
        {tab === 'posts' && <PostsTab />}
        {tab === 'fans' && <FansTab fans={fans} loading={loading} />}
        {tab === 'tiers' && <TiersTab />}
      </AnimatePresence>
    </div>
  );
};

export default FanClubView;
