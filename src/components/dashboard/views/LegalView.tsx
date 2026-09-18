import { PrivacidadContent } from './legalContent/PrivacidadContent';
import { TerminosContent } from './legalContent/TerminosContent';
import { CookiesContent } from './legalContent/CookiesContent';
import { EliminarCuentaContent } from './legalContent/EliminarCuentaContent';
import { SoporteContent } from './legalContent/SoporteContent';

interface LegalViewProps {
  document: 'privacidad' | 'terminos' | 'cookies' | 'eliminar-cuenta' | 'soporte';
}

const TITLES: Record<LegalViewProps['document'], string> = {
  privacidad: 'Privacidad',
  terminos: 'Términos y condiciones',
  cookies: 'Cookies',
  'eliminar-cuenta': 'Eliminar cuenta',
  soporte: 'Soporte',
};

// Misma fecha que aparece en la cabecera de cada página web equivalente
// (src/pages/{Privacidad,Terminos,Cookies}.tsx) — eliminar-cuenta y soporte
// no llevan fecha allí tampoco.
const LAST_UPDATED: Partial<Record<LegalViewProps['document'], string>> = {
  privacidad: 'Última actualización: 9 de septiembre de 2026',
  terminos: 'Última actualización: 9 de septiembre de 2026',
  cookies: 'Última actualización: 9 de septiembre de 2026',
};

// Pantalla interna del dashboard que reutiliza el texto legal real de
// src/pages/{Privacidad,Terminos,Cookies,EliminarCuenta,Soporte}.tsx —
// las rutas web públicas siguen existiendo sin cambios, esto es solo una
// segunda forma de llegar al mismo contenido, ya dentro del shell nativo
// del dashboard (sin AmbientBackground/LegalFooter/FooterPublic, que son
// exclusivos de la web pública).
export function LegalView({ document }: LegalViewProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-display font-extrabold mb-1">{TITLES[document]}</h1>
      {LAST_UPDATED[document] && (
        <p className="text-xs mb-4 text-muted-foreground">{LAST_UPDATED[document]}</p>
      )}
      {document === 'privacidad' && <PrivacidadContent />}
      {document === 'terminos' && <TerminosContent />}
      {document === 'cookies' && <CookiesContent />}
      {document === 'eliminar-cuenta' && <EliminarCuentaContent />}
      {document === 'soporte' && <SoporteContent />}
    </div>
  );
}
