import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { isNative } from '@/lib/capacitor';
import IosInstallSheet from '@/components/IosInstallSheet';

const DISMISS_KEY = 'xpeak_install_appbar_dismissed';

/**
 * Barra de instalación global, visible en cualquier página (a diferencia de
 * InstallPwaBanner, que solo vive en el feed /descubrir para ocultar la UI
 * del navegador). Comparte la detección de plataforma vía useInstallPrompt
 * pero es su propio componente porque posición, copy y clave de dismiss son
 * distintos.
 */
export default function InstallAppBar() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');
  const [showIosSteps, setShowIosSteps] = useState(false);
  const { platform, iosBrowser, isStandalone, canPromptInstall, promptInstall } = useInstallPrompt();
  const { pathname } = useLocation();

  // Dentro de la app Capacitor ya estás "instalado" — no tiene sentido
  // ofrecer instalar lo que ya es la app nativa. En /auth se oculta porque,
  // en móvil, se apila con el banner de cookies y deja el formulario de
  // registro casi sin hueco visible (bajón de altas verificado 10 oct 2026).
  if (isNative || isStandalone || dismissed || pathname.startsWith('/auth')) return null;
  // Nada que ofrecer: ni prompt nativo disponible ni instrucciones de iOS.
  if (!canPromptInstall && platform !== 'ios') return null;

  const dismiss = () => { setDismissed(true); localStorage.setItem(DISMISS_KEY, '1'); };

  const handleInstall = async () => {
    if (platform === 'ios') { setShowIosSteps(true); return; }
    await promptInstall();
    dismiss();
  };

  const isDesktop = !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const copy = isDesktop
    ? 'instálala como app de escritorio, con acceso directo y sin pestaña de navegador.'
    : 'pantalla completa, sin barra del navegador, como una app.';

  return (
    <div className="sticky top-0 z-[70] w-full"
      style={{
        background: 'linear-gradient(90deg,#D4AF37,#B8941E)',
        color: '#000',
      }}>
      <div className="flex items-center justify-center gap-3 px-4 py-2 text-center">
        <p className="text-xs font-bold leading-snug">
          Instala XPEAK: {copy}
        </p>
        <button onClick={handleInstall}
          className="flex-shrink-0 px-3 py-1 rounded-lg text-xs font-black bg-black/85 text-white animate-pulse hover:opacity-80 hover:animate-none">
          Instalar
        </button>
        <button onClick={dismiss} aria-label="Cerrar" className="flex-shrink-0 p-1 transition-opacity hover:opacity-70">
          <X size={14} />
        </button>
      </div>
      {showIosSteps && <IosInstallSheet browser={iosBrowser} onClose={() => setShowIosSteps(false)} />}
    </div>
  );
}
