import { useId } from 'react';

// Medalla del podio de los sets más escuchados (fase 3, 1 nov 2026). Versión
// sobria elegida por el usuario (opción B): un aro fino del metal con el
// número dentro, sin cinta ni brillos (la primera, con cinta, "recargada").
const METALES = {
  1: { nombre: 'oro', claro: '#F3D77A', oscuro: '#B8941E', numero: '#B8941E' },
  2: { nombre: 'plata', claro: '#E9ECF0', oscuro: '#9AA1AB', numero: '#7D838C' },
  3: { nombre: 'bronce', claro: '#E7B48A', oscuro: '#A2602C', numero: '#A2602C' },
} as const;

// Versión brillante, para las tarjetas del directorio (10 nov 2026: "más brillo,
// colores más fuertes"): disco macizo del metal con reflejo y número blanco.
// La sobria de arriba se queda en las filas de los sets.
export const METAL_FUERTE = {
  1: { luz: '#FFF4C2', claro: '#FFD84D', medio: '#E8A800', oscuro: '#9C6B00', borde: '#7A5200' },
  2: { luz: '#FFFFFF', claro: '#E8EDF3', medio: '#AEB8C4', oscuro: '#6E7A88', borde: '#56606C' },
  3: { luz: '#FFE0C4', claro: '#F2A766', medio: '#C9701F', oscuro: '#83420C', borde: '#6A3409' },
} as const;

const MedallaBrillante = ({ puesto, tam, id }: { puesto: 1 | 2 | 3; tam: number; id: string }) => {
  const m = METAL_FUERTE[puesto];
  const nombre = METALES[puesto].nombre;
  return (
    <svg width={tam} height={tam} viewBox="0 0 72 72" role="img" aria-label={`Medalla de ${nombre}: puesto ${puesto}`}>
      <defs>
        <radialGradient id={`disco-${id}`} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor={m.claro} />
          <stop offset="0.35" stopColor={m.claro} />
          <stop offset="0.75" stopColor={m.medio} />
          <stop offset="1" stopColor={m.oscuro} />
        </radialGradient>
        <linearGradient id={`aro-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={m.luz} />
          <stop offset="0.5" stopColor={m.medio} />
          <stop offset="1" stopColor={m.borde} />
        </linearGradient>
      </defs>
      <circle cx="36" cy="36" r="33" fill={`url(#aro-${id})`} />
      <circle cx="36" cy="36" r="27.5" fill={`url(#disco-${id})`} stroke={m.borde} strokeOpacity="0.45" strokeWidth="1" />
      {/* Reflejo */}
      <ellipse cx="27" cy="22" rx="11" ry="5" fill="#fff" opacity="0.28" transform="rotate(-28 27 22)" />
      {/* La plata es clara: número oscuro con luz debajo; oro y bronce, blanco con sombra. */}
      <text x="36" y="47.5" textAnchor="middle" fontSize="30" fontWeight="900" fill={puesto === 2 ? '#fff' : m.borde} opacity={puesto === 2 ? 0.9 : 0.55}
        style={{ fontFamily: 'inherit' }} transform="translate(0 1.5)">{puesto}</text>
      <text x="36" y="47.5" textAnchor="middle" fontSize="30" fontWeight="900" fill={puesto === 2 ? '#3A434E' : '#fff'} style={{ fontFamily: 'inherit' }}>{puesto}</text>
    </svg>
  );
};

const Medalla = ({ puesto, tam = 64, brillante = false }: { puesto: 1 | 2 | 3; tam?: number; brillante?: boolean }) => {
  const m = METALES[puesto];
  const id = useId().replace(/:/g, '');
  if (brillante) return <MedallaBrillante puesto={puesto} tam={tam} id={id} />;
  return (
    <svg width={tam} height={tam} viewBox="0 0 72 72" role="img" aria-label={`Medalla de ${m.nombre}: puesto ${puesto}`}>
      <defs>
        <linearGradient id={`aro-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={m.claro} />
          <stop offset="1" stopColor={m.oscuro} />
        </linearGradient>
      </defs>
      <circle cx="36" cy="36" r="32" fill="#fff" stroke={`url(#aro-${id})`} strokeWidth="4" />
      <text x="36" y="47" textAnchor="middle" fontSize="30" fontWeight="900" fill={m.numero} style={{ fontFamily: 'inherit' }}>{puesto}</text>
    </svg>
  );
};

export default Medalla;
