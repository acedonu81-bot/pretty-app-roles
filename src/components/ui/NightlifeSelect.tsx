import { useState, useRef, useEffect } from 'react';

interface Option { value: string; label: string; }

interface NightlifeSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  active?: boolean; // true when value is not default/empty
}

export default function NightlifeSelect({ value, onChange, options, placeholder = 'Seleccionar', className = '', active }: NightlifeSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = active ?? (value !== '' && value !== options[0]?.value);
  const label = options.find(o => o.value === value)?.label ?? placeholder;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ userSelect: 'none' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-all outline-none"
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

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-xl overflow-hidden overflow-y-auto"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
            maxHeight: '240px',
          }}
        >
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full text-left text-xs font-bold px-3 py-2.5 transition-all"
              style={{
                background: o.value === value ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: o.value === value ? '#7a6216' : '#333',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => { if (o.value !== value) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { if (o.value !== value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
