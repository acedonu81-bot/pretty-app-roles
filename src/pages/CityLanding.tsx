import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Star, Shield, ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isEarlyAdopter } from '@/lib/earlyAdopter';
import { toSlug } from '@/data/profiles';

// Fecha de última modificación (congelada al renderizar; en prerender = build).
// Señal de frescura para motores generativos, que penalizan contenido stale.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

interface Prof { id: string; display_name: string; photo_url: string | null; bio: string | null; city: string | null; role: string; score: number; slug: string; is_verified: boolean; is_early_adopter: boolean; }

const ROLE_MAP: Record<string, string[]> = {
  dj: ['dj'], camareros: ['camarero', 'staff'], fotografo: ['media'], staff: ['staff', 'promotor'],
  catering: ['catering'], maquillaje: ['makeup'], peluqueria: ['peluqueria'], promotores: ['promotor'],
  'disco-movil': ['dj'], vestuario: ['vestuario', 'staff'], azafata: ['azafata'],
  // Categorías que antes caían al fallback ['dj'] y por eso nunca encontraban
  // a nadie, pese a existir esos roles en la BD (bailarin, grupo-musical…).
  bailarin: ['bailarin'], 'grupo-musical': ['grupo-musical'],
  humorista: ['humorista'], monologo: ['humorista'], monologos: ['humorista'],
  mago: ['mago'], animador: ['animador'], animadores: ['animador'],
  payaso: ['payaso'], payasos: ['payaso'], speaker: ['speaker'],
  'photo-booth': ['photo-booth'],
};

// Durante el prerender de build (prerender-content.mjs), esta variable global
// trae los profesionales ya resueltos para la ruta actual — renderToString es
// síncrono y no espera al useEffect de abajo, así que sin esto el HTML servido
// a crawlers nunca incluye profesionales reales ni enlaces a /p/:slug.
// En el navegador normal esta variable nunca existe y el hook se comporta
// exactamente igual que antes (fetch client-side vía Supabase).
declare global {
  // eslint-disable-next-line no-var
  var __PRERENDER_PROFILES__: { profs: Prof[]; suggestions: Prof[] } | undefined;
}

function useCityProfessionals(ciudad: string, categorySlug: string) {
  const preloaded = typeof globalThis !== 'undefined' ? globalThis.__PRERENDER_PROFILES__ : undefined;
  const [profs, setProfs] = useState<Prof[]>(preloaded?.profs ?? []);
  const [suggestions, setSuggestions] = useState<Prof[]>(preloaded?.suggestions ?? []);
  const [loaded, setLoaded] = useState(!!preloaded);

  useEffect(() => {
    if (preloaded) return;
    setLoaded(false);
    setProfs([]);
    setSuggestions([]);
    const roles = ROLE_MAP[categorySlug] ?? ['dj'];
    // No existe columna slug en profiles — se deriva del nombre, igual que
    // hace PublicProfile.tsx al resolver /p/:slug.
    const map = (p: any): Prof => ({ id: p.user_id, display_name: p.display_name ?? 'Profesional', photo_url: p.photo_url, bio: p.bio, city: p.zone, role: p.role, score: p.score ?? 0, slug: toSlug(p.display_name ?? p.user_id), is_verified: p.is_verified ?? false, is_early_adopter: isEarlyAdopter(p) });

    supabase
      .from('profiles')
      .select('user_id,display_name,photo_url,bio,zone,role,score,is_verified,audio_embed_url,audio_session_urls,portfolio_urls,is_early_adopter_override')
      .in('role', roles)
      // is_primary marca el perfil principal de una cuenta de agencia con
      // varios perfiles (useProfile.tsx). Filtrar por él aquí escondía a todo
      // profesional con un único perfil, porque createProfile lo inserta como
      // false y nada lo asciende: 31 de 34 perfiles quedaban invisibles en
      // todas las páginas de ciudad. Se ordena por él, como hacen Landing.tsx
      // y Auth.tsx, en vez de excluir.
      .ilike('zone', `%${ciudad}%`)
      // Respeta is_public, que la RLS no filtra: un perfil marcado como no
      // público (p.ej. el que tiene un email por nombre) no debe listarse.
      .or('is_public.is.null,is_public.eq.true')
      .order('is_primary', { ascending: false })
      .order('score', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data?.length) {
          setProfs(data.map(map));
          setLoaded(true);
        } else {
          // No hay en esta ciudad — cargar sugerencias nacionales
          supabase
            .from('profiles')
            .select('user_id,display_name,photo_url,bio,zone,role,score,is_verified,audio_embed_url,audio_session_urls,portfolio_urls,is_early_adopter_override')
            .in('role', roles)
            .or('is_public.is.null,is_public.eq.true')
            .order('is_primary', { ascending: false })
            .order('score', { ascending: false })
            .limit(4)
            .then(({ data: sug }) => {
              setSuggestions((sug ?? []).map(map));
              setLoaded(true);
            });
        }
      });
  }, [ciudad, categorySlug]);

  return { profs, suggestions, loaded };
}

type CityInfo = {
  ciudad: string;
  slug: string;
  venues: string[];
  precioMin: string;
  precioMax: string;
  seasonal?: {
    badge: string;
    months: string;
    highlight: string;
    keywords: string[];
  };
};

