import { ArrowRight, Briefcase } from 'lucide-react';
import { logEvent } from '@/lib/track';

// Recuadro para el profesional en las páginas /contratar-<oficio> y
// /contratar-<oficio>/<ciudad> (Ficha XDS 26 oct 2026, 78 puntos). Esas páginas
// tenían ~470 sesiones al mes y ningún camino para quien busca trabajo en
// eventos. Va debajo de la lista de profesionales y más discreto que el botón
// de contratar, para no distraer al organizador. Sin "gratis" ni "0 comisión".
// Death line 30 nov: menos de 5 altas desde aquí, se quita o se rehace.

// slug de la página → [pregunta, rol que entiende /auth]
const OFICIOS: Record<string, [string, string]> = {
  dj: ['¿Eres DJ', 'dj'],
  camareros: ['¿Eres camarero o camarera', 'staff'],
  staff: ['¿Trabajas como staff de eventos', 'staff'],
  azafata: ['¿Eres azafata o azafato', 'azafata'],
  fotografo: ['¿Eres fotógrafo o videógrafo', 'media'],
  catering: ['¿Tienes un catering', 'catering'],
  'disco-movil': ['¿Tienes una disco móvil', 'disco-movil'],
  speaker: ['¿Eres speaker o presentador', 'speaker'],
  mago: ['¿Eres mago', 'mago'],
  bailarin: ['¿Eres bailarín o bailarina', 'bailarin'],
  vestuario: ['¿Eres estilista', 'vestuario'],
  monologo: ['¿Eres humorista o monologuista', 'humorista'],
  monologos: ['¿Eres humorista o monologuista', 'humorista'],
  humorista: ['¿Eres humorista o monologuista', 'humorista'],
  maquillaje: ['¿Eres maquilladora o maquillador', 'makeup'],
  peluqueria: ['¿Eres peluquera o peluquero', 'peluqueria'],
  'grupo-musical': ['¿Tienes un grupo musical', 'grupo-musical'],
  'tecnico-sonido': ['¿Eres técnico de sonido', 'tecnico'],
  'alquiler-equipos': ['¿Alquilas equipo de sonido o luces', 'alquiler'],
  'photo-booth': ['¿Tienes un photo booth', 'photo-booth'],
  'food-truck': ['¿Tienes un food truck', 'food-truck'],
  promotores: ['¿Eres promotor o RRPP', 'promotor'],
  animador: ['¿Eres animador o animadora', 'animador'],
  animadores: ['¿Eres animador o animadora', 'animador'],
  payaso: ['¿Eres payaso o animador', 'animador'],
  payasos: ['¿Eres payaso o animador', 'animador'],
  'locales-eventos': ['¿Tienes un local para eventos', 'local_eventos'],
};

export default function CtaProfesional({ slug, ciudad }: { slug: string; ciudad?: string }) {
  const [pregunta, rol] = OFICIOS[slug] ?? ['¿Trabajas en eventos', ''];
  const href = `/auth?mode=register${rol ? `&role=${rol}` : ''}`;
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
      <div className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ background: '#FFFFFF', border: '1.5px dashed rgba(184,148,30,0.55)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.14)', color: '#8B6A00' }}>
          <Briefcase size={18} />
        </div>
        <div className="flex-1">
          <p className="text-base sm:text-lg font-black leading-snug">{pregunta}{ciudad ? ` en ${ciudad}` : ''}?</p>
          <p className="text-sm mt-1" style={{ color: '#4b5563' }}>
            En XPEAK los organizadores piden profesionales por zona. Crea tu perfil y te llegan las solicitudes de eventos {ciudad ? `en ${ciudad}` : 'de tu zona'}.
          </p>
        </div>
        <a href={href}
          onClick={() => void logEvent('cta_click', location.pathname, `pro_${ciudad ? 'ciudad' : 'oficio'} rol=${rol || 'ninguno'}`)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all hover:scale-105 whitespace-nowrap"
          style={{ background: '#2563EB', color: '#FFFFFF' }}>
          Crear mi perfil profesional <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}
