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
    if (localStorage.getItem(COOKIE_KEY)) return;
    // Show after scroll past the hero, or after 6s — whichever comes first
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setVisible(true);
    };
    const onScroll = () => { if (window.scrollY > window.innerHeight * 0.6) fire(); };
    const t = setTimeout(fire, 1500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  const save = (p: CookiePrefs) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(p));
    // Sin este update, GTM/GA4 sigue en "denied" (el default de index.html) y
    // descarta los hits en silencio aunque la etiqueta se dispare con 200/204.
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = (window as any).gtag || function () { (window as any).dataLayer.push(arguments); };
    (window as any).gtag('consent', 'update', {
      ad_storage: p.marketing ? 'granted' : 'denied',
      ad_user_data: p.marketing ? 'granted' : 'denied',
      ad_personalization: p.marketing ? 'granted' : 'denied',
      analytics_storage: p.analytics ? 'granted' : 'denied',
    });
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
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Usamos cookies propias para mejorar tu experiencia. Las cookies técnicas son necesarias para el funcionamiento de la plataforma.{' '}
                  <Link to="/cookies" className="underline font-medium" style={{ color: '#D4AF37' }}>Política de cookies</Link>
                </p>
              </div>
              <button onClick={rejectAll} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 flex-shrink-0">
                <X size={13} style={{ color: 'rgba(255,255,255,0.6)' }} />
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
                          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{cat.desc}</p>
                        </div>
                        {cat.locked ? (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md mt-0.5 flex-shrink-0"
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
            <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExpanded(e => !e)}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', minWidth: 0, flex: '0 0 auto' }}
                >
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {expanded ? 'Cerrar' : 'Personalizar'}
                </button>
                {expanded && (
                  <button type="button" onClick={saveCustom}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                    Guardar
                  </button>
                )}
                <button type="button" onClick={rejectAll}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  Solo necesarias
                </button>
              </div>
              <button type="button" onClick={acceptAll}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
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
