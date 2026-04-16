import { useState, useEffect } from 'react';
import { Zap, Heart, Search, Lock, BarChart3, Euro, CheckCircle, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ROLE_ES } from '@/lib/constants';
import type { Pro } from '@/types';
import DiscoverTab from './empresario/DiscoverTab';
import FlashTab from './empresario/FlashTab';
import HistorialTab from './empresario/HistorialTab';
import BenchmarkTab from './empresario/BenchmarkTab';
import MediaTab from './empresario/MediaTab';
import StatsTab from './empresario/StatsTab';

const EmpresarioView = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'discover' | 'flash' | 'favorites' | 'stats' | 'benchmark' | 'media' | 'historial'>('discover');
  const [pros, setPros] = useState<Pro[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [privateHiring, setPrivateHiring] = useState(false);

  useEffect(() => { fetchPros(); }, []);
  useEffect(() => { if (user?.id) fetchFavorites(); }, [user?.id]);

  const fetchPros = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, role, zone, hourly_rate, specialty, subscription_tier, is_live, is_verified, photo_url, genres, bio')
      .limit(200);
    if (error) { toast.error('Error al cargar profesionales'); return; }
    setPros((data ?? []).map((d: any) => ({ ...d, id: d.user_id })) as unknown as Pro[]);
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const { data, error } = await supabase.from('favorites').select('profile_id').eq('user_id', user.id);
    if (error) { toast.error('Error al cargar favoritos'); return; }
    setFavorites((data ?? []).map((d: any) => d.profile_id));
  };

  const toggleFavorite = async (profileId: string) => {
    if (!user) return;
    if (favorites.includes(profileId)) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('profile_id', profileId);
      if (error) { toast.error('Error al eliminar favorito'); return; }
      setFavorites(prev => prev.filter(id => id !== profileId));
      toast.success('Eliminado de favoritos');
    } else {
      const { error } = await supabase.from('favorites').insert({ user_id: user.id, profile_id: profileId } as any);
      if (error) { toast.error('Error al guardar favorito'); return; }
      setFavorites(prev => [...prev, profileId]);
      toast.success('Guardado en favoritos');
    }
  };

  const exportCSV = (proList: Pro[], notes: Record<string, string>) => {
    const rows = [
      ['Nombre', 'Rol', 'Ciudad', 'Tarifa €/hora', 'Sello Oro', 'Disponible Flash', 'Instagram / WA', 'Nota privada'],
      ...proList.map(p => [
        p.display_name ?? '—',
        ROLE_ES[p.role] ?? p.role,
        p.zone ?? '—',
        p.hourly_rate > 0 ? `€${p.hourly_rate}` : 'A consultar',
        p.is_verified ? 'Verificado ✓' : 'Sin verificar',
        p.is_flash_active ? 'Disponible ahora' : 'No disponible',
        p.instagram ? `https://instagram.com/${p.instagram.replace('@', '')}` : '—',
        notes[p.id] ?? '',
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `XPEAK_talentos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(`${proList.length} profesionales exportados a CSV`);
  };

  const TABS = [
    { id: 'discover'  as const, label: 'Descubrir',    icon: Search       },
    { id: 'flash'     as const, label: 'Flash Jobs',   icon: Zap          },
    { id: 'favorites' as const, label: 'Favoritos',    icon: Heart        },
    { id: 'historial' as const, label: 'Historial',    icon: CheckCircle  },
    { id: 'media'     as const, label: 'Media',        icon: Image        },
    { id: 'stats'     as const, label: 'Estadísticas', icon: BarChart3    },
    { id: 'benchmark' as const, label: 'Cómo pagan',   icon: Euro         },
  ];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Panel <span className="text-gradient">Empresario</span></h2>
        <p className="text-sm text-muted-foreground">Encuentra, contrata y analiza el talento para tu sala.</p>
      </div>

      {/* Private hiring toggle */}
      <div className="glass-panel p-4 mb-5 flex items-center justify-between" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-3">
          <Lock size={16} style={{ color: privateHiring ? '#D4AF37' : '#8E8EA0' }} />
          <div>
            <p className="text-xs font-bold">Contrataciones Privadas</p>
            <p className="text-[0.55rem] text-muted-foreground">Tus contrataciones no serán visibles para otros usuarios.</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={privateHiring} onChange={() => setPrivateHiring(!privateHiring)} className="sr-only" />
          <div className="relative w-9 h-5 rounded-full" style={{ background: privateHiring ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)', border: `1px solid ${privateHiring ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
            <div className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform" style={{ background: privateHiring ? '#D4AF37' : '#8E8EA0', transform: privateHiring ? 'translateX(16px)' : 'translateX(0)' }} />
          </div>
        </label>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: tab === t.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${tab === t.id ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
              color: tab === t.id ? '#D4AF37' : '#8E8EA0',
            }}>
            <t.icon size={13} /> {t.label}
            {t.id === 'favorites' && favorites.length > 0 && (
              <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)' }}>{favorites.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'stats'     && <StatsTab pros={pros} favorites={favorites} />}
      {tab === 'media'     && <MediaTab />}
      {tab === 'benchmark' && <BenchmarkTab />}
      {tab === 'flash'     && <FlashTab />}
      {tab === 'historial' && <HistorialTab />}
      {(tab === 'discover' || tab === 'favorites') && (
        <DiscoverTab
          pros={pros}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onExportCSV={exportCSV}
          showFavoritesOnly={tab === 'favorites'}
        />
      )}
    </div>
  );
};

export default EmpresarioView;
