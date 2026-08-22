import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import GeometricAvatar from './GeometricAvatar';

interface LiveProfile {
  id: string;
  display_name: string;
  role: string;
  stream_title: string | null;
  zone: string | null;
}

const DEMO_LIVE: LiveProfile[] = [
  { id: 'demo-1', display_name: 'DJ Konrad',  role: 'dj',     stream_title: 'Techno Industrial',  zone: 'Madrid' },
  { id: 'demo-2', display_name: 'Carla VIP',  role: 'staff',  stream_title: 'Coordinación evento', zone: 'Barcelona' },
  { id: 'demo-3', display_name: 'Luna Make',  role: 'makeup', stream_title: 'Backstage live',      zone: 'Valencia' },
];

const ROLE_LABEL: Record<string, string> = { dj: 'DJ', staff: 'Camarero', azafata: 'Azafata', makeup: 'Makeup', rookie: 'Promesa', media: 'Media' };
const ROLE_COLOR: Record<string, string> = { dj: '#D4AF37', staff: '#8B5CF6', azafata: '#F472B6', makeup: '#EC4899', rookie: '#F59E0B', media: '#3B82F6' };

const LiveDJsSection = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [profiles, setProfiles] = useState<LiveProfile[]>([]);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, display_name, role, stream_title, zone')
      .eq('is_live', true)
      .limit(6)
      .then(({ data, error }) => {
        if (error) { setProfiles(DEMO_LIVE); return; }
        const real = (data as LiveProfile[]) ?? [];
        if (real.length === 0) { setProfiles(DEMO_LIVE); return; }

        // Máximo 1 por rol, hasta 3
        const seen = new Set<string>();
        const varied: LiveProfile[] = [];
        for (const p of real) {
          if (!seen.has(p.role)) { seen.add(p.role); varied.push(p); }
          if (varied.length === 3) break;
        }
        // Rellena con demos de roles que falten
        for (const d of DEMO_LIVE) {
          if (varied.length === 3) break;
          if (!seen.has(d.role)) { seen.add(d.role); varied.push(d); }
        }
        setProfiles(varied);
      });
  }, []);

  if (profiles.length === 0) return null;

  return (
    <section className="mb-10 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#E53935' }} />
        </span>
        <h3 className="text-base font-bold">
          En <span className="text-gradient">Directo</span> Ahora
        </h3>
      </div>

      {/* Cards — pill horizontal */}
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', maskImage: 'linear-gradient(to right, black 85%, transparent 100%)' }}>
        {profiles.map(p => {
          const color = ROLE_COLOR[p.role] ?? '#D4AF37';
          const label = ROLE_LABEL[p.role] ?? p.role;
          return (
            <button
              key={p.id}
              onClick={onNavigate}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-none transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: 'rgba(0,0,0,0.03)',
                border: `1px solid ${color}28`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="relative flex-shrink-0">
                <GeometricAvatar role={p.role as any} seed={p.id.charCodeAt(0)} size={38} isLive />
                {/* live dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black"
                  style={{ background: '#E53935', boxShadow: '0 0 6px rgba(229,57,53,0.7)' }} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-bold leading-tight truncate">{p.display_name}</p>
                <p className="text-xs truncate" style={{ color: '#222' }}>
                  {p.stream_title || p.zone || label}
                </p>
              </div>
              <span className="text-[0.7rem] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default LiveDJsSection;
