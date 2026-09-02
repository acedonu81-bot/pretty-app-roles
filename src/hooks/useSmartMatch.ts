import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isEarlyAdopter } from '@/lib/earlyAdopter';

export interface MatchedProfessional {
  user_id: string;
  display_name: string;
  role: string;
  specialty: string | null;
  zone: string | null;
  photo_url: string | null;
  hourly_rate: number | null;
  is_flash_active: boolean;
  is_verified: boolean;
  is_early_adopter: boolean;
  score: number;
  fast_responder_count: number;
  avgRating: number;
  reviewCount: number;
  matchScore: number;
  matchReasons: string[];
  estimatedPrice: number | null;
}

interface MatchQuery {
  role: string;
  city?: string;
  eventDate?: string;
  maxBudget?: number;
  eventType?: string;
}

const EVENT_HOURS: Record<string, number> = {
  'Boda': 6,
  'Comunión': 4,
  'Evento corporativo': 5,
  'Fiesta privada': 4,
  'Festival': 8,
  'Cumpleaños': 3,
  'Inauguración': 3,
  'Club / Discoteca': 5,
};

function normalizeCity(zone: string | null): string {
  if (!zone) return '';
  return zone.split(',')[0].trim().toLowerCase();
}

function computeMatch(
  profile: any,
  ratingInfo: { avg: number; count: number },
  blocked: Set<string>,
  query: MatchQuery,
): MatchedProfessional | null {
  let score = 0;
  const reasons: string[] = [];

  const cityQuery = query.city?.toLowerCase().trim() ?? '';
  const profileCity = normalizeCity(profile.zone);

  // city_ref es la ciudad grande de referencia que deriva la BD, asi que quien
  // vive en un pueblo puntua igual en la busqueda de su ciudad grande.
  const profileCityRef = (profile.city_ref ?? '').trim().toLowerCase();

  if (cityQuery && (profileCity.includes(cityQuery) || profileCityRef === cityQuery)) {
    score += 30;
    reasons.push(`En ${profile.zone?.split(',')[0]}`);
  } else if (cityQuery && (!profileCity || profileCity === 'espana' || profileCity === 'españa')) {
    // Sin ciudad concreta (zone='España', el valor por defecto del alta) el
    // profesional se ofrece para toda España: no coincide, pero penalizarlo
    // -10 hundia a 14 de 37 perfiles en TODA busqueda con ciudad.
    score += 0;
  } else if (cityQuery) {
    score -= 10;
  }

  if (query.eventDate && blocked.has(query.eventDate)) {
    return null;
  }
  if (query.eventDate && !blocked.has(query.eventDate)) {
    score += 15;
    reasons.push('Disponible en la fecha');
  }

  if (ratingInfo.count > 0) {
    score += Math.round(ratingInfo.avg * 4);
    if (ratingInfo.avg >= 4.5) reasons.push(`★ ${ratingInfo.avg.toFixed(1)} (${ratingInfo.count} reseñas)`);
  }

  if (profile.is_verified) { score += 10; reasons.push('Verificado'); }
  if (profile.is_flash_active) { score += 8; reasons.push('Disponible ahora'); }
  if (isEarlyAdopter(profile)) score += 5;
  if ((profile.fast_responder_count ?? 0) >= 1) { score += 7; reasons.push('Respuesta rápida'); }

  score += Math.min(15, Math.round((profile.score ?? 0) / 10));

  const hours = EVENT_HOURS[query.eventType ?? ''] ?? 4;
  const estimated = profile.hourly_rate ? profile.hourly_rate * hours : null;

  if (query.maxBudget && estimated) {
    if (estimated <= query.maxBudget) {
      score += 12;
      reasons.push(`~${estimated}€ (dentro de presupuesto)`);
    } else {
      // Se pidió un presupuesto máximo y este profesional lo supera —
      // no lo recomendamos como si encajara, aunque el resto del perfil sea bueno.
      return null;
    }
  } else if (estimated) {
    reasons.push(`~${estimated}€ estimado`);
  }

  if (score <= 0) return null;

  return {
    user_id: profile.user_id,
    display_name: profile.display_name,
    role: profile.role,
    specialty: profile.specialty,
    zone: profile.zone,
    photo_url: profile.photo_url,
    hourly_rate: profile.hourly_rate,
    is_flash_active: profile.is_flash_active ?? false,
    is_verified: profile.is_verified ?? false,
    is_early_adopter: isEarlyAdopter(profile),
    score: profile.score ?? 0,
    fast_responder_count: profile.fast_responder_count ?? 0,
    avgRating: ratingInfo.avg,
    reviewCount: ratingInfo.count,
    matchScore: score,
    matchReasons: reasons,
    estimatedPrice: estimated,
  };
}

export function useSmartMatch(query: MatchQuery | null): { results: MatchedProfessional[]; loading: boolean } {
  const [results, setResults] = useState<MatchedProfessional[]>([]);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    if (!query) { setResults([]); return; }
    setLoading(true);

    const [profilesRes, reviewsRes, availRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('user_id, display_name, role, roles, specialty, zone, city_ref, photo_url, hourly_rate, is_flash_active, is_verified, bio, audio_embed_url, audio_session_urls, portfolio_urls, score, fast_responder_count, is_early_adopter_override')
        .contains('roles', [query.role])
        .not('display_name', 'is', null)
        .limit(100),
      supabase.from('reviews').select('reviewed_user_id, rating').eq('approved', true),
      query.eventDate
        ? supabase.from('availability').select('user_id, blocked_date').eq('blocked_date', query.eventDate)
        : Promise.resolve({ data: [] }),
    ]);

    const profiles = profilesRes.data ?? [];
    const reviews = reviewsRes.data ?? [];
    const blocked = new Set((availRes.data ?? []).map((r: any) => r.user_id));

    const ratingMap = new Map<string, { sum: number; count: number }>();
    reviews.forEach((r: any) => {
      if (!r.reviewed_user_id) return;
      const e = ratingMap.get(r.reviewed_user_id) || { sum: 0, count: 0 };
      e.sum += r.rating;
      e.count += 1;
      ratingMap.set(r.reviewed_user_id, e);
    });

    const blockedForDate = new Set<string>();
    (availRes.data ?? []).forEach((r: any) => blockedForDate.add(r.user_id));

    const matched = profiles
      .filter(p => p.display_name?.trim().length > 1)
      .map(p => {
        const ri = ratingMap.get(p.user_id);
        const avg = ri ? Math.round((ri.sum / ri.count) * 10) / 10 : 0;
        const count = ri?.count ?? 0;
        const userBlocked = new Set<string>();
        if (blockedForDate.has(p.user_id)) userBlocked.add(query.eventDate!);
        return computeMatch(p, { avg, count }, userBlocked, query);
      })
      .filter((m): m is MatchedProfessional => m !== null)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    setResults(matched);
    setLoading(false);
  }, [query?.role, query?.city, query?.eventDate, query?.maxBudget, query?.eventType]);

  useEffect(() => { run(); }, [run]);

  return { results, loading };
}
