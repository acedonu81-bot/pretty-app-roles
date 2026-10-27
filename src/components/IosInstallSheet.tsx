import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, Share, PlusSquare, MoreHorizontal, Compass, Copy, Check } from 'lucide-react';
import type { IosBrowser } from '@/hooks/useInstallPrompt';

/**
 * Hoja inferior con los pasos para instalar XPEAK en iPhone/iPad. iOS no
 * tiene botón de instalar programable: el usuario tiene que hacerlo a mano,
 * y dónde está "Compartir" depende del navegador. Dentro de apps (Google,
 * Instagram, TikTok…) ni siquiera existe la opción, así que ahí se le pide
 * que abra la web en Safari y se le deja copiar el enlace.
 *
 * z-[10000]: por encima del aviso de cookies (z-[9999]); con menos, el aviso tapaba
 * los últimos pasos y el botón de copiar el enlace (grabación de Clarity, 27 oct).
 * Va en portal a <body>: InstallPwaBanner usa backdrop-filter, que convierte
 * al banner en el contenedor de los `fixed` de dentro y encerraría la hoja.
 */
interface Props {
  browser: IosBrowser;
  onClose: () => void;
}

const GOLD_TEXT = '#7a6216';

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
        style={{ background: '#D4AF37', color: '#111' }}>
        {n}
      </span>
      <span className="text-sm leading-snug pt-0.5" style={{ color: '#222' }}>{children}</span>
    </li>
  );
}

const Icon = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex align-middle mx-0.5" style={{ color: GOLD_TEXT }}>{children}</span>
);

export default function IosInstallSheet({ browser, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch { /* sin permiso de portapapeles: el usuario aún tiene los pasos */ }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-end justify-center" role="dialog" aria-modal="true"
      aria-label="Cómo instalar XPEAK" onClick={onClose}
      style={{ background: 'rgba(17,17,17,0.45)' }}>
      <div className="w-full max-w-md rounded-t-3xl px-5 pt-5"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg,#FFFDF7,#FBF3DD)',
          paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.18)',
        }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-base font-black" style={{ color: '#111' }}>
              {browser === 'inapp' ? 'Ábrela en Safari para instalarla' : 'Instala XPEAK en tu iPhone'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#4b5563' }}>
              {browser === 'inapp'
                ? 'Estás en el navegador de otra app, y desde aquí iPhone no deja instalar.'
                : 'Pantalla completa, sin barra del navegador, como una app.'}
            </p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="flex-shrink-0 p-1 transition-opacity hover:opacity-70">
            <X size={18} style={{ color: '#4b5563' }} />
          </button>
        </div>

        <ol className="space-y-3">
          {browser === 'safari' && (
            <>
              <Step n={1}>
                Toca <Icon><Share size={16} /></Icon> <b>Compartir</b> en la barra de Safari.
                Si no lo ves, toca <Icon><MoreHorizontal size={16} /></Icon> y luego <b>Compartir</b>.
              </Step>
              <Step n={2}>
                Baja y elige <Icon><PlusSquare size={16} /></Icon> <b>Añadir a pantalla de inicio</b>.
              </Step>
              <Step n={3}>Toca <b>Añadir</b> arriba a la derecha.</Step>
            </>
          )}
          {browser === 'chrome' && (
            <>
              <Step n={1}>
                Toca <Icon><Share size={16} /></Icon> <b>Compartir</b>, arriba a la derecha junto a la dirección.
              </Step>
              <Step n={2}>
                Elige <Icon><PlusSquare size={16} /></Icon> <b>Añadir a pantalla de inicio</b>
                {' '}(si no aparece, toca <b>Más</b>).
              </Step>
              <Step n={3}>Toca <b>Añadir</b>.</Step>
            </>
          )}
          {browser === 'inapp' && (
            <>
              <Step n={1}>
                Toca <Icon><MoreHorizontal size={16} /></Icon> o <Icon><Share size={16} /></Icon> en la barra de esta ventana.
              </Step>
              <Step n={2}>
                Elige <Icon><Compass size={16} /></Icon> <b>Abrir en Safari</b> (o "Abrir en el navegador").
              </Step>
              <Step n={3}>
                En Safari, toca <b>Compartir</b> y luego <b>Añadir a pantalla de inicio</b>.
              </Step>
            </>
          )}
        </ol>

        {browser === 'inapp' && (
          <button onClick={copyLink}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#111' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Enlace copiado: pégalo en Safari' : 'Copiar enlace para Safari'}
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
