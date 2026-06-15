import { useState, useEffect } from 'react';
import { Lock, Music2, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { parseStreamUrl } from '@/lib/streaming';

interface Session {
  id: string;
  title: string;
  url: string;
  description: string | null;
}

interface Props {
  profileId: string;       // profile.id (UUID)
  professionalName: string;
  accentColor: string;
}

const FanClubSessionsViewer = ({ profileId, professionalName, accentColor }: Props) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Check subscription
  useEffect(() => {
    if (!user) { setSubLoading(false); return; }
    supabase
      .from('fan_subscriptions' as any)
      .select('id')
      .eq('fan_id', user.id)
      .eq('professional_profile_id', profileId)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data }) => { setIsSubscribed(!!data); setSubLoading(false); });
  }, [user, profileId]);

  // Load sessions
  useEffect(() => {
    supabase
      .from('fan_club_sessions' as any)
      .select('id, title, url, description')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setSessions((data as Session[]) ?? []); setSessionsLoading(false); });
  }, [profileId]);

  const handleSubscribe = () => {
    toast.info('Fan Club · Próximamente', {
      description: `La monetización del Fan Club de ${professionalName} estará disponible pronto.`,
    });
  };

  if (sessionsLoading || subLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-xs text-muted-foreground animate-pulse">Cargando contenido exclusivo...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="py-8 flex flex-col items-center gap-3 text-center">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}25` }}>
          <Music2 size={20} style={{ color: `${accentColor}80` }} />
        </div>
        <p className="text-sm font-bold" style={{ color: 'rgba(22,20,18,0.65)' }}>
          Sin sesiones exclusivas todavía
        </p>
        <p className="text-xs text-muted-foreground max-w-[220px]">
          {professionalName} aún no ha publicado contenido para el Fan Club.
        </p>
      </div>
    );
  }

  // Locked state — not a subscriber
  if (!isSubscribed) {
    const teaser = sessions[0];
    const parsed = teaser ? parseStreamUrl(teaser.url) : null;

    return (
      <div className="space-y-4">
        {/* Teaser — blurred first session */}
        {teaser && (
          <div className="relative rounded-xl overflow-hidden" style={{ border: `1px solid ${accentColor}20` }}>
            <div className="p-4 pb-2">
              <p className="text-xs font-bold truncate" style={{ color: 'rgba(22,20,18,0.55)' }}>{teaser.title}</p>
            </div>
            {parsed && (
              <div className="relative" style={{ height: 80 }}>
                <iframe src={parsed.embedUrl} className="w-full h-full" style={{ border: 'none', filter: 'blur(4px)', pointerEvents: 'none' }}
                  allow="autoplay" sandbox="allow-scripts allow-same-origin" title={teaser.title} />
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
              </div>
            )}
            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}35` }}>
                <Lock size={16} style={{ color: accentColor }} />
              </div>
              <p className="text-xs font-bold" style={{ color: accentColor }}>Fan Club Exclusivo</p>
            </div>
          </div>
        )}

        {/* Session count teaser */}
        <div className="rounded-xl p-4 text-center space-y-3"
          style={{ background: `${accentColor}06`, border: `1px solid ${accentColor}18` }}>
          <p className="text-sm font-bold">
            {sessions.length} {sessions.length === 1 ? 'sesión exclusiva' : 'sesiones exclusivas'}
          </p>
          <p className="text-xs text-muted-foreground">
            Suscríbete al Fan Club de {professionalName} para acceder a todo el contenido exclusivo.
          </p>
          <button
            type="button"
            onClick={handleSubscribe}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: `linear-gradient(90deg,${accentColor},#B8941E)`, color: '#000' }}>
            <Heart size={13} /> Unirse al Fan Club
          </button>
        </div>
      </div>
    );
  }

  // Subscribed — full access
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-black px-2 py-0.5 rounded-full"
          style={{ background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}30` }}>
          <Heart size={9} className="inline mr-1" fill={accentColor} />FAN EXCLUSIVO
        </span>
        <span className="text-xs text-muted-foreground">{sessions.length} sesiones</span>
      </div>

      {sessions.map(s => {
        const parsed = parseStreamUrl(s.url);
        const isOpen = expanded === s.id;
        return (
          <div key={s.id} className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${accentColor}15` }}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : s.id)}
              className="w-full flex items-center justify-between gap-3 p-3 text-left transition-all hover:opacity-80">
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{s.title}</p>
                {s.description && <p className="text-xs text-muted-foreground truncate mt-0.5">{s.description}</p>}
              </div>
              {isOpen ? <ChevronUp size={14} style={{ flexShrink: 0, color: 'rgba(22,20,18,0.65)' }} />
                : <ChevronDown size={14} style={{ flexShrink: 0, color: 'rgba(22,20,18,0.65)' }} />}
            </button>
            {isOpen && parsed && (
              <div style={{ height: 120 }}>
                <iframe src={parsed.embedUrl} className="w-full h-full" style={{ border: 'none' }}
                  allow="autoplay" sandbox="allow-scripts allow-same-origin" title={s.title} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FanClubSessionsViewer;
