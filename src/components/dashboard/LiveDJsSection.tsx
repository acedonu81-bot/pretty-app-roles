import { useState, useEffect } from 'react';
import { Radio, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import GeometricAvatar from './GeometricAvatar';
import { parseStreamUrl } from '@/lib/streaming';

interface LiveProfile {
  id: string;
  display_name: string;
  role: string;
  stream_url: string | null;
  stream_title: string | null;
  zone: string | null;
}

const LiveDJsSection = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [liveDjs, setLiveDjs] = useState<LiveProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, role, stream_url, stream_title, zone')
        .eq('is_live', true)
        .limit(6);
      setLiveDjs((data as LiveProfile[]) ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || liveDjs.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#E53935' }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: '#E53935' }} />
          </span>
          <h3 className="text-lg font-bold">
            En <span className="text-gradient">Directo</span> Ahora
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">{liveDjs.length} profesional{liveDjs.length !== 1 ? 'es' : ''}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveDjs.map(dj => {
          const embed = dj.stream_url ? parseStreamUrl(dj.stream_url) : null;
          return (
            <div key={dj.id} className="glass-panel overflow-hidden rounded-xl cursor-pointer hover:border-primary/20 transition-all"
              onClick={onNavigate}>
              <div className="relative" style={{ height: 160, background: 'rgba(0,0,0,0.6)' }}>
                {embed ? (
                  <iframe src={embed.embedUrl} className="absolute inset-0 w-full h-full"
                    allowFullScreen allow="autoplay; encrypted-media; fullscreen"
                    style={{ border: 'none' }} title={dj.display_name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Radio size={32} className="text-muted-foreground opacity-30 animate-pulse" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                  <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"
                    style={{ background: '#E53935', color: '#fff' }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                    </span>
                    LIVE
                  </span>
                </div>
              </div>
              <div className="p-3 flex items-center gap-3">
                <GeometricAvatar role={dj.role as any} seed={dj.id.length} size={36} isLive />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{dj.display_name || 'DJ'}</p>
                  <p className="text-xs text-muted-foreground truncate">{dj.stream_title || dj.zone || 'En directo'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LiveDJsSection;
