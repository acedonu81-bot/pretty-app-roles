import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface Option { value: string; label: string; }

interface NightlifeSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  active?: boolean; // true when value is not default/empty
}

const MENU_MAX = 240;
const GAP = 8;

// El menú se pinta en document.body con position: fixed, no dentro del
// componente. Antes iba dentro y lo recortaba cualquier contenedor con
// overflow (la barra de filtros del directorio tiene overflow-x-auto): al
// pulsar "Todas" el menú se abría invisible y parecía que el filtro no hacía
// nada (19 oct 2026). Fuera del flujo tampoco lo tapan las tarjetas de debajo.
export default function NightlifeSelect({ value, onChange, options, placeholder = 'Seleccionar', className = '', active }: NightlifeSelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number; maxHeight: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = active ?? (value !== '' && value !== options[0]?.value);
  const label = options.find(o => o.value === value)?.label ?? placeholder;

  const medir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const abajo = window.innerHeight - r.bottom - GAP - 8;
    const arriba = r.top - GAP - 8;
    // Si debajo no caben unas ~5 opciones y arriba hay más sitio, se abre hacia arriba.
    if (abajo < 200 && arriba > abajo) {
      setPos({ left: r.left, width: r.width, bottom: window.innerHeight - r.top + GAP, maxHeight: Math.min(MENU_MAX, Math.max(arriba, 120)) });
    } else {
      setPos({ left: r.left, width: r.width, top: r.bottom + GAP, maxHeight: Math.min(MENU_MAX, Math.max(abajo, 120)) });
    }
  }, []);

  useLayoutEffect(() => { if (open) medir(); }, [open, medir]);

  useEffect(() => {
    if (!open) return;
    const fuera = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', tecla);
    // scroll en cualquier ancestro (captura) y cambio de tamaño: el menú sigue al botón.
    window.addEventListener('scroll', medir, true);
    window.addEventListener('resize', medir);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', tecla);
      window.removeEventListener('scroll', medir, true);
      window.removeEventListener('resize', medir);
    };
  }, [open, medir]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ userSelect: 'none' }} data-select-open={open ? 'true' : undefined}>
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 text-xs font-bold px-3 py-2 rounded-full transition-all outline-none"
        style={{
          background: isActive ? 'rgba(212,175,55,0.1)' : '#ffffff',
          border: `1px solid ${isActive ? 'rgba(212,175,55,0.45)' : 'rgba(0,0,0,0.12)'}`,
          color: isActive ? '#7a6216' : '#333',
          cursor: 'pointer',
        }}
      >
        <span className="truncate">{label}</span>
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none', color: isActive ? '#7a6216' : '#888' }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Menú: en document.body, fuera de cualquier contenedor que recorte */}
      {open && pos && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          className="rounded-2xl overflow-hidden overflow-y-auto p-1"
          style={{
            position: 'fixed',
            left: pos.left,
            width: pos.width,
            top: pos.top,
            bottom: pos.bottom,
            zIndex: 1000,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
            maxHeight: pos.maxHeight,
          }}
        >
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full text-left text-xs font-bold px-3 py-2.5 transition-all rounded-xl"
              style={{
                background: o.value === value ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: o.value === value ? '#7a6216' : '#333',
              }}
              onMouseEnter={e => { if (o.value !== value) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { if (o.value !== value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              {o.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}