export const CITIES: Record<string, CityInfo> = {
  madrid:    { ciudad: 'Madrid',    slug: 'madrid',    venues: ['Fabrik', 'Mondo Disko', 'Teatro Barceló', 'Opium Madrid', 'Charada'],         precioMin: '60€',  precioMax: '300€' },
  barcelona: { ciudad: 'Barcelona', slug: 'barcelona', venues: ['Apolo', 'Razzmatazz', 'Sala Nitsa', 'Input', 'Pacha Barcelona'],              precioMin: '80€',  precioMax: '400€' },
  valencia:  { ciudad: 'Valencia',  slug: 'valencia',  venues: ['Lolita Valencia', 'Radio City', 'Akuarela', 'Sala Wah Wah', 'Garaje Beat'],   precioMin: '50€',  precioMax: '250€' },
  sevilla:   { ciudad: 'Sevilla',   slug: 'sevilla',   venues: ['Boss Club', 'Joy Eslava Sevilla', 'Sala Malandar', 'Antique Theatre', 'Cats'], precioMin: '40€',  precioMax: '200€' },
  malaga:    { ciudad: 'Málaga',    slug: 'malaga',    venues: ['Teatro Cervantes', 'Sala Velvet', 'Liceo', 'Sojo Club', 'Theatro Club'],        precioMin: '40€',  precioMax: '180€',
    seasonal: {
      badge: '☀️ Costa del Sol',
      months: 'Abril – Octubre',
      highlight: 'Málaga y la Costa del Sol concentran una alta demanda de profesionales para bodas en finca, terrazas de hotel y eventos privados en verano.',
      keywords: ['DJ Málaga verano', 'DJ bodas Costa del Sol', 'camareros eventos Málaga', 'DJ terraza Málaga', 'personal extra hostelería Málaga'],
    },
  },
  bilbao:    { ciudad: 'Bilbao',    slug: 'bilbao',    venues: ['Kafe Antzokia', 'Sala Bilborock', 'Cotton Club', 'La Noche', 'Fever'],         precioMin: '50€',  precioMax: '220€' },
  zaragoza:  { ciudad: 'Zaragoza',  slug: 'zaragoza',  venues: ['Sala Oasis', 'El Plata', 'Sala López', 'Casa del Loco', 'Amnesia'],           precioMin: '35€',  precioMax: '160€' },
  murcia:    { ciudad: 'Murcia',    slug: 'murcia',    venues: ['Garaje Club', 'B12', 'La Puerta Falsa', 'Sala Rambla', 'Hangar'],             precioMin: '30€',  precioMax: '150€' },
  palma:     { ciudad: 'Palma',     slug: 'palma',     venues: ['Pacha Mallorca', 'Tito\'s', 'Nikki Beach', 'Bésame', 'Es Gremi'],            precioMin: '60€',  precioMax: '350€',
    seasonal: {
      badge: '🌴 Temporada Alta',
      months: 'Mayo – Octubre',
      highlight: 'Mallorca concentra cientos de eventos privados en fincas, villas y yates de junio a septiembre. La demanda de DJs y camareros se multiplica x3 en verano.',
      keywords: ['DJ Mallorca verano', 'DJ villa Mallorca', 'camareros temporada Palma', 'DJ pool party Mallorca', 'personal extra hostelería Mallorca'],
    },
  },
  ibiza:     { ciudad: 'Ibiza',     slug: 'ibiza',     venues: ['Amnesia', 'Pacha', 'DC-10', 'Hi Ibiza', 'Ushuaïa'],                           precioMin: '150€', precioMax: '2000€',
    seasonal: {
      badge: '🎉 Temporada Ibiza',
      months: 'Mayo – Septiembre',
      highlight: 'Ibiza es el epicentro mundial de eventos privados en villa, pool parties y yates de mayo a octubre. Los mejores profesionales se agotan con semanas de antelación.',
      keywords: ['DJ villa Ibiza', 'DJ fiesta privada Ibiza', 'DJ pool party Ibiza', 'DJ eventos Ibiza', 'camareros temporada Ibiza', 'personal extra hostelería Ibiza'],
    },
  },
  alicante:      { ciudad: 'Alicante',           slug: 'alicante',      venues: ['Sala Stereo', 'Oz Club', 'Arena Discoteca', 'Chocolat Club', 'Sala Oz'],          precioMin: '40€', precioMax: '200€',
    seasonal: { badge: '☀️ Costa Blanca', months: 'Abril – Octubre', highlight: 'Alicante y la Costa Blanca concentran bodas en finca, fiestas en villa y eventos de playa con alta demanda en verano.', keywords: ['DJ Alicante verano', 'DJ bodas Costa Blanca', 'camareros eventos Alicante'] },
  },
  granada:       { ciudad: 'Granada',            slug: 'granada',       venues: ['Sala Industrial Copera', 'El Camborio', 'Clandestino', 'Suite Granada', 'Planta Baja'], precioMin: '35€', precioMax: '180€' },
  cordoba:       { ciudad: 'Córdoba',            slug: 'cordoba',       venues: ['Teatro Cómico', 'Sala Zero', 'Week Club', 'El Tablón', 'Sala Noches'],              precioMin: '30€', precioMax: '160€' },
  valladolid:    { ciudad: 'Valladolid',         slug: 'valladolid',    venues: ['Sala Cuatro', 'Tótem Club', 'Malandar Valladolid', 'Planta Baja', 'Le Club'],       precioMin: '30€', precioMax: '150€' },
  sansebastian:  { ciudad: 'San Sebastián',      slug: 'sansebastian',  venues: ['Bataplan', 'Ku Discoteca', 'Etxekalte', 'Sala Dabadaba', 'Mau Mau'],               precioMin: '60€', precioMax: '280€' },
  santander:     { ciudad: 'Santander',          slug: 'santander',     venues: ['Sala El Tren', 'Pub Wenceslao', 'Suite Santander', 'Nuit Club', 'La Parka'],        precioMin: '35€', precioMax: '160€',
    seasonal: { badge: '🌊 Verano Cantábrico', months: 'Junio – Septiembre', highlight: 'Santander activa su temporada de eventos en verano: bodas en finca, terrazas de hotel y fiestas privadas junto al mar.', keywords: ['DJ Santander verano', 'DJ eventos Cantabria', 'camareros bodas Santander'] },
  },
  coruna:        { ciudad: 'A Coruña',           slug: 'coruna',        venues: ['Mardi Gras', 'Plastic', 'Discoteca Playa Club', 'Suite Coruña', 'Metrópolis'],      precioMin: '35€', precioMax: '170€' },
  tenerife:      { ciudad: 'Tenerife',           slug: 'tenerife',      venues: ['Papagayo Beach Club', 'Monkey Beach Club', 'Café Latino', 'Tramps Tenerife', 'Prisma'], precioMin: '50€', precioMax: '300€',
    seasonal: { badge: '🌴 Canarias Todo el Año', months: 'Todo el año', highlight: 'Tenerife tiene temporada activa los 12 meses. Sur de Tenerife concentra hoteles de lujo, bodas internacionales y eventos en villa con alta demanda constante.', keywords: ['DJ Tenerife eventos', 'DJ bodas Tenerife', 'camareros temporada Tenerife', 'DJ sur Tenerife'] },
  },
  laspalmas:     { ciudad: 'Las Palmas',         slug: 'laspalmas',     venues: ['Café Olivo', 'Discoteca Flower Power', 'Suite Las Palmas', 'La Cueva', 'Pacha Gran Canaria'], precioMin: '40€', precioMax: '250€',
    seasonal: { badge: '🌴 Gran Canaria', months: 'Todo el año', highlight: 'Las Palmas y Gran Canaria tienen demanda constante de DJs y personal de eventos todo el año, con picos en Carnaval y verano.', keywords: ['DJ Las Palmas eventos', 'DJ Gran Canaria', 'camareros eventos Las Palmas'] },
  },
  lapalma:       { ciudad: 'La Palma',           slug: 'lapalma',       venues: ['Sala El Tiempo', 'Discoteca Folías', 'Club Náutico La Palma', 'Terraza Parador', 'La Bodeguita'], precioMin: '35€', precioMax: '180€',
    seasonal: { badge: '🌋 Isla Bonita', months: 'Todo el año', highlight: 'La Palma crece en turismo de lujo y bodas en entorno natural único. La isla sufre escasez crónica de profesionales — XPEAK cubre esa demanda.', keywords: ['DJ La Palma Canarias', 'DJ bodas La Palma', 'camareros eventos La Palma', 'personal eventos isla La Palma'] },
  },
  lanzarote:     { ciudad: 'Lanzarote',          slug: 'lanzarote',     venues: ['Jameos del Agua', 'La Cueva del Diablo', 'Papagayo Lanzarote', 'Suite Lanzarote', 'Costa Teguise Club'], precioMin: '50€', precioMax: '280€',
    seasonal: { badge: '🌋 Lanzarote', months: 'Todo el año', highlight: 'Lanzarote combina turismo internacional todo el año con bodas en entornos volcánicos únicos. Alta demanda de DJs y personal para hoteles y eventos privados.', keywords: ['DJ Lanzarote eventos', 'DJ bodas Lanzarote', 'camareros hoteles Lanzarote'] },
  },
  fuerteventura: { ciudad: 'Fuerteventura',      slug: 'fuerteventura', venues: ['Waikiki Beach Club', 'Suite Fuerteventura', 'Oasis Park', 'Sands Beach Club', 'La Pared Club'],  precioMin: '40€', precioMax: '250€',
    seasonal: { badge: '🏄 Fuerteventura', months: 'Todo el año', highlight: 'Fuerteventura concentra resorts internacionales, kite surf y bodas en playa. Demanda constante de DJs y personal para eventos en hotel y fiestas privadas.', keywords: ['DJ Fuerteventura bodas', 'DJ eventos Fuerteventura', 'camareros resorts Fuerteventura'] },
  },
  menorca:       { ciudad: 'Menorca',            slug: 'menorca',       venues: ['Cova d\'en Xoroi', 'Es Cau', 'Suite Mahón', 'Casino San Clemente', 'Cafe Balear'],   precioMin: '60€', precioMax: '320€',
    seasonal: { badge: '🌿 Menorca', months: 'Mayo – Octubre', highlight: 'Menorca es destino de lujo y bodas exclusivas. Cova den Xoroi es uno de los clubs más icónicos de España. Alta demanda de profesionales para eventos privados y bodas en finca.', keywords: ['DJ Menorca bodas', 'DJ Menorca eventos', 'camareros bodas Menorca', 'DJ Cova den Xoroi'] },
  },
  formentera:    { ciudad: 'Formentera',         slug: 'formentera',    venues: ['Beso Beach', 'Juan y Andrea', 'Hostal La Savina', 'Es Pujols Club', 'Fonda Pepe'],   precioMin: '120€', precioMax: '1500€',
    seasonal: { badge: '🏝️ Formentera', months: 'Junio – Septiembre', highlight: 'Formentera es el destino más exclusivo del Mediterráneo. Fiestas privadas en villa, yates y beach clubs de lujo con DJs de primer nivel. Demanda altísima y oferta casi inexistente.', keywords: ['DJ Formentera villa', 'DJ fiesta privada Formentera', 'DJ Formentera verano', 'camareros Formentera'] },
  },
  // Ciudades ampliadas — cobertura nacional completa
  vigo:          { ciudad: 'Vigo',               slug: 'vigo',          venues: ['Pub Modus', 'Discoteca Acuario', 'Sala Radar', 'Why Not Vigo', 'Chaman Club'],        precioMin: '35€', precioMax: '160€' },
  santiago:      { ciudad: 'Santiago de Compostela', slug: 'santiago',  venues: ['Sala Capitol', 'Modus Vivendi', 'The Old House', 'Pub Momo', 'Discoteca Azabache'],  precioMin: '35€', precioMax: '160€' },
  gijon:         { ciudad: 'Gijón',              slug: 'gijon',         venues: ['Sala Acapulco', 'Discoteca 2001', 'Pub Triskel', 'Sala Albéniz', 'Club Escape'],      precioMin: '30€', precioMax: '150€' },
  oviedo:        { ciudad: 'Oviedo',             slug: 'oviedo',        venues: ['Sala Gruta', 'La Cámara', 'Discoteca Ciao', 'Pub Bambú', 'Sala Ítaca'],              precioMin: '30€', precioMax: '150€' },
  vitoria:       { ciudad: 'Vitoria-Gasteiz',    slug: 'vitoria',       venues: ['Sala Comercial', 'Discoteca Ozono', 'Pub Laredo', 'El Jardín', 'Sala Aplauso'],      precioMin: '35€', precioMax: '160€' },
  pamplona:      { ciudad: 'Pamplona',           slug: 'pamplona',      venues: ['Sala Totem', 'Discoteca Reverb', 'Pub Txoko', 'La Morea Club', 'Sala Zentral'],      precioMin: '35€', precioMax: '170€' },
  logrono:       { ciudad: 'Logroño',            slug: 'logrono',       venues: ['Pub Peñas', 'Discoteca Sala 8', 'Club Escena', 'La Cueva', 'Sala Gonzalo'],          precioMin: '30€', precioMax: '140€' },
  salamanca:     { ciudad: 'Salamanca',          slug: 'salamanca',     venues: ['Camelot Club', 'Gatsby Club', 'Sala Versalles', 'Disco Safari', 'Pub Doctor'],       precioMin: '30€', precioMax: '150€' },
  toledo:        { ciudad: 'Toledo',             slug: 'toledo',        venues: ['Sala Lava', 'Discoteca Manhattan', 'Pub El Corral', 'Circus Club', 'La Sala'],        precioMin: '30€', precioMax: '140€' },
  albacete:      { ciudad: 'Albacete',           slug: 'albacete',      venues: ['Sala Big Ben', 'Discoteca Sphaerum', 'Pub San Juan', 'Club Génesis', 'La Riviera'],   precioMin: '25€', precioMax: '130€' },
  marbella:      { ciudad: 'Marbella',           slug: 'marbella',      venues: ['Ocean Club', 'Nikki Beach Marbella', 'Suite 88', 'Olivia Valere', 'Buddha'],          precioMin: '80€', precioMax: '600€',
    seasonal: { badge: '☀️ Costa del Sol VIP', months: 'Mayo – Octubre', highlight: 'Marbella es el destino premium de la Costa del Sol. Beach clubs, fincas de lujo y villas de alta gama concentran la mayor demanda de DJs y staff de alto nivel.', keywords: ['DJ Marbella villa', 'DJ Marbella boda', 'camareros Marbella beach club'] } },
  benidorm:      { ciudad: 'Benidorm',           slug: 'benidorm',      venues: ['Penélope Club', 'Ku Benidorm', 'Disco 9 Club', 'Benidorm Palace', 'Sala Pub'],        precioMin: '40€', precioMax: '250€',
    seasonal: { badge: '🌞 Temporada Benidorm', months: 'Abril – Octubre', highlight: 'Benidorm concentra la mayor densidad de clubs y hoteles por habitante de España. Alta demanda de DJs y personal de hostelería todo el verano.', keywords: ['DJ Benidorm verano', 'camareros hoteles Benidorm'] } },
  sitges:        { ciudad: 'Sitges',             slug: 'sitges',        venues: ['Atlantida Sitges', 'Privilege Sitges', 'El Patio', 'Organic Club', 'Bar Parrot'],     precioMin: '60€', precioMax: '300€',
    seasonal: { badge: '🌊 Sitges', months: 'Mayo – Octubre', highlight: 'Sitges concentra eventos, festivales y bodas todo el verano. Alta demanda de DJs y personal para eventos de playa y fiestas privadas.', keywords: ['DJ Sitges eventos', 'DJ Sitges boda', 'camareros Sitges'] } },
  tarragona:     { ciudad: 'Tarragona',          slug: 'tarragona',     venues: ['Sala Zeppelin', 'Discoteca Tequila', 'Pub Saratoga', 'Club Cocoa', 'Sala B5'],       precioMin: '40€', precioMax: '180€' },
  lleida:        { ciudad: 'Lleida',             slug: 'lleida',        venues: ['Sala Capitol', 'Discoteca Cheers', 'Pub Molino', 'Club Lotus', 'Sala Indiana'],       precioMin: '25€', precioMax: '130€' },
  girona:        { ciudad: 'Girona',             slug: 'girona',        venues: ['Sala Platea', 'Pub La Sala', 'Club Borsalino', 'Discoteca Rocambola', 'Neon Club'],   precioMin: '40€', precioMax: '180€' },
  castellon:     { ciudad: 'Castellón',          slug: 'castellon',     venues: ['Discoteca Zona', 'Pub Mónaco', 'Sala B12', 'Club Zenith', 'La Fábrica'],             precioMin: '30€', precioMax: '150€' },
  almeria:       { ciudad: 'Almería',            slug: 'almeria',       venues: ['Sala Torresolo', 'Discoteca El Pueblo', 'Club Maxi', 'Pub Bamboleo', 'La Bodega'],    precioMin: '30€', precioMax: '150€' },
  huelva:        { ciudad: 'Huelva',             slug: 'huelva',        venues: ['Sala Mandala', 'Discoteca Zeus', 'Pub Rincón', 'Club Cosmos', 'La Traca'],            precioMin: '25€', precioMax: '130€' },
  jaen:          { ciudad: 'Jaén',               slug: 'jaen',          venues: ['Sala Olympo', 'Discoteca Galaxia', 'Pub Mandrágora', 'Club Noctámbulos', 'El Rincón'], precioMin: '25€', precioMax: '120€' },
  cadiz:         { ciudad: 'Cádiz',              slug: 'cadiz',         venues: ['Sala La Clandestina', 'Discoteca Moma', 'Pub El Balandro', 'Club 7 Vidas', 'La Peña'], precioMin: '30€', precioMax: '150€' },
  badajoz:       { ciudad: 'Badajoz',            slug: 'badajoz',       venues: ['Sala Zona 5', 'Discoteca Avenue', 'Pub Eterno', 'Club Eskalera', 'La Noche'],         precioMin: '25€', precioMax: '120€' },
  caceres:       { ciudad: 'Cáceres',            slug: 'caceres',       venues: ['Sala Música', 'Discoteca La Madrugada', 'Pub Barón', 'Club Xplore', 'El Corcho'],    precioMin: '25€', precioMax: '120€' },
  leon:          { ciudad: 'León',               slug: 'leon',          venues: ['Sala Maravillas', 'Discoteca Houdini', 'Pub Claustro', 'Club Studio', 'La Noche'],   precioMin: '25€', precioMax: '130€' },
  burgos:        { ciudad: 'Burgos',             slug: 'burgos',        venues: ['Sala Bohemio', 'Discoteca Atenas', 'Pub La Mafia', 'Club Atlético', 'La Trastienda'], precioMin: '25€', precioMax: '130€' },
  segovia:       { ciudad: 'Segovia',            slug: 'segovia',       venues: ['Sala El Alcázar', 'Pub Mesón', 'Club Medieval', 'Terraza La Muralla', 'El Refugio'],  precioMin: '30€', precioMax: '140€' },
  pontevedra:    { ciudad: 'Pontevedra',         slug: 'pontevedra',    venues: ['Sala Karma', 'Pub Alameda', 'Discoteca Bahía', 'Club 5 Sentidos', 'La Noche'],        precioMin: '30€', precioMax: '140€' },
  lugo:          { ciudad: 'Lugo',               slug: 'lugo',          venues: ['Sala Lugo', 'Pub La Merced', 'Discoteca Galaxia', 'Club Espiral', 'El Molino'],       precioMin: '25€', precioMax: '120€' },
  ourense:       { ciudad: 'Ourense',            slug: 'ourense',       venues: ['Sala As Burgas', 'Pub Cardenal', 'Discoteca Domus', 'Club Thermal', 'La Taberna'],    precioMin: '25€', precioMax: '120€' },
  avila:         { ciudad: 'Ávila',              slug: 'avila',         venues: ['Sala Muralla', 'Pub Medieval', 'Discoteca Siglo XV', 'Club Torreón', 'La Bodega'],    precioMin: '25€', precioMax: '120€' },
  cuenca:        { ciudad: 'Cuenca',             slug: 'cuenca',        venues: ['Sala Casas Colgadas', 'Pub El Ventilador', 'Club Serranía', 'Discoteca Matrix', 'El Hoyo'], precioMin: '25€', precioMax: '120€' },
  guadalajara:   { ciudad: 'Guadalajara',        slug: 'guadalajara',   venues: ['Sala Carena', 'Discoteca Azteca', 'Pub El Palacio', 'Club Fuente', 'La Estrella'],    precioMin: '25€', precioMax: '130€' },
  huesca:        { ciudad: 'Huesca',             slug: 'huesca',        venues: ['Sala Pirámide', 'Pub Montearagón', 'Discoteca Helios', 'Club Pyros', 'La Cueva'],     precioMin: '25€', precioMax: '120€' },
  teruel:        { ciudad: 'Teruel',             slug: 'teruel',        venues: ['Sala Mudéjar', 'Pub Amantes', 'Discoteca El Torico', 'Club Aragón', 'La Taberna'],    precioMin: '20€', precioMax: '110€' },
  soria:         { ciudad: 'Soria',              slug: 'soria',         venues: ['Sala Duero', 'Pub La Numancia', 'Discoteca Medinaceli', 'Club Pinar', 'El Rincón'],   precioMin: '20€', precioMax: '100€' },
  elche:         { ciudad: 'Elche',              slug: 'elche',         venues: ['Sala Palmeral', 'Discoteca Noctambulos', 'Pub Altamira', 'Club Milenio', 'La Nit'],   precioMin: '35€', precioMax: '160€' },
  cartagena:     { ciudad: 'Cartagena',          slug: 'cartagena',     venues: ['Sala Arsenal', 'Discoteca Anfiteatro', 'Pub Naval', 'Club Mediterráneo', 'La Cueva'], precioMin: '30€', precioMax: '150€' },
  jerez:         { ciudad: 'Jerez de la Frontera', slug: 'jerez',       venues: ['Sala Jerez', 'Discoteca Karting', 'Pub El Gallo', 'Club Bodega', 'La Tasca'],        precioMin: '30€', precioMax: '150€' },
  costaadeje:    { ciudad: 'Costa Adeje',        slug: 'costaadeje',    venues: ['Hard Rock Tenerife', 'Papagayo Beach Club', 'El Cine Club', 'Tropic Club', 'Monkey Beach'], precioMin: '60€', precioMax: '350€',
    seasonal: { badge: '🌴 Sur Tenerife', months: 'Todo el año', highlight: 'Costa Adeje y el sur de Tenerife concentran hoteles de lujo, bodas internacionales y eventos privados todo el año.', keywords: ['DJ Costa Adeje', 'DJ bodas sur Tenerife', 'camareros hoteles Costa Adeje'] } },
  // Municipios grandes
  fuengirola:    { ciudad: 'Fuengirola',          slug: 'fuengirola',    venues: ['Marenostrum Resort', 'Sala Mango', 'Pub Sea Garden', 'Club Yate', 'La Quinta'],      precioMin: '45€', precioMax: '220€',
    seasonal: { badge: '☀️ Costa del Sol', months: 'Abril – Octubre', highlight: 'Fuengirola es uno de los municipios turísticos más activos de la Costa del Sol, con alta demanda de DJs y personal para hoteles y eventos en verano.', keywords: ['DJ Fuengirola verano', 'camareros eventos Fuengirola', 'DJ bodas Fuengirola'] } },
  torremolinos:  { ciudad: 'Torremolinos',        slug: 'torremolinos',  venues: ['Sala Waikiki', 'Discoteca Palladium', 'Pub Nogalera', 'Club Havana', 'La Taberna'],  precioMin: '40€', precioMax: '200€',
    seasonal: { badge: '☀️ Costa del Sol', months: 'Abril – Octubre', highlight: 'Torremolinos concentra clubs y hoteles de playa con alta demanda de DJs y staff en verano. Ambiente cosmopolita y eventos LGBTQ+.', keywords: ['DJ Torremolinos verano', 'DJ Torremolinos clubs', 'camareros Torremolinos'] } },
  benalmadena:   { ciudad: 'Benalmádena',         slug: 'benalmadena',   venues: ['Casino Torrequebrada', 'Sala Fortuna', 'Pub Puerto Marina', 'Club Kiu', 'La Arena'], precioMin: '40€', precioMax: '200€',
    seasonal: { badge: '☀️ Costa del Sol', months: 'Abril – Octubre', highlight: 'Benalmádena y su Puerto Marina concentran restaurantes, clubs y eventos en verano. Casino Torrequebrada es referencia de entretenimiento en la Costa del Sol.', keywords: ['DJ Benalmádena', 'camareros Puerto Marina', 'DJ eventos Benalmádena'] } },
  estepona:      { ciudad: 'Estepona',            slug: 'estepona',      venues: ['Sala La Rada', 'Discoteca Suite', 'Pub Bodegas', 'Club Cosmo', 'La Terraza'],        precioMin: '45€', precioMax: '250€',
    seasonal: { badge: '☀️ Costa del Sol', months: 'Mayo – Octubre', highlight: 'Estepona está en auge con nuevos complejos de lujo y campos de golf. Alta demanda de DJs y personal para eventos en villas y fincas.', keywords: ['DJ Estepona', 'camareros Estepona eventos', 'DJ boda Estepona'] } },
  gandia:        { ciudad: 'Gandía',              slug: 'gandia',        venues: ['Discoteca Spook', 'Sala Norte', 'Pub Heaven', 'Club Ítaca', 'La Crema'],            precioMin: '35€', precioMax: '180€',
    seasonal: { badge: '🌊 Valencia Coast', months: 'Junio – Septiembre', highlight: 'Gandía es el destino de eventos y entretenimiento más activo de la Comunidad Valenciana en verano. Spook Factory es referencia nacional de música electrónica.', keywords: ['DJ Gandía verano', 'DJ Spook Gandía', 'camareros eventos Gandía'] } },
  denia:         { ciudad: 'Dénia',               slug: 'denia',         venues: ['Sala La Pedrera', 'Pub El Quinto', 'Club Faralló', 'La Raqueta', 'Terraza Tramontana'], precioMin: '40€', precioMax: '200€',
    seasonal: { badge: '🌊 Costa Blanca Norte', months: 'Mayo – Septiembre', highlight: 'Dénia combina turismo familiar y de lujo con bodas en finca y eventos privados. Alta demanda de DJs y camareros en verano.', keywords: ['DJ Dénia bodas', 'camareros eventos Dénia', 'DJ fiesta privada Dénia'] } },
  calpe:         { ciudad: 'Calpe',               slug: 'calpe',         venues: ['Club Salinas', 'Pub El Peñón', 'Discoteca Infinity', 'Terraza Ifach', 'La Lonja'],   precioMin: '40€', precioMax: '200€',
    seasonal: { badge: '🌊 Costa Blanca', months: 'Mayo – Septiembre', highlight: 'Calpe y el Peñón de Ifach son referencia en bodas con vistas al mar y eventos privados de lujo en la Costa Blanca.', keywords: ['DJ Calpe boda', 'camareros Calpe eventos', 'DJ fiesta privada Calpe'] } },
  javea:         { ciudad: 'Jávea',               slug: 'javea',         venues: ['Club Náutico Jávea', 'Pub Tossalet', 'Discoteca Pirámide', 'La Siesta', 'El Arenal Club'], precioMin: '50€', precioMax: '280€',
    seasonal: { badge: '🌊 Costa Blanca', months: 'Mayo – Septiembre', highlight: 'Jávea es destino premium en la Costa Blanca con alta concentración de residentes europeos. Bodas en villa y eventos exclusivos todo el verano.', keywords: ['DJ Jávea bodas', 'camareros Jávea eventos', 'DJ villa Jávea'] } },
  talavera:      { ciudad: 'Talavera de la Reina', slug: 'talavera',     venues: ['Sala Kalipso', 'Discoteca La Fábrica', 'Pub Aljibe', 'Club Menfis', 'La Vega'],     precioMin: '25€', precioMax: '130€' },
  getafe:        { ciudad: 'Getafe',              slug: 'getafe',        venues: ['Sala Bonavista', 'Discoteca Area', 'Pub Getafe Center', 'Club 4', 'La Esquina'],     precioMin: '30€', precioMax: '150€' },
  alcorcon:      { ciudad: 'Alcorcón',            slug: 'alcorcon',      venues: ['Sala Independencia', 'Pub Alcazar', 'Discoteca Fenix', 'Club Base', 'La Pista'],     precioMin: '30€', precioMax: '150€' },
  leganes:       { ciudad: 'Leganés',             slug: 'leganes',       venues: ['Sala La Herrería', 'Pub Madrid Sur', 'Discoteca Ozone', 'Club Central', 'La Nave'],  precioMin: '30€', precioMax: '150€' },
  mostoles:      { ciudad: 'Móstoles',            slug: 'mostoles',      venues: ['Sala Altair', 'Pub Paseo', 'Discoteca Escena', 'Club Olimpo', 'La Zona'],           precioMin: '30€', precioMax: '150€' },
  fuenlabrada:   { ciudad: 'Fuenlabrada',         slug: 'fuenlabrada',   venues: ['Sala Zeus', 'Pub Plaza Norte', 'Discoteca Génesis', 'Club Babel', 'La Cueva'],      precioMin: '30€', precioMax: '140€' },
  badalona:      { ciudad: 'Badalona',            slug: 'badalona',      venues: ['Sala Razzmatazz Badalona', 'Pub Mar Badalona', 'Discoteca Cosmos', 'Club Sirius', 'La Plataforma'], precioMin: '40€', precioMax: '180€' },
  hospitalet:    { ciudad: "L'Hospitalet",        slug: 'hospitalet',    venues: ['Sala Apolo 2', 'Pub Rambla', 'Discoteca La Farga', 'Club Central', 'La Nave'],      precioMin: '40€', precioMax: '180€' },
  sabadell:      { ciudad: 'Sabadell',            slug: 'sabadell',      venues: ['Sala Rix', 'Pub El Vapor', 'Discoteca Space', 'Club Groove', 'La Industria'],       precioMin: '35€', precioMax: '170€' },
  terrassa:      { ciudad: 'Terrassa',            slug: 'terrassa',      venues: ['Sala Ègara', 'Pub La Mina', 'Discoteca Colors', 'Club Universe', 'La Fàbrica'],     precioMin: '35€', precioMax: '170€' },
  cornella:      { ciudad: 'Cornellà',            slug: 'cornella',      venues: ['Sala Bikini Sur', 'Pub Riera', 'Discoteca Antilla', 'Club Mix', 'La Zona'],         precioMin: '35€', precioMax: '170€' },
  manresa:       { ciudad: 'Manresa',             slug: 'manresa',       venues: ['Sala Stroika', 'Pub Casino', 'Discoteca Nit', 'Club La Llum', 'El Casal'],          precioMin: '30€', precioMax: '150€' },
  mataro:        { ciudad: 'Mataró',              slug: 'mataro',        venues: ['Sala Rock Dreams', 'Pub La Mar', 'Discoteca Mond', 'Club Proa', 'La Fàbrica'],      precioMin: '35€', precioMax: '160€' },
  reus:          { ciudad: 'Reus',                slug: 'reus',          venues: ['Sala Fortuny', 'Pub La Cartuja', 'Discoteca Cosmos', 'Club Eros', 'El Mercat'],     precioMin: '30€', precioMax: '150€' },
  elda:          { ciudad: 'Elda',                slug: 'elda',          venues: ['Sala Altea', 'Pub La Molineta', 'Discoteca Metrópolis', 'Club Alce', 'La Cueva'],   precioMin: '25€', precioMax: '130€' },
  torrevieja:    { ciudad: 'Torrevieja',          slug: 'torrevieja',    venues: ['Sala Mar', 'Pub Playa', 'Discoteca Picadilly', 'Club Nix', 'La Caleta'],            precioMin: '35€', precioMax: '180€',
    seasonal: { badge: '🌊 Costa Blanca Sur', months: 'Mayo – Octubre', highlight: 'Torrevieja concentra turismo europeo y residentes del norte con alta demanda de DJs y personal para eventos en verano.', keywords: ['DJ Torrevieja verano', 'camareros Torrevieja', 'DJ bodas Torrevieja'] } },
  orihuela:      { ciudad: 'Orihuela Costa',      slug: 'orihuela',      venues: ['Sala Zenia', 'Pub La Manga', 'Discoteca Dreams', 'Club Playa Flamenca', 'La Cala'],  precioMin: '35€', precioMax: '180€',
    seasonal: { badge: '🌊 Costa Blanca Sur', months: 'Mayo – Octubre', highlight: 'Orihuela Costa y La Zenia concentran urbanizaciones de lujo con bodas en finca y eventos privados en temporada alta.', keywords: ['DJ Orihuela Costa', 'camareros Orihuela eventos', 'DJ bodas Orihuela'] } },
  valdemoro:     { ciudad: 'Valdemoro',           slug: 'valdemoro',     venues: ['Sala Central', 'Pub La Plaza', 'Discoteca Oasis', 'Club Zona', 'El Gato'],          precioMin: '25€', precioMax: '130€' },
  pozuelo:       { ciudad: 'Pozuelo de Alarcón',  slug: 'pozuelo',       venues: ['Sala Pozuelo', 'Pub La Dehesa', 'Discoteca Campus', 'Club Alto', 'La Finca'],       precioMin: '40€', precioMax: '200€' },
  majadahonda:   { ciudad: 'Majadahonda',         slug: 'majadahonda',   venues: ['Sala Majadahonda', 'Pub La Estación', 'Discoteca Classic', 'Club Monte', 'El Lago'], precioMin: '40€', precioMax: '200€' },
  elmasnou:      { ciudad: 'El Masnou',           slug: 'elmasnou',      venues: ['Sala Port', 'Pub La Barca', 'Club Mar', 'Terraza El Masnou', 'La Riba'],            precioMin: '40€', precioMax: '180€' },
  vilanova:      { ciudad: 'Vilanova i la Geltrú', slug: 'vilanova',     venues: ['Sala Maldà', 'Pub La Geltrú', 'Discoteca Cosmos', 'Club Maresme', 'La Musclera'],   precioMin: '40€', precioMax: '180€' },
};

