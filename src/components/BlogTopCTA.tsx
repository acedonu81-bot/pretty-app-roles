interface BlogTopCTAProps {
  label: string;
  href: string;
}

export default function BlogTopCTA({ label, href }: BlogTopCTAProps) {
  return (
    <div className="flex items-center justify-between gap-3 my-4 px-4 py-3 rounded-xl"
      style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}>
      <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>
        ⚡ Flash Booking — profesionales verificados en menos de 1h
      </p>
      <a href={href}
        className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:scale-105 whitespace-nowrap"
        style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
        {label}
      </a>
    </div>
  );
}
