import { Sparkles } from 'lucide-react';
import { useActivityFeed } from '@/hooks/useActivityFeed';

const ActivityFeedWidget = () => {
  const { items } = useActivityFeed();

  if (items.length === 0) return null;

  return (
    <div className="mx-4 md:mx-6 mt-4 rounded-xl px-4 py-3"
      style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={13} style={{ color: '#D4AF37' }} />
        <span className="text-xs font-black tracking-wider" style={{ color: '#D4AF37' }}>
          ACTIVIDAD RECIENTE
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.slice(0, 5).map(item => (
          <li key={item.id} className="text-xs" style={{ color: 'rgba(22,20,18,0.65)' }}>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeedWidget;