type CategoryInfo = {
  label: string;
  keyword: string;
  unidad: string;
  desc: (ciudad: string) => string;
  intro: (ciudad: string, venues: string[]) => string;
  faqs: (ciudad: string, precio: string) => { q: string; a: string }[];
};

export const CATEGORIES: Record<string, CategoryInfo> = {
  dj: {
    label: 'DJ',
    keyword: 'DJ',
    unidad: '/hora',
    desc: (c) => {
      if (c === 'Ibiza') return 'DJ villa Ibiza, DJ fiesta privada Ibiza, DJ pool party Ibiza. DJs verificados disponibles en temporada. Flash Booking en menos de 1h. Contratos digitales. Sin comisión.';
      if (c === 'Palma') return 'DJ villa Mallorca, DJ pool party Palma, DJ fiestas privadas Mallorca. Temporada mayo-octubre. Flash Booking en menos de 1h. Sin comisión.';
      return `DJs verificados en ${c}: Tech House, Techno, Comercial y más. Flash Booking en menos de 1h. Contratos automáticos. Sin comisión.`;
    },
    intro: (c, venues) => {
      if (c === 'Ibiza') return 'Ibiza es el destino número uno para DJs y eventos privados en Europa. Villas, yates, pool parties y clubs de clase mundial como Amnesia, Pacha o DC-10. XPEAK conecta organizadores con DJs verificados disponibles en Ibiza para fiestas privadas, eventos en villa y clubs. Temporada activa de mayo a octubre.';
      if (c === 'Palma') return 'Mallorca concentra cientos de eventos privados en finca, villa y yate de mayo a octubre. XPEAK conecta organizadores con DJs verificados en Palma y toda Mallorca: desde pool parties en villas hasta bodas en finca y eventos corporativos en hotel resort.';
      return `${c} concentra una de las escenas de eventos y entretenimiento más activas de España. Desde clubs como ${venues.slice(0,2).join(' y ')} hasta eventos privados, XPEAK conecta salas, promotoras y organizadores con DJs verificados disponibles ahora mismo.`;
    },
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un DJ en ${c}?`, a: c === 'Ibiza'
        ? `El precio de un DJ en Ibiza varía entre ${precio}/hora según el nombre del artista y el tipo de evento. Un DJ para villa privada cuesta orientativamente 300€–800€ por noche. DJs residentes de clubs reconocidos pueden superar los 2.000€. En XPEAK todos los perfiles muestran su tarifa pública.`
        : `El precio de un DJ en ${c} varía entre ${precio}/hora según experiencia y equipo. En XPEAK todos los perfiles muestran su tarifa pública antes de contactar.` },
      { q: c === 'Ibiza' ? '¿Puedo contratar DJ para una fiesta en villa de Ibiza?' : `¿Cómo funciona el Flash Booking en ${c}?`,
        a: c === 'Ibiza'
          ? 'Sí. XPEAK tiene DJs especializados en eventos privados en villa: conocen la normativa de ruido de Ibiza, trabajan con equipo silencioso o indoor y tienen experiencia con grupos internacionales. Puedes publicar tu oferta de villa y recibir candidaturas en menos de 1 hora.'
          : `Publica una oferta urgente y recibe respuestas de DJs disponibles en ${c} en menos de 60 minutos. Ideal para sustituciones de última hora.` },
      { q: '¿XPEAK cobra comisión?', a: 'No. XPEAK es completamente gratuito para salas y promotoras. El contrato se cierra directamente entre tú y el profesional.' },
      ...(c === 'Ibiza' ? [{ q: '¿Con cuánta antelación hay que contratar DJ en Ibiza en temporada?', a: 'En temporada alta (junio–septiembre) los mejores DJs de Ibiza se agotan con 2–4 semanas de antelación. Si tu evento es en julio o agosto, reserva con al menos 1 mes. Para urgencias, el Flash Booking de XPEAK puede encontrar disponibilidad en menos de 1 hora.' }] : []),
    ],
  },
  camareros: {
    label: 'Camareros',
    keyword: 'Camareros',
    unidad: '/hora',
    desc: (c) => {
      if (c === 'Ibiza') return 'Camareros temporada Ibiza: personal extra hostelería Ibiza para villas, yates y pool parties. Contratación por horas, por noches o por temporada. Flash Booking en <1h.';
      if (c === 'Palma') return 'Camareros temporada Mallorca: personal extra para villas, fincas y resorts. Por horas o por temporada. Flash Booking disponible. 0% comisión.';
      return `Camareros profesionales en ${c} para bodas, eventos de empresa y fiestas privadas. Flash Booking en menos de 1h. Contrato digital automático. Gratis para organizadores.`;
    },
    intro: (c) => {
      if (c === 'Ibiza') return 'Ibiza necesita cientos de camareros extra cada temporada (mayo–septiembre). XPEAK conecta villas, clubs, restaurantes y organizadores de eventos con camareros y bartenders verificados disponibles en Ibiza: por horas, por noches o para toda la temporada. Personal extra hostelería disponible en menos de 1 hora con Flash Booking.';
      if (c === 'Palma') return 'Mallorca concentra una alta demanda de camareros extra en temporada estival. XPEAK conecta hoteles, fincas y organizadores de eventos en Palma con personal de sala verificado disponible para bodas, pool parties y eventos corporativos. Contratación por horas o por temporada.';
      return `Encuentra camareros y personal de sala en ${c} para cualquier tipo de evento: bodas, cenas corporativas, fiestas privadas y catering. XPEAK conecta organizadores con profesionales verificados con experiencia demostrable, disponibles para acuerdos puntuales o de temporada.`;
    },
    faqs: (c, precio) => [
      { q: `¿Cuánto cobran los camareros en ${c}?`, a: c === 'Ibiza'
        ? `Los camareros en Ibiza cobran entre ${precio}/hora en temporada, con suplemento nocturno habitual de 2–4€/hora. Para eventos de villa o yate el precio puede ser superior al incluir desplazamiento y posible alojamiento. En XPEAK todos los perfiles muestran su tarifa pública.`
        : `Los camareros profesionales en ${c} cobran entre ${precio}/hora. Para eventos de boda o corporativos con servicio completo el precio suele incluir desplazamiento y uniforme.` },
      { q: `¿Cuántos camareros necesito para mi evento en ${c}?`, a: 'La regla estándar es 1 camarero por cada 15-20 personas en formato cóctel, y 1 por cada 8-10 en cena sentada con servicio completo.' },
      { q: c === 'Ibiza' ? '¿Puedo contratar camareros por temporada en Ibiza?' : '¿Puedo contratar camareros para una sola noche?',
        a: c === 'Ibiza'
          ? 'Sí. XPEAK permite acuerdos de temporada completa (mayo–octubre) con contrato digital automático. También contrataciones puntuales para una sola noche o evento. El Flash Booking cubre urgencias en menos de 1 hora.'
          : `Sí. XPEAK permite contrataciones puntuales en ${c}. El Flash Booking notifica a los profesionales disponibles en tu zona al instante.` },
    ],
  },
  staff: {
    label: 'Staff de Eventos',
    keyword: 'Staff',
    unidad: '/hora',
    desc: (c) => `Staff profesional en ${c} para eventos, discotecas y festivales: hostesses, RRPP, promotores y coordinadores. Flash Booking en menos de 1h. Sin comisión.`,
    intro: (c) => `XPEAK conecta salas, festivales y organizadores con staff profesional verificado en ${c}: hostesses, relaciones públicas, coordinadores de sala, promotores y personal de producción. Contrato digital en minutos, sin intermediarios.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta el staff de eventos en ${c}?`, a: `El precio del staff profesional en ${c} varía entre ${precio}/hora según el perfil: hostesses desde 15€, coordinadores desde 25€, RRPP con lista propia desde 100€/noche.` },
      { q: `¿Puedo contratar staff para un festival en ${c}?`, a: `Sí. XPEAK tiene perfiles con experiencia en festivales de música en ${c} y alrededores. Puedes contratar desde 1 persona hasta equipos completos de producción.` },
      { q: '¿El staff tiene experiencia en eventos nocturnos?', a: 'Todos los perfiles en XPEAK incluyen historial de venues y referencias verificadas de eventos anteriores.' },
    ],
  },
  azafata: {
    label: 'Azafatas',
    keyword: 'Azafatas',
    unidad: '/hora',
    desc: (c) => `Azafatas profesionales en ${c} para ferias, congresos y eventos corporativos. Flash Booking en menos de 1h. Sin comisión.`,
    intro: (c) => `XPEAK conecta empresas, agencias y organizadores con azafatas verificadas en ${c}: recepción, protocolo, stands feriales y presentaciones de producto. Contrato digital en minutos, sin intermediarios.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar azafatas en ${c}?`, a: `El precio de las azafatas en ${c} varía entre ${precio}/hora según el perfil: recepción desde 15€, stands desde 18€, imagen o protocolo desde 22€.` },
      { q: `¿Puedo contratar azafatas para una feria en ${c}?`, a: `Sí. XPEAK tiene perfiles con experiencia en ferias y congresos en ${c} y alrededores. Puedes contratar desde 1 persona hasta equipos completos.` },
      { q: '¿Las azafatas tienen experiencia en eventos corporativos?', a: 'Todos los perfiles en XPEAK incluyen historial de eventos y referencias verificadas de contrataciones anteriores.' },
    ],
  },
  fotografo: {
    label: 'Fotógrafo',
    keyword: 'Fotógrafo',
    unidad: '/evento',
    desc: (c) => `Fotógrafos profesionales en ${c} para bodas, eventos nocturnos y celebraciones. Perfiles verificados, entrega rápida. Flash Booking disponible. Sin comisión.`,
    intro: (c) => `Encuentra fotógrafos y videógrafos especializados en eventos en ${c}: bodas, clubs, festivales y eventos corporativos. XPEAK conecta organizadores con profesionales verificados, con portfolio real y disponibilidad confirmada.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un fotógrafo de eventos en ${c}?`, a: `Un fotógrafo profesional de eventos en ${c} cobra entre ${precio} por evento completo. Las bodas suelen incluir ceremonia, cóctel y banquete. Eventos de una noche desde 300€.` },
      { q: `¿Puedo contratar fotógrafo y videógrafo juntos en ${c}?`, a: `Sí. Muchos perfiles en XPEAK ofrecen pack foto + vídeo con descuento. Contratar ambos con el mismo profesional suele ser un 20% más económico.` },
      { q: '¿En cuánto tiempo recibo las fotos?', a: 'La mayoría de fotógrafos en XPEAK entregan una selección de fotos editadas en 2–5 días y el reportaje completo en 2–4 semanas. Los plazos están especificados en cada perfil.' },
    ],
  },
  catering: {
    label: 'Catering',
    keyword: 'Catering',
    unidad: '/persona',
    desc: (c) => `Catering profesional en ${c} para bodas, eventos corporativos y celebraciones privadas. Menús personalizados, servicio completo, contratos automáticos. Sin comisión.`,
    intro: (c) => `Encuentra proveedores de catering para cualquier tipo de evento en ${c}: banquetes de boda, coffee breaks corporativos, cenas de gala y fiestas privadas. XPEAK te conecta directamente con el proveedor, sin intermediarios ni comisiones.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta el catering para una boda en ${c}?`, a: `El catering para bodas en ${c} cuesta entre ${precio} por comensal según el menú y el servicio. Banquete sentado completo con vinos: 70€–120€/persona. Bufé: 50€–80€/persona.` },
      { q: `¿Qué incluye un servicio de catering completo en ${c}?`, a: 'Un catering completo incluye aperitivo, cóctel, banquete, barra libre, montaje, personal de sala y limpieza. En XPEAK cada proveedor detalla exactamente qué está incluido.' },
      { q: '¿Con cuánta antelación debo contratar el catering?', a: 'Para bodas, mínimo 3–6 meses. Para eventos corporativos de menos de 50 personas el Flash Booking puede conseguirte disponibilidad en menos de una semana.' },
    ],
  },
  'disco-movil': {
    label: 'Disco Móvil',
    keyword: 'Disco Móvil',
    unidad: '/evento',
    desc: (c) => `Contratar disco móvil en ${c}: DJs con equipo completo (sonido, luces, humo) para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.`,
    intro: (c) => `Una disco móvil en ${c} incluye DJ profesional + equipo completo de sonido, iluminación y efectos. Ideal para bodas, comuniones, cumpleaños y fiestas privadas donde el local no tiene instalación propia. XPEAK conecta organizadores con DJs que llevan su propio setup listo para actuar.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta una disco móvil en ${c}?`, a: `Una disco móvil completa en ${c} cuesta entre ${precio} por evento, incluyendo DJ, equipo de sonido, luces y efectos. El precio varía según la duración y el nivel del equipo.` },
      { q: '¿Qué diferencia hay entre un DJ y una disco móvil?', a: 'Un DJ de disco móvil trae su propio equipo completo: altavoces, mesa de mezclas, luces de colores, máquina de humo y cañón de confeti. No necesitas contratar técnico de sonido ni alquilar equipo aparte.' },
      { q: '¿La disco móvil sirve para bodas?', a: 'Sí, es la opción más popular para bodas en fincas rurales y locales sin equipo propio. El DJ llega con todo el material, lo monta antes del evento y lo recoge al terminar.' },
    ],
  },
  speaker: {
    label: 'Speaker',
    keyword: 'Speaker y Presentador',
    unidad: '/evento',
    desc: (c) => `Contratar speaker o presentador en ${c} para eventos corporativos, congresos y galas. Ponentes motivacionales, MCs y presentadores verificados. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra speakers, ponentes y presentadores profesionales en ${c} para conferencias, congresos, cenas de empresa y galas. XPEAK conecta organizadores con comunicadores verificados: desde keynote speakers motivacionales hasta MCs bilingües con experiencia en grandes eventos.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un speaker en ${c}?`, a: `Un speaker profesional en ${c} cobra entre ${precio} por evento según su especialidad y trayectoria. Presentadores de eventos desde 300€; keynote speakers con experiencia internacional desde 1.000€.` },
      { q: `¿Qué diferencia hay entre un speaker y un presentador en ${c}?`, a: 'Un speaker da una ponencia o conferencia con contenido propio. Un presentador o MC conduce el evento, da paso a los actos y dinamiza la audiencia. Muchos profesionales hacen ambas funciones.' },
      { q: '¿Puedo contratar un presentador bilingüe en ${c}?', a: `Sí. XPEAK tiene presentadores bilingüe (español/inglés) en ${c} para eventos con asistentes internacionales. Especifícalo en tu solicitud de Flash Booking.` },
    ],
  },
  mago: {
    label: 'Mago',
    keyword: 'Mago e Ilusionista',
    unidad: '/evento',
    desc: (c) => `Contratar mago o ilusionista en ${c} para bodas, eventos de empresa y fiestas privadas. Magia de cerca y shows de escenario. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra magos e ilusionistas profesionales en ${c} para cualquier tipo de evento: magia de cerca en mesas para bodas y cenas de empresa, shows de escenario para convenciones y fiestas privadas. XPEAK conecta organizadores con magos verificados con experiencia demostrable.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un mago en ${c}?`, a: `Un mago profesional en ${c} cobra entre ${precio} por evento. Magia de cerca para bodas (pase entre mesas): 200€–400€. Shows de escenario de 30–60 min: 400€–800€.` },
      { q: `¿Qué tipos de espectáculos de magia hay en ${c}?`, a: 'Magia de cerca (close-up) entre los asistentes, shows de escenario con grandes ilusiones, magia infantil y familiar, y magia corporativa con branding de la empresa integrado en el show.' },
      { q: '¿Un mago es adecuado para una boda?', a: 'Sí, es uno de los entretenimientos más valorados en bodas. El mago pasa por las mesas durante el cóctel o la cena creando momentos únicos y rompiendo el hielo entre los invitados.' },
    ],
  },
  bailarin: {
    label: 'Bailarín / Instructor',
    keyword: 'Bailarín, Compañía de Danza e Instructor',
    unidad: '/evento',
    desc: (c) => `Contratar bailarines en ${c} para bodas, eventos y espectáculos: flamenco, baile moderno, latino y danza contemporánea. También instructores de salsa y bachata para clases. Shows desde 30 min. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra bailarines y compañías de danza en ${c} para amenizar cualquier evento: flamenco para bodas y eventos internacionales, shows de baile moderno para convenciones, danza contemporánea para galas y espectáculos de apertura. XPEAK conecta organizadores con bailarines profesionales verificados.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar bailarines en ${c}?`, a: `Un espectáculo de baile en ${c} cuesta entre ${precio} por show según la duración y el número de bailarines. Shows de flamenco desde 300€; compañías de 4–6 bailarines desde 600€.` },
      { q: `¿Qué estilos de baile puedo contratar en ${c}?`, a: `En XPEAK encontrarás bailarines de flamenco, baile latino (salsa, bachata), hip hop, danza contemporánea, ballet y baile nupcial para la primera danza de bodas en ${c}.` },
      { q: '¿Puedo contratar bailarines para una boda civil?', a: 'Sí. El espectáculo de baile es muy popular durante el cóctel o la apertura del banquete. También hay bailarines especializados en coreografías sorpresa para la primera danza de los novios.' },
    ],
  },
  vestuario: {
    label: 'Estilista / Vestuario',
    keyword: 'Estilista',
    unidad: '/día',
    desc: (c) => `Contratar estilista o profesional del vestuario en ${c} para bodas, producciones audiovisuales y eventos de moda. Portafolio real, perfiles verificados. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra estilistas, diseñadores de vestuario y personal de armario en ${c}: desde el estilismo integral para bodas hasta la coordinación de vestuario en rodajes, videoclips y espectáculos. XPEAK conecta organizadores con profesionales del vestuario verificados con portafolio real.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un estilista en ${c}?`, a: `Un estilista integral para boda en ${c} (novia, novio y séquito) cobra entre 300€ y 1.500€ según el alcance. Producciones audiovisuales: ${precio} por jornada.` },
      { q: `¿Puedo contratar estilistas para una producción audiovisual en ${c}?`, a: 'Sí. XPEAK incluye coordinadores de vestuario con experiencia en rodajes, videoclips y campañas publicitarias. Especifica el número de días de rodaje y el tipo de producción en tu oferta.' },
      { q: `¿Qué es un personal shopper para eventos en ${c}?`, a: 'Un personal shopper te ayuda a elegir el outfit correcto para cada tipo de evento: gala, boda, presentación corporativa o evento de moda. Tarifa habitual: entre 80€ y 200€ por sesión de 2-3 horas.' },
    ],
  },
  monologo: {
    label: 'Monólogo',
    keyword: 'Monologuista y Stand-Up',
    unidad: '/actuación',
    desc: (c) => `Contratar monologuista o cómico de stand-up en ${c} para cenas de empresa, bodas y eventos. Guión personalizado. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra monologuistas y cómicos de stand-up en ${c} para cualquier evento: cenas de empresa, bodas, convenciones, fiestas privadas y festivales de humor. XPEAK conecta organizadores con profesionales del humor verificados con experiencia demostrable y guión adaptable a cada ocasión.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un monologuista en ${c}?`, a: `Un monólogo profesional en ${c} cuesta entre ${precio} por actuación según la duración y el perfil del cómico. Actuaciones de 20-30 min para cenas de empresa: 300€–600€. Shows de stand-up de 45-60 min: 500€–1.200€.` },
      { q: `¿El monologuista puede personalizar el guión para mi empresa en ${c}?`, a: 'Sí. La mayoría de monologuistas en XPEAK ofrecen guión 100% personalizado con referencias a tu empresa, sector, equipo o ciudad. Es el formato más demandado para cenas de empresa y convenciones.' },
      { q: `¿Un monólogo funciona para una boda en ${c}?`, a: 'Absolutamente. El monólogo de boda es el entretenimiento que más recuerdan los invitados. El cómico recoge anécdotas de la pareja y los invitados para crear un show único e irrepetible de 20-30 minutos.' },
      { q: '¿Cuánto dura una actuación de stand-up para eventos?', a: 'Lo más habitual es 20-30 minutos para cenas y bodas (formato cóctel o sobremesa) y 45-60 minutos para shows de teatro o festivales. Puedes especificar la duración exacta al hacer la solicitud.' },
    ],
  },
  monologos: {
    label: 'Monólogos',
    keyword: 'Monologuista y Stand-Up',
    unidad: '/actuación',
    desc: (c) => `Contratar monologuistas en ${c} para cenas de empresa, bodas y eventos. Stand-up comedy con guión personalizado. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra monologuistas y cómicos de stand-up en ${c} para cualquier tipo de evento. XPEAK conecta organizadores con los mejores cómicos verificados de ${c}: desde stand-up comedy para festivales hasta monólogos a medida para cenas corporativas y bodas.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cobran los monologuistas en ${c}?`, a: `Los monologuistas profesionales en ${c} cobran entre ${precio} por actuación. Monólogos cortos de 20 min: desde 250€. Shows completos de 60 min: desde 600€.` },
      { q: `¿Dónde puedo encontrar monologuistas para eventos en ${c}?`, a: `En XPEAK tienes un directorio de monologuistas verificados en ${c} con vídeos de actuaciones anteriores, opiniones de clientes y disponibilidad en tiempo real. Puedes contactar directamente o usar Flash Booking para urgencias.` },
      { q: '¿Puedo contratar varios cómicos para una noche de stand-up?', a: 'Sí. XPEAK permite coordinar varios monologuistas para una misma noche. Ideal para festivales de humor, galas de empresa con varios actos o eventos benéficos con presentador y cómicos.' },
    ],
  },
  humorista: {
    label: 'Humorista',
    keyword: 'Humorista y Cómico',
    unidad: '/evento',
    desc: (c) => `Contratar humorista o monologuista en ${c} para cenas de empresa, bodas y eventos privados. Stand-up comedy, monólogos personalizados e impro. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra humoristas, monologuistas y cómicos en ${c} para amenizar cenas de empresa, bodas, fiestas privadas y eventos corporativos. XPEAK conecta organizadores con humoristas profesionales con experiencia en eventos: desde stand-up comedy hasta dinámicas de impro para team building.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un humorista en ${c}?`, a: `Un monólogo profesional en ${c} cuesta entre ${precio} por actuación. Shows de 20–30 min para cenas de empresa: 300€–600€. Actuaciones de stand-up de 45–60 min: 500€–1.000€.` },
      { q: `¿El humorista puede personalizar el monólogo para mi empresa en ${c}?`, a: 'Sí. La mayoría de humoristas en XPEAK ofrecen guion personalizado con referencias a la empresa, el sector o los asistentes. Especifícalo al hacer la solicitud.' },
      { q: '¿Un humorista es adecuado para una cena de empresa?', a: 'Es uno de los entretenimientos más demandados para cenas corporativas. Un buen monólogo rompe el hielo, genera risas compartidas y crea un recuerdo positivo del evento entre los empleados.' },
    ],
  },
  maquillaje: {
    label: 'Maquilladora',
    keyword: 'Maquilladora',
    unidad: '/servicio',
    desc: (c) => `Contratar maquilladora en ${c} para bodas, eventos y sesiones fotográficas. Maquillaje profesional y artístico. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra maquilladoras profesionales en ${c} para bodas, sesiones de fotos, eventos de moda y TV. XPEAK conecta organizadores y novias con maquilladoras verificadas con portfolio real y experiencia en eventos.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta una maquilladora profesional en ${c}?`, a: `El maquillaje profesional en ${c} cuesta entre ${precio} por servicio. Maquillaje de novia completo: 150€–300€. Maquillaje artístico para eventos: 80€–200€.` },
      { q: `¿La maquilladora va al domicilio en ${c}?`, a: 'La mayoría de maquilladoras en XPEAK ofrecen servicio a domicilio o en el propio venue del evento. Especifícalo en tu solicitud y confirma el desplazamiento.' },
      { q: '¿Puedo contratar maquillaje para varias personas?', a: 'Sí. Para bodas y eventos grupales muchas maquilladoras trabajan en equipo o tienen asistentes. Indica el número de personas al hacer la solicitud para recibir presupuesto ajustado.' },
    ],
  },
  peluqueria: {
    label: 'Peluquera a domicilio',
    keyword: 'Peluquera a Domicilio',
    unidad: '/servicio',
    desc: (c) => `Peluquera a domicilio en ${c}: corte, color y peinados de novia. Para tu evento o para el día a día, sin salir de casa. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra peluqueras y peluqueros a domicilio en ${c}, cerca de ti. Ya sea para el peinado de una boda, un evento puntual o un servicio recurrente en casa, XPEAK conecta a clientas con profesionales verificados con portfolio real.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta una peluquera a domicilio en ${c}?`, a: `Una peluquera a domicilio en ${c} cuesta entre ${precio} por servicio. Corte y peinado básico: 25€–60€. Peinado de novia con prueba previa: 80€–200€.` },
      { q: `¿La peluquería a domicilio en ${c} es solo para bodas?`, a: 'No. Aunque los peinados de novia y eventos son un caso de uso frecuente, la mayoría de profesionales también ofrecen servicio a domicilio para el día a día: cortes, color y tratamientos capilares.' },
      { q: `¿Cómo encuentro una peluquera a domicilio cerca de mí en ${c}?`, a: 'Filtra por tu zona en el directorio de XPEAK y contacta directamente con las profesionales disponibles, o usa Flash Booking para recibir disponibilidad urgente.' },
    ],
  },
  'grupo-musical': {
    label: 'Grupo Musical',
    keyword: 'Grupo Musical',
    unidad: '/evento',
    desc: (c) => `Contratar grupo musical en ${c} para bodas y eventos: cuartetos de cuerda, jazz, flamenco y bandas pop-rock. Música en vivo. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra grupos musicales profesionales en ${c} para cualquier momento de tu evento: cuartetos de cuerda para la ceremonia, jazz o flamenco para el cóctel, banda completa para la fiesta. XPEAK conecta organizadores con músicos verificados en ${c}.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un grupo musical en ${c}?`, a: `Un grupo musical en ${c} cuesta entre ${precio} según el número de músicos y la duración. Un dúo acústico o saxofonista parte de 300€; una banda completa de 5-6 músicos puede superar los 1.500€.` },
      { q: `¿Con cuánta antelación reservar un grupo musical en ${c}?`, a: 'Con 6-9 meses de antelación para asegurar disponibilidad, especialmente en temporada alta (mayo-octubre). Los grupos más solicitados se agotan antes.' },
      { q: '¿El grupo musical puede actuar en exteriores?', a: `Sí, la mayoría cuenta con equipo propio adaptado a exteriores. Indica el espacio de tu evento en ${c} para que el proveedor dimensione correctamente el equipo de sonido.` },
    ],
  },
  'photo-booth': {
    label: 'Photo Booth',
    keyword: 'Photo Booth',
    unidad: '/evento',
    desc: (c) => `Alquilar photo booth en ${c} para bodas, comuniones y eventos de empresa. Impresión al instante y álbum digital. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra proveedores de photo booth en ${c} para tu boda, comunión o evento de empresa: cabina clásica con impresión, photo booth 360 para vídeos o espejo glamour. XPEAK conecta organizadores con proveedores verificados en ${c}.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta un photo booth en ${c}?`, a: `Un photo booth en ${c} cuesta entre ${precio} según el tipo (clásico, 360 o espejo glamour), la duración y extras como impresión ilimitada o libro de firmas.` },
      { q: `¿Qué incluye un photo booth profesional en ${c}?`, a: 'Normalmente incluye montaje y desmontaje, atrezzo temático, impresión ilimitada al instante, álbum digital y varias horas de servicio.' },
      { q: `¿Con cuánta antelación contratar un photo booth en ${c}?`, a: 'Con 3-4 meses de antelación suele ser suficiente. En temporada alta (mayo-septiembre) se recomienda reservar con 6 meses.' },
    ],
  },
  promotores: {
    label: 'Promotor',
    keyword: 'Promotor y RRPP',
    unidad: '/noche',
    desc: (c) => {
      if (c === 'A Coruña') return 'Promotor y RRPP en A Coruña para discotecas, festivales y eventos privados. Gestión de listas VIP, captación de público y relaciones públicas. Perfiles verificados. Sin comisión.';
      return `Contratar promotor o RRPP en ${c} para clubs, festivales y eventos. Gestión de listas VIP, captación de público y relaciones públicas. Flash Booking. Sin comisión.`;
    },
    intro: (c, venues) => {
      if (c === 'A Coruña') return `A Coruña tiene una escena de ocio nocturno consolidada, con salas como ${venues.slice(0,2).join(' y ')} entre las más activas de Galicia. XPEAK conecta discotecas, promotoras y organizadores con promotores y RRPP verificados en A Coruña: gestión de listas VIP, captación de público y coordinación de puerta.`;
      return `Encuentra promotores y relaciones públicas profesionales en ${c} para clubs nocturnos, festivales y eventos. XPEAK conecta salas y organizadores con promotores verificados: gestión de listas VIP, captación de público, street marketing y coordinación de prensa.`;
    },
    faqs: (c, precio) => [
      { q: `¿Cuánto cobra un promotor en ${c}?`, a: `Un promotor o RRPP en ${c} cobra entre ${precio} por noche según el volumen de trabajo y su red de contactos. Algunos trabajan a comisión por entrada vendida; otros cobran tarifa fija.` },
      { q: `¿Qué hace exactamente un promotor de eventos en ${c}?`, a: 'Gestiona la lista VIP, capta público objetivo, hace difusión en redes y en su red de contactos, coordina con la puerta y en algunos casos gestiona relaciones con prensa y medios locales.' },
      { q: '¿El promotor puede gestionar el marketing en redes sociales?', a: 'Depende del perfil. En XPEAK algunos promotores incluyen gestión de Instagram y contenido en su servicio. Consulta directamente con cada profesional qué incluye su tarifa.' },
      ...(c === 'A Coruña' ? [{ q: '¿Hay promotores disponibles en A Coruña ahora mismo?', a: 'La oferta de promotores verificados en Galicia todavía está creciendo en XPEAK. Puedes publicar tu necesidad y contactar directamente con los perfiles disponibles; si tu evento es urgente, indica la fecha con antelación para asegurar respuesta.' }] : []),
    ],
  },
  animador: {
    label: 'Animador',
    keyword: 'Payaso y Animador de Eventos',
    unidad: '/evento',
    desc: (c) => `Contratar payaso o animador en ${c} para cumpleaños, bodas, eventos corporativos y festivales. Animación infantil, magia y circo. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra payasos, animadores y artistas de calle en ${c} para todo tipo de eventos. XPEAK conecta organizadores con animadores profesionales verificados en ${c}: desde animación infantil con magia y globoflexia hasta artistas de circo y mimo para eventos corporativos y festivales.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cuesta contratar un payaso o animador en ${c}?`, a: `Un animador o payaso profesional en ${c} cuesta entre ${precio} por evento. Animación infantil básica (60 min): 150€–250€. Shows de circo o animación adultos: 300€–600€.` },
      { q: `¿Qué servicios incluye un animador infantil en ${c}?`, a: 'Los animadores infantiles en XPEAK suelen incluir magia, globoflexia, juegos y cuentacuentos. Algunos ofrecen también pintacaras y talleres de manualidades. Consulta el perfil de cada profesional para ver qué incluye su show.' },
      { q: `¿Puedo contratar un animador para una boda en ${c}?`, a: 'Sí. Muchos animadores en XPEAK tienen experiencia en bodas, tanto para entretener a los niños durante el banquete como para dinamizar al público adulto con juegos, humor o espectáculos de circo.' },
      { q: '¿Hay animadores disponibles para eventos corporativos?', a: 'Sí. Artistas de circo, zanqueros, mimos y animadores de team building son muy demandados en eventos de empresa. Usa Flash Booking si necesitas un animador con urgencia para tu evento.' },
    ],
  },
  payaso: {
    label: 'Payaso',
    keyword: 'Payaso Profesional',
    unidad: '/evento',
    desc: (c) => `Contratar payaso profesional en ${c} para cumpleaños infantiles, bodas y fiestas. Magia, globoflexia y animación. Flash Booking. Sin comisión.`,
    intro: (c) => `Encuentra payasos profesionales en ${c} para cumpleaños, comuniones y todo tipo de celebraciones. XPEAK conecta familias y organizadores con los mejores payasos verificados en ${c} con portfolio de actuaciones y opiniones reales de clientes.`,
    faqs: (c, precio) => [
      { q: `¿Cuánto cobra un payaso en ${c}?`, a: `Un payaso profesional en ${c} cobra entre ${precio} por actuación. Shows de 60 min para cumpleaños: 150€–300€. Actuaciones con más de 2 horas o efectos especiales: desde 350€.` },
      { q: `¿A partir de qué edad es adecuado un payaso para niños en ${c}?`, a: 'Los payasos en XPEAK adaptan su show a la edad del público. Para niños de 3-5 años: globoflexia y cuentacuentos. Para 6-12 años: magia, juegos participativos y humor. Especifícalo al hacer la reserva.' },
      { q: '¿El payaso lleva su propio material?', a: 'Sí. Todos los animadores en XPEAK llevan su propio material: disfraces, globos, efectos mágicos y música. Solo necesitas un espacio mínimo de 3x3m para el show.' },
    ],
  },
};

const ProfGrid = ({ profs }: { profs: Prof[] }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
    {profs.map(p => (
      <a key={p.id}
        href={p.slug ? `/p/${p.slug}` : `/p/${p.id}`}
        style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.03)', border: p.is_early_adopter ? '4px solid #3B82F6' : '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s', boxShadow: p.is_early_adopter ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        <div style={{ aspectRatio: '3/2', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
          {p.photo_url
            ? <img src={p.photo_url} alt={p.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: '#D4AF37' }}>{p.display_name.charAt(0)}</div>
          }
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
            {p.is_early_adopter && <span style={{ background: '#3B82F6', color: '#fff', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>⭐ EARLY</span>}
          </div>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <p style={{ fontWeight: 900, fontSize: 14, color: '#fff', margin: '0 0 4px' }}>{p.display_name}</p>
          {p.city && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 4 }}><span>📍</span>{p.city}</p>}
          {p.bio && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.bio}</p>}
        </div>
      </a>
    ))}
  </div>
);

export default function CityLanding() {
  const { ciudad } = useParams<{ ciudad: string }>();
  const { pathname } = useLocation();

  const cityData = ciudad ? CITIES[ciudad.toLowerCase()] : null;
  if (!cityData) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Navigate to="/" replace />
      </>
    );
  }

  // Detect category from pathname: /contratar-dj/madrid → 'dj'
  const categorySlug = pathname.split('/')[1]?.replace('contratar-', '') ?? 'dj';
  const catData = CATEGORIES[categorySlug] ?? CATEGORIES['dj'];

  const precio = `${cityData.precioMin}–${cityData.precioMax}`;
  const canonicalBase = `/contratar-${categorySlug}/${cityData.slug}`;
  const { profs: professionals, suggestions: profSuggestions, loaded: profsLoaded } = useCityProfessionals(cityData.ciudad, categorySlug);
  const h1 = `Contratar ${catData.keyword} en ${cityData.ciudad}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: h1,
    provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    areaServed: { '@type': 'City', name: cityData.ciudad },
    description: catData.desc(cityData.ciudad),
    url: `https://xpeak.es${canonicalBase}`,
    serviceType: `Contratación de ${catData.keyword}`,
    dateModified: BUILD_DATE,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Registro gratuito para salas y promotoras' },
  };

  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: catData.faqs(cityData.ciudad, precio).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: `Contratar ${catData.keyword}`, item: `https://xpeak.es/contratar-${categorySlug}` },
      { '@type': 'ListItem', position: 3, name: cityData.ciudad, item: `https://xpeak.es${canonicalBase}` },
    ],
  };

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `XPEAK — ${catData.keyword} en ${cityData.ciudad}`,
    description: catData.desc(cityData.ciudad),
    url: `https://xpeak.es${canonicalBase}`,
    image: 'https://xpeak.es/og-image.jpg',
    email: 'hola@xpeak.es',
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityData.ciudad,
      addressCountry: 'ES',
    },
    areaServed: { '@type': 'City', name: cityData.ciudad },
    priceRange: `${cityData.precioMin} – ${cityData.precioMax}`,
    openingHours: 'Mo-Su 00:00-24:00',
    sameAs: ['https://www.instagram.com/xpeak.es'],
  };

  // Una ciudad sin profesionales renderiza "Aún no hay": es thin content y no
  // debe indexarse. Sale también del sitemap (scripts/update-sitemap.mjs usa
  // el mismo criterio de inventario). `follow` mantiene el flujo de enlaces
  // hacia las páginas que sí tienen contenido. En cuanto entre el primer
  // profesional de la ciudad, la página vuelve a ser indexable sola.
  // Durante el prerender de build, __PRERENDER_PROFILES__ ya trae los datos
  // resueltos, así que el HTML servido al crawler lleva el robots correcto.
  const hasInventory = professionals.length > 0;
  const shouldNoindex = profsLoaded && !hasInventory;

  return (
    <>
      <Helmet>
        <title>{h1} — XPEAK | Directorio Profesional de Eventos</title>
        {/* Siempre explícito: si solo se emitiera el noindex, quedarían dos
            etiquetas robots (la global de index.html y esta). Declarar ambos
            casos hace que Helmet sustituya la global en vez de sumarse. */}
        <meta name="robots" content={shouldNoindex ? 'noindex, follow' : 'index, follow'} />
        <meta name="description" content={catData.desc(cityData.ciudad)} />
        <link rel="canonical" href={`https://xpeak.es${canonicalBase}`} />
        <meta property="og:title" content={`${h1} — XPEAK`} />
        <meta property="og:description" content={catData.desc(cityData.ciudad)} />
        <meta property="og:url" content={`https://xpeak.es${canonicalBase}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessData)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/blog" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/precios" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>Precios</a>
            <a href="/auth"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              {cityData.ciudad} · España
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">{h1}</h1>
          <p className="text-sm sm:text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {catData.intro(cityData.ciudad, cityData.venues)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/auth"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Publicar oferta gratis
            </a>
            <a href={`/directorio/${categorySlug}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Ver directorio <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Seasonal banner — only for cities with seasonal data */}
        {cityData.seasonal && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
            <div className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.04))', border: '1px solid rgba(212,175,55,0.25)' }}>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-black px-2.5 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                  {cityData.seasonal.badge}
                </span>
                <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>{cityData.seasonal.months}</span>
              </div>
              <p className="text-xs leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {cityData.seasonal.highlight}
              </p>
            </div>
            {/* Seasonal keyword chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {cityData.seasonal.keywords.map(k => (
                <span key={k} className="text-xs px-2.5 py-1 rounded-full font-bold"
                  style={{ background: 'rgba(212,175,55,0.06)', color: 'rgba(212,175,55,0.7)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  {k}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { label: `Precio ${catData.keyword} en ${cityData.ciudad}`, value: `${precio}${catData.unidad}`, icon: <Star size={16} /> },
              { label: 'Flash Booking', value: ['promotores', 'azafata', 'peluqueria'].includes(categorySlug) ? 'Necesidades urgentes' : 'En menos de 1h', icon: <Zap size={16} /> },
              { label: 'Comisión XPEAK', value: '0% para salas', icon: <Shield size={16} /> },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                  <p className="text-sm font-black">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {cityData.venues.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Espacios y venues en {cityData.ciudad}</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Profesionales con experiencia en los principales espacios de la ciudad.
            </p>
            <div className="flex flex-wrap gap-2">
              {cityData.venues.map(v => (
                <span key={v} className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                  {v}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Profesionales reales de Supabase */}
        {profsLoaded && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
            {professionals.length > 0 ? (
              <>
                <h2 className="text-xl sm:text-2xl font-black mb-2">
                  {catData.keyword} disponibles en {cityData.ciudad}
                </h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Profesionales verificados activos en XPEAK. Contacto directo, sin intermediarios.
                </p>
                <ProfGrid profs={professionals} />
              </>
            ) : (
              <>
                <div className="rounded-2xl p-6 mb-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-base font-black mb-1">Todavía no hay {catData.keyword} en {cityData.ciudad}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Cuestión de tiempo.
                  </p>
                </div>
                {profSuggestions.length > 0 && (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Sugerencias · Disponibles en toda España
                    </p>
                    <ProfGrid profs={profSuggestions} />
                  </>
                )}
              </>
            )}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <a href={`/directorio/${categorySlug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, fontWeight: 700, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none' }}>
                Ver todos los {catData.keyword} <ArrowRight size={13} />
              </a>
            </div>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Cómo contratar {catData.keyword} en {cityData.ciudad} con XPEAK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Crea tu cuenta gratis', body: `Regístrate como sala, promotora u organizador en menos de 2 minutos. Sin tarjeta.` },
              { step: '02', title: 'Publica tu oferta', body: `Describe el evento en ${cityData.ciudad}, fecha, horario y presupuesto. Flash Booking lo distribuye al instante.` },
              { step: '03', title: 'Cierra el contrato', body: `Elige al profesional, firma el contrato digital con un clic. PDF listo para facturación.` },
            ].map(s => (
              <div key={s.step} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-3xl font-black mb-3" style={{ color: 'rgba(212,175,55,0.25)' }}>{s.step}</p>
                <p className="text-sm font-bold mb-1.5">{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Preguntas frecuentes — {catData.keyword} en {cityData.ciudad}</h2>
          <div className="space-y-4">
            {catData.faqs(cityData.ciudad, precio).map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm font-bold mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Otras categorías en la misma ciudad — enlazado interno cruzado */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-6">Otros profesionales en {cityData.ciudad}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.keys(CATEGORIES)
              .filter(slug => slug !== categorySlug && slug !== 'monologos')
              .map(slug => (
                <a key={slug} href={`/contratar-${slug}/${cityData.slug}`}
                  className="flex items-center gap-2 p-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {CATEGORIES[slug].keyword}
                </a>
              ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 text-center">
          <div className="rounded-2xl p-7 sm:p-10" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl sm:text-3xl font-black mb-3">¿Buscas {catData.keyword} en {cityData.ciudad}?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {['promotores', 'azafata', 'peluqueria'].includes(categorySlug)
                ? 'Únete gratis — sin comisión, contratos automáticos, Flash Booking para necesidades urgentes.'
                : 'Únete gratis — sin comisión, contratos automáticos, Flash Booking en menos de 1h.'}
            </p>
            <a href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Empezar gratis en {cityData.ciudad}
            </a>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
