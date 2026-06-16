import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <AnimatePresence initial={false}>
          {items.slice(0, 5).map(item => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs overflow-hidden"
              style={{ color: 'rgba(22,20,18,0.65)' }}
            >
              {item.text}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default ActivityFeedWidget;
