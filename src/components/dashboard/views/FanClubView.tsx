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
    <div className="animate-[fadeIn_0.4s_ease] relative">

      {/* ── Ambient background render — only FanClub ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        {/* Deep orb bottom-left — warm gold */}
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(212,175,55,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'orbFloat1 20s ease-in-out infinite',
        }} />
        {/* Accent orb top-right — violet */}
        <div style={{
          position: 'absolute', top: '5%', right: '-8%',
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle at 55% 45%, rgba(139,92,246,0.14) 0%, transparent 65%)',
          filter: 'blur(70px)',
          animation: 'orbFloat2 26s ease-in-out infinite',
        }} />
        {/* Small accent orb center — rose */}
        <div style={{
          position: 'absolute', top: '35%', left: '40%',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(236,72,153,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'orbFloat3 18s ease-in-out infinite',
        }} />
        {/* Subtle grid lines texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.018]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fcGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fcGrid)" />
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">Fan <span className="text-gradient">Club</span></h2>
            <span className="text-xs font-black px-2 py-0.5 rounded-full tracking-widest"
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
