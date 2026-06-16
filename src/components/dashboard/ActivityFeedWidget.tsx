import { Sparkles, MapPin, MessageCircle } from 'lucide-react';
import { useActivityFeed, ActivityItem } from '@/hooks/useActivityFeed';

const LANES = 2;
const MIN_DISPLAY = 6;

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
}

const ActivityFeedWidget = () => {
  const { items } = useActivityFeed();

  if (items.length === 0) return null;

  const displayCount = Math.max(items.length, MIN_DISPLAY);
  const displayItems: { item: ActivityItem; lane: number }[] = Array.from(
    { length: displayCount },
    (_, i) => ({ item: items[i % items.length], lane: i % LANES }),
  );

  return (
    <div className="mx-4 md:mx-6 mt-4 rounded-xl px-4 py-3 overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} style={{ color: '#D4AF37' }} />
        <span className="text-xs font-black tracking-wider" style={{ color: '#D4AF37' }}>
          ACTIVIDAD RECIENTE
        </span>
      </div>
      <div className="relative h-[92px] overflow-hidden">
        {displayItems.map(({ item, lane }, i) => {
          const isNew = item.kind === 'signup' && minutesAgo(item.createdAt) < 15;
          return (
            <div
              key={`${item.id}-${i}`}
              className="absolute whitespace-nowrap flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                top: lane === 0 ? 2 : 48,
                left: '100%',
                background: '#f9f8f6',
                border: '1px solid rgba(0,0,0,0.06)',
                animation: `xpeakActivityTicker ${22 + (i % 3) * 4}s ${i * 3.2}s linear infinite`,
              }}
            >
              <div className="relative flex-shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: `${item.roleColor}22`, color: item.roleColor, border: `1px solid ${item.roleColor}55` }}>
                  {item.kind === 'contact' ? <MessageCircle size={11} /> : item.name.charAt(0).toUpperCase()}
                </div>
                {isNew && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{ background: '#22c55e', border: '1.5px solid #fff' }} />
                )}
              </div>

              {item.kind === 'contact' ? (
                <span className="text-xs font-bold" style={{ color: 'rgba(22,20,18,0.8)' }}>{item.text}</span>
              ) : (
                <>
                  <span className="text-xs font-bold" style={{ color: 'rgba(22,20,18,0.88)' }}>{item.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${item.roleColor}18`, color: item.roleColor }}>
                    {item.roleLabel}
                  </span>
                  {item.zone && (
                    <span className="text-[11px] flex items-center gap-0.5" style={{ color: 'rgba(22,20,18,0.4)' }}>
                      <MapPin size={9} /> {item.zone}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes xpeakActivityTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% - 100vw)); }
        }
      `}</style>
    </div>
  );
};

export default ActivityFeedWidget;
