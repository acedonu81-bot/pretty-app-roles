import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cookie, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_KEY = 'xpeak-cookie-consent';
// Lo deja Auth.tsx al registrarse sin píxel de Meta cargado.
export const REGISTRO_PENDIENTE_META = 'xpeak-registro-pendiente-meta';

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
    desc: 'Google Analytics y Microsoft Clarity: páginas vistas, origen de la visita y grabación de cómo navegas (clics y desplazamiento, sin el texto que escribes) para detectar fallos y mejorar la web.',
    locked: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing',
    desc: 'Píxel de Meta: mide si nuestras campañas de Instagram y Facebook traen visitas y registros.',
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
  // En /auth no se muestra (12 oct 2026): la mitad del tráfico del anuncio de
  // Instagram se iba en menos de 3 s con el aviso tapando el tercio inferior
  // del formulario. Se pide después del alta, en la siguiente pantalla. Es
  // legal porque en /auth no se carga nada opcional sin consentimiento: el
  // píxel de Meta, GA4 y Clarity siguen esperando a que acepte.
  const { pathname } = useLocation();
  const enRegistro = pathname.startsWith('/auth');
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

  // Meta Pixel solo se carga en index.html si xpeak-cookie-consent YA tenía
  // marketing:true en el arranque diferido inicial. Si el usuario acepta
  // "Marketing" después (aquí, tras ver el banner), hay que cargarlo bajo
  // demanda — si no, aceptar la casilla no tendría ningún efecto hasta
  // recargar la página.
  const cargarMetaPixelSiHaceFalta = () => {
    if ((window as any).fbq) return;
    const f = window as any, b = document, e = 'script', v = 'https://connect.facebook.net/en_US/fbevents.js';
    let n: any, t: any, s: any;
    if (f.fbq) return;
    n = f.fbq = function (...args: unknown[]) { n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode?.insertBefore(t, s);
    n('init', '2436920620126360');
    n('track', 'PageView');
  };

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
    if (p.marketing) {
      cargarMetaPixelSiHaceFalta();
      // El alta se hizo sin píxel (el aviso ya no sale en /auth): se le
      // cuenta a Meta ahora que ha aceptado. Ver REGISTRO_PENDIENTE_META.
      try {
        if (sessionStorage.getItem(REGISTRO_PENDIENTE_META)) {
          (window as any).fbq?.('track', 'CompleteRegistration');
          sessionStorage.removeItem(REGISTRO_PENDIENTE_META);
        }
      } catch { /* sessionStorage bloqueado: sin efecto */ }
    }
    // Carga Clarity si hace falta y le pasa el consentimiento (también al
    // rechazar, para que no grabe si GTM ya lo había cargado). Ver index.html.
    (window as any).__xpeakClarity?.(p);
    setVisible(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true, personalization: true });
  const rejectAll = () => save({ necessary: true, analytics: false, marketing: false, personalization: false });
  const saveCustom = () => save(prefs);

  const toggle = (key: keyof Omit<CookiePrefs, 'necessary'>) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }));

  // Dentro del panel en móvil va encima de la barra inferior (Inicio, Flash,
  // Chat, Perfil) para que se pueda seguir navegando mientras se decide.
  const enPanel = pathname.startsWith('/dashboard');

  // Compacto (auditoría 15 oct 2026): en móvil tapaba el 18-20 % de la
  // pantalla y, en la portada, justo las tres opciones de "¿Qué quieres
  // hacer?". Ahora una frase y una fila de botones. Rechazar y Aceptar van
  // del mismo tamaño y en la misma capa (guía de cookies de la AEPD).
  return (
    <AnimatePresence>
      {visible && !enRegistro && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 200 }}
          className={`fixed left-3 right-3 z-[9999] max-w-xl mx-auto ${enPanel
            ? 'bottom-[calc(var(--mobile-nav-space)+var(--reproductor-h,0px)+0.5rem)] md:bottom-[max(1rem,calc(var(--sab)+var(--reproductor-h,0px)))]'
            : 'bottom-[max(0.75rem,calc(var(--sab)+var(--reproductor-h,0px)))]'}`}
        >
          <div style={{
            background: 'rgba(255,253,247,0.98)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: 16,
            boxShadow: '0 -8px 40px rgba(122,98,22,0.18)'}}>
            <div className="flex items-start gap-2.5 px-4 pt-3 pb-2">
              <Cookie size={16} style={{ color: '#8B6A00', flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs leading-snug" style={{ color: '#374151' }}>
                Usamos cookies para que XPEAK funcione y, si aceptas, para medir y mejorar.{' '}
                <Link to="/cookies" className="underline font-semibold" style={{ color: '#8B6A00' }}>Más información</Link>
              </p>
            </div>

            {/* Categorías al pulsar "Configurar" */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-2 space-y-2 max-h-[45vh] overflow-y-auto">
                    {CATEGORIES.map(cat => (
                      <div key={cat.key} className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,0.16)' }}>
                        <div className="flex-1">
                          <p className="text-xs font-bold mb-0.5">{cat.label}</p>
                          <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{cat.desc}</p>
                        </div>
                        {cat.locked ? (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md mt-0.5 flex-shrink-0"
                            style={{ background: 'rgba(212,175,55,0.1)', color: '#8B6A00', border: '1px solid rgba(212,175,55,0.25)' }}>
                            Siempre activa
                          </span>
                        ) : (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={!!prefs[cat.key as keyof CookiePrefs]}
                            aria-label={cat.label}
                            onClick={() => toggle(cat.key as keyof Omit<CookiePrefs, 'necessary'>)}
                            className="relative flex-shrink-0 mt-0.5 w-11 h-6 rounded-full transition-all duration-200"
                            style={{
                              background: prefs[cat.key as keyof CookiePrefs] ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : '#E8DFC4'}}
                          >
                            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                              style={{ left: prefs[cat.key as keyof CookiePrefs] ? 'calc(100% - 22px)' : 2 }} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="px-3 pb-3 pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded(e => !e)}
                aria-expanded={expanded}
                className="flex items-center justify-center gap-0.5 px-2 min-h-[40px] rounded-lg text-xs font-semibold transition-all hover:bg-black/5 flex-shrink-0"
                style={{ color: '#4b5563' }}
              >
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {expanded ? 'Cerrar' : 'Configurar'}
              </button>
              {expanded ? (
                <button type="button" onClick={saveCustom}
                  className="flex-1 min-h-[40px] rounded-lg text-xs font-bold transition-all"
                  style={{ background: '#FBF3DD', border: '1px solid rgba(139,106,0,0.35)', color: '#5c4600' }}>
                  Guardar
                </button>
              ) : (
                <button type="button" onClick={rejectAll}
                  className="flex-1 min-h-[40px] rounded-lg text-xs font-bold transition-all hover:bg-black/5"
                  style={{ background: '#ffffff', border: '1px solid rgba(139,106,0,0.35)', color: '#1f2937' }}>
                  Rechazar
                </button>
              )}
              <button type="button" onClick={acceptAll}
                className="flex-1 min-h-[40px] rounded-lg text-xs font-bold transition-all"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#111' }}>
                Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
