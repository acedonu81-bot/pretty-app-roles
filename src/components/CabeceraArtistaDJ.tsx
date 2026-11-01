import type { ReactNode } from 'react';
import { BadgeCheck, MapPin } from 'lucide-react';
import { fotoOptimizada } from '@/lib/imagen';

// Cabecera de artista del perfil de DJ (opción B elegida el 1 nov 2026, al
// estilo Hearthis): banner bajo, avatar redondo montado sobre el banner,
// nombre, ciudad y estilos, botones de seguir/compartir y contadores. Sustituye
// solo para DJs a la portada con la foto a pantalla completa del resto de roles.
// No hay campo de banner propio: se usa la propia foto desenfocada, con un
// velo dorado para que no compita con el avatar.
const CabeceraArtistaDJ = ({ nombre, foto, zona, estilos, verificado, precio, acciones, contadores, llamadas }: {
  nombre: string;
  /** "Desde 100€/h", o null si no ha puesto tarifa. */
  precio: string | null;
  foto: string | null;
  zona: string | null;
  estilos: string[];
  verificado: boolean;
  /** Seguir y compartir. */
  acciones: ReactNode;
  contadores: ReactNode;
  /** Escríbele / Añadir a mi evento (en móvil ya van en la barra fija de abajo). */
  llamadas: ReactNode;
}) => {
  const tieneFoto = !!foto && foto.trim().length > 5;
  const inicial = (nombre || 'X').trim().charAt(0).toUpperCase();

  return (
    <header>
      <div className="relative overflow-hidden h-36 sm:h-52 md:h-60"
        style={{ background: 'linear-gradient(120deg,#F3E3B8 0%,#E3B54F 45%,#B8941E 100%)' }}>
        {tieneFoto && (
          <img src={fotoOptimizada(foto, 800)} alt="" aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110"
            style={{ filter: 'blur(22px) saturate(1.15)', opacity: 0.75 }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(212,175,55,0.18) 0%, rgba(139,106,0,0.35) 100%)' }} />
      </div>

      <div className="max-w-3xl mx-auto px-5">
        {/* El margen negativo va en el avatar y no en la fila: así solo el
            avatar se monta sobre el banner y el nombre queda siempre debajo. */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5 relative">
          {tieneFoto ? (
            <img src={fotoOptimizada(foto, 400)} alt={nombre} loading="eager" {...{ fetchpriority: 'high' }}
              className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover flex-shrink-0 -mt-14 sm:-mt-20"
              style={{ border: '4px solid #fff', boxShadow: '0 8px 24px rgba(139,106,0,0.25)', objectPosition: '50% 20%' }} />
          ) : (
            <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full flex items-center justify-center flex-shrink-0 text-5xl font-black -mt-14 sm:-mt-20"
              style={{ border: '4px solid #fff', boxShadow: '0 8px 24px rgba(139,106,0,0.25)', background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#fff' }}>
              {inicial}
            </div>
          )}

          <div className="min-w-0 flex-1 sm:pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black tracking-tight break-words" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.75rem)', lineHeight: 1.05, color: '#111', letterSpacing: '-0.02em' }}>
                {nombre}
              </h1>
              {verificado && (
                <BadgeCheck size={22} style={{ color: '#D4AF37' }} aria-label="Verificado por XPEAK" />
              )}
            </div>
            <p className="text-sm font-semibold mt-1 flex items-center gap-1.5 flex-wrap" style={{ color: '#666' }}>
              <span style={{ color: '#8B6A00' }}>DJ</span>
              {zona && (<><span aria-hidden="true">·</span><MapPin size={13} />{zona}</>)}
              {estilos.length > 0 && (<><span aria-hidden="true">·</span>{estilos.slice(0, 3).join(', ')}</>)}
            </p>
            {/* El precio va aquí y no en una tarjeta aparte: entre las pestañas
                y los sets cortaba la página como en una ficha de catálogo. */}
            <p className="text-sm mt-1.5" style={{ color: '#333' }}>
              {precio ? <><span className="font-black" style={{ color: '#111' }}>{precio}</span> · Contrato directo</> : 'Precio a consultar · Contrato directo'}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:pb-3">{acciones}</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
          {contadores}
          <div className="hidden md:flex gap-3">{llamadas}</div>
        </div>
      </div>
    </header>
  );
};

export default CabeceraArtistaDJ;
