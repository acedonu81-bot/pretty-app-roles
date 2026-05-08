/**
 * Post-build prerender script.
 * For each static SEO route, creates dist/[path]/index.html with
 * the correct <title>, <meta>, <canonical> and OG tags injected.
 * No browser required — pure string replacement on the built index.html.
 *
 * Run after `vite build`:  node scripts/prerender-meta.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const BASE = 'https://xpeak.es';

// ─── Static meta per route ─────────────────────────────────────────────────
const ROUTES = [
  // Landing
  {
    path: '/',
    title: 'XPEAK | Contratar DJs, Staff y Profesionales para Eventos en España',
    desc: 'Contrata DJs verificados, fotógrafos, staff de sala y profesionales para tus eventos. Flash Booking en menos de 1h. Contratos automáticos. Gratis para salas y promotoras. Toda España.',
    ogTitle: 'XPEAK | Contratar DJs, Staff y Profesionales para Eventos',
    ogDesc: 'Contrata DJs, fotógrafos, staff de sala y profesionales verificados para tus eventos en España. Flash Booking en menos de 1h.',
    ogType: 'website',
  },
  // Category landings
  {
    path: '/contratar-dj',
    title: 'Contratar DJ para tu Evento — XPEAK | Directorio Profesional de Eventos',
    desc: 'Contrata DJs verificados en toda España: Tech House, Techno, Comercial y más. Flash Booking en menos de 1h. Contratos automáticos. Sin comisión para salas.',
    ogTitle: 'Contratar DJ para Eventos en España — XPEAK',
    ogDesc: 'Directorio verificado de DJs profesionales. Flash Booking, contratos digitales y sin comisión. DJ para bodas, clubs y festivales.',
    ogType: 'website',
  },
  {
    path: '/contratar-staff',
    title: 'Contratar Staff de Eventos — XPEAK | Directorio Profesional de Eventos',
    desc: 'Contrata staff profesional para tus eventos: hostesses, relaciones públicas, promotores y personal de sala. Flash Booking disponible. Sin comisión.',
    ogTitle: 'Contratar Staff de Eventos en España — XPEAK',
    ogDesc: 'Directorio de staff profesional: hostesses, RRPP, camareros de sala. Flash Booking y contratos digitales.',
    ogType: 'website',
  },
  {
    path: '/contratar-fotografo',
    title: 'Contratar Fotógrafo de Eventos — XPEAK | Directorio Profesional de Eventos',
    desc: 'Contrata fotógrafos y videógrafos especializados en eventos nocturnos, festivales y celebraciones. Perfiles verificados, entrega rápida. Sin comisión.',
    ogTitle: 'Contratar Fotógrafo de Eventos en España — XPEAK',
    ogDesc: 'Fotógrafos y videógrafos verificados para clubs, festivales y eventos privados. Flash Booking disponible.',
    ogType: 'website',
  },
  {
    path: '/contratar-camareros',
    title: 'Contratar Camareros para Eventos — XPEAK | Directorio Profesional de Eventos',
    desc: 'Contrata camareros y personal de servicio para bodas, eventos corporativos y hostelería nocturna. Perfiles verificados, contratos automáticos. Sin comisión.',
    ogTitle: 'Contratar Camareros para Eventos en España — XPEAK',
    ogDesc: 'Camareros y personal de hostelería verificados. Bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.',
    ogType: 'website',
  },
  {
    path: '/contratar-catering',
    title: 'Contratar Catering para Eventos — XPEAK | Directorio Profesional de Eventos',
    desc: 'Contrata catering y personal de servicio para bodas, eventos corporativos y celebraciones privadas en España. Perfiles verificados. Sin comisión.',
    ogTitle: 'Contratar Catering para Eventos en España — XPEAK',
    ogDesc: 'Catering profesional para bodas y eventos. Directorio verificado. Flash Booking disponible.',
    ogType: 'website',
  },
  {
    path: '/contratar-maquillaje',
    title: 'Contratar Maquillador para Eventos — XPEAK | Directorio Profesional de Eventos',
    desc: 'Contrata maquilladores artísticos, peluqueros y estilistas para eventos, shows y actuaciones en España. Perfiles verificados. Sin comisión.',
    ogTitle: 'Contratar Maquillador para Eventos en España — XPEAK',
    ogDesc: 'Maquilladores y estilistas para shows, clubs y eventos. Directorio verificado. Flash Booking disponible.',
    ogType: 'website',
  },
  {
    path: '/contratar-promotores',
    title: 'Contratar Promotores de Eventos — XPEAK | Directorio Profesional de Eventos',
    desc: 'Contrata promotores, RRPP y coordinadores de acceso para clubs, festivales y eventos privados en España. Perfiles verificados. Sin comisión.',
    ogTitle: 'Contratar Promotores de Eventos en España — XPEAK',
    ogDesc: 'Promotores y RRPP verificados para clubs y festivales. Flash Booking disponible. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-vestuario',
    title: 'Contratar Estilista de Eventos — XPEAK | Directorio Profesional de Eventos',
    desc: 'Contrata diseñadores de vestuario, estilistas y técnicos de moda para shows, actuaciones y eventos en España. Perfiles verificados. Sin comisión.',
    ogTitle: 'Contratar Estilista y Vestuario para Eventos — XPEAK',
    ogDesc: 'Estilistas y diseñadores de vestuario para shows y eventos. Directorio verificado. Flash Booking disponible.',
    ogType: 'website',
  },
  // City landings — DJ
  {
    path: '/contratar-dj/madrid',
    title: 'Contratar DJ en Madrid — XPEAK | DJs verificados para clubs y eventos',
    desc: 'Contrata DJs profesionales en Madrid para clubs, festivales, bodas y eventos privados. Flash Booking en menos de 1h. Sin comisión.',
    ogTitle: 'Contratar DJ en Madrid — XPEAK',
    ogDesc: 'Directorio de DJs verificados en Madrid. Flash Booking, contratos digitales. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-dj/barcelona',
    title: 'Contratar DJ en Barcelona — XPEAK | DJs verificados para clubs y eventos',
    desc: 'Contrata DJs profesionales en Barcelona para clubs, festivales, bodas y eventos privados. Flash Booking en menos de 1h. Sin comisión.',
    ogTitle: 'Contratar DJ en Barcelona — XPEAK',
    ogDesc: 'Directorio de DJs verificados en Barcelona. Flash Booking, contratos digitales. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-dj/valencia',
    title: 'Contratar DJ en Valencia — XPEAK | DJs verificados para clubs y eventos',
    desc: 'Contrata DJs profesionales en Valencia para clubs, festivales, bodas y eventos privados. Flash Booking en menos de 1h. Sin comisión.',
    ogTitle: 'Contratar DJ en Valencia — XPEAK',
    ogDesc: 'Directorio de DJs verificados en Valencia. Flash Booking, contratos digitales. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-dj/sevilla',
    title: 'Contratar DJ en Sevilla — XPEAK | DJs verificados para clubs y eventos',
    desc: 'Contrata DJs profesionales en Sevilla para clubs, festivales, bodas y eventos privados. Flash Booking en menos de 1h. Sin comisión.',
    ogTitle: 'Contratar DJ en Sevilla — XPEAK',
    ogDesc: 'Directorio de DJs verificados en Sevilla. Flash Booking, contratos digitales. Sin comisión.',
    ogType: 'website',
  },
  // City landings — Camareros
  {
    path: '/contratar-camareros/madrid',
    title: 'Contratar Camareros en Madrid — XPEAK | Personal de hostelería verificado',
    desc: 'Contrata camareros y personal de hostelería en Madrid para bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.',
    ogTitle: 'Contratar Camareros en Madrid — XPEAK',
    ogDesc: 'Camareros verificados en Madrid. Flash Booking para cubrir eventos urgentes. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-camareros/barcelona',
    title: 'Contratar Camareros en Barcelona — XPEAK | Personal de hostelería verificado',
    desc: 'Contrata camareros y personal de hostelería en Barcelona para bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.',
    ogTitle: 'Contratar Camareros en Barcelona — XPEAK',
    ogDesc: 'Camareros verificados en Barcelona. Flash Booking para cubrir eventos urgentes. Sin comisión.',
    ogType: 'website',
  },
  // City landings — Fotógrafo
  {
    path: '/contratar-fotografo/madrid',
    title: 'Contratar Fotógrafo en Madrid — XPEAK | Fotógrafos de eventos verificados',
    desc: 'Contrata fotógrafos profesionales en Madrid para bodas, eventos nocturnos y corporativos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.',
    ogTitle: 'Contratar Fotógrafo en Madrid — XPEAK',
    ogDesc: 'Fotógrafos verificados en Madrid para bodas y eventos. Flash Booking disponible. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-fotografo/barcelona',
    title: 'Contratar Fotógrafo en Barcelona — XPEAK | Fotógrafos de eventos verificados',
    desc: 'Contrata fotógrafos profesionales en Barcelona para bodas, eventos nocturnos y corporativos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.',
    ogTitle: 'Contratar Fotógrafo en Barcelona — XPEAK',
    ogDesc: 'Fotógrafos verificados en Barcelona para bodas y eventos. Flash Booking disponible. Sin comisión.',
    ogType: 'website',
  },
  // City landings — Catering
  {
    path: '/contratar-catering/madrid',
    title: 'Contratar Catering en Madrid — XPEAK | Catering para bodas y eventos',
    desc: 'Contrata catering profesional en Madrid para bodas, eventos corporativos y celebraciones privadas. Menús personalizados. Sin comisión.',
    ogTitle: 'Contratar Catering en Madrid — XPEAK',
    ogDesc: 'Catering profesional en Madrid para bodas y eventos. Menús personalizados. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-catering/barcelona',
    title: 'Contratar Catering en Barcelona — XPEAK | Catering para bodas y eventos',
    desc: 'Contrata catering profesional en Barcelona para bodas, eventos corporativos y celebraciones privadas. Menús personalizados. Sin comisión.',
    ogTitle: 'Contratar Catering en Barcelona — XPEAK',
    ogDesc: 'Catering profesional en Barcelona para bodas y eventos. Menús personalizados. Sin comisión.',
    ogType: 'website',
  },
  // Disco móvil — genérica + ciudades
  {
    path: '/contratar-disco-movil',
    title: 'Contratar Disco Móvil — XPEAK | DJ con equipo completo para bodas y eventos',
    desc: 'Contrata disco móvil profesional para bodas, comuniones y fiestas privadas en España. DJ + sonido + luces + efectos incluidos. Flash Booking. Sin comisión.',
    ogTitle: 'Contratar Disco Móvil en España — XPEAK',
    ogDesc: 'DJ con equipo completo para bodas, comuniones y fiestas privadas. Flash Booking disponible. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-disco-movil/madrid',
    title: 'Contratar Disco Móvil en Madrid — XPEAK | DJ con equipo para bodas',
    desc: 'Contrata disco móvil en Madrid: DJ profesional con equipo de sonido, luces y efectos para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.',
    ogTitle: 'Contratar Disco Móvil en Madrid — XPEAK',
    ogDesc: 'Disco móvil profesional en Madrid para bodas y eventos. Equipo completo incluido. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-disco-movil/barcelona',
    title: 'Contratar Disco Móvil en Barcelona — XPEAK | DJ con equipo para bodas',
    desc: 'Contrata disco móvil en Barcelona: DJ profesional con equipo de sonido, luces y efectos para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.',
    ogTitle: 'Contratar Disco Móvil en Barcelona — XPEAK',
    ogDesc: 'Disco móvil profesional en Barcelona para bodas y eventos. Equipo completo incluido. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-disco-movil/valencia',
    title: 'Contratar Disco Móvil en Valencia — XPEAK | DJ con equipo para bodas',
    desc: 'Contrata disco móvil en Valencia: DJ profesional con equipo de sonido, luces y efectos para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.',
    ogTitle: 'Contratar Disco Móvil en Valencia — XPEAK',
    ogDesc: 'Disco móvil profesional en Valencia para bodas y eventos. Equipo completo incluido. Sin comisión.',
    ogType: 'website',
  },
  {
    path: '/contratar-disco-movil/sevilla',
    title: 'Contratar Disco Móvil en Sevilla — XPEAK | DJ con equipo para bodas',
    desc: 'Contrata disco móvil en Sevilla: DJ profesional con equipo de sonido, luces y efectos para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.',
    ogTitle: 'Contratar Disco Móvil en Sevilla — XPEAK',
    ogDesc: 'Disco móvil profesional en Sevilla para bodas y eventos. Equipo completo incluido. Sin comisión.',
    ogType: 'website',
  },
  // City landings — Staff
  {
    path: '/contratar-staff/madrid',
    title: 'Contratar Staff de Eventos en Madrid — XPEAK | Hostesses y RRPP verificados',
    desc: 'Contrata staff profesional en Madrid: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',
    ogTitle: 'Contratar Staff de Eventos en Madrid — XPEAK',
    ogDesc: 'Staff verificado en Madrid. Hostesses, RRPP y promotores. Flash Booking disponible.',
    ogType: 'website',
  },
  {
    path: '/contratar-staff/barcelona',
    title: 'Contratar Staff de Eventos en Barcelona — XPEAK | Hostesses y RRPP verificados',
    desc: 'Contrata staff profesional en Barcelona: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',
    ogTitle: 'Contratar Staff de Eventos en Barcelona — XPEAK',
    ogDesc: 'Staff verificado en Barcelona. Hostesses, RRPP y promotores. Flash Booking disponible.',
    ogType: 'website',
  },
  // Blogs
  {
    path: '/blog/cuanto-cobra-un-dj-en-espana',
    title: '¿Cuánto cobra un DJ en España? Tarifas y precios 2026 — XPEAK',
    desc: 'Guía completa con precios de DJs en España 2026: tarifas por experiencia, ciudad y tipo de evento. IVA, IRPF, equipo incluido o no. Datos reales de XPEAK.',
    ogTitle: '¿Cuánto cobra un DJ en España? Tarifas 2026',
    ogDesc: 'Precios reales de DJs en España por experiencia, ciudad y tipo de evento. Guía completa 2026.',
    ogType: 'article',
  },
  {
    path: '/blog/cuanto-cobra-un-camarero-de-eventos',
    title: 'Cuánto cobra un camarero de eventos por horas en España (2026) — XPEAK',
    desc: 'Guía completa de precios de camareros para eventos en España 2026: bodas, empresas y fiestas privadas. Cuánto cobran y cuántos necesitas contratar.',
    ogTitle: 'Cuánto cobra un camarero de eventos en España 2026 — XPEAK',
    ogDesc: 'Tarifas de camareros para eventos en España. Bodas, corporativo y hostelería nocturna. Guía completa 2026.',
    ogType: 'article',
  },
  {
    path: '/blog/cuantos-camareros-necesito-para-mi-boda',
    title: 'Cuántos camareros necesito para mi boda: guía definitiva 2026 — XPEAK',
    desc: 'Guía definitiva 2026: cuántos camareros necesitas para tu boda según los invitados y el tipo de servicio. Tabla de ratios y consejos prácticos.',
    ogTitle: 'Cuántos camareros necesito para mi boda 2026 — XPEAK',
    ogDesc: 'Tabla de ratios de camareros por número de invitados y tipo de servicio. Guía completa para bodas en España.',
    ogType: 'article',
  },
  {
    path: '/blog/dj-para-bodas-vs-discoteca',
    title: 'DJ para bodas vs DJ para discoteca: diferencias y precios 2026 — XPEAK',
    desc: '¿Son lo mismo un DJ de boda y un DJ de discoteca? Diferencias en habilidades, equipamiento y precios. Guía para elegir el perfil correcto en 2026.',
    ogTitle: 'DJ para bodas vs DJ para discoteca 2026 — XPEAK',
    ogDesc: 'Diferencias entre DJ de boda y DJ de discoteca. Habilidades, equipo, precio. Guía 2026.',
    ogType: 'article',
  },
  {
    path: '/blog/cuanto-cuesta-una-boda-en-espana',
    title: '¿Cuánto cuesta una boda en España en 2026? Presupuesto completo — XPEAK',
    desc: 'Guía completa del coste de una boda en España 2026: desglose por partidas (catering, DJ, fotógrafo, personal), precio según invitados y ciudad. Datos reales.',
    ogTitle: '¿Cuánto cuesta una boda en España en 2026? Guía completa',
    ogDesc: 'Presupuesto real de una boda en España: catering, DJ, fotógrafo, camareros, flores. Precios por número de invitados y ciudad.',
    ogType: 'article',
  },
  // DJ por ciudad — adicionales
  { path: '/contratar-dj/malaga',    title: 'Contratar DJ en Málaga — XPEAK | DJs verificados para clubs y eventos',    desc: 'Contrata DJs profesionales en Málaga para clubs, festivales, bodas y eventos privados. Flash Booking en menos de 1h. Sin comisión.',                     ogTitle: 'Contratar DJ en Málaga — XPEAK',    ogDesc: 'Directorio de DJs verificados en Málaga. Flash Booking, contratos digitales. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-dj/bilbao',    title: 'Contratar DJ en Bilbao — XPEAK | DJs verificados para clubs y eventos',    desc: 'Contrata DJs profesionales en Bilbao para clubs, festivales, bodas y eventos privados. Flash Booking en menos de 1h. Sin comisión.',                     ogTitle: 'Contratar DJ en Bilbao — XPEAK',    ogDesc: 'Directorio de DJs verificados en Bilbao. Flash Booking, contratos digitales. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-dj/zaragoza',  title: 'Contratar DJ en Zaragoza — XPEAK | DJs verificados para clubs y eventos',  desc: 'Contrata DJs profesionales en Zaragoza para clubs, festivales, bodas y eventos privados. Flash Booking en menos de 1h. Sin comisión.',                   ogTitle: 'Contratar DJ en Zaragoza — XPEAK',  ogDesc: 'Directorio de DJs verificados en Zaragoza. Flash Booking, contratos digitales. Sin comisión.',  ogType: 'website' },
  { path: '/contratar-dj/murcia',    title: 'Contratar DJ en Murcia — XPEAK | DJs verificados para clubs y eventos',    desc: 'Contrata DJs profesionales en Murcia para clubs, festivales, bodas y eventos privados. Flash Booking en menos de 1h. Sin comisión.',                     ogTitle: 'Contratar DJ en Murcia — XPEAK',    ogDesc: 'Directorio de DJs verificados en Murcia. Flash Booking, contratos digitales. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-dj/palma',     title: 'Contratar DJ en Palma — XPEAK | DJs verificados para clubs y eventos',     desc: 'Contrata DJs profesionales en Palma de Mallorca para clubs, eventos privados y bodas. Flash Booking en menos de 1h. Sin comisión.',                    ogTitle: 'Contratar DJ en Palma — XPEAK',     ogDesc: 'Directorio de DJs verificados en Palma de Mallorca. Flash Booking, contratos digitales. Sin comisión.', ogType: 'website' },
  { path: '/contratar-dj/ibiza',     title: 'Contratar DJ en Ibiza — XPEAK | DJs verificados para clubs y eventos',     desc: 'Contrata DJs profesionales en Ibiza para clubs internacionales, fiestas privadas y eventos exclusivos. Flash Booking en menos de 1h. Sin comisión.',   ogTitle: 'Contratar DJ en Ibiza — XPEAK',     ogDesc: 'Directorio de DJs verificados en Ibiza. Flash Booking para clubs y eventos VIP. Sin comisión.',  ogType: 'website' },

  // Camareros por ciudad — adicionales
  { path: '/contratar-camareros/valencia', title: 'Contratar Camareros en Valencia — XPEAK | Personal de hostelería verificado',  desc: 'Contrata camareros y personal de hostelería en Valencia para bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.',  ogTitle: 'Contratar Camareros en Valencia — XPEAK',  ogDesc: 'Camareros verificados en Valencia. Flash Booking para cubrir eventos urgentes. Sin comisión.',  ogType: 'website' },
  { path: '/contratar-camareros/sevilla',  title: 'Contratar Camareros en Sevilla — XPEAK | Personal de hostelería verificado',   desc: 'Contrata camareros y personal de hostelería en Sevilla para bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.',   ogTitle: 'Contratar Camareros en Sevilla — XPEAK',   ogDesc: 'Camareros verificados en Sevilla. Flash Booking para cubrir eventos urgentes. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-camareros/malaga',   title: 'Contratar Camareros en Málaga — XPEAK | Personal de hostelería verificado',    desc: 'Contrata camareros y personal de hostelería en Málaga para bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.',    ogTitle: 'Contratar Camareros en Málaga — XPEAK',    ogDesc: 'Camareros verificados en Málaga. Flash Booking para cubrir eventos urgentes. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-camareros/bilbao',   title: 'Contratar Camareros en Bilbao — XPEAK | Personal de hostelería verificado',    desc: 'Contrata camareros y personal de hostelería en Bilbao para bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.',    ogTitle: 'Contratar Camareros en Bilbao — XPEAK',    ogDesc: 'Camareros verificados en Bilbao. Flash Booking para cubrir eventos urgentes. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-camareros/zaragoza', title: 'Contratar Camareros en Zaragoza — XPEAK | Personal de hostelería verificado', desc: 'Contrata camareros y personal de hostelería en Zaragoza para bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.', ogTitle: 'Contratar Camareros en Zaragoza — XPEAK', ogDesc: 'Camareros verificados en Zaragoza. Flash Booking para cubrir eventos urgentes. Sin comisión.', ogType: 'website' },
  { path: '/contratar-camareros/murcia',   title: 'Contratar Camareros en Murcia — XPEAK | Personal de hostelería verificado',   desc: 'Contrata camareros y personal de hostelería en Murcia para bodas, eventos corporativos y hostelería nocturna. Flash Booking disponible.',   ogTitle: 'Contratar Camareros en Murcia — XPEAK',   ogDesc: 'Camareros verificados en Murcia. Flash Booking para cubrir eventos urgentes. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-camareros/palma',    title: 'Contratar Camareros en Palma — XPEAK | Personal de hostelería verificado',    desc: 'Contrata camareros y personal de hostelería en Palma de Mallorca para bodas y eventos privados. Flash Booking disponible.',                   ogTitle: 'Contratar Camareros en Palma — XPEAK',    ogDesc: 'Camareros verificados en Palma. Flash Booking para cubrir eventos urgentes. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-camareros/ibiza',    title: 'Contratar Camareros en Ibiza — XPEAK | Personal de hostelería verificado',    desc: 'Contrata camareros y personal de hostelería en Ibiza para eventos privados, fiestas VIP y clubs exclusivos. Flash Booking disponible.',        ogTitle: 'Contratar Camareros en Ibiza — XPEAK',    ogDesc: 'Camareros verificados en Ibiza. Flash Booking para eventos VIP y clubs. Sin comisión.',        ogType: 'website' },

  // Staff por ciudad — adicionales
  { path: '/contratar-staff/valencia',  title: 'Contratar Staff de Eventos en Valencia — XPEAK | Hostesses y RRPP verificados',  desc: 'Contrata staff profesional en Valencia: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',  ogTitle: 'Contratar Staff de Eventos en Valencia — XPEAK',  ogDesc: 'Staff verificado en Valencia. Hostesses, RRPP y promotores. Flash Booking disponible.',  ogType: 'website' },
  { path: '/contratar-staff/sevilla',   title: 'Contratar Staff de Eventos en Sevilla — XPEAK | Hostesses y RRPP verificados',   desc: 'Contrata staff profesional en Sevilla: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',   ogTitle: 'Contratar Staff de Eventos en Sevilla — XPEAK',   ogDesc: 'Staff verificado en Sevilla. Hostesses, RRPP y promotores. Flash Booking disponible.',   ogType: 'website' },
  { path: '/contratar-staff/malaga',    title: 'Contratar Staff de Eventos en Málaga — XPEAK | Hostesses y RRPP verificados',    desc: 'Contrata staff profesional en Málaga: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',    ogTitle: 'Contratar Staff de Eventos en Málaga — XPEAK',    ogDesc: 'Staff verificado en Málaga. Hostesses, RRPP y promotores. Flash Booking disponible.',    ogType: 'website' },
  { path: '/contratar-staff/bilbao',    title: 'Contratar Staff de Eventos en Bilbao — XPEAK | Hostesses y RRPP verificados',    desc: 'Contrata staff profesional en Bilbao: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',    ogTitle: 'Contratar Staff de Eventos en Bilbao — XPEAK',    ogDesc: 'Staff verificado en Bilbao. Hostesses, RRPP y promotores. Flash Booking disponible.',    ogType: 'website' },
  { path: '/contratar-staff/zaragoza',  title: 'Contratar Staff de Eventos en Zaragoza — XPEAK | Hostesses y RRPP verificados',  desc: 'Contrata staff profesional en Zaragoza: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',  ogTitle: 'Contratar Staff de Eventos en Zaragoza — XPEAK',  ogDesc: 'Staff verificado en Zaragoza. Hostesses, RRPP y promotores. Flash Booking disponible.',  ogType: 'website' },
  { path: '/contratar-staff/murcia',    title: 'Contratar Staff de Eventos en Murcia — XPEAK | Hostesses y RRPP verificados',    desc: 'Contrata staff profesional en Murcia: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',    ogTitle: 'Contratar Staff de Eventos en Murcia — XPEAK',    ogDesc: 'Staff verificado en Murcia. Hostesses, RRPP y promotores. Flash Booking disponible.',    ogType: 'website' },
  { path: '/contratar-staff/palma',     title: 'Contratar Staff de Eventos en Palma — XPEAK | Hostesses y RRPP verificados',     desc: 'Contrata staff profesional en Palma de Mallorca: hostesses, RRPP, promotores y personal de sala para clubs y eventos. Flash Booking disponible.',     ogTitle: 'Contratar Staff de Eventos en Palma — XPEAK',     ogDesc: 'Staff verificado en Palma. Hostesses, RRPP y promotores para clubs y eventos.',     ogType: 'website' },
  { path: '/contratar-staff/ibiza',     title: 'Contratar Staff de Eventos en Ibiza — XPEAK | Hostesses y RRPP verificados',     desc: 'Contrata staff de primer nivel en Ibiza: hostesses VIP, relaciones públicas y promotores para clubs y eventos exclusivos. Flash Booking disponible.',     ogTitle: 'Contratar Staff de Eventos en Ibiza — XPEAK',     ogDesc: 'Staff VIP verificado en Ibiza. Hostesses, RRPP y promotores para clubs exclusivos.',     ogType: 'website' },

  // Fotógrafo por ciudad — adicionales
  { path: '/contratar-fotografo/valencia', title: 'Contratar Fotógrafo en Valencia — XPEAK | Fotógrafos de eventos verificados', desc: 'Contrata fotógrafos profesionales en Valencia para bodas, eventos nocturnos y corporativos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.', ogTitle: 'Contratar Fotógrafo en Valencia — XPEAK', ogDesc: 'Fotógrafos verificados en Valencia para bodas y eventos. Flash Booking disponible. Sin comisión.', ogType: 'website' },
  { path: '/contratar-fotografo/sevilla',  title: 'Contratar Fotógrafo en Sevilla — XPEAK | Fotógrafos de eventos verificados',  desc: 'Contrata fotógrafos profesionales en Sevilla para bodas, eventos nocturnos y corporativos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.',  ogTitle: 'Contratar Fotógrafo en Sevilla — XPEAK',  ogDesc: 'Fotógrafos verificados en Sevilla para bodas y eventos. Flash Booking disponible. Sin comisión.',  ogType: 'website' },
  { path: '/contratar-fotografo/malaga',   title: 'Contratar Fotógrafo en Málaga — XPEAK | Fotógrafos de eventos verificados',   desc: 'Contrata fotógrafos profesionales en Málaga para bodas, eventos nocturnos y corporativos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.',   ogTitle: 'Contratar Fotógrafo en Málaga — XPEAK',   ogDesc: 'Fotógrafos verificados en Málaga para bodas y eventos. Flash Booking disponible. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-fotografo/bilbao',   title: 'Contratar Fotógrafo en Bilbao — XPEAK | Fotógrafos de eventos verificados',   desc: 'Contrata fotógrafos profesionales en Bilbao para bodas, eventos nocturnos y corporativos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.',   ogTitle: 'Contratar Fotógrafo en Bilbao — XPEAK',   ogDesc: 'Fotógrafos verificados en Bilbao para bodas y eventos. Flash Booking disponible. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-fotografo/zaragoza', title: 'Contratar Fotógrafo en Zaragoza — XPEAK | Fotógrafos de eventos verificados', desc: 'Contrata fotógrafos profesionales en Zaragoza para bodas, eventos nocturnos y corporativos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.', ogTitle: 'Contratar Fotógrafo en Zaragoza — XPEAK', ogDesc: 'Fotógrafos verificados en Zaragoza para bodas y eventos. Flash Booking disponible. Sin comisión.', ogType: 'website' },
  { path: '/contratar-fotografo/murcia',   title: 'Contratar Fotógrafo en Murcia — XPEAK | Fotógrafos de eventos verificados',   desc: 'Contrata fotógrafos profesionales en Murcia para bodas, eventos nocturnos y corporativos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.',   ogTitle: 'Contratar Fotógrafo en Murcia — XPEAK',   ogDesc: 'Fotógrafos verificados en Murcia para bodas y eventos. Flash Booking disponible. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-fotografo/palma',    title: 'Contratar Fotógrafo en Palma — XPEAK | Fotógrafos de eventos verificados',    desc: 'Contrata fotógrafos profesionales en Palma de Mallorca para bodas y eventos exclusivos. Pack foto+vídeo disponible. Flash Booking. Sin comisión.',    ogTitle: 'Contratar Fotógrafo en Palma — XPEAK',    ogDesc: 'Fotógrafos verificados en Palma para bodas y eventos. Flash Booking disponible. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-fotografo/ibiza',    title: 'Contratar Fotógrafo en Ibiza — XPEAK | Fotógrafos de eventos verificados',    desc: 'Contrata fotógrafos profesionales en Ibiza para eventos exclusivos, clubs y fiestas privadas. Especialistas en fotografía nocturna. Sin comisión.',    ogTitle: 'Contratar Fotógrafo en Ibiza — XPEAK',    ogDesc: 'Fotógrafos verificados en Ibiza para eventos y clubs. Flash Booking disponible. Sin comisión.',    ogType: 'website' },

  // Catering por ciudad — adicionales
  { path: '/contratar-catering/valencia', title: 'Contratar Catering en Valencia — XPEAK | Catering para bodas y eventos', desc: 'Contrata catering profesional en Valencia para bodas, eventos corporativos y celebraciones privadas. Menús personalizados. Sin comisión.', ogTitle: 'Contratar Catering en Valencia — XPEAK', ogDesc: 'Catering profesional en Valencia para bodas y eventos. Menús personalizados. Sin comisión.', ogType: 'website' },
  { path: '/contratar-catering/sevilla',  title: 'Contratar Catering en Sevilla — XPEAK | Catering para bodas y eventos',  desc: 'Contrata catering profesional en Sevilla para bodas, eventos corporativos y celebraciones privadas. Menús personalizados. Sin comisión.',  ogTitle: 'Contratar Catering en Sevilla — XPEAK',  ogDesc: 'Catering profesional en Sevilla para bodas y eventos. Menús personalizados. Sin comisión.',  ogType: 'website' },
  { path: '/contratar-catering/malaga',   title: 'Contratar Catering en Málaga — XPEAK | Catering para bodas y eventos',   desc: 'Contrata catering profesional en Málaga para bodas, eventos corporativos y celebraciones privadas. Menús personalizados. Sin comisión.',   ogTitle: 'Contratar Catering en Málaga — XPEAK',   ogDesc: 'Catering profesional en Málaga para bodas y eventos. Menús personalizados. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-catering/bilbao',   title: 'Contratar Catering en Bilbao — XPEAK | Catering para bodas y eventos',   desc: 'Contrata catering profesional en Bilbao para bodas, eventos corporativos y celebraciones privadas. Menús personalizados. Sin comisión.',   ogTitle: 'Contratar Catering en Bilbao — XPEAK',   ogDesc: 'Catering profesional en Bilbao para bodas y eventos. Menús personalizados. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-catering/zaragoza', title: 'Contratar Catering en Zaragoza — XPEAK | Catering para bodas y eventos', desc: 'Contrata catering profesional en Zaragoza para bodas, eventos corporativos y celebraciones privadas. Menús personalizados. Sin comisión.', ogTitle: 'Contratar Catering en Zaragoza — XPEAK', ogDesc: 'Catering profesional en Zaragoza para bodas y eventos. Menús personalizados. Sin comisión.', ogType: 'website' },
  { path: '/contratar-catering/murcia',   title: 'Contratar Catering en Murcia — XPEAK | Catering para bodas y eventos',   desc: 'Contrata catering profesional en Murcia para bodas, eventos corporativos y celebraciones privadas. Menús personalizados. Sin comisión.',   ogTitle: 'Contratar Catering en Murcia — XPEAK',   ogDesc: 'Catering profesional en Murcia para bodas y eventos. Menús personalizados. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-catering/palma',    title: 'Contratar Catering en Palma — XPEAK | Catering para bodas y eventos',    desc: 'Contrata catering profesional en Palma de Mallorca para bodas y eventos exclusivos. Menús personalizados. Sin comisión.',                    ogTitle: 'Contratar Catering en Palma — XPEAK',    ogDesc: 'Catering profesional en Palma para bodas y eventos. Menús personalizados. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-catering/ibiza',    title: 'Contratar Catering en Ibiza — XPEAK | Catering para bodas y eventos',    desc: 'Contrata catering de lujo en Ibiza para bodas, eventos privados exclusivos y fiestas VIP. Menús personalizados. Sin comisión.',             ogTitle: 'Contratar Catering en Ibiza — XPEAK',    ogDesc: 'Catering de lujo en Ibiza para eventos privados y bodas. Menús personalizados. Sin comisión.',    ogType: 'website' },

  // Disco móvil por ciudad — adicionales
  { path: '/contratar-disco-movil/malaga',   title: 'Contratar Disco Móvil en Málaga — XPEAK | DJ con equipo para bodas',   desc: 'Contrata disco móvil en Málaga: DJ con sonido, luces y efectos para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.',   ogTitle: 'Contratar Disco Móvil en Málaga — XPEAK',   ogDesc: 'Disco móvil profesional en Málaga para bodas y eventos. Equipo completo. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-disco-movil/bilbao',   title: 'Contratar Disco Móvil en Bilbao — XPEAK | DJ con equipo para bodas',   desc: 'Contrata disco móvil en Bilbao: DJ con sonido, luces y efectos para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.',   ogTitle: 'Contratar Disco Móvil en Bilbao — XPEAK',   ogDesc: 'Disco móvil profesional en Bilbao para bodas y eventos. Equipo completo. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-disco-movil/zaragoza', title: 'Contratar Disco Móvil en Zaragoza — XPEAK | DJ con equipo para bodas', desc: 'Contrata disco móvil en Zaragoza: DJ con sonido, luces y efectos para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.', ogTitle: 'Contratar Disco Móvil en Zaragoza — XPEAK', ogDesc: 'Disco móvil profesional en Zaragoza para bodas y eventos. Equipo completo. Sin comisión.', ogType: 'website' },
  { path: '/contratar-disco-movil/murcia',   title: 'Contratar Disco Móvil en Murcia — XPEAK | DJ con equipo para bodas',   desc: 'Contrata disco móvil en Murcia: DJ con sonido, luces y efectos para bodas, comuniones y fiestas privadas. Flash Booking. Sin comisión.',   ogTitle: 'Contratar Disco Móvil en Murcia — XPEAK',   ogDesc: 'Disco móvil profesional en Murcia para bodas y eventos. Equipo completo. Sin comisión.',   ogType: 'website' },
  { path: '/contratar-disco-movil/palma',    title: 'Contratar Disco Móvil en Palma — XPEAK | DJ con equipo para bodas',    desc: 'Contrata disco móvil en Palma de Mallorca: DJ con sonido, luces y efectos para bodas y fiestas privadas. Flash Booking. Sin comisión.',    ogTitle: 'Contratar Disco Móvil en Palma — XPEAK',    ogDesc: 'Disco móvil profesional en Palma para bodas y eventos. Equipo completo. Sin comisión.',    ogType: 'website' },
  { path: '/contratar-disco-movil/ibiza',    title: 'Contratar Disco Móvil en Ibiza — XPEAK | DJ con equipo para bodas',    desc: 'Contrata disco móvil en Ibiza: DJ con equipo profesional de sonido y luces para bodas y eventos privados exclusivos. Flash Booking. Sin comisión.', ogTitle: 'Contratar Disco Móvil en Ibiza — XPEAK',    ogDesc: 'Disco móvil profesional en Ibiza para bodas y eventos exclusivos. Sin comisión.',         ogType: 'website' },

  // Blog — todos los posts
  { path: '/blog', title: 'Blog XPEAK — Guías para contratar profesionales de eventos en España', desc: 'Guías y consejos para contratar DJs, camareros, fotógrafos y staff para eventos en España. Precios, ratios y todo lo que necesitas saber.', ogTitle: 'Blog XPEAK — Guías para eventos en España', ogDesc: 'Guías y consejos para contratar profesionales de eventos en España. Precios y ratios.', ogType: 'website' },
  { path: '/blog/contratar-fotografo-de-bodas',       title: 'Cómo contratar un fotógrafo de bodas en España: guía de precios 2026 — XPEAK',         desc: 'Precios reales de fotógrafos de bodas en España 2026 por ciudad y tipo de servicio. Qué incluye y cómo elegir el fotógrafo perfecto.',                    ogTitle: 'Contratar fotógrafo de bodas: guía 2026',          ogDesc: 'Precios reales de fotógrafos de bodas en España. Qué incluye y cómo elegir el mejor.',           ogType: 'article' },
  { path: '/blog/staff-de-discoteca-funciones-y-salario', title: 'Staff de discoteca: funciones, sueldos y cómo contratar (2026) — XPEAK',           desc: 'Guía completa del personal de sala: hostesses, RRPPs, camareros y coordinadores. Tarifas reales por perfil y cómo contratar en España 2026.',            ogTitle: 'Staff de discoteca: funciones y sueldos 2026',     ogDesc: 'Funciones y tarifas del personal de sala: hostesses, RRPP, camareros. Guía 2026.',               ogType: 'article' },
  { path: '/blog/catering-para-eventos-de-empresa',    title: 'Catering para eventos de empresa en España: tipos y precios 2026 — XPEAK',             desc: 'Guía completa de catering para eventos corporativos: coffee breaks, cócteles, cenas de gala y food trucks. Precios por persona y formato.',              ogTitle: 'Catering para eventos de empresa: precios 2026',   ogDesc: 'Tipos de catering corporativo y precios por persona en España. Guía 2026.',                       ogType: 'article' },
  { path: '/blog/disco-movil-para-comuniones',         title: 'Disco móvil para comuniones: precios y qué incluye en 2026 — XPEAK',                  desc: 'Guía de precios de disco móvil para comuniones en España. Paquetes, qué incluye y cómo elegir el DJ correcto para tu comunión.',                       ogTitle: 'Disco móvil para comuniones: precios 2026',        ogDesc: 'Precios y paquetes de disco móvil para comuniones en España. Qué incluye el servicio.',           ogType: 'article' },
  { path: '/blog/promotores-de-eventos-que-hacen',     title: 'Promotores de eventos: qué hacen y cuánto cobran en España (2026) — XPEAK',           desc: 'Tipos de promotores, funciones reales, tarifas y cómo estructurar el contrato. Guía completa para contratar promotores de eventos en España.',          ogTitle: 'Promotores de eventos: qué hacen y cuánto cobran', ogDesc: 'Funciones y tarifas de promotores de eventos en España. Cómo contratar. Guía 2026.',               ogType: 'article' },
  { path: '/blog/maquillaje-nupcial-precio-guia',      title: 'Maquillaje nupcial: precios y cómo elegir tu maquilladora en España (2026) — XPEAK',  desc: 'Guía de precios de maquillaje para novias en España. Cuánto cuesta, qué incluye y cómo elegir la maquilladora perfecta para tu boda.',                ogTitle: 'Maquillaje nupcial: precios 2026 — XPEAK Blog',    ogDesc: 'Cuánto cuesta el maquillaje de novia en España y cómo elegir bien tu maquilladora.',             ogType: 'article' },
  { path: '/blog/dj-para-cumpleanos-precio',           title: 'DJ para cumpleaños: precios y qué incluye el servicio en España (2026) — XPEAK',       desc: 'Cuánto cuesta contratar un DJ para un cumpleaños en España. Precios por horas, equipo incluido y cómo elegir el DJ correcto para tu fiesta.',           ogTitle: 'DJ para cumpleaños: precios 2026 — XPEAK Blog',    ogDesc: 'Cuánto cuesta contratar un DJ para un cumpleaños en España. Precios por horas y equipo.',         ogType: 'article' },
  { path: '/blog/como-organizar-evento-corporativo',   title: 'Cómo organizar un evento corporativo paso a paso: guía completa 2026 — XPEAK',         desc: 'Guía completa para organizar eventos de empresa: presupuesto, proveedores, timeline y checklist. Todo lo que necesitas saber para un evento exitoso.',  ogTitle: 'Organizar evento corporativo: guía 2026 — XPEAK',  ogDesc: 'Cómo organizar eventos de empresa. Presupuesto, proveedores, timeline y checklist completo.',    ogType: 'article' },
  { path: '/blog/musica-para-bodas-guia',              title: 'Música para bodas: DJ, banda en directo o lista de reproducción — guía 2026 — XPEAK',  desc: 'Comparativa completa DJ vs banda vs cuarteto vs playlist para bodas. Precios, ventajas y cuándo elegir cada opción para tu boda en España.',           ogTitle: 'Música para bodas: DJ vs banda 2026 — XPEAK Blog', ogDesc: 'Comparativa DJ vs banda en directo para tu boda. Precios y cuándo elegir cada opción.',           ogType: 'article' },
  { path: '/blog/fotografia-eventos-nocturnos',        title: 'Fotografía en eventos nocturnos: precios y cómo contratar en España (2026) — XPEAK',   desc: 'Cuánto cobra un fotógrafo de discoteca o eventos nocturnos en España. Precios por tipo de evento, equipo necesario y cómo elegir el perfil correcto.',  ogTitle: 'Fotografía eventos nocturnos: precios 2026 — XPEAK', ogDesc: 'Cuánto cobra un fotógrafo de eventos nocturnos en España. Precios y guía de contratación.', ogType: 'article' },

  // Precios
  { path: '/precios', title: 'Precios XPEAK — Gratis para profesionales y empresarios de eventos', desc: 'XPEAK es gratis para DJs, fotógrafos, camareros y staff. También gratis para salas, promotoras y organizadores. Sin comisión. Contratos digitales incluidos.', ogTitle: 'Precios XPEAK — Gratis para todos', ogDesc: 'XPEAK es gratis para profesionales y empresarios de eventos. Sin comisión. Contratos digitales automáticos.', ogType: 'website' },
  { path: '/blog/precio-azafatas-eventos-espana',  title: 'Precio de azafatas para eventos en España: guía completa 2026 — XPEAK', desc: 'Tarifas reales de azafatas para ferias, congresos y eventos corporativos en España. Perfiles, precios por jornada y qué incluye. Guía 2026.', ogTitle: 'Precio azafatas eventos España 2026 — XPEAK Blog', ogDesc: 'Cuánto cobran las azafatas para eventos y ferias en España. Tarifas por perfil y ciudad.', ogType: 'article' },
  { path: '/blog/contratar-barman-evento-privado',  title: 'Contratar barman para evento privado: precios y qué incluye en España (2026) — XPEAK', desc: 'Cuánto cuesta contratar un barman o coctelero para un evento privado en España. Tarifas, paquetes y diferencias con camarero de barra. Guía 2026.', ogTitle: 'Contratar barman evento privado: precios 2026 — XPEAK Blog', ogDesc: 'Cuánto cuesta contratar un barman para un evento privado. Tarifas y paquetes.', ogType: 'article' },
  { path: '/blog/dj-boda-civil-precio-canciones',   title: 'DJ para boda civil: precio y qué canciones poner en cada momento (2026) — XPEAK', desc: 'Cuánto cuesta un DJ para boda civil en España y qué canciones poner en la entrada, firma, cóctel y pista de baile. Guía completa 2026.', ogTitle: 'DJ para boda civil: precio y canciones 2026 — XPEAK Blog', ogDesc: 'Precio del DJ para boda civil y guía de canciones por momento. Guía completa.', ogType: 'article' },
  { path: '/blog/catering-boda-precio-por-persona', title: 'Catering boda: precio por persona en España (2026) — XPEAK', desc: 'Cuánto cuesta el catering de una boda en España. Precios por formato, qué incluye cada paquete y cómo no llevarte sorpresas. Guía 2026.', ogTitle: 'Catering boda precio por persona 2026 — XPEAK Blog', ogDesc: 'Precios reales del catering de boda en España. Por persona, por formato y todo lo que incluye.', ogType: 'article' },
  { path: '/blog/videografo-bodas-precio',          title: 'Videógrafo para bodas: precio y qué incluye el vídeo en España (2026) — XPEAK', desc: 'Cuánto cuesta contratar un videógrafo para tu boda en España. Precios por paquete, ciudad y diferencias con el fotógrafo. Guía 2026.', ogTitle: 'Videógrafo bodas: precio 2026 — XPEAK Blog', ogDesc: 'Precios reales de videógrafos de boda en España. Por paquete, ciudad y tipo de producción.', ogType: 'article' },
  { path: '/blog/tendencias-bodas-2026',            title: 'Tendencias bodas 2026 en España: decoración, música y experiencias — XPEAK', desc: 'Lo que piden los novios en 2026: bodas íntimas, fincas rurales, catering experiencial y fórmulas mixtas de música. Guía de tendencias.', ogTitle: 'Tendencias bodas 2026 España — XPEAK Blog', ogDesc: 'Todo lo que piden los novios en 2026: bodas íntimas, fincas, catering experiencial y música en directo.', ogType: 'article' },
  { path: '/blog/animadores-infantiles-comuniones-cumpleanos', title: 'Animadores infantiles para comuniones y cumpleaños: precios 2026 — XPEAK', desc: 'Cuánto cuestan los animadores para comuniones y cumpleaños en España. Tipos de animación, ratios y qué preguntar antes de contratar. Guía 2026.', ogTitle: 'Animadores infantiles comuniones: precios 2026 — XPEAK Blog', ogDesc: 'Precios reales de animadores infantiles para comuniones y cumpleaños en España.', ogType: 'article' },
  { path: '/blog/como-organizar-fiesta-empresa',    title: 'Cómo organizar una fiesta de empresa: checklist y proveedores (2026) — XPEAK', desc: 'Guía completa para organizar la fiesta de empresa. Checklist por fases, presupuesto por partidas y qué proveedores necesitas. Ideal para cenas de fin de año.', ogTitle: 'Organizar fiesta de empresa: checklist 2026 — XPEAK Blog', ogDesc: 'Checklist completo, presupuesto y proveedores para la fiesta de empresa perfecta en España.', ogType: 'article' },

  // Static pages
  {
    path: '/sobre-nosotros',
    title: 'Sobre XPEAK — Directorio profesional de ocio nocturno en España',
    desc: 'XPEAK conecta DJs, staff, fotógrafos y profesionales verificados con salas, promotoras y eventos en toda España. Conoce nuestra misión.',
    ogTitle: 'Sobre XPEAK',
    ogDesc: 'La plataforma que conecta al talento del ocio nocturno con las mejores oportunidades en España.',
    ogType: 'website',
  },
  {
    path: '/aviso-legal',
    title: 'Aviso Legal — XPEAK',
    desc: 'Aviso legal e información corporativa de XPEAK, plataforma profesional para eventos y ocio nocturno en España.',
    ogTitle: 'Aviso Legal — XPEAK',
    ogDesc: 'Información legal de XPEAK.',
    ogType: 'website',
  },

  // ── Local SEO — /dj-madrid, /camareros-barcelona, etc. ────────────────────
  // DJs por ciudad
  { path: '/dj-madrid',    title: 'DJs en Madrid — Contratar DJ para tu evento | XPEAK', desc: 'Encuentra DJs profesionales en Madrid. Tech House, Techno, Comercial, Reggaeton. Tarifas desde 60€/h. Flash Booking en menos de 1h. Sin comisión.', ogTitle: 'DJs en Madrid — Contratar DJ | XPEAK', ogDesc: 'DJs verificados en Madrid para clubs, bodas y eventos. Tarifas desde 60€/h. Flash Booking disponible.', ogType: 'website' },
  { path: '/dj-barcelona', title: 'DJs en Barcelona — Contratar DJ para tu evento | XPEAK', desc: 'Encuentra DJs profesionales en Barcelona. Tech House, Techno, Deep House y más. Tarifas desde 80€/h. Flash Booking en menos de 1h. Sin comisión.', ogTitle: 'DJs en Barcelona — Contratar DJ | XPEAK', ogDesc: 'DJs verificados en Barcelona para clubs, bodas y eventos. Tarifas desde 80€/h. Flash Booking disponible.', ogType: 'website' },
  { path: '/dj-sevilla',   title: 'DJs en Sevilla — Contratar DJ para tu evento | XPEAK', desc: 'Encuentra DJs profesionales en Sevilla. Afro House, Comercial, Reggaeton y más. Tarifas desde 40€/h. Flash Booking en menos de 1h. Sin comisión.', ogTitle: 'DJs en Sevilla — Contratar DJ | XPEAK', ogDesc: 'DJs verificados en Sevilla para clubs, bodas y eventos. Tarifas desde 40€/h. Flash Booking disponible.', ogType: 'website' },
  { path: '/dj-valencia',  title: 'DJs en Valencia — Contratar DJ para tu evento | XPEAK', desc: 'Encuentra DJs profesionales en Valencia. Deep House, Comercial y más. Tarifas desde 50€/h. Flash Booking en menos de 1h. Sin comisión.', ogTitle: 'DJs en Valencia — Contratar DJ | XPEAK', ogDesc: 'DJs verificados en Valencia para clubs, bodas y eventos. Tarifas desde 50€/h. Flash Booking disponible.', ogType: 'website' },
  { path: '/dj-malaga',    title: 'DJs en Málaga — Contratar DJ para tu evento | XPEAK', desc: 'Encuentra DJs profesionales en Málaga y la Costa del Sol. Tarifas desde 35€/h. Flash Booking en menos de 1h. Sin comisión.', ogTitle: 'DJs en Málaga — Contratar DJ | XPEAK', ogDesc: 'DJs verificados en Málaga para clubs, bodas y eventos. Flash Booking disponible.', ogType: 'website' },
  { path: '/dj-bilbao',    title: 'DJs en Bilbao — Contratar DJ para tu evento | XPEAK', desc: 'Encuentra DJs profesionales en Bilbao. Techno, Deep House y más. Tarifas desde 50€/h. Flash Booking en menos de 1h. Sin comisión.', ogTitle: 'DJs en Bilbao — Contratar DJ | XPEAK', ogDesc: 'DJs verificados en Bilbao para clubs, bodas y eventos. Flash Booking disponible.', ogType: 'website' },

  // Camareros por ciudad
  { path: '/camareros-madrid',    title: 'Camareros en Madrid — Personal de sala para eventos | XPEAK', desc: 'Camareros y barmans profesionales en Madrid para bodas, eventos de empresa y fiestas privadas. Desde 16€/h. Flash Booking disponible. Sin comisión.', ogTitle: 'Camareros en Madrid para eventos | XPEAK', ogDesc: 'Personal de sala verificado en Madrid. Bodas, eventos corporativos y fiestas privadas. Flash Booking.', ogType: 'website' },
  { path: '/camareros-barcelona', title: 'Camareros en Barcelona — Personal de sala para eventos | XPEAK', desc: 'Camareros y barmans profesionales en Barcelona para bodas y eventos. Desde 16€/h. Flash Booking disponible. Sin comisión.', ogTitle: 'Camareros en Barcelona para eventos | XPEAK', ogDesc: 'Personal de sala verificado en Barcelona. Bodas y eventos corporativos. Flash Booking disponible.', ogType: 'website' },
  { path: '/camareros-sevilla',   title: 'Camareros en Sevilla — Personal de sala para eventos | XPEAK', desc: 'Camareros y barmans profesionales en Sevilla para bodas y eventos. Desde 14€/h. Flash Booking disponible. Sin comisión.', ogTitle: 'Camareros en Sevilla para eventos | XPEAK', ogDesc: 'Personal de sala verificado en Sevilla. Bodas y eventos. Flash Booking disponible.', ogType: 'website' },
  { path: '/camareros-valencia',  title: 'Camareros en Valencia — Personal de sala para eventos | XPEAK', desc: 'Camareros y barmans profesionales en Valencia para bodas y eventos. Desde 15€/h. Flash Booking disponible. Sin comisión.', ogTitle: 'Camareros en Valencia para eventos | XPEAK', ogDesc: 'Personal de sala verificado en Valencia. Bodas y eventos. Flash Booking disponible.', ogType: 'website' },
  { path: '/camareros-malaga',    title: 'Camareros en Málaga — Personal de sala para eventos | XPEAK', desc: 'Camareros y barmans profesionales en Málaga para bodas y eventos. Desde 14€/h. Flash Booking disponible. Sin comisión.', ogTitle: 'Camareros en Málaga para eventos | XPEAK', ogDesc: 'Personal de sala verificado en Málaga. Bodas y eventos. Flash Booking disponible.', ogType: 'website' },
  { path: '/camareros-bilbao',    title: 'Camareros en Bilbao — Personal de sala para eventos | XPEAK', desc: 'Camareros y barmans profesionales en Bilbao para bodas y eventos. Desde 15€/h. Flash Booking disponible. Sin comisión.', ogTitle: 'Camareros en Bilbao para eventos | XPEAK', ogDesc: 'Personal de sala verificado en Bilbao. Bodas y eventos. Flash Booking disponible.', ogType: 'website' },

  // Fotógrafo por ciudad
  { path: '/fotografo-madrid',    title: 'Fotógrafos en Madrid — Fotografía de eventos y bodas | XPEAK', desc: 'Fotógrafos profesionales en Madrid para bodas, eventos nocturnos y corporativos. Portfolio verificado. Desde 300€/evento. Flash Booking. Sin comisión.', ogTitle: 'Fotógrafos en Madrid para eventos y bodas | XPEAK', ogDesc: 'Fotógrafos verificados en Madrid. Portfolio real, entrega rápida. Flash Booking disponible.', ogType: 'website' },
  { path: '/fotografo-barcelona', title: 'Fotógrafos en Barcelona — Fotografía de eventos y bodas | XPEAK', desc: 'Fotógrafos profesionales en Barcelona para bodas, eventos nocturnos y corporativos. Portfolio verificado. Flash Booking. Sin comisión.', ogTitle: 'Fotógrafos en Barcelona para eventos y bodas | XPEAK', ogDesc: 'Fotógrafos verificados en Barcelona. Portfolio real, entrega rápida. Flash Booking disponible.', ogType: 'website' },
  { path: '/fotografo-sevilla',   title: 'Fotógrafos en Sevilla — Fotografía de eventos y bodas | XPEAK', desc: 'Fotógrafos profesionales en Sevilla para bodas, eventos y corporativos. Portfolio verificado. Flash Booking. Sin comisión.', ogTitle: 'Fotógrafos en Sevilla para eventos y bodas | XPEAK', ogDesc: 'Fotógrafos verificados en Sevilla. Portfolio real, entrega rápida. Flash Booking disponible.', ogType: 'website' },
  { path: '/fotografo-valencia',  title: 'Fotógrafos en Valencia — Fotografía de eventos y bodas | XPEAK', desc: 'Fotógrafos profesionales en Valencia para bodas, eventos y corporativos. Portfolio verificado. Flash Booking. Sin comisión.', ogTitle: 'Fotógrafos en Valencia para eventos y bodas | XPEAK', ogDesc: 'Fotógrafos verificados en Valencia. Portfolio real, entrega rápida. Flash Booking disponible.', ogType: 'website' },
  { path: '/fotografo-malaga',    title: 'Fotógrafos en Málaga — Fotografía de eventos y bodas | XPEAK', desc: 'Fotógrafos profesionales en Málaga y la Costa del Sol para bodas y eventos. Portfolio verificado. Flash Booking. Sin comisión.', ogTitle: 'Fotógrafos en Málaga para eventos y bodas | XPEAK', ogDesc: 'Fotógrafos verificados en Málaga. Portfolio real, entrega rápida. Flash Booking disponible.', ogType: 'website' },
  { path: '/fotografo-bilbao',    title: 'Fotógrafos en Bilbao — Fotografía de eventos y bodas | XPEAK', desc: 'Fotógrafos profesionales en Bilbao para bodas, eventos y corporativos. Portfolio verificado. Flash Booking. Sin comisión.', ogTitle: 'Fotógrafos en Bilbao para eventos y bodas | XPEAK', ogDesc: 'Fotógrafos verificados en Bilbao. Portfolio real, entrega rápida. Flash Booking disponible.', ogType: 'website' },

  // Maquillaje por ciudad
  { path: '/maquillaje-madrid',    title: 'Maquilladoras en Madrid — Maquillaje para bodas y eventos | XPEAK', desc: 'Maquilladoras profesionales en Madrid para bodas, fotografía y eventos. Prueba nupcial incluida. Desde 95€. Flash Booking disponible. Sin comisión.', ogTitle: 'Maquilladoras en Madrid para bodas | XPEAK', ogDesc: 'Maquilladoras verificadas en Madrid. Nupcial, artístico y editorial. Flash Booking disponible.', ogType: 'website' },
  { path: '/maquillaje-barcelona', title: 'Maquilladoras en Barcelona — Maquillaje para bodas y eventos | XPEAK', desc: 'Maquilladoras profesionales en Barcelona para bodas, fotografía y eventos. Prueba nupcial incluida. Flash Booking disponible. Sin comisión.', ogTitle: 'Maquilladoras en Barcelona para bodas | XPEAK', ogDesc: 'Maquilladoras verificadas en Barcelona. Nupcial, artístico y editorial. Flash Booking disponible.', ogType: 'website' },
  { path: '/maquillaje-sevilla',   title: 'Maquilladoras en Sevilla — Maquillaje para bodas y eventos | XPEAK', desc: 'Maquilladoras profesionales en Sevilla para bodas y eventos. Prueba nupcial incluida. Flash Booking disponible. Sin comisión.', ogTitle: 'Maquilladoras en Sevilla para bodas | XPEAK', ogDesc: 'Maquilladoras verificadas en Sevilla. Nupcial y artístico. Flash Booking disponible.', ogType: 'website' },
  { path: '/maquillaje-valencia',  title: 'Maquilladoras en Valencia — Maquillaje para bodas y eventos | XPEAK', desc: 'Maquilladoras profesionales en Valencia para bodas y eventos. Prueba nupcial incluida. Flash Booking disponible. Sin comisión.', ogTitle: 'Maquilladoras en Valencia para bodas | XPEAK', ogDesc: 'Maquilladoras verificadas en Valencia. Nupcial y artístico. Flash Booking disponible.', ogType: 'website' },
  { path: '/maquillaje-malaga',    title: 'Maquilladoras en Málaga — Maquillaje para bodas y eventos | XPEAK', desc: 'Maquilladoras profesionales en Málaga para bodas y eventos. Prueba nupcial incluida. Flash Booking disponible. Sin comisión.', ogTitle: 'Maquilladoras en Málaga para bodas | XPEAK', ogDesc: 'Maquilladoras verificadas en Málaga. Nupcial y artístico. Flash Booking disponible.', ogType: 'website' },
  { path: '/maquillaje-bilbao',    title: 'Maquilladoras en Bilbao — Maquillaje para bodas y eventos | XPEAK', desc: 'Maquilladoras profesionales en Bilbao para bodas y eventos. Prueba nupcial incluida. Flash Booking disponible. Sin comisión.', ogTitle: 'Maquilladoras en Bilbao para bodas | XPEAK', ogDesc: 'Maquilladoras verificadas en Bilbao. Nupcial y artístico. Flash Booking disponible.', ogType: 'website' },

  // Staff por ciudad
  { path: '/staff-madrid',    title: 'Staff de eventos en Madrid — Hostesses y RRPP | XPEAK', desc: 'Staff profesional en Madrid para discotecas, festivales y eventos: hostesses, RRPP, promotores y coordinadores. Desde 15€/h. Flash Booking. Sin comisión.', ogTitle: 'Staff de eventos en Madrid — Hostesses y RRPP | XPEAK', ogDesc: 'Staff verificado en Madrid. Hostesses, RRPP y coordinadores para clubs y festivales. Flash Booking.', ogType: 'website' },
  { path: '/staff-barcelona', title: 'Staff de eventos en Barcelona — Hostesses y RRPP | XPEAK', desc: 'Staff profesional en Barcelona para discotecas y eventos: hostesses, RRPP, promotores. Desde 15€/h. Flash Booking. Sin comisión.', ogTitle: 'Staff de eventos en Barcelona — Hostesses y RRPP | XPEAK', ogDesc: 'Staff verificado en Barcelona. Hostesses, RRPP y coordinadores. Flash Booking disponible.', ogType: 'website' },
  { path: '/staff-sevilla',   title: 'Staff de eventos en Sevilla — Hostesses y RRPP | XPEAK', desc: 'Staff profesional en Sevilla para discotecas y eventos: hostesses, RRPP, promotores. Flash Booking. Sin comisión.', ogTitle: 'Staff de eventos en Sevilla — Hostesses y RRPP | XPEAK', ogDesc: 'Staff verificado en Sevilla. Hostesses, RRPP y promotores. Flash Booking disponible.', ogType: 'website' },
  { path: '/staff-valencia',  title: 'Staff de eventos en Valencia — Hostesses y RRPP | XPEAK', desc: 'Staff profesional en Valencia para discotecas y eventos: hostesses, RRPP, promotores. Flash Booking. Sin comisión.', ogTitle: 'Staff de eventos en Valencia — Hostesses y RRPP | XPEAK', ogDesc: 'Staff verificado en Valencia. Hostesses, RRPP y promotores. Flash Booking disponible.', ogType: 'website' },
  { path: '/staff-malaga',    title: 'Staff de eventos en Málaga — Hostesses y RRPP | XPEAK', desc: 'Staff profesional en Málaga para discotecas y eventos: hostesses, RRPP, promotores. Flash Booking. Sin comisión.', ogTitle: 'Staff de eventos en Málaga — Hostesses y RRPP | XPEAK', ogDesc: 'Staff verificado en Málaga. Hostesses, RRPP y promotores. Flash Booking disponible.', ogType: 'website' },
  { path: '/staff-bilbao',    title: 'Staff de eventos en Bilbao — Hostesses y RRPP | XPEAK', desc: 'Staff profesional en Bilbao para discotecas y eventos: hostesses, RRPP, promotores. Flash Booking. Sin comisión.', ogTitle: 'Staff de eventos en Bilbao — Hostesses y RRPP | XPEAK', ogDesc: 'Staff verificado en Bilbao. Hostesses, RRPP y promotores. Flash Booking disponible.', ogType: 'website' },

  // Blog nuevo
  { path: '/blog/wedding-planner-precio-espana', title: 'Wedding Planner: precio y qué hace en España (2026) — XPEAK', desc: 'Cuánto cobra un wedding planner en España. Precios por paquete, coordinador del día vs planificación integral, y checklist completo 2026.', ogTitle: 'Wedding Planner: precio y qué hace en España 2026 — XPEAK Blog', ogDesc: 'Precios reales de wedding planners en España. Coordinación del día vs planificación integral. Guía completa.', ogType: 'article' },
  { path: '/blog/como-contratar-personal-para-un-evento', title: 'Cómo contratar personal para un evento en España: guía 2026 — XPEAK', desc: 'Tipos de personal para eventos, ratios por número de invitados, precios y checklist completo para contratar staff en España.', ogTitle: 'Contratar personal para un evento: guía 2026 — XPEAK Blog', ogDesc: 'Guía completa para contratar personal de eventos en España. Ratios, precios y checklist.', ogType: 'article' },
  { path: '/blog/dj-residente-discoteca-precio', title: 'DJ residente de discoteca: precio y contrato en España (2026) — XPEAK', desc: 'Cuánto cobra un DJ residente en una discoteca en España. Tarifas por ciudad y aforo, diferencias con DJ invitado y cláusulas del contrato.', ogTitle: 'DJ residente discoteca: precio 2026 — XPEAK Blog', ogDesc: 'Tarifas reales de DJs residentes en discotecas españolas. Diferencias con DJ invitado y contrato.', ogType: 'article' },
  { path: '/blog/catering-comuniones-precio-persona', title: 'Catering para comuniones: precio por persona en España (2026) — XPEAK', desc: 'Cuánto cuesta el catering de una comunión en España. Precios por formato (aperitivo, banquete, todo incluido), extras y consejos para ahorrar.', ogTitle: 'Catering comuniones: precio por persona 2026 — XPEAK Blog', ogDesc: 'Precios reales del catering para comuniones en España. Por persona, por formato y todo lo que incluye.', ogType: 'article' },

  // ── Perfiles demo ────────────────────────────────────────────────────────
  { path: '/p/luna-deep',     title: 'Luna Deep — DJ Deep House & Melodic en Madrid | XPEAK',      desc: 'Perfil de Luna Deep, DJ referente del deep house en Madrid. Sesiones melódicas con vinilo y producción propia. 11 años de experiencia. Contrata online.',  ogTitle: 'Luna Deep — DJ Deep House Madrid | XPEAK',      ogDesc: 'DJ referente del deep house en Madrid. Vinilo y producción propia. Contrata online en XPEAK.',      ogType: 'profile' },
  { path: '/p/mc-rafaga',     title: 'MC Ráfaga — DJ Urbano & Reggaetón en Barcelona | XPEAK',     desc: 'Perfil de MC Ráfaga, DJ urbano especializado en reggaetón y música latina en Barcelona. 6 años de experiencia. Contrata online en XPEAK.',                ogTitle: 'MC Ráfaga — DJ Urbano Barcelona | XPEAK',        ogDesc: 'DJ urbano y reggaetón en Barcelona. El más solicitado de la ciudad. Contrata en XPEAK.',           ogType: 'profile' },
  { path: '/p/sara-beats',    title: 'Sara Beats — DJ Comercial & Top Hits en Sevilla | XPEAK',    desc: 'Perfil de Sara Beats, DJ versátil especializada en música comercial y top hits en Sevilla. Bodas, eventos y discotecas. Contrata online.',                 ogTitle: 'Sara Beats — DJ Comercial Sevilla | XPEAK',      ogDesc: 'DJ versátil para bodas y eventos en Sevilla. Comercial, Top 40. Contrata online en XPEAK.',        ogType: 'profile' },
  { path: '/p/carla-vega',    title: 'Carla Vega — Azafata VIP & Hostess en Madrid | XPEAK',       desc: 'Perfil de Carla Vega, azafata profesional con experiencia en clubs de alto standing en Madrid. Protocolo, multilingüe EN/FR. Contrata online.',          ogTitle: 'Carla Vega — Hostess VIP Madrid | XPEAK',        ogDesc: 'Azafata VIP en Madrid. Protocolo y multilingüe EN/FR. Experiencia en clubs de alto standing.',    ogType: 'profile' },
  { path: '/p/marcos-rios',   title: 'Marcos Ríos — Camarero VIP & Flair Bartender en Madrid | XPEAK', desc: 'Perfil de Marcos Ríos, barman con espectáculo en Madrid. Coctelería molecular y flair para eventos exclusivos. Certificado WSET. Contrata online.',  ogTitle: 'Marcos Ríos — Flair Bartender Madrid | XPEAK',   ogDesc: 'Barman con espectáculo en Madrid. Coctelería molecular y flair. Certificado WSET.',                ogType: 'profile' },
  { path: '/p/patricia-sanz', title: 'Patricia Sanz — RRPP & Relaciones Públicas en Madrid | XPEAK', desc: 'Perfil de Patricia Sanz, la RRPP más conectada de Madrid. 10 años de experiencia en gestión de listas y networking VIP. Contrata online.',         ogTitle: 'Patricia Sanz — RRPP Madrid | XPEAK',            ogDesc: 'RRPP premium en Madrid. Gestión de listas, networking VIP. 10 años de experiencia.',               ogType: 'profile' },
  { path: '/p/nadia-glamour', title: 'Nadia Glamour — Maquilladora de Eventos & FX en Madrid | XPEAK', desc: 'Perfil de Nadia Glamour, maquilladora artística especializada en looks de noche y efectos especiales en Madrid. FX Pro, Bodypaint UV. Contrata.',  ogTitle: 'Nadia Glamour — Maquilladora de Noche Madrid | XPEAK', ogDesc: 'Maquilladora artística en Madrid. Looks de noche, FX y Bodypaint UV. Contrata online.',       ogType: 'profile' },
  { path: '/p/ivan-stylez',   title: 'Iván Stylez — Peluquero de Autor & Estilista en Madrid | XPEAK', desc: 'Perfil de Iván Stylez, estilista capilar de autor con experiencia en desfiles y eventos nocturnos en Madrid. Color Expert. Contrata online.',     ogTitle: 'Iván Stylez — Peluquero de Autor Madrid | XPEAK', ogDesc: 'Estilista capilar de autor en Madrid. Color Expert, extensiones y peinado de evento.',              ogType: 'profile' },
  { path: '/p/alicia-moon',   title: 'Alicia Moon — Estilista Integral Nocturna en Madrid | XPEAK', desc: 'Perfil de Alicia Moon, estilista de imagen nocturna en Madrid. Vestuario, asesoría de estilo y personal shopping con luxury brands. Contrata online.', ogTitle: 'Alicia Moon — Estilista Nocturna Madrid | XPEAK', ogDesc: 'Estilismo integral nocturno en Madrid. Vestuario, asesoría de imagen y luxury brands.',              ogType: 'profile' },
  { path: '/p/diego-noir',    title: 'Diego Noir — Estilista Moda Nocturna & Streetwear en Madrid | XPEAK', desc: 'Perfil de Diego Noir, estilista de moda nocturna y streetwear en Madrid. Diseño custom de outfits para artistas y clubs. Contrata online.',  ogTitle: 'Diego Noir — Moda Nocturna Madrid | XPEAK',      ogDesc: 'Estilista de moda nocturna y streetwear en Madrid. Diseño custom para artistas.',                  ogType: 'profile' },
  { path: '/p/carlos-flash',  title: 'Carlos Flash — Fotógrafo de Eventos Nocturnos en Madrid | XPEAK', desc: 'Perfil de Carlos Flash, fotógrafo especializado en eventos nocturnos y fiestas en Madrid. Entrega en 24h. Canon R5. Contrata online en XPEAK.',  ogTitle: 'Carlos Flash — Fotógrafo Eventos Madrid | XPEAK', ogDesc: 'Fotógrafo de eventos nocturnos en Madrid. Entrega 24h. Equipo Canon R5. Contrata online.',          ogType: 'profile' },
  { path: '/p/marta-lens',    title: 'Marta Lens — Videógrafa & Aftermovies en Madrid | XPEAK',    desc: 'Perfil de Marta Lens, videógrafa especializada en aftermovies cinematográficos para salas y festivales en Madrid. 4K Cinema, Drone. Contrata online.',  ogTitle: 'Marta Lens — Videógrafa Madrid | XPEAK',         ogDesc: 'Aftermovies cinematográficos en Madrid. 4K Cinema y drone. Para salas y festivales.',              ogType: 'profile' },
  { path: '/p/zoe-viral',     title: 'Zoe Viral — Creadora de Contenido UGC & TikTok en Madrid | XPEAK', desc: 'Perfil de Zoe Viral, creadora de contenido viral para clubs y eventos nocturnos en Madrid. +200K seguidores en TikTok y Reels. Contrata online.', ogTitle: 'Zoe Viral — Creadora Contenido Madrid | XPEAK',  ogDesc: 'Contenido viral para clubs en Madrid. +200K seguidores. TikTok, Reels y UGC Creator.',              ogType: 'profile' },
  { path: '/p/alex-neon',     title: 'Álex Neon — Diseñador Gráfico & Flyers para Eventos en Madrid | XPEAK', desc: 'Perfil de Álex Neon, diseñador gráfico especializado en identidad visual para salas y promotoras en Madrid. Flyers, branding, cartelería. Contrata.', ogTitle: 'Álex Neon — Diseñador Flyers Madrid | XPEAK', ogDesc: 'Identidad visual para salas y promotoras en Madrid. Flyers, branding y cartelería.', ogType: 'profile' },
  { path: '/p/paula-motion',  title: 'Paula Motion — Motion Graphics & Visuales LED en Madrid | XPEAK', desc: 'Perfil de Paula Motion, diseñadora de motion graphics para pantallas LED en salas y festivales de Madrid. After Effects y LED Mapping. Contrata.',  ogTitle: 'Paula Motion — Motion Graphics Madrid | XPEAK',  ogDesc: 'Motion graphics para pantallas LED en salas y festivales de Madrid. After Effects y VDMX.',        ogType: 'profile' },
  { path: '/p/ruben-vj',      title: 'Rubén VJ — Video Jockey & Visuales Live en Madrid | XPEAK',   desc: 'Perfil de Rubén VJ, video jockey con setup propio en Madrid. Proyecciones inmersivas sincronizadas con el DJ. Resolume y VDMX. Contrata online.',     ogTitle: 'Rubén VJ — Video Jockey Madrid | XPEAK',         ogDesc: 'VJ con setup propio en Madrid. Proyecciones inmersivas sincronizadas con el DJ. Resolume/VDMX.',  ogType: 'profile' },
  { path: '/p/laura-promo',   title: 'Laura Promo — Brand Ambassador & Street Team en Madrid | XPEAK', desc: 'Perfil de Laura Promo, promotora profesional con experiencia en acciones de guerrilla y street marketing en Madrid. Flyering y registro in-situ.',  ogTitle: 'Laura Promo — Brand Ambassador Madrid | XPEAK',  ogDesc: 'Promotora profesional en Madrid. Street team, flyering y registro in-situ. Experiencia real.',    ogType: 'profile' },
  { path: '/p/javi-street',   title: 'Javi Street — Promotor & Soporte de Marca en Madrid | XPEAK', desc: 'Perfil de Javi Street, promotor de marca en eventos nocturnos en Madrid. QR Campaigns, activaciones y gestión de stands. Contrata online en XPEAK.',  ogTitle: 'Javi Street — Promotor Eventos Madrid | XPEAK',  ogDesc: 'Soporte de marca en eventos nocturnos en Madrid. QR Campaigns, activaciones y stands.',            ogType: 'profile' },
];

// ─── Helper: replace or inject a meta tag ──────────────────────────────────
function replaceMeta(html, attr, value, newContent) {
  const re = new RegExp(`<meta\\s+${attr}\\s*=\\s*["'][^"']*["'][^>]*>`, 'gi');
  const tag = `<meta ${attr}="${value}" content="${escHtml(newContent)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function replaceTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/, `<title>${escHtml(title)}</title>`);
}

function replaceCanonical(html, url) {
  const re = /<link\s+rel="canonical"[^>]*>/gi;
  const tag = `<link rel="canonical" href="${url}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function replaceOgProp(html, prop, content) {
  const re = new RegExp(`<meta\\s+property="${prop}"[^>]*>`, 'gi');
  const tag = `<meta property="${prop}" content="${escHtml(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Main ──────────────────────────────────────────────────────────────────
const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
let count = 0;

for (const route of ROUTES) {
  const url = `${BASE}${route.path}`;
  let html = shell;
  html = replaceTitle(html, route.title);
  html = replaceMeta(html, 'name="description"', 'name="description"', route.desc);
  html = replaceCanonical(html, url);
  html = replaceOgProp(html, 'og:title', route.ogTitle);
  html = replaceOgProp(html, 'og:description', route.ogDesc);
  html = replaceOgProp(html, 'og:url', url);
  html = replaceOgProp(html, 'og:type', route.ogType);
  html = replaceMeta(html, 'name="twitter:title"', 'name="twitter:title"', route.ogTitle);
  html = replaceMeta(html, 'name="twitter:description"', 'name="twitter:description"', route.ogDesc);

  const dir = path.join(DIST, route.path === '/' ? '' : route.path);
  fs.mkdirSync(dir, { recursive: true });
  const dest = route.path === '/' ? path.join(DIST, 'index.html') : path.join(dir, 'index.html');
  fs.writeFileSync(dest, html, 'utf8');
  count++;
  console.log(`  ✓ ${route.path}`);
}

console.log(`\nPrerender: ${count} páginas generadas en dist/`);
