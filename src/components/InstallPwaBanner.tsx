import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import IosInstallSheet from '@/components/IosInstallSheet';

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

// `bottomOffset`: hueco que deja por debajo. En /descubrir hay una barra fija
// abajo (acciones del perfil o "Crear cuenta y contactar") y la banda quedaba
// tapada por ella (auditoría 15 oct 2026).
export default function InstallPwaBanner({ bottomOffset = '1rem' }: { bottomOffset?: string } = {}) {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');
  const [showIosSteps, setShowIosSteps] = useState(false);
  const { platform, iosBrowser, isStandalone, canPromptInstall, promptInstall } = useInstallPrompt();
  const isIOS = platform === 'ios';

  // El banner es `fixed` con z-60 sobre el feed, y los CTAs de cada tarjeta
  // ("Ver perfil" / "Contactar") viven pegados abajo con z-20: sin esto el
  // banner los tapaba por completo y el toque lo recibía el banner, no el
  // botón — los dos únicos CTAs del feed quedaban muertos hasta cerrarlo.
  // Publicamos su altura real para que el contenido de debajo se aparte, y la
  // limpiamos al desmontar o al cerrarlo.
  const bannerRef = useRef<HTMLDivElement>(null);
  const visible = !isStandalone && !dismissed && (canPromptInstall || isIOS);
  useEffect(() => {
    const root = document.documentElement;
    if (!visible) { root.style.removeProperty('--install-banner-space'); return; }
    const el = bannerRef.current;
    if (!el) return;
    const apply = () => root.style.setProperty('--install-banner-space', `${el.offsetHeight + 12}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => { ro.disconnect(); root.style.removeProperty('--install-banner-space'); };
  }, [visible]);

  if (isStandalone || dismissed) return null;
  // Solo mostrar si hay algo que ofrecer: prompt nativo de Android, o pasos de iOS.
  if (!canPromptInstall && !isIOS) return null;

  const dismiss = () => { setDismissed(true); localStorage.setItem(DISMISS_KEY, '1'); };

  const handleInstall = async () => {
    if (isIOS) { setShowIosSteps(true); return; }
    await promptInstall();
    dismiss();
  };

  return (
    <div ref={bannerRef} className="fixed left-3 right-3 z-[60] rounded-2xl overflow-hidden"
      style={{
        bottom: `calc(${bottomOffset} + env(safe-area-inset-bottom))`,
        background: 'rgba(255,253,247,0.97)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,175,55,0.45)',
        boxShadow: '0 8px 30px rgba(122,98,22,0.22)',
      }}>
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black" style={{ color: '#111' }}>Instala XPEAK</p>
          <p className="text-[0.75rem] leading-snug" style={{ color: '#4b5563' }}>
            Pantalla completa, sin barra del navegador, como Instagram.
          </p>
        </div>
        <button onClick={handleInstall}
          className="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-black transition-all hover:scale-105"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#111' }}>
          Instalar
        </button>
        <button onClick={dismiss} aria-label="Cerrar" className="flex-shrink-0 -mr-2 w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-70">
          <X size={16} style={{ color: '#4b5563' }} />
        </button>
      </div>
      {showIosSteps && <IosInstallSheet browser={iosBrowser} onClose={() => setShowIosSteps(false)} />}
    </div>
  );
}
