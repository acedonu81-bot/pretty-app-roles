import { useState, useEffect, useCallback } from 'react';
import { Zap, Heart, Search, Lock, BarChart3, Euro, CheckCircle, Image, X, Building2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { ROLE_ES } from '@/lib/constants';
import type { Pro } from '@/types';
import DiscoverTab from './empresario/DiscoverTab';
import FlashTab from './empresario/FlashTab';
import HistorialTab from './empresario/HistorialTab';
import GastosTab from './empresario/GastosTab';
import BenchmarkTab from './empresario/BenchmarkTab';
import MediaTab from './empresario/MediaTab';
import StatsTab from './empresario/StatsTab';

interface EmpresarioViewProps {
  onMessage?: (userId: string, name: string) => void;
}

const EmpresarioView = ({ onMessage }: EmpresarioViewProps) => {
  const { user } = useAuth();
  const { role, loading: profileLoading } = useProfile();

  // All hooks must be declared before any early return
  const [tab, setTab] = useState<'discover' | 'flash' | 'favorites' | 'stats' | 'benchmark' | 'media' | 'historial' | 'gastos'>('discover');
  const [pros, setPros] = useState<Pro[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPros = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, role, zone, hourly_rate, specialty, subscription_tier, is_live, is_verified, photo_url, genres, bio, is_flash_active')
      .eq('is_flash_active', true)
      .limit(200);
    setLoading(false);
    if (error) { toast.error('Error al cargar profesionales'); return; }
    const filtered = (data ?? []).filter((d: any) => d.user_id !== user?.id);
    setPros(filtered.map((d: any) => ({ ...d, id: d.user_id })) as unknown as Pro[]);
  }, [user?.id]);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from('favorites').select('profile_id').eq('user_id', user.id);
    if (error) { toast.error('Error al cargar favoritos'); return; }
    setFavorites((data ?? []).map((d: any) => d.profile_id));
  }, [user]);

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
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `XPEAK_talentos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(`${proList.length} profesionales exportados a CSV`);
  };

  useEffect(() => { fetchPros(); }, [fetchPros]);
  useEffect(() => { if (user?.id) fetchFavorites(); }, [user?.id, fetchFavorites]);

  // Early return AFTER all hooks
  if (!profileLoading && role !== 'empresario') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <Building2 size={28} style={{ color: 'rgba(212,175,55,0.5)' }} />
        </div>
        <h2 className="text-lg font-black tracking-tight">Panel exclusivo para empresas y salas</h2>
        <p className="text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Esta sección está pensada para clubs, promotoras y organizadores de eventos. Si eres empresa, cambia tu rol en <strong style={{ color: '#D4AF37' }}>Mi Perfil → Rol → Empresa / Sala</strong>.
        </p>
      </div>
    );
  }

  const TABS = [
    { id: 'discover'  as const, label: 'Descubrir',    icon: Search       },
    { id: 'flash'     as const, label: 'Flash Jobs',   icon: Zap          },
    { id: 'favorites' as const, label: 'Favoritos',    icon: Heart        },
    { id: 'historial' as const, label: 'Historial',    icon: CheckCircle  },
    { id: 'gastos'    as const, label: 'Gastos',       icon: Euro         },
    { id: 'media'     as const, label: 'Media',        icon: Image        },
    { id: 'stats'     as const, label: 'Estadísticas', icon: BarChart3    },
    { id: 'benchmark' as const, label: 'Cómo pagan',   icon: Clock        },
  ];

  const filteredPros = pros.filter(p =>
    p.is_flash_active === true &&
    (!searchQuery || (p.display_name ?? '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Panel <span className="text-gradient">Empresario</span></h2>
        <p className="text-sm text-muted-foreground">Encuentra, contrata y analiza el talento para tu sala.</p>
      </div>

      {/* Private hiring — coming soon */}
      <div className="glass-panel p-4 mb-5 flex items-center justify-between" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-3">
          <Lock size={16} style={{ color: '#8E8EA0' }} />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold">Contrataciones Privadas</p>
              <span className="flex items-center gap-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                <Clock size={9} /> Próximamente
              </span>
            </div>
            <p className="text-[0.75rem] text-muted-foreground">Tus contrataciones no serán visibles para otros usuarios.</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8E8EA0' }} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar profesional por nombre..."
          className="nightlife-input w-full text-sm"
          style={{ paddingLeft: '2.25rem' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} style={{ color: '#8E8EA0' }} />
          </button>
        )}
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
              <span className="text-[0.75rem] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)' }}>{favorites.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'stats'     && <StatsTab pros={pros} favorites={favorites} />}
      {tab === 'media'     && <MediaTab />}
      {tab === 'benchmark' && <BenchmarkTab />}
      {tab === 'flash'     && <FlashTab />}
      {tab === 'historial' && <HistorialTab />}
      {tab === 'gastos'    && <GastosTab />}
      {(tab === 'discover' || tab === 'favorites') && (
        <DiscoverTab
          pros={filteredPros}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onExportCSV={exportCSV}
          onMessage={onMessage}
          showFavoritesOnly={tab === 'favorites'}
          loading={loading}
        />
      )}
    </div>
  );
};

export default EmpresarioView;
