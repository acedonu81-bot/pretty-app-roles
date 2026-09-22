interface Props {
  venueCapacity: number | null;
  allowsOvernight: boolean | null;
  pricePerHour: number | null;
  pricePerEvent: number | null;
  distanceFromMadridKm: number | null;
  onChange: (
    field: 'venueCapacity' | 'allowsOvernight' | 'pricePerHour' | 'pricePerEvent' | 'distanceFromMadridKm',
    value: number | boolean | null
  ) => void;
}

const LocalEventosExtraFields = ({
  venueCapacity,
  allowsOvernight,
  pricePerHour,
  pricePerEvent,
  distanceFromMadridKm,
  onChange,
}: Props) => (
  <div className="mt-5 mb-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
    <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>
      Datos del local
    </p>

    <div className="mb-3">
      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Aforo (personas)</label>
      <input
        type="number"
        min={0}
        value={venueCapacity ?? ''}
        onChange={e => onChange('venueCapacity', e.target.value === '' ? null : Number(e.target.value))}
        placeholder="Ej: 200"
        className="nightlife-input mt-1 text-base"
      />
    </div>

    <label className="flex items-center gap-2.5 mb-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={allowsOvernight ?? false}
        onChange={e => onChange('allowsOvernight', e.target.checked)}
        className="w-4 h-4 accent-[#D4AF37]"
      />
      <span className="text-sm font-semibold" style={{ color: '#222' }}>Permite pernoctar</span>
    </label>

    <div className="grid grid-cols-2 gap-3 mb-3">
      <div>
        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Precio por hora</label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
          <input
            type="number"
            min={0}
            value={pricePerHour ?? ''}
            onChange={e => onChange('pricePerHour', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="Ej: 100"
            className="nightlife-input !pl-8 text-base"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Precio por evento/noche</label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
          <input
            type="number"
            min={0}
            value={pricePerEvent ?? ''}
            onChange={e => onChange('pricePerEvent', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="Ej: 800"
            className="nightlife-input !pl-8 text-base"
          />
        </div>
      </div>
    </div>

    <div className="mb-1">
      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Distancia desde Madrid (km)</label>
      <input
        type="number"
        min={0}
        value={distanceFromMadridKm ?? ''}
        onChange={e => onChange('distanceFromMadridKm', e.target.value === '' ? null : Number(e.target.value))}
        placeholder="Ej: 25"
        className="nightlife-input mt-1 text-base"
      />
    </div>
  </div>
);

export default LocalEventosExtraFields;
