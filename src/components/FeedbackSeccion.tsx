import { useState } from 'react';
import FeedbackWebForm from '@/components/FeedbackWebForm';

// Feedback siempre a mano: quien necesite algo de nosotros lo dice aquí sin
// buscar un enlace. Mismo formulario y misma tabla que la tarjeta del panel; si
// lo envía aquí, la tarjeta ya no vuelve a salir.
export default function FeedbackSeccion({ rol, className = 'mt-8' }: { rol?: string | null; className?: string }) {
  const [enviado, setEnviado] = useState(false);
  return (
    <section id="feedback" className={`rounded-2xl p-5 scroll-mt-4 ${className}`}
      style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' }}>
      {enviado ? (
        <p className="text-sm font-bold" style={{ color: '#111' }}>Gracias, lo leemos todo.</p>
      ) : (
        <>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] mb-1" style={{ color: '#7A6216' }}>
            ¿Necesitas algo de nosotros?
          </p>
          <FeedbackWebForm momento="recursos" rol={rol}
            onEnviado={() => {
              setEnviado(true);
              try { localStorage.setItem('xpeak_fb_hecho', '1'); } catch { /* sin almacenamiento */ }
            }} />
        </>
      )}
    </section>
  );
}
