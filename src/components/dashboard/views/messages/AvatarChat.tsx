// Avatar único del panel de mensajes (26 oct 2026): foto con aro dorado fino o
// monograma crema. Antes cada nombre tenía un degradado distinto (morado, rosa,
// verde, azul) y el panel parecía una app de consumo; ahora todos son iguales.
interface Props {
  name: string;
  photo?: string | null;
  size?: number;
  rounded?: 'full' | 'xl';
}

export default function AvatarChat({ name, photo, size = 44, rounded = 'full' }: Props) {
  const radius = rounded === 'full' ? '9999px' : `${Math.round(size * 0.3)}px`;
  const aro = '0 0 0 1px rgba(139,106,0,0.35)';
  if (photo) {
    return (
      <img src={photo} alt={name} loading="lazy"
        className="object-cover flex-shrink-0"
        style={{ width: size, height: size, borderRadius: radius, boxShadow: aro }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    );
  }
  return (
    <div className="flex items-center justify-center flex-shrink-0 font-display font-bold select-none"
      style={{
        width: size, height: size, borderRadius: radius,
        background: 'linear-gradient(160deg,#FFFBEE 0%,#F3E4B8 100%)',
        color: '#8B6A00', boxShadow: aro, fontSize: Math.round(size * 0.4),
      }}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
}
