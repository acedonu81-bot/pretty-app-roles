import { useState, useEffect } from 'react';
import { Filter, Heart, Star, FileText, Download, X, Users, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';
import NightlifeSelect from '@/components/ui/NightlifeSelect';
import type { Pro } from './types';
import { ZONES } from './types';

interface Props {
  pros: Pro[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onExportCSV: (list: Pro[], notes: Record<string, string>) => void;
  onMessage?: (userId: string, name: string) => void;
  showFavoritesOnly?: boolean;
  loading?: boolean;
}

const DiscoverTab = ({ pros, favorites, onToggleFavorite, onExportCSV, onMessage, showFavoritesOnly = false, loading = false }: Props) => {
  const [filterZone, setFilterZone]   = useState('Todas');
  const [filterRole, setFilterRole]   = useState('Todos');
  const [maxPrice, setMaxPrice]       = useState(1000);
  const [proNotes, setProNotes]       = useState<Record<string, string>>({});
  const [notesTarget, setNotesTarget] = useState<string | null>(null);
  const [notesDraft, setNotesDraft]   = useState('');

  const filtered = pros.filter(p => {
    if (filterZone !== 'Todas' && p.zone !== filterZone) return false;
    // 'camarero' es un rol legacy — cuenta como staff en el filtro
    const effectiveRole = p.role === 'camarero' ? 'staff' : p.role;
    if (filterRole !== 'Todos' && effectiveRole !== filterRole) return false;
    if (p.hourly_rate > maxPrice) return false;
    if (showFavoritesOnly && !favorites.includes(p.id)) return false;
    return true;
  });

  const openNotes = (id: string) => { setNotesTarget(id); setNotesDraft(proNotes[id] ?? ''); };
  const saveNotes = () => {
    if (notesTarget) setProNotes(prev => ({ ...prev, [notesTarget]: notesDraft }));
    setNotesTarget(null);
    toast.success('Nota guardada');
  };

  useEffect(() => {
    if (!notesTarget) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setNotesTarget(null); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [notesTarget]);

  return (
    <>
      {/* Filters */}
      <div className="glass-panel p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} style={{ color: '#8A6D0F' }} />
          <span className="text-xs font-bold">Filtros</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[0.75rem] text-muted-foreground font-bold uppercase mb-1 block">Zona</label>
            <NightlifeSelect
              value={filterZone}
              onChange={setFilterZone}
              options={ZONES.map(z => ({ value: z, label: z }))}
              active={filterZone !== 'Todas'}
            />
          </div>
          <div>
            <label className="text-[0.75rem] text-muted-foreground font-bold uppercase mb-1 block">Rol</label>
            <NightlifeSelect
              value={filterRole}
              onChange={setFilterRole}
              options={[
                { value: 'Todos', label: 'Todos' },
                { value: 'dj', label: 'DJ' },
                { value: 'staff', label: 'Camarero' },
                { value: 'azafata', label: 'Azafata' },
                { value: 'makeup', label: 'Estilismo / Makeup' },
                { value: 'peluqueria', label: 'Peluquería a Domicilio' },
                { value: 'media', label: 'Media / Foto-Vídeo' },
                { value: 'ambassador', label: 'Relaciones Públicas' },
                { value: 'promotor', label: 'Promotor' },
                { value: 'catering', label: 'Catering / Cocina' },
                { value: 'rookie', label: 'Rookie' },
              ]}
              active={filterRole !== 'Todos'}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="text-[0.75rem] text-muted-foreground font-bold uppercase mb-1 block">
            Tarifa máx: {maxPrice >= 1000 ? 'Sin límite' : `€${maxPrice}/hora`}
          </label>
          <input type="range" min={50} max={1000} step={50} value={maxPrice}
            onChange={e => setMaxPrice(parseInt(e.target.value))} className="w-full accent-amber-500" />
          <div className="flex justify-between text-[0.75rem] text-muted-foreground mt-0.5">
            <span>€50</span>
            <span style={{ color: '#8A6D0F' }}>{maxPrice >= 1000 ? '∞ Sin límite' : `€${maxPrice}`}</span>
            <span>Sin límite</span>
          </div>
        </div>
      </div>

      {/* Export bar */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          {filtered.length} profesional{filtered.length !== 1 ? 'es' : ''}
          {showFavoritesOnly ? ' guardados' : ' encontrados'}
        </p>
        {filtered.length > 0 && (
          <button onClick={() => onExportCSV(filtered, proNotes)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
            <Download size={12} /> Exportar CSV
          </button>
        )}
      </div>

      {/* Pro grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-panel p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-lg bg-white/5 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-white/5 rounded mb-1.5 w-3/4" />
                <div className="h-2 bg-white/5 rounded w-1/2" />
              </div>
              <div className="w-8 h-8 rounded bg-white/5 flex-shrink-0" />
            </div>
            <div className="flex gap-2 mb-3">
              <div className="h-4 bg-white/5 rounded w-12" />
              <div className="h-4 bg-white/5 rounded w-16" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-white/5 rounded-md flex-1" />
              <div className="h-8 w-9 bg-white/5 rounded-md" />
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full glass-panel p-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <Users size={22} style={{ color: 'rgba(212,175,55,0.35)' }} />
            </div>
            <p className="text-sm font-bold">
              {showFavoritesOnly ? 'Sin profesionales guardados' : 'Sin resultados con estos filtros'}
            </p>
            <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
              {showFavoritesOnly
                ? 'Guarda profesionales desde la pestaña Descubrir para acceder rápido a ellos.'
                : 'Prueba a ajustar la zona, el rol o ampliar el precio máximo.'}
            </p>
          </div>
        )}
        {!loading && filtered.map(p => (
          <div key={p.id} className="glass-panel p-4 transition-all hover:border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              {p.photo_url && p.photo_url.length > 5 ? (
                <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={p.photo_url} alt={p.display_name} loading="lazy" className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              ) : (
                <GeometricAvatar role={p.role as any} seed={(p.id ?? p.display_name ?? 'x').charCodeAt(0)} size={42} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold truncate">{p.display_name || 'Sin nombre'}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.specialty || p.role} · {p.zone || 'Madrid'}</p>
                {p.bio && <p className="text-[0.75rem] text-muted-foreground mt-0.5 line-clamp-1">{p.bio}</p>}
              </div>
              {/* Semáforo */}
              <div className="flex flex-col items-center gap-0.5 flex-shrink-0"
                title={p.is_flash_active ? 'Disponible ahora' : 'No disponible'}>
                <span className="w-2.5 h-2.5 rounded-full"
                  style={p.is_flash_active
                    ? { background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }
                    : { background: '#444' }} />
                <span className="text-xs font-bold" style={{ color: p.is_flash_active ? '#22c55e' : '#555' }}>
                  {p.is_flash_active ? 'DISP.' : 'OFF'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-base font-black" style={{ color: '#8A6D0F' }}>
                {p.hourly_rate > 0 ? <>€{p.hourly_rate}<span className="text-xs font-bold opacity-60">/hora</span></> : <span className="text-xs opacity-50">A consultar</span>}
              </span>
              {p.genres?.slice(0, 2).map(g => (
                <span key={g} className="text-[0.7rem] px-1 py-0.5 rounded font-bold"
                  style={{ background: 'rgba(212,175,55,0.08)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.15)' }}>
                  {g}
                </span>
              ))}
              {proNotes[p.id] && (
                <span className="text-[0.7rem] px-1 py-0.5 rounded font-bold flex items-center gap-0.5"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>
                  📝 Nota
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {onMessage && (
                <button onClick={() => onMessage(p.id, p.display_name || 'Profesional')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all hover:scale-105 flex-1"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
                  <MessageCircle size={12} /> Contactar
                </button>
              )}
              <button onClick={() => onToggleFavorite(p.id)}
                className="flex items-center justify-center px-2.5 py-2 rounded-md text-xs font-bold transition-all hover:scale-105"
                style={{
                  background: favorites.includes(p.id) ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${favorites.includes(p.id) ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
                  color: favorites.includes(p.id) ? '#D4AF37' : '#3d3d4e',
                }}
                title={favorites.includes(p.id) ? 'Guardado' : 'Guardar'}>
                <Heart size={12} fill={favorites.includes(p.id) ? '#D4AF37' : 'none'} />
              </button>
              <button onClick={() => openNotes(p.id)}
                className="flex items-center justify-center px-2.5 py-2 rounded-md text-xs font-bold transition-all hover:scale-105"
                style={{
                  background: proNotes[p.id] ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${proNotes[p.id] ? 'rgba(139,92,246,0.3)' : 'var(--nightlife-border)'}`,
                  color: proNotes[p.id] ? '#8B5CF6' : '#3d3d4e',
                }}
                title="Nota privada CRM">
                <FileText size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notes modal */}
      {notesTarget && (() => {
        const pro = pros.find(p => p.id === notesTarget);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={e => { if (e.target === e.currentTarget) setNotesTarget(null); }}>
            <div className="rounded-2xl p-5 w-full max-w-sm"
              style={{ background: '#0a0a0e', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={14} style={{ color: '#8B5CF6' }} />
                  <span className="text-sm font-bold">Nota privada CRM</span>
                </div>
                <button onClick={() => setNotesTarget(null)}><X size={16} className="text-muted-foreground" /></button>
              </div>
              {pro && (
                <p className="text-xs text-muted-foreground mb-3">
                  <span className="font-bold text-white">{pro.display_name}</span> · {pro.role} · {pro.zone}
                </p>
              )}
              <textarea value={notesDraft} onChange={e => setNotesDraft(e.target.value)}
                placeholder="Ej: Trae mesa propia. Pago en efectivo. Contactar por WA los viernes."
                rows={4} className="nightlife-input w-full text-xs resize-none"
                style={{ borderColor: 'rgba(139,92,246,0.3)' }} />
              <div className="flex gap-2 mt-3">
                <button onClick={saveNotes}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(90deg,#8B5CF6,#7C3AED)', color: '#222' }}>
                  Guardar nota
                </button>
                {proNotes[notesTarget] && (
                  <button
                    onClick={() => {
                      setProNotes(prev => { const n = { ...prev }; delete n[notesTarget!]; return n; });
                      setNotesTarget(null);
                      toast.success('Nota eliminada');
                    }}
                    className="px-3 py-2.5 rounded-xl text-xs font-bold"
                    style={{ background: 'rgba(0,0,0,0.04)', color: '#3d3d4e', border: '1px solid rgba(0,0,0,0.08)' }}>
                    Borrar
                  </button>
                )}
              </div>
              <p className="text-[0.75rem] text-muted-foreground mt-2 text-center">Solo tú puedes ver estas notas</p>
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default DiscoverTab;
