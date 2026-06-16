import { Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivityFeed } from '@/hooks/useActivityFeed';

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
}

function timeAgo(mins: number): string {
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
          {items.slice(0, 5).map(item => {
            const mins = minutesAgo(item.createdAt);
            const isNew = mins < 15;
            const metaParts = [
              item.zone ?? null,
              timeAgo(mins),
            ].filter(Boolean);

            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2.5 overflow-hidden"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: `${item.roleColor}22`, color: item.roleColor, border: `1px solid ${item.roleColor}55` }}>
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  {isNew && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                      style={{ background: '#22c55e', border: '1.5px solid #fff' }}>
                      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#22c55e' }} />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: 'rgba(22,20,18,0.88)' }}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${item.roleColor}18`, color: item.roleColor }}>
                      {item.roleLabel}
                    </span>
                    <p className="text-[11px] truncate flex items-center gap-1" style={{ color: 'rgba(22,20,18,0.4)' }}>
                      {item.zone && <MapPin size={9} className="flex-shrink-0" />}
                      {metaParts.join(' · ')}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default ActivityFeedWidget;
