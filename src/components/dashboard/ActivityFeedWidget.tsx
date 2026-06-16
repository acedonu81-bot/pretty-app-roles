import { Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivityFeed } from '@/hooks/useActivityFeed';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

const ActivityFeedWidget = () => {
  const { items } = useActivityFeed();

  if (items.length === 0) return null;

  return (
    <div className="mx-4 md:mx-6 mt-4 rounded-xl px-4 py-3"
      style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} style={{ color: '#D4AF37' }} />
        <span className="text-xs font-black tracking-wider" style={{ color: '#D4AF37' }}>
          ACTIVIDAD RECIENTE
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.slice(0, 5).map(item => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                style={{ background: `${item.roleColor}22`, color: item.roleColor, border: `1px solid ${item.roleColor}55` }}>
                {item.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: 'rgba(22,20,18,0.88)' }}>
                  {item.name}
                  <span className="font-semibold ml-1" style={{ color: item.roleColor }}>· {item.roleLabel}</span>
                </p>
                <p className="text-[11px] flex items-center gap-1" style={{ color: 'rgba(22,20,18,0.4)' }}>
                  {item.zone && (
                    <span className="flex items-center gap-0.5"><MapPin size={9} /> {item.zone}</span>
                  )}
                  <span>{item.zone ? '· ' : ''}{timeAgo(item.createdAt)}</span>
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default ActivityFeedWidget;
