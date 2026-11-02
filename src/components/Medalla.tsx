import { useId } from 'react';

// Medalla del podio de los sets más escuchados (fase 3, 1 nov 2026). Versión
// sobria elegida por el usuario (opción B): un aro fino del metal con el
// número dentro, sin cinta ni brillos (la primera, con cinta, "recargada").
const METALES = {
  1: { nombre: 'oro', claro: '#F3D77A', oscuro: '#B8941E', numero: '#B8941E' },
  2: { nombre: 'plata', claro: '#E9ECF0', oscuro: '#9AA1AB', numero: '#7D838C' },
  3: { nombre: 'bronce', claro: '#E7B48A', oscuro: '#A2602C', numero: '#A2602C' },
} as const;

const Medalla = ({ puesto, tam = 64 }: { puesto: 1 | 2 | 3; tam?: number }) => {
  const m = METALES[puesto];
  const id = useId().replace(/:/g, '');
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
