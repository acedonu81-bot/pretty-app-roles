import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logEvent } from '@/lib/track';
import { HZ_MATCH_IDS, type HZMatchRole } from '@/data/healthyZoneMatches';
import { HZ, clay, SURFACE_RGB } from './clay';

const ROLE_LABEL: Record<HZMatchRole, string> = {
  dj: 'DJ',
  staff: 'Camarero/a',
  catering: 'Catering',
  'grupo-musical': 'Grupo en directo',
  bailarin: 'Bailarín/instructor',
};

// Directorio de cada rol, para el aviso "consulta tu zona" cuando el perfil
// mostrado no es de Madrid (las guías de la Healthy Zone están escritas en
// clave Madrid, pero la oferta real de XPEAK es de toda España).
const ROLE_DIRECTORIO: Record<HZMatchRole, string> = {
  dj: '/directorio/dj',
  staff: '/directorio/staff',
  catering: '/directorio/catering',
  'grupo-musical': '/directorio/grupo-musical',
  bailarin: '/directorio/bailarin',
};

interface Profile {
  user_id: string;
  display_name: string;
  photo_url: string | null;
  city_ref: string | null;
  region: string | null;
}

// Una recomendación de "esto podría encajar" dentro de un bloque de guía.
// Trae un perfil real (con foto) al azar de la lista curada en
// healthyZoneMatches.ts. Si Supabase falla o el perfil ya no existe, no
// muestra nada — nunca un hueco roto ni un dato inventado.
//
// origin identifica la guía (slug) para poder medir en GA4/analítica propia
// qué guía y qué rol generan clics reales a "Ver perfil", separado de las
// visitas de página que ya mide GA4 solo.
export default function HZMatchCard({ role, seed, origin }: { role: HZMatchRole; seed: string; origin: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const ids = HZ_MATCH_IDS[role];
    if (!ids?.length) { setLoaded(true); return; }
    // Rotación estable por sesión de carga (no aleatoria en cada render).
    const pick = ids[Math.abs(hashCode(seed)) % ids.length];
    supabase
      .from('profiles')
      .select('user_id, display_name, photo_url, city_ref, region')
      .eq('user_id', pick)
      .maybeSingle()
      .then(({ data }) => {
        if (active) { setProfile(data ?? null); setLoaded(true); }
      });
    return () => { active = false; };
  }, [role, seed]);

  if (!loaded || !profile || !profile.display_name) return null;

  const lugar = profile.city_ref || profile.region;
  // Las guías están escritas en clave Madrid; si el perfil mostrado es de
  // otra ciudad, lo decimos y enlazamos al directorio de ese rol en vez de
  // prometer "hay más cerca de ti" sin dato real detrás.
  const esOtraCiudad = !!profile.city_ref && profile.city_ref !== 'Madrid';

  return (
    <div className="mt-4 flex flex-col gap-2">
      <a
        href={`/p/${profile.user_id}`}
        onClick={() => { void logEvent('hz_match_click', origin, `${role}:${profile.user_id}`); }}
        className="flex items-center gap-4 rounded-[24px] p-4 no-underline transition-transform hover:-translate-y-0.5"
        style={{ background: HZ.surface, boxShadow: clay(SURFACE_RGB, 'sm') }}
      >
        {profile.photo_url ? (
          <img
            src={profile.photo_url}
            alt={profile.display_name}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
            style={{ boxShadow: clay(SURFACE_RGB, 'sm') }}
            loading="lazy"
          />
        ) : (
          <span className="h-14 w-14 shrink-0 rounded-full" style={{ background: '#DDE9E2' }} aria-hidden="true" />
        )}
        <span className="flex flex-col gap-0.5">
          <span className="text-xs" style={{ color: HZ.green, fontWeight: 800 }}>Este podría encajar</span>
          <span className="text-base" style={{ color: HZ.ink, fontWeight: 800 }}>
            {profile.display_name} <span style={{ color: HZ.inkSoft, fontWeight: 600 }}>· {ROLE_LABEL[role]}</span>
          </span>
          {lugar && <span className="text-sm" style={{ color: HZ.inkSoft }}>{lugar}</span>}
        </span>
        <span className="ml-auto shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap" style={{ background: HZ.green, color: '#fff', fontWeight: 800 }}>
          Ver perfil
        </span>
      </a>
      {esOtraCiudad && (
        <a href={ROLE_DIRECTORIO[role]} className="self-start pl-2 text-xs no-underline" style={{ color: HZ.inkSoft }}>
          ¿No eres de {profile.city_ref}? <span style={{ color: HZ.green, fontWeight: 800 }}>Consulta tu zona en el directorio →</span>
        </a>
      )}
    </div>
  );
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0;
  return h;
}
