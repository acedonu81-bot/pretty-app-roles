import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Zap, Heart, Search, Lock, BarChart3, Euro, CheckCircle, Image, X, Building2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { ROLE_ES } from '@/lib/constants';
import { buildCsv, downloadCsv } from '@/lib/csvExport';
import type { Pro } from '@/types';
import DiscoverTab from './empresario/DiscoverTab';
import FlashTab from './empresario/FlashTab';
import HistorialTab from './empresario/HistorialTab';
import GastosTab from './empresario/GastosTab';
import BenchmarkTab from './empresario/BenchmarkTab';
import MediaTab from './empresario/MediaTab';
const StatsTab = lazy(() => import('./empresario/StatsTab'));
import SmartMatchWidget from '../SmartMatchWidget';

/* ── Feed público "Empresas que contratan" ── */
const WhoIsHiringFeed = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('user_id, display_name, zone, bio, photo_url, is_verified, score')
      .eq('role', 'empresario')
      .not('display_name', 'is', null)
      .order('is_verified', { ascending: false })
      .order('score', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setCompanies((data ?? []).filter((p: any) => p.display_name?.trim().length > 1));
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={16} style={{ color: '#8A6D0F' }} />
          <h2 className="text-base font-black" style={{ color: '#222' }}>Empresas & salas en XPEAK</h2>
        </div>
        <p className="text-xs" style={{ color: '#333' }}>
          Clubs, promotoras y organizadores registrados. Pueden contactarte para sus eventos.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => <div key={i} className="rounded-2xl h-16 animate-pulse" style={{ background: 'rgba(0,0,0,0.04)' }} />)}
        </div>
      )}

      {!loading && companies.length === 0 && (
        <div className="py-12 text-center rounded-2xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <Building2 size={28} className="mx-auto mb-3" style={{ color: 'rgba(212,175,55,0.3)' }} />
          <p className="text-sm font-bold" style={{ color: '#333' }}>Aún no hay empresas registradas</p>
          <p className="text-xs mt-1" style={{ color: '#333' }}>Pronto verás aquí los clubs y promotoras que buscan talento</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {companies.map(c => (
          <div key={c.user_id} className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
              {c.photo_url
                ? <img src={c.photo_url} alt={c.display_name} loading="lazy" className="w-full h-full object-cover" />
                : <Building2 size={16} style={{ color: '#8A6D0F' }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm font-black truncate" style={{ color: '#111' }}>{c.display_name}</p>
                {c.is_verified && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.12)', color: '#B8941E' }}>✓ Verificado</span>
                )}
              </div>
              {c.zone && (
                <p className="text-xs truncate" style={{ color: '#333' }}>📍 {c.zone}</p>
              )}
              {c.bio && (
                <p className="text-xs line-clamp-1 mt-0.5" style={{ color: '#333' }}>{c.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <p className="text-sm font-black mb-1">¿Organizas eventos?</p>
        <p className="text-xs mb-3" style={{ color: '#333' }}>Únete como empresa y los profesionales podrán encontrarte y contactarte.</p>
        <a href="/dashboard?view=profile" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <Building2 size={13} /> Cambiar a rol Empresa
        </a>
      </div>
    </div>
  );
};

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
      if (error && error.code !== '23505') { toast.error('Error al guardar favorito'); return; }
      setFavorites(prev => prev.includes(profileId) ? prev : [...prev, profileId]);
      toast.success('Guardado en favoritos');
    }
  };

  const exportCSV = (proList: Pro[], notes: Record<string, string>) => {
    const csv = buildCsv('Talentos — Directorio', [
      {
        title: 'RESUMEN',
        header: ['Concepto', 'Valor'],
        rows: [['Profesionales listados', proList.length]],
      },
      {
        title: 'DETALLE DE PROFESIONALES',
        header: ['Nombre', 'Rol', 'Ciudad', 'Tarifa €/hora', 'Sello Oro', 'Disponible Flash', 'Instagram / WA', 'Nota privada'],
        rows: proList.map(p => [
          p.display_name ?? '—',
          ROLE_ES[p.role] ?? p.role,
          p.zone ?? '—',
          p.hourly_rate > 0 ? `€${p.hourly_rate}` : 'A consultar',
          p.is_verified ? 'Verificado ✓' : 'Sin verificar',
          p.is_flash_active ? 'Disponible ahora' : 'No disponible',
          p.instagram ? `https://instagram.com/${p.instagram.replace('@', '')}` : '—',
          notes[p.id] ?? '',
        ]),
      },
    ]);
    downloadCsv(csv, `XPEAK_talentos_${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success(`${proList.length} profesionales exportados a CSV`);
  };

  useEffect(() => { fetchPros(); }, [fetchPros]);
  useEffect(() => { if (user?.id) fetchFavorites(); }, [user?.id, fetchFavorites]);

  // Si no es empresario, mostrar feed de quién está contratando (solo lectura)
  if (!profileLoading && role !== 'empresario') {
    return <WhoIsHiringFeed />;
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

      {/* Guía rápida — antes había una cifra hardcodeada ("47+ profesionales
          activos") que no era real; sustituida por 3 pasos concretos que
          orientan a quien entra por primera vez sin depender de ningún
          número que pueda ser bajo o falso. */}
      <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl text-xs overflow-x-auto"
        style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
        {[
          { n: '1', t: 'Busca profesionales por zona y presupuesto' },
          { n: '2', t: 'Contacta gratis, sin comisión' },
          { n: '3', t: 'Cierra el trato directamente con él' },
        ].map((step, i) => (
          <div key={step.n} className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-black text-[0.65rem] flex-shrink-0"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F' }}>{step.n}</span>
              <span style={{ color: '#333', fontWeight: 600 }}>{step.t}</span>
            </div>
            {i < 2 && <span style={{ color: 'rgba(0,0,0,0.15)' }}>→</span>}
          </div>
        ))}
      </div>

      {/* Private hiring — coming soon */}
      <div className="glass-panel p-4 mb-5 flex items-center justify-between" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-3">
          <Lock size={16} style={{ color: '#3d3d4e' }} />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold">Contrataciones Privadas</p>
              <span className="flex items-center gap-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
                <Clock size={9} /> Próximamente
              </span>
            </div>
            <p className="text-[0.75rem] text-muted-foreground">Tus contrataciones no serán visibles para otros usuarios.</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#3d3d4e' }} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar profesional por nombre..."
          className="nightlife-input w-full text-sm"
          style={{ paddingLeft: '2.25rem' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} style={{ color: '#3d3d4e' }} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: tab === t.id ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${tab === t.id ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
              color: tab === t.id ? '#D4AF37' : '#3d3d4e',
            }}>
            <t.icon size={13} /> {t.label}
            {t.id === 'favorites' && favorites.length > 0 && (
              <span className="text-[0.75rem] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)' }}>{favorites.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'stats'     && <Suspense fallback={<p className="text-sm text-muted-foreground animate-pulse">Cargando estadísticas…</p>}><StatsTab pros={pros} favorites={favorites} /></Suspense>}
      {tab === 'media'     && <MediaTab />}
      {tab === 'benchmark' && <BenchmarkTab />}
      {tab === 'flash'     && <FlashTab />}
      {tab === 'historial' && <HistorialTab />}
      {tab === 'gastos'    && <GastosTab />}
      {tab === 'discover' && <SmartMatchWidget onMessage={onMessage} />}
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
