import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_KEY = 'xpeak-cookie-consent';

interface CookiePrefs {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const CATEGORIES = [
  {
    key: 'necessary' as const,
    label: 'Necesarias',
    desc: 'Imprescindibles para el funcionamiento de la plataforma (sesión, autenticación). No se pueden desactivar.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    label: 'Analítica',
    desc: 'Nos ayudan a entender cómo usas XPEAK para mejorar la experiencia (datos anónimos).',
    locked: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing',
    desc: 'Permiten mostrar contenido y ofertas relevantes según tus intereses dentro de la plataforma.',
    locked: false,
  },
  {
    key: 'personalization' as const,
    label: 'Personalización',
    desc: 'Recuerdan tus preferencias de idioma, zona y configuración entre sesiones.',
    locked: false,
  },
];

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({ necessary: true, analytics: false, marketing: false, personalization: false });

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const save = (p: CookiePrefs) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(p));
    setVisible(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true, personalization: true });
  const rejectAll = () => save({ necessary: true, analytics: false, marketing: false, personalization: false });
  const saveCustom = () => save(prefs);

  const toggle = (key: keyof Omit<CookiePrefs, 'necessary'>) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] max-w-xl mx-auto"
        >
          <div style={{
            background: 'rgba(8,8,8,0.97)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 16,
            boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
          }}>
            {/* Header */}
            <div className="flex items-start gap-3 p-5 pb-3">
              <Cookie size={18} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1">
                <p className="text-sm font-bold mb-1">Preferencias de cookies</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Usamos cookies propias y de terceros para mejorar tu experiencia y mostrarte contenido relevante.{' '}
                  <Link to="/cookies" className="underline font-medium" style={{ color: '#D4AF37' }}>Política de cookies</Link>
                </p>
              </div>
              <button onClick={rejectAll} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 flex-shrink-0">
                <X size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
            </div>

            {/* Expandable categories */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-3 space-y-2.5">
                    {CATEGORIES.map(cat => (
                      <div key={cat.key} className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex-1">
                          <p className="text-xs font-bold mb-0.5">{cat.label}</p>
                          <p className="text-[0.65rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{cat.desc}</p>
                        </div>
                        {cat.locked ? (
                          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-md mt-0.5 flex-shrink-0"
                            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                            Siempre activa
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggle(cat.key as keyof Omit<CookiePrefs, 'necessary'>)}
                            className="relative flex-shrink-0 mt-0.5 w-9 h-5 rounded-full transition-all duration-200"
                            style={{
                              background: prefs[cat.key as keyof CookiePrefs] ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(255,255,255,0.1)',
                            }}
                          >
                            <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                              style={{ left: prefs[cat.key as keyof CookiePrefs] ? 'calc(100% - 18px)' : 2 }} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="p-4 pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setExpanded(e => !e)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/5 sm:w-auto"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
              >
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {expanded ? 'Guardar selección' : 'Personalizar'}
              </button>
              {expanded && (
                <button type="button" onClick={saveCustom}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                  Guardar selección
                </button>
              )}
              <button type="button" onClick={rejectAll}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                Solo necesarias
              </button>
              <button type="button" onClick={acceptAll}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                Aceptar todas
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
