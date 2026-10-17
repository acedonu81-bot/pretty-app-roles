import { Instagram } from 'lucide-react';
import { HZ, TONES, clay } from '@/components/healthy-zone/clay';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-.9-.95-1.4-2.17-1.4-3.46h-3.14v13.5c0 1.63-1.32 2.95-2.95 2.95a2.95 2.95 0 0 1 0-5.9c.26 0 .51.03.76.1v-3.2a6.15 6.15 0 0 0-.76-.05A6.1 6.1 0 0 0 3 15.86a6.1 6.1 0 0 0 6.1 6.1 6.1 6.1 0 0 0 6.1-6.1V9.4a8.25 8.25 0 0 0 4.8 1.54V7.8a4.85 4.85 0 0 1-3.4-1.98Z" />
    </svg>
  );
}

const REDES = [
  { label: 'Instagram', href: 'https://www.instagram.com/xpeaksite?utm_source=xpeak_web&utm_medium=social&utm_campaign=concurso', Icon: Instagram },
  { label: 'TikTok', href: 'https://www.tiktok.com/@xpeak30?utm_source=xpeak_web&utm_medium=social&utm_campaign=concurso', Icon: TikTokIcon },
];

/**
 * "Síguenos" del concurso (17 oct 2026): la gente que entra solo a votar se
 * registra y se va sin saber cuándo habrá otro. Los iconos llevan a las redes
 * donde se anuncian los concursos y sus ganadores.
 */
export default function SiguenosRedes() {
  return (
    <section className="mt-12 rounded-[28px] p-6 sm:p-8 text-center"
      style={{ background: HZ.surface, boxShadow: clay(TONES.sun.rgb, 'sm') }}>
      <h2 className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: HZ.display, fontWeight: 800, color: HZ.ink }}>
        ¿Solo vienes a votar? Síguenos en redes
      </h2>
      <p className="max-w-md mx-auto mb-5 text-sm sm:text-base" style={{ fontFamily: HZ.body, fontWeight: 600, color: HZ.ink, opacity: 0.8 }}>
        Para estar al tanto de todos los concursos, de los finalistas y de lo que viene.
      </p>
      <div className="flex items-center justify-center gap-4">
        {REDES.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Síguenos en ${label}`}
            className="flex items-center gap-2 px-5 py-3 rounded-full transition-transform hover:-translate-y-0.5"
            style={{ background: '#fff', color: TONES.sun.stroke, fontFamily: HZ.body, fontWeight: 800, boxShadow: clay(TONES.sun.rgb, 'sm') }}>
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
