import { useEffect, useState } from 'react';
import { X, Share, PlusSquare } from 'lucide-react';

/**
 * Banner sutil para invitar a instalar XPEAK como PWA — solo tiene sentido en
 * el feed swipe (/descubrir), donde la barra de UI del navegador es la única
 * pieza que Instagram/TikTok no dejan ver y XPEAK sí. No hay forma de ocultar
 * esa barra desde una pestaña normal (restricción de seguridad del navegador,
 * no algo que el código pueda saltarse); instalada como PWA (manifest.json ya
 * tiene display:"standalone") sí desaparece del todo.
 *
 * iOS Safari no dispara "beforeinstallprompt" — solo Android/Chrome lo hace.
 * Por eso hay dos variantes: un botón nativo en Android, e instrucciones
 * manuales en iOS (mismo patrón ya usado en SettingsView para notificaciones).
 */
const DISMISS_KEY = 'xpeak_pwa_banner_dismissed';

export default function InstallPwaBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosSteps, setShowIosSteps] = useState(false);

  // Calculados una vez con inicializador lazy, no en cada render — mismo
  // patrón que `dismissed` arriba. El valor nunca cambia durante la vida del
  // componente (no hay evento que anuncie un cambio de user agent o de modo
  // de visualización), así que recalcularlo en cada render es solo trabajo
  // repetido, sin ganancia.
  const [isIOS] = useState(() => /iPad|iPhone|iPod/.test(navigator.userAgent));
  const [isStandalone] = useState(() =>
    ('standalone' in navigator && (navigator as any).standalone)
    || window.matchMedia('(display-mode: standalone)').matches);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isStandalone || dismissed) return null;
  // Solo mostrar si hay algo que ofrecer: prompt nativo de Android, o pasos de iOS.
  if (!deferredPrompt && !isIOS) return null;

  const dismiss = () => { setDismissed(true); localStorage.setItem(DISMISS_KEY, '1'); };

  const handleInstall = async () => {
    if (isIOS) { setShowIosSteps(true); return; }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  return (
    <div className="fixed left-3 right-3 z-[60] rounded-2xl overflow-hidden"
      style={{
        bottom: 'calc(1rem + env(safe-area-inset-bottom))',
        background: 'rgba(10,9,8,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,175,55,0.25)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      }}>
      {!showIosSteps ? (
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white">Instala XPEAK</p>
            <p className="text-[0.7rem] leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Pantalla completa, sin barra del navegador — como Instagram.
            </p>
          </div>
          <button onClick={handleInstall}
            className="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Instalar
          </button>
          <button onClick={dismiss} aria-label="Cerrar" className="flex-shrink-0 p-1 transition-opacity hover:opacity-70">
            <X size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>
      ) : (
        <div className="px-4 py-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-white">Añadir a pantalla de inicio</p>
            <button onClick={dismiss} aria-label="Cerrar" className="p-1 transition-opacity hover:opacity-70">
              <X size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
          </div>
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
            1. Toca <Share size={13} style={{ color: '#D4AF37' }} /> abajo en Safari
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
            2. Elige <PlusSquare size={13} style={{ color: '#D4AF37' }} /> "Añadir a pantalla de inicio"
          </p>
        </div>
      )}
    </div>
  );
}
