import { useMemo, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { ALL_CITIES } from '@/lib/regions';

// Buscador de ciudad del registro (13 oct 2026). Antes era un <select> con
// más de 100 ciudades: un DJ de Toledo tardó unos 30 s en encontrar la suya
// desde el anuncio de Instagram. Se escribe y se elige; solo vale una ciudad
// de la lista porque las páginas /contratar-*/:ciudad filtran por ella.

const MAX_SUGERENCIAS = 6;

export const sinTildes = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Primero las que empiezan por lo escrito y después las que lo contienen.
// Sin texto, las primeras de la lista (las grandes capitales).
export function sugerirCiudades(texto: string, ciudades: string[] = ALL_CITIES): string[] {
  const q = sinTildes(texto);
  if (!q) return ciudades.slice(0, MAX_SUGERENCIAS);
  const empiezan = ciudades.filter(c => sinTildes(c).startsWith(q));
  const contienen = ciudades.filter(c => !sinTildes(c).startsWith(q) && sinTildes(c).includes(q));
  return [...empiezan, ...contienen].slice(0, MAX_SUGERENCIAS);
}

interface Props {
  value: string;
  onChange: (ciudad: string) => void;
  onBlur?: () => void;
}

export default function CiudadBuscador({ value, onChange, onBlur }: Props) {
  const [texto, setTexto] = useState(value);
  const [abierto, setAbierto] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sugerencias = useMemo(() => sugerirCiudades(texto), [texto]);

  const elegir = (c: string) => {
    setTexto(c);
    onChange(c);
    setAbierto(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <MapPin size={14} className="absolute left-3 top-[1.4rem] -translate-y-1/2 text-muted-foreground z-10" />
      <input
        ref={inputRef}
        type="text"
        name="city"
        value={texto}
        onChange={e => {
          const t = e.target.value;
          setTexto(t);
          setAbierto(true);
          // Si lo escrito ya es una ciudad (sin contar tildes), queda elegida.
          onChange(ALL_CITIES.find(c => sinTildes(c) === sinTildes(t)) ?? '');
        }}
        onFocus={() => {
          setAbierto(true);
          // Con el teclado abierto, la lista de debajo quedaba tapada.
          setTimeout(() => inputRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 250);
        }}
        onBlur={() => { setAbierto(false); onBlur?.(); }}
        onKeyDown={e => {
          if (e.key === 'Enter' && abierto && sugerencias.length) { e.preventDefault(); elegir(sugerencias[0]); }
        }}
        placeholder="¿En qué ciudad trabajas?"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        role="combobox"
        aria-expanded={abierto}
        aria-autocomplete="list"
        aria-label="Tu ciudad"
        className="nightlife-input !py-3 !pl-9 text-base w-full"
      />
      {abierto && (
        <ul role="listbox" className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl overflow-hidden"
          style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.35)', boxShadow: '0 10px 30px rgba(122,98,22,0.15)' }}>
          {sugerencias.length ? sugerencias.map(c => (
            <li key={c} role="option" aria-selected={c === value}
              // pointerdown + preventDefault: elige antes de que el blur cierre la lista.
              onPointerDown={e => { e.preventDefault(); elegir(c); }}
              className="px-4 py-2.5 text-sm cursor-pointer"
              style={{ color: '#111', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              {c}
            </li>
          )) : (
            <li className="px-4 py-3 text-xs" style={{ color: 'rgba(0,0,0,0.55)' }}>
              No está en la lista: elige la ciudad grande más cercana.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
