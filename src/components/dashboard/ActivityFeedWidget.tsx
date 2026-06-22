import { Sparkles, MapPin, MessageCircle } from 'lucide-react';
import { useActivityFeed, ActivityItem } from '@/hooks/useActivityFeed';

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
}

const Chip = ({ item }: { item: ActivityItem }) => {
  const isNew = item.kind === 'signup' && minutesAgo(item.createdAt) < 15;
  return (
    <div
      className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{ background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.06)' }}
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
        <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#444' }}>{item.text}</span>
      ) : (
        <>
          <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#222' }}>{item.name}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: `${item.roleColor}18`, color: item.roleColor }}>
            {item.roleLabel}
          </span>
          {item.zone && (
            <span className="text-[11px] flex items-center gap-0.5 whitespace-nowrap" style={{ color: '#333' }}>
              <MapPin size={9} /> {item.zone}
            </span>
          )}
        </>
      )}
    </div>
  );
};

// Carril de marquee continuo: los items se renderizan dos veces seguidas y el
// track se anima -50% de su propio ancho (= exactamente un juego de items),
// creando un loop perfecto sin huecos. El keyframe está en index.css global
// para que los re-renders de React no invaliden la animación en curso.
const Lane = ({ items, durationSeconds }: { items: ActivityItem[]; durationSeconds: number }) => {
  if (items.length === 0) return null;
  return (
    <div className="overflow-hidden h-11">
      <div
        className="flex items-center gap-3 will-change-transform"
        style={{
          width: 'max-content',
          animation: `xpeakActivityTicker ${durationSeconds}s linear infinite`,
        }}
      >
        {items.map((item, i) => <Chip key={`a-${item.id}-${i}`} item={item} />)}
        {items.map((item, i) => <Chip key={`b-${item.id}-${i}`} item={item} />)}
      </div>
    </div>
  );
};

const ActivityFeedWidget = () => {
  const { items } = useActivityFeed();

  if (items.length === 0) return null;

  const laneA = items.filter((_, i) => i % 2 === 0);
  const laneB = items.filter((_, i) => i % 2 === 1);

  return (
    <div className="mx-4 md:mx-6 mt-4 rounded-xl px-4 py-3 overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} style={{ color: '#D4AF37' }} />
        <span className="text-xs font-black tracking-wider" style={{ color: '#D4AF37' }}>
          ACTIVIDAD RECIENTE
        </span>
      </div>
      {items.length <= 4 ? (
        <div className="flex flex-wrap gap-2">
          {items.map(item => <Chip key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Lane items={laneA} durationSeconds={Math.max(20, laneA.length * 7)} />
          {laneB.length > 0 && <Lane items={laneB} durationSeconds={Math.max(20, laneB.length * 7)} />}
        </div>
      )}
    </div>
  );
};

export default ActivityFeedWidget;
