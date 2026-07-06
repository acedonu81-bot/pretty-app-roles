const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs"
      style={{ background: 'rgba(10,10,14,0.95)', border: '1px solid rgba(212,175,55,0.25)', color: '#222' }}>
      {label && <p className="font-bold mb-1" style={{ color: '#8A6D0F' }}>{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name}>
          <span style={{ color: p.color }}>{p.name}:</span>{' '}
          {typeof p.value === 'number' && p.name?.includes('€') ? `€${p.value}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default DarkTooltip;
