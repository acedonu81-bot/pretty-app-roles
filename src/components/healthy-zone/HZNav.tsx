import { HZ_GUIDES, HZ_PATH } from '@/data/healthyZone';
import { HZ, clay, clayButton, GREEN_RGB, SURFACE_RGB } from './clay';

// Menú en píldora flotante, común a la página de la zona y a sus guías.
export default function HZNav() {
  return (
    <nav
      className="mx-4 sm:mx-10 mt-4 sm:mt-6 flex items-center justify-between gap-3 rounded-full py-3 pl-5 pr-3 sm:py-4 sm:pl-8 sm:pr-4"
      style={{ background: HZ.surface, boxShadow: clay(SURFACE_RGB, 'md') }}
    >
      <a href={HZ_PATH} className="flex items-center gap-2 sm:gap-3" style={{ textDecoration: 'none' }}>
        <span className="text-lg sm:text-[22px]" style={{ fontFamily: HZ.display, fontWeight: 800, letterSpacing: '-0.5px', color: HZ.ink }}>XPEAK</span>
        <span
          className="rounded-full px-3 py-1.5 text-xs sm:text-[13px] whitespace-nowrap"
          style={{ background: '#BFEBD0', color: '#155C40', fontWeight: 800, boxShadow: clay(SURFACE_RGB, 'sm') }}
        >
          Healthy Zone
        </span>
      </a>
      <div className="flex items-center gap-7 text-[15px]" style={{ fontWeight: 700 }}>
        {HZ_GUIDES.map((g) => (
          <a key={g.slug} href={g.slug} className="hidden lg:inline" style={{ textDecoration: 'none', color: HZ.ink }}>
            {g.short}
          </a>
        ))}
        <a
          href="#plan"
          className="rounded-full px-4 py-2.5 sm:px-6 sm:py-3.5 text-sm sm:text-[15px] whitespace-nowrap"
          style={{ background: HZ.green, color: '#fff', fontWeight: 800, textDecoration: 'none', boxShadow: clayButton(GREEN_RGB) }}
        >
          <span className="sm:hidden">Tu plan</span>
          <span className="hidden sm:inline">Cuéntanos tu plan</span>
        </a>
      </div>
    </nav>
  );
}
