import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_KEY = 'xpeak-cookies-accepted';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
        >
          <div
            className="max-w-2xl mx-auto rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center gap-4 text-sm"
            style={{
              background: 'rgba(10,10,10,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 -4px 30px rgba(0,0,0,0.5)',
            }}
          >
            <Cookie size={20} style={{ color: '#D4AF37', flexShrink: 0 }} />
            <p className="text-muted-foreground text-xs leading-relaxed text-center sm:text-left flex-1">
              Utilizamos cookies técnicas para mantener tu sesión activa.{' '}
              <Link to="/cookies" className="font-bold underline" style={{ color: '#D4AF37' }}>
                Más información
              </Link>
            </p>
            <button
              onClick={accept}
              className="px-5 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 shrink-0"
              style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}
            >
              Aceptar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
