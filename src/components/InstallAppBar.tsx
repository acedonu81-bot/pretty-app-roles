import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { isNative } from '@/lib/capacitor';
import IosInstallSheet from '@/components/IosInstallSheet';

const DISMISS_KEY = 'xpeak_install_appbar_dismissed';
// Visitas (una por sesión del navegador): la barra sale desde la segunda.
// En la primera visita en móvil se juntaba con el aviso de cookies y la
// cabecera y tapaba casi un tercio de la pantalla (auditoría 15 oct 2026).
const VISITAS_KEY = 'xpeak_visitas';
const VISITA_SESION_KEY = 'xpeak_visita_contada';

function esVisitaRepetida(): boolean {
  try {
    let n = parseInt(localStorage.getItem(VISITAS_KEY) ?? '0', 10) || 0;
    if (!sessionStorage.getItem(VISITA_SESION_KEY)) {
      n += 1;
      localStorage.setItem(VISITAS_KEY, String(n));
      sessionStorage.setItem(VISITA_SESION_KEY, '1');
    }
    return n >= 2;
  } catch {
    return true;
  }
}

/**
 * Barra de instalación global, visible en cualquier página (a diferencia de
 * InstallPwaBanner, que solo vive en el feed /descubrir para ocultar la UI
 * del navegador). Comparte la detección de plataforma vía useInstallPrompt
 * pero es su propio componente porque posición, copy y clave de dismiss son
 * distintos.
 */
export default function InstallAppBar() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');
  const [visitaRepetida] = useState(esVisitaRepetida);
  const [showIosSteps, setShowIosSteps] = useState(false);
  const { platform, iosBrowser, isStandalone, canPromptInstall, promptInstall } = useInstallPrompt();
  const { pathname } = useLocation();
  const barRef = useRef<HTMLDivElement>(null);

  // Dentro de la app Capacitor ya estás "instalado" — no tiene sentido
  // ofrecer instalar lo que ya es la app nativa. En /auth se oculta porque,
  // en móvil, se apila con el banner de cookies y deja el formulario de
  // registro casi sin hueco visible (bajón de altas verificado 10 oct 2026).
  // Tampoco sale si no hay nada que ofrecer: ni prompt nativo ni iOS.
  // Tampoco en /baja-emails (20 oct 2026): quien llega ahí a darse de baja no quiere instalar nada.
  const oculta = isNative || isStandalone || dismissed || !visitaRepetida || pathname.startsWith('/auth') || pathname.startsWith('/baja-emails')
    || (!canPromptInstall && platform !== 'ios');
  // En iPhone/iPad la barra se sabe desde el primer render (no espera a
  // 'beforeinstallprompt'), así que va en el flujo sin provocar salto. Fija
  // encima tapaba la cabecera de la portada (logo, Acceder, Descubrir), el
  // "Volver" del resto de páginas y la topbar del panel (auditoría 15 oct
  // 2026). En Android y escritorio el aviso llega 1-2 s tarde y sigue fija.
  const enFlujo = !oculta && platform === 'ios';

  // El panel ocupa justo el alto de la pantalla (.dvh-screen): con la barra
  // en el flujo se le resta su altura para que no aparezca scroll de más.
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!enFlujo || !el) return;
    const raiz = document.documentElement;
    const medir = () => raiz.style.setProperty('--install-bar-h', `${el.offsetHeight}px`);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => { ro.disconnect(); raiz.style.removeProperty('--install-bar-h'); };
  }, [enFlujo]);

  if (oculta) return null;

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
    // Fuera de iOS va encima del contenido (fixed), no en el flujo: el aviso
    // de instalación del navegador llega 1-2 s después de cargar y, al
    // aparecer, empujaba toda la página 60 px hacia abajo (CLS 0,19 en la del
    // Concurso DJ, auditoría 13 oct 2026). La entrada deslizando no cuenta
    // como salto.
    <div ref={barRef} className={`${enFlujo ? 'relative' : 'fixed top-0 inset-x-0 motion-safe:animate-[installBarIn_0.35s_ease-out]'} z-[70] w-full`}
      style={{
        background: 'linear-gradient(90deg,#D4AF37,#B8941E)',
        color: '#000',
        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
      }}>
      <style>{'@keyframes installBarIn{from{transform:translateY(-100%)}to{transform:translateY(0)}}'}</style>
      <div className="flex items-center justify-center gap-3 px-4 py-2 text-center">
        <p className="text-xs font-bold leading-snug">
          Instala XPEAK: {copy}
        </p>
        <button onClick={handleInstall}
          className="flex-shrink-0 px-3.5 min-h-[36px] rounded-lg text-xs font-black bg-black/85 text-white animate-pulse hover:opacity-80 hover:animate-none">
          Instalar
        </button>
        <button onClick={dismiss} aria-label="Cerrar" className="flex-shrink-0 -mr-2 w-10 h-10 flex items-center justify-center rounded-lg transition-opacity hover:opacity-70">
          <X size={16} />
        </button>
      </div>
      {showIosSteps && <IosInstallSheet browser={iosBrowser} onClose={() => setShowIosSteps(false)} />}
    </div>
  );
}
