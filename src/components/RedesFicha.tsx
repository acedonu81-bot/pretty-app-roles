// Redes del profesional en su ficha (25 nov 2026): Instagram, TikTok y Facebook.
// La BD ya deja vacías las que su plan no incluye (zz_profiles_redes_publicadas),
// así que aquí se pinta lo que llegue. Quien no ha iniciado sesión ve un único
// botón para registrarse, como antes con Instagram.
import { Instagram, Facebook } from 'lucide-react';
import { clicRedSocial } from '@/lib/track';
import { extractInstagramHandle, instagramUrl, extractTiktokHandle, tiktokUrl, facebookRuta, facebookUrl } from '@/lib/social';

type Origen = 'perfil_publico' | 'panel';
type Estilo = 'cristal' | 'texto' | 'chip';

export type Redes = { instagram?: string | null; tiktok?: string | null; facebook?: string | null };

export const tieneRedes = (r: Redes) => !!(r.instagram || r.tiktok || facebookRuta(r.facebook));

// Icono de TikTok (lucide no lo trae).
function TikTokIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1 0-5.2c.27 0 .53.04.78.12V9.66a5.7 5.7 0 0 0-.78-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
    </svg>
  );
}

const COLOR = { instagram: '225,48,108', tiktok: '0,0,0', facebook: '24,119,242' } as const;

function clases(estilo: Estilo) {
  if (estilo === 'texto') return 'inline-flex items-center gap-1.5 text-sm font-bold';
  if (estilo === 'chip') return 'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105';
  return 'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105';
}

function estiloDe(estilo: Estilo, red: keyof typeof COLOR): React.CSSProperties {
  if (estilo === 'texto') return { color: '#8B6A00' };
  if (estilo === 'chip') {
    const hex = { instagram: '#E1306C', tiktok: '#333', facebook: '#1877F2' }[red];
    return { background: `rgba(${COLOR[red]},0.06)`, color: hex, border: `1px solid rgba(${COLOR[red]},0.15)` };
  }
  const fondo = red === 'tiktok' ? '255,255,255' : COLOR[red];
  return { background: `rgba(${fondo},0.18)`, backdropFilter: 'blur(8px)', border: `1px solid rgba(${fondo},0.4)`, color: '#fff' };
}

export function RedesFicha({ redes, userId, origen, estilo = 'cristal', logueado = true, registroHref, className = '' }: {
  redes: Redes; userId: string; origen: Origen; estilo?: Estilo; logueado?: boolean; registroHref?: string; className?: string;
}) {
  if (!tieneRedes(redes)) return null;
  const tam = estilo === 'texto' ? 15 : estilo === 'chip' ? 13 : 12;
  const fb = facebookRuta(redes.facebook);

  if (!logueado && registroHref) {
    return (
      <div className={className}>
        <a href={registroHref} className={clases(estilo)} style={estiloDe(estilo, redes.instagram ? 'instagram' : redes.tiktok ? 'tiktok' : 'facebook')}>
          {redes.instagram ? <Instagram size={tam} /> : redes.tiktok ? <TikTokIcon size={tam} /> : <Facebook size={tam} />} Regístrate para ver sus redes
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {redes.instagram && (
        <a href={instagramUrl(redes.instagram)} target="_blank" rel="noopener noreferrer"
          onClick={() => clicRedSocial('instagram', origen, userId)}
          className={clases(estilo)} style={estiloDe(estilo, 'instagram')}>
          <Instagram size={tam} /> @{extractInstagramHandle(redes.instagram)}
        </a>
      )}
      {redes.tiktok && (
        <a href={tiktokUrl(redes.tiktok)} target="_blank" rel="noopener noreferrer"
          onClick={() => clicRedSocial('tiktok', origen, userId)}
          className={clases(estilo)} style={estiloDe(estilo, 'tiktok')}>
          <TikTokIcon size={tam} /> @{extractTiktokHandle(redes.tiktok)}
        </a>
      )}
      {fb && (
        <a href={facebookUrl(fb)} target="_blank" rel="noopener noreferrer"
          onClick={() => clicRedSocial('facebook', origen, userId)}
          className={clases(estilo)} style={estiloDe(estilo, 'facebook')}>
          <Facebook size={tam} /> Facebook
        </a>
      )}
    </div>
  );
}
