import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, ChevronDown,
  Zap, Users, CreditCard, FileText, Radio, Star,
  User, BarChart3, Calendar, Map, ShoppingBag, Heart,
  Award, Camera, Smile, Building2, RefreshCw,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface KBEntry {
  id: string;
  patterns: RegExp[];
  answer: string;
  /** Optional follow-up suggestions shown after this answer */
  followUps?: string[];
}

interface Msg {
  from: 'bot' | 'user';
  text: string;
  ts: number;
  followUps?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────────────────────
const KB: KBEntry[] = [

  // ── Saludos ───────────────────────────────────────────────────────────────
  {
    id: 'greeting',
    patterns: [/^\s*(hola|buenas|buenos días|buenos dias|hey|hi|saludos|ey|qué hay|que hay|buenas noches|buenas tardes)\s*[!?]?\s*$/i],
    answer: '¡Hola! Soy el asistente de **XPEAK**. Puedo ayudarte con:\n\n• Perfil y visibilidad en el directorio\n• Flash Booking y cómo conseguir contratos\n• Planes y precios\n• Contratos legales, mensajes, estadísticas\n• Streaming, Fan Club, Tienda y más\n\n¿Sobre qué quieres saber?',
    followUps: ['¿Qué es XPEAK?', '¿Cómo funciona el Flash Booking?', '¿Cuánto cuesta?', '¿Cómo consigo más bookings?'],
  },

  // ── Qué es XPEAK ─────────────────────────────────────────────────────────
  {
    id: 'about',
    patterns: [/qué es xpeak|que es xpeak|para qu[eé] sirve|explícame xpeak|explicame xpeak|cuéntame.*xpeak|información.*xpeak|info.*xpeak/i],
    answer: '**XPEAK** es el marketplace profesional de la industria del entretenimiento nocturno en Europa.\n\nNació para eliminar los intermediarios entre artistas y venues. Todo ocurre en la plataforma:\n\n• **Directorio** — DJs, staff, maquilladores, media, promotores y embajadores\n• **Flash Booking** — contratación urgente con ofertas que caducan en 2h\n• **Contratos** — documentos legales generados en segundos\n• **Mensajería** — comunicación directa entre partes sin comisiones\n• **Escenario Virtual** — streaming en vivo para crecer tu audiencia\n• **Fan Club** — monetización de tu comunidad de seguidores\n• **Estadísticas** — datos reales de quién visita tu perfil\n\nActualmente activo en **España** con expansión a toda Europa prevista para 2026.',
    followUps: ['¿Cómo me registro?', '¿Qué roles hay?', '¿Cuánto cuesta?'],
  },

  // ── Registro / acceso ─────────────────────────────────────────────────────
  {
    id: 'register',
    patterns: [/registr|crear cuenta|cuenta nueva|sign up|cómo me uno|como me uno|acceder|login|iniciar sesión|contraseña olvidada|password|recuperar.*cuenta/i],
    answer: 'Para crear tu cuenta en XPEAK:\n\n1. Ve a la pantalla de inicio → **"Entrar"**\n2. Regístrate con **email + contraseña** o con **Google** (un clic)\n3. Elige tu **rol profesional** (DJ, Staff, Makeup, Media…)\n4. Confirma tu email si es por correo\n\n**Si no puedes entrar:**\n• Contraseña incorrecta → usa **"¿Olvidaste tu contraseña?"** en el login\n• No recibes el email → revisa la carpeta de spam\n• Cuenta bloqueada → escribe a soporte@xpeak.site\n\nNo hay verificación manual al registrarse — accedes al instante.',
    followUps: ['¿Cómo completo mi perfil?', '¿Puedo cambiar mi rol después?', '¿Qué diferencia hay entre planes?'],
  },

  // ── Perfil — campos y optimización ───────────────────────────────────────
  {
    id: 'profile',
    patterns: [/mi perfil|editar.*perfil|completar.*perfil|campos.*perfil|foto.*perfil|avatar|bio|descripci|rider.*técnico|rider tecnico|tarifa|precio.*hora|géneros|generos|idioma.*perfil/i],
    answer: 'Tu perfil en **Mi Cuenta → Mi Perfil** tiene estos campos clave:\n\n**Básicos (obligatorios para aparecer):**\n• Foto profesional — la primera impresión lo es todo\n• Nombre artístico o profesional\n• Ciudad principal — determina en qué búsquedas locales apareces\n• Rol y especialidades/géneros\n\n**Avanzados (multiplican visitas x5):**\n• Bio (2-4 líneas): quién eres, qué ofreces y por qué contratarte\n• Tarifa — precio orientativo por sesión o por hora\n• Rider técnico — especifica equipo que necesitas o que aportas\n• Idiomas — si hablas inglés o francés, apareces en búsquedas internacionales\n• Audio embed — enlaza tu mejor mix o sesión\n• Toggle de disponibilidad — actívalo cuando estés libre para eventos\n\n**Tip:** Los perfiles con foto, audio Y géneros seleccionados reciben 5 veces más contactos que los incompletos.',
    followUps: ['¿Qué pongo en el rider técnico?', '¿Cómo escribo una buena bio?', '¿Cómo subo mi mix?'],
  },

  // ── Bio: cómo escribirla ──────────────────────────────────────────────────
  {
    id: 'bio',
    patterns: [/bio|descripción.*perfil|descripcion.*perfil|cómo.*presentar|como.*presentar|qué poner en la bio|que poner.*bio|texto.*perfil/i],
    answer: 'Una buena bio en XPEAK sigue esta estructura:\n\n**Línea 1 — Quién eres:**\nEj: "DJ residente en Madrid especializado en Tech House y Melodic Techno con 8 años de experiencia en salas de capacidad 500+"\n\n**Línea 2 — Qué ofreces:**\nEj: "Sesiones de 2-4h adaptadas al público del local, con equipo propio opcional"\n\n**Línea 3 — Por qué contratarte:**\nEj: "Residencias en [Sala X], colaboraciones con sellos [Y y Z], vídeo demostrativo disponible"\n\n**Lo que NO hacer:**\n• Frases genéricas como "apasionado de la música"\n• Más de 4 líneas (nadie las lee)\n• Escribir en mayúsculas\n\nLa bio la ven los empresarios antes de decidir si te escriben.',
    followUps: ['¿Qué pongo en el rider técnico?', '¿Cómo mejoro mi posición en el directorio?'],
  },

  // ── Rider técnico ─────────────────────────────────────────────────────────
  {
    id: 'rider',
    patterns: [/rider|requisitos.*técnicos|requisitos tecnicos|equipo.*necesito|qué necesito.*actuar|setup|mesa.*mezclas|cdj|controller/i],
    answer: 'El **rider técnico** informa al venue de lo que necesitas o lo que aportas.\n\n**Si el venue pone el equipo, especifica:**\n• Mesa de mezclas: modelo exacto o rango (ej. "Pioneer DJM-900 o superior")\n• Reproductores: CDJ-2000NXS2 / XDJ-1000 / Denon SC6000\n• Monitores de escenario y potencia mínima\n• Conexiones: USB, ethernet, cable de audio\n\n**Si tú llevas equipo, especifica:**\n• Qué aportas (ej. "Denon Prime 4 propio")\n• Qué necesita el local (enchufes, mesa de apoyo, iluminación)\n\n**Otros campos útiles:**\n• Tiempo de montaje y prueba de sonido (recomendado 30 min antes)\n• Necesidades de acceso o aparcamiento\n\nUn rider claro evita malentendidos y transmite profesionalidad.',
    followUps: ['¿Cómo completo mi perfil?', '¿Qué es el Flash Booking?'],
  },

  // ── Audio / mix upload ────────────────────────────────────────────────────
  {
    id: 'audio',
    patterns: [/subir.*audio|subir.*mix|enlazar.*mix|soundcloud|mixcloud|hearthis|embed.*audio|audio.*embed|mix.*perfil|sesión.*escuchar|sesion.*escuchar/i],
    answer: 'Para que los empresarios escuchen tu trabajo desde tu ficha:\n\n1. Sube tu mejor mix a **SoundCloud**, **Mixcloud** o **hearthis.at** (son gratuitos)\n2. Copia la URL pública del mix (no la privada)\n3. En XPEAK ve a **Mi Perfil → Redes & Plataformas**\n4. Pega la URL en el campo correspondiente y guarda\n\n**Qué mix subir:**\n• Duración recomendada: 45-90 minutos\n• Que represente bien el estilo con el que quieres que te contraten\n• Si tienes varios estilos, pon el más comercial/versátil\n\n**El audio aparece embebido** en tu ficha pública — los empresarios lo escuchan sin salir de XPEAK, lo que aumenta significativamente los contactos.',
    followUps: ['¿Puedo enlazar también vídeo?', '¿Qué géneros selecciono en el perfil?'],
  },

  // ── Flash Booking — mecánica completa ─────────────────────────────────────
  {
    id: 'flashbooking',
    patterns: [/flash booking|flash book|booking.*urgente|oferta.*urgente|urgente.*booking|última hora|ultima hora|disponible.*ahora|disponib.*toggle/i],
    answer: '**Flash Booking** es el sistema de contratación de última hora de XPEAK.\n\n**Cómo funciona para profesionales:**\n1. Activa el toggle **"Disponible ahora"** en Mi Perfil\n2. Apareces destacado en la sección Flash Booking visible para todos los empresarios\n3. Cuando recibes una oferta, te llega por **Mensajes** con detalles del evento\n4. Respondes directamente — sin intermediarios ni porcentajes\n5. Si aceptas, generáis el contrato desde Herramientas\n\n**Cómo funciona para empresarios:**\n1. Ve a **En Vivo → Flash Booking**\n2. Publica la oferta: rol, fecha, ciudad, duración y caché ofrecido\n3. La oferta es visible **2 horas** para los profesionales disponibles\n4. Recibes respuestas directamente en tus Mensajes\n\n**Importante:** Los planes **Elite y Agency** tienen visibilidad prioritaria — sus perfiles aparecen antes en la lista de disponibles.',
    followUps: ['¿Qué pasa si nadie responde en 2 horas?', '¿Qué plan necesito?', '¿Cómo negocio el precio?'],
  },

  // ── Flash Booking — expiración / sin respuesta ────────────────────────────
  {
    id: 'flashexpiry',
    patterns: [/caduca|expirar|expira|2 horas|dos horas|nadie.*responde|sin respuesta.*flash|oferta.*vence/i],
    answer: 'Una oferta Flash **caduca automáticamente a las 2 horas** de publicarse.\n\nSi nadie responde en ese tiempo:\n• La oferta desaparece del muro de Flash Booking\n• El empresario puede volver a publicarla con los mismos datos (no hay límite de intentos)\n• También puede buscar directamente en el Directorio y contactar manualmente\n\n**Por qué puede no haber respuestas:**\n• Pocos profesionales del rol y ciudad tienen disponibilidad activa\n• La franja horaria es muy próxima (menos de 3h)\n• El caché ofrecido está por debajo del mercado\n\n**Consejo:** Ofrece el caché real desde el principio — los profesionales ven todas las ofertas simultáneamente y priorizan las mejor pagadas.',
    followUps: ['¿Cómo publico una nueva oferta?', '¿Cuántos profesionales hay disponibles?'],
  },

  // ── Negociar precios ──────────────────────────────────────────────────────
  {
    id: 'negotiation',
    patterns: [/negociar|negociación|negociacion|precio.*discutir|caché.*negociar|cache.*negociar|cuánto.*cobrar|cuanto.*cobrar|tarifa.*justa/i],
    answer: 'XPEAK no impone precios ni cobra comisión sobre el acuerdo económico.\n\n**La negociación ocurre en Mensajes:**\n• Inicia indicando tu disponibilidad y tarifa base\n• El empresario puede contraoferta — tú decides si aceptas\n• No hay presión: si no hay acuerdo, la conversación queda archivada\n\n**Referencias de mercado en España (2025):**\n• DJ sesión club 4h — entre €150 y €800 según experiencia y sala\n• Staff / azafata noche — entre €80 y €200\n• Fotógrafo evento — entre €150 y €500\n• Maquillaje artístico — entre €80 y €250\n\n**Tip:** Si has publicado tarifa en el perfil, los empresarios llegan habiendo visto ese precio — reduce el regateo.',
    followUps: ['¿Cómo genero el contrato tras acordar?', '¿Qué incluye el contrato?'],
  },

  // ── Contratos — legales y contenido ──────────────────────────────────────
  {
    id: 'contracts',
    patterns: [/contrato|contratos|pdf|legal|firma.*digital|iva|irpf|fiscal|tributar|prestación de servicio|penalizaci|cancelaci.*contrato/i],
    answer: 'En **Herramientas → Contratos** generas contratos de prestación de servicios **conformes a la ley española**.\n\n**Qué incluye cada contrato:**\n• Identificación completa de ambas partes\n• Descripción del servicio, fecha, lugar y duración\n• Precio pactado con desglose IVA 21% + retención IRPF 15%\n• Cláusula de cancelación con penalización proporcional al plazo\n• Referencia a Código Civil art. 1544 y ET art. 1.1\n\n**Proceso:**\n1. Ve a Contratos → Nuevo contrato\n2. Selecciona la otra parte (si ya hablásteis por Mensajes, aparece en la lista)\n3. Rellena los datos del evento\n4. Descarga el PDF y envíalo a la otra parte para imprimir y firmar\n\n**Firma digital eIDAS** (con validez legal plena) llegará próximamente.',
    followUps: ['¿Qué pasa si se cancela el evento?', '¿El contrato incluye IRPF?'],
  },

  // ── Cancelación de evento ─────────────────────────────────────────────────
  {
    id: 'cancellation',
    patterns: [/cancelaci|cancelar.*evento|evento.*cancel|penalizaci|no.*puedo.*ir|fuerza mayor|anular.*booking/i],
    answer: 'Las cancelaciones se gestionan según lo acordado en el **contrato generado en XPEAK**.\n\n**Penalización estándar en los contratos XPEAK:**\n• Cancelación con más de 15 días de antelación → sin penalización\n• Entre 7 y 15 días → 25% del caché acordado\n• Entre 2 y 7 días → 50% del caché\n• Menos de 48 horas → 100% del caché\n\nEstas cláusulas son editables al generar el contrato — puedes acordar otras condiciones.\n\n**Si no hay contrato firmado**, la cancelación no tiene consecuencias legales directas en XPEAK — la plataforma actúa como canal de comunicación, no como árbitro.\n\n**Fuerza mayor** (enfermedad acreditada, fallecimiento familiar, etc.) suele eximir la penalización — consúltalo con la otra parte directamente.',
    followUps: ['¿Cómo genero un contrato?', '¿Puedo valorar negativamente a alguien?'],
  },

  // ── Mensajes / chat ───────────────────────────────────────────────────────
  {
    id: 'messages',
    patterns: [/mensajes|mensaje|chat.*plataforma|hablar.*profesional|contactar.*perfil|dm|directo|bandeja.*entrada/i],
    answer: 'El sistema de **Mensajes** en **Herramientas → Mensajes** es el canal de comunicación central de XPEAK.\n\n**Cómo usarlo:**\n• Inicia una conversación desde el botón **"Mensaje"** en cualquier tarjeta del directorio\n• O desde el perfil completo de un profesional\n• Las conversaciones quedan guardadas indefinidamente\n\n**Qué puedes hacer en un mensaje:**\n• Adjuntar tu rider técnico (texto plano)\n• Acordar precio, fecha y condiciones antes del contrato\n• Confirmar asistencia o cancelar con antelación\n\n**Notificaciones:** XPEAK te avisa en la interfaz cuando tienes mensajes nuevos. El badge con número aparece en el icono de Mensajes del menú.',
    followUps: ['¿Puedo bloquear a alguien?', '¿Cómo genero el contrato después de acordar?'],
  },

  // ── Directorio — cómo funciona la búsqueda ────────────────────────────────
  {
    id: 'directory',
    patterns: [/directorio|cómo.*buscar|como.*buscar|filtrar.*profesional|filtros.*directorio|encontrar.*dj|encontrar.*staff|aparecer.*directorio|búsqueda.*directorio/i],
    answer: 'El **Directorio** tiene 6 secciones, una por rol:\n\n• **DJs & Artistas** — todos los géneros, de techno a comercial\n• **DJ Promesa** — talento emergente, precios más accesibles\n• **Staff & Promoción** — azafatas, RRPP, hostess, camareros\n• **Maquillaje & Peluquería** — imagen artística, nupcial y editorial\n• **Media & Contenido** — fotógrafos, videógrafos, creadores de reels\n• **Panel Empresario** — vista específica con herramientas de contratación\n\n**Filtros disponibles en cada sección:**\n• Ciudad (busca radio local)\n• Disponibilidad ahora (Flash Booking activo)\n• Sello de Oro verificado\n• Géneros / especialidades\n\n**Orden de resultados:**\nPrimero aparecen los verificados con Sello de Oro, luego por plan (Elite > Business > Starter > Free).',
    followUps: ['¿Cómo mejoro mi posición en resultados?', '¿Puedo buscar por precio?'],
  },

  // ── Algoritmo de posicionamiento ─────────────────────────────────────────
  {
    id: 'ranking',
    patterns: [/posicionamiento|ranking|aparecer.*primero|mejorar.*visibilidad|algoritmo|orden.*resultados|cómo.*destaco|como.*destaco/i],
    answer: 'El orden en que apareces en el directorio sigue esta jerarquía:\n\n**1. Sello de Oro** (verificado por XPEAK) — posición más alta\n**2. Plan de suscripción** — Elite > Business > Starter > Free\n**3. Perfil completo** — foto + bio + géneros + audio\n**4. Actividad reciente** — perfiles con más interacciones suben\n**5. Disponibilidad activa** — con el toggle ON apareces destacado en Flash Booking\n\n**Para subir rápido sin pagar más:**\n• Completa el 100% de tu perfil (foto, bio, géneros, idiomas, audio)\n• Solicita el Sello de Oro (gratis, solo necesitas vídeo)\n• Mantén el toggle de disponibilidad activo los fines de semana\n• Responde rápido a los mensajes (la actividad influye en el ranking)',
    followUps: ['¿Cómo obtengo el Sello de Oro?', '¿Qué plan da más visibilidad?'],
  },

  // ── Roles disponibles — descripción detallada ─────────────────────────────
  {
    id: 'roles',
    patterns: [/qué roles hay|que roles hay|tipos de.*perfil|categorías.*xpeak|categorias.*xpeak|cambiar.*rol|qué rol.*elegir|que rol.*elegir|staff.*qué hace|staff.*que hace/i],
    answer: 'XPEAK tiene estos roles profesionales:\n\n**DJs & Artistas** — Música electrónica, sesiones en directo, residencias\n**DJ / Artista Promesa** — Perfil junior para talento emergente y residentes locales\n**Staff & Promoción** — Azafatas, RRPP, promotores de sala, hostess, camareros, seguridad\n**Maquillaje & Peluquería** — Artistas de imagen para artistas, bodas y producción\n**Media & Contenido** — Fotógrafos, videógrafos, drone, reels, motion graphics\n**Embajador** — Representación de marcas de bebidas, tecnología o ropa en eventos\n**Promotor** — Organización de fiestas, management de artistas, booking de salas\n**Empresario** — Clubs, salas, festivales, agencias de booking, hoteles con eventos\n\n**Cambiar de rol:** Ve a **Ajustes** → sección de perfil → selecciona nuevo rol. Ten en cuenta que el contenido específico (géneros, especialidades) se resetea al cambiar.',
    followUps: ['¿Puedo tener varios roles?', '¿Cómo edito las especialidades?'],
  },

  // ── DJ Promesa vs DJ completo ─────────────────────────────────────────────
  {
    id: 'rookie',
    patterns: [/dj promesa|artista promesa|rookie|junior|emergente|nuevo.*dj|principiante|diferencia.*dj.*promesa/i],
    answer: 'La sección **DJ / Artista Promesa** está diseñada para talento emergente.\n\n**Diferencias clave con el directorio principal de DJs:**\n• Aparece en una sección separada que los empresarios filtran específicamente cuando buscan precios más accesibles o apostar por talento nuevo\n• Las tarifas son generalmente más bajas (€50-€200 vs €150-€800 en DJ senior)\n• Menor competencia — menos perfiles, más visibilidad relativa\n• Ideal para residencias locales, fiestas privadas y aperturas de sala\n\n**Cuándo "graduarse":**\nNo hay un límite automático. Cuando consideres que tu experiencia y caché están al nivel del directorio principal, cambia tu rol en Ajustes.\n\n**Los empresarios que miran Promesas buscan:** precio ajustado, energía fresca y flexibilidad horaria.',
    followUps: ['¿Cómo cambio de rol?', '¿Qué géneros debo seleccionar?'],
  },

  // ── Suscripciones — comparativa detallada ────────────────────────────────
  {
    id: 'subscription',
    patterns: [/suscripci|precio.*plan|plan.*precio|cuánto.*cuesta|cuanto.*cuesta|gratis.*qué incluye|free.*plan|starter|business.*plan|elite.*plan|agency.*plan|diferencia.*planes/i],
    answer: 'Comparativa de los **4 planes XPEAK**:\n\n**Free — Gratis siempre**\n• Perfil activo y visible en el directorio\n• Posición estándar (última en el ranking)\n• Sin acceso a Flash Booking\n• Sin streaming en Escenario Virtual\n\n**Starter**\n• Acceso a Flash Booking (con retraso de 15 min respecto a Elite/Business)\n• Posición media en el directorio\n• Estadísticas básicas\n\n**Business**\n• Posición destacada en el directorio\n• Flash Booking sin retraso\n• Streaming en Escenario Virtual\n• Estadísticas completas con comparativas\n• Acceso prioritario a TOP Weekend\n\n**Elite / Agency**\n• Máxima visibilidad — aparece primero en todas las búsquedas\n• Badge AGENCIA (para empresas con múltiples artistas)\n• Todas las funciones desbloqueadas\n• Soporte prioritario\n\nPrecios exactos en **Mi Cuenta → Suscripción**. Sin permanencia, cancela cuando quieras.',
    followUps: ['¿Puedo probar Business gratis?', '¿Hay descuento si pago anual?', '¿Cómo cancelo?'],
  },

  // ── Facturación / pagos / cancelar plan ───────────────────────────────────
  {
    id: 'billing',
    patterns: [/cancelar.*plan|cancelar.*suscripci|reembolso|devoluci|cobro.*incorrecto|método de pago|tarjeta.*pago|cambiar.*tarjeta|factura.*suscripci|stripe/i],
    answer: 'Todo lo relacionado con pagos está en **Mi Cuenta → Suscripción**.\n\n**Cancelar:**\n• Puedes cancelar en cualquier momento sin penalización\n• Conservas el plan activo hasta el fin del período ya pagado\n• Después pasas automáticamente a Free\n\n**Cambiar de plan:**\n• Upgrade (Free → Starter → Business): efecto inmediato\n• Downgrade: efecto al finalizar el período actual\n\n**Cambiar método de pago:**\n• En Suscripción → "Gestionar facturación" (portal Stripe)\n• Puedes añadir nueva tarjeta y eliminar la antigua\n\n**Reembolsos:**\n• Escribe a soporte@xpeak.site en los **7 días** siguientes al cobro\n• Se estudian caso a caso\n\nXPEAK procesa pagos con **Stripe** — tus datos de tarjeta nunca pasan por nuestros servidores.',
    followUps: ['¿Qué pasa si mi tarjeta falla?', '¿Puedo pagar con PayPal?'],
  },

  // ── Sello de Oro — requisitos y proceso ───────────────────────────────────
  {
    id: 'verification',
    patterns: [/sello.*oro|verificaci|badge.*verificado|cómo.*verificar|como.*verificar|obtener.*sello|solicitar.*verificaci|video.*verificaci|vídeo.*verificaci/i],
    answer: 'El **Sello de Oro XPEAK** es la verificación de calidad de la plataforma.\n\n**Requisitos para solicitarlo:**\n1. Perfil completo (foto, bio, géneros, ciudad)\n2. Vídeo de demostración subido (mínimo 2 minutos mostrando tu trabajo real)\n3. Historial limpio en la plataforma (sin reportes)\n\n**Proceso:**\n1. Graba un vídeo — puede ser una actuación real, session grabada o contenido propio\n2. Súbelo a YouTube, Drive o Vimeo (enlace sin contraseña)\n3. Ve a **Mi Perfil → Sección Verificación → Solicitar Sello**\n4. El equipo lo revisa en **24-48 horas laborables**\n5. Si se aprueba, el badge aparece en tu tarjeta y perfil inmediatamente\n\n**Qué consigues:**\n• Posición #1 en el directorio (por encima de los no verificados del mismo plan)\n• Mayor tasa de conversión — los empresarios confían más\n• Elegibilidad para TOP Weekend y selecciones editoriales\n• El sello es **gratuito** — no requiere plan de pago específico',
    followUps: ['¿Qué tipo de vídeo necesito?', '¿Cuánto tarda la revisión?'],
  },

  // ── TOP Weekend ───────────────────────────────────────────────────────────
  {
    id: 'topweekend',
    patterns: [/top weekend|topweekend|selección.*editorial|selecci.*semana|cada jueves|fin de semana.*destacado/i],
    answer: '**TOP Weekend** es la selección editorial semanal — la sección más vista por los empresarios.\n\nCada **jueves a las 12:00** el equipo XPEAK publica los 6-10 mejores profesionales disponibles para ese fin de semana.\n\n**Criterios de selección:**\n• Sello de Oro activo (imprescindible)\n• Disponibilidad activada para viernes y/o sábado\n• Perfil con audio + vídeo + bio completa\n• Plan Business o Elite\n• Sin conflictos ni reportes recientes\n\n**Qué ganas al aparecer:**\n• Tu tarjeta en posición destacada visible para TODOS los usuarios de la plataforma\n• Notificación a los empresarios registrados con tu perfil\n• Históricamente, los seleccionados reciben entre 3 y 8 contactos ese fin de semana\n\nNo puedes "pagar" para aparecer — es decisión editorial del equipo.',
    followUps: ['¿Cómo obtengo el Sello de Oro?', '¿Qué plan necesito?'],
  },

  // ── Escenario Virtual / streaming ─────────────────────────────────────────
  {
    id: 'streaming',
    patterns: [/escenario virtual|streaming|stream|en vivo|en directo|twitch|youtube.*live|emitir|broadcast|directo.*xpeak/i],
    answer: 'El **Escenario Virtual** es el espacio de streaming en directo integrado en XPEAK.\n\n**Cómo activarlo:**\n1. Ve a **En Vivo → Escenario Virtual**\n2. Conecta tu canal de Twitch, YouTube Live o Mixcloud Live\n3. Cuando estés emitiendo en tu plataforma habitual, activa el toggle en XPEAK\n4. Tu directo aparece en el feed de Escenario Virtual visible para todos los usuarios\n\n**Requisitos:**\n• Plan **Business o Elite** activo\n• Canal externo con al menos 1 emisión previa\n\n**Beneficios de visibilidad:**\n• Los empresarios que están buscando DJs te ven actuando en tiempo real — es la mejor demo posible\n• El feed de directos aparece en el dashboard principal de todos los usuarios\n• Cada emisión aumenta las visitas a tu perfil entre un 40-70%\n\n**Tip:** Emite en viernes por la tarde (17-20h) — es cuando más empresarios navegan por XPEAK planificando el fin de semana.',
    followUps: ['¿Qué plan necesito para el Escenario Virtual?', '¿Puedo guardar la grabación?'],
  },

  // ── Fan Club ──────────────────────────────────────────────────────────────
  {
    id: 'fanclub',
    patterns: [/fan club|fanclub|seguidores|fans|contenido exclusivo|suscriptores.*fan|monetizar.*fans|comunidad.*xpeak/i],
    answer: '**Fan Club** es tu espacio de comunidad y monetización directa en XPEAK.\n\n**Qué puedes publicar:**\n• Sets y sesiones exclusivas no publicadas en otras plataformas\n• Fotos y vídeos behind the scenes\n• Adelantos de fechas antes del anuncio público\n• Acceso anticipado a tu tienda\n• Sorteos de entradas o merchandising entre suscriptores\n\n**Cómo funciona la suscripción:**\n• Tú fijas el precio mensual (mínimo €2, máximo libre)\n• Los fans pagan para acceder al contenido exclusivo\n• XPEAK cobra una comisión de plataforma (porcentaje a confirmar en la versión de monetización)\n\n**Estado actual:** La sección ya existe y puedes configurar tu espacio. La monetización real via Stripe está **en desarrollo** y llegará en la próxima versión mayor.',
    followUps: ['¿Cuándo llega la monetización completa?', '¿Qué más puedo vender en XPEAK?'],
  },

  // ── Tienda ────────────────────────────────────────────────────────────────
  {
    id: 'store',
    patterns: [/tienda|store|vender.*productos|samples.*vender|pack.*samples|merchandising|merch.*xpeak|venta.*digital/i],
    answer: 'La **Tienda XPEAK** te permitirá vender desde tu perfil sin necesidad de plataformas externas.\n\n**Tipos de productos previstos:**\n• **Samples y packs** — loops, one-shots, stems de tus producciones\n• **Sesiones de audio** — sets grabados en calidad lossless\n• **Merchandising físico** — camisetas, vinilos, prints (con envío gestionado por ti)\n• **Productos digitales** — tutoriales, cursos, presets de EQ/efectos\n• **Entradas y accesos** — a tus fiestas o eventos privados\n\n**Estado actual:** En desarrollo activo. La sección **Mi Tienda** ya es visible en Mi Perfil donde podrás configurar productos cuando esté disponible.\n\n**Para prepararte ya:**\n• Graba y organiza tus mejores sesiones\n• Piensa en un precio justo para cada producto\n• El lanzamiento está previsto para las próximas semanas',
    followUps: ['¿El Fan Club también sirve para monetizar?', '¿Habrá comisión de venta?'],
  },

  // ── Estadísticas — interpretarlas ────────────────────────────────────────
  {
    id: 'stats',
    patterns: [/estadísticas|estadisticas|métricas|visitas.*perfil|clics.*contacto|cómo.*interpretar.*stats|que significan.*stats|rendimiento.*perfil/i],
    answer: 'En **Mi Cuenta → Estadísticas** tienes un panel de rendimiento con estos datos:\n\n**Visitas al perfil** — número de veces que alguien ha abierto tu ficha completa. Un perfil con Sello de Oro y plan Business recibe entre 50 y 200 visitas semanales en temporada alta.\n\n**Clics de contacto** — cuántas personas han pulsado "Mensaje" desde tu perfil. Si este número es bajo respecto a las visitas, tu bio o tarifa puede estar ahuyentando contactos.\n\n**Mensajes recibidos** — conversaciones iniciadas. Un ratio visitas/mensajes sano es 1 mensaje por cada 10-15 visitas.\n\n**Evolución mensual** — gráfica de tendencia. Identifica picos (¿coincidieron con TOP Weekend? ¿con una emisión en Escenario Virtual?) para repetirlos.\n\nCon **Business o Elite** accedes a comparativas del sector — sabes si estás por encima o por debajo de la media de tu rol y ciudad.',
    followUps: ['¿Cómo mejoro mi ratio de contactos?', '¿Dónde activo el streaming?'],
  },

  // ── Calendario ────────────────────────────────────────────────────────────
  {
    id: 'calendar',
    patterns: [/calendario|agenda.*xpeak|fechas.*ocupadas|bloquer.*fecha|gestionar.*fechas|disponibilidad.*calendario/i],
    answer: 'El **Calendario** en **Herramientas → Calendario** es tu gestor de agenda profesional.\n\n**Qué puedes hacer:**\n• Marcar días como **ocupados** (evento ya contratado)\n• Marcar días como **disponible** (para que los empresarios lo vean)\n• Añadir notas privadas a cada fecha\n• Ver todos tus compromisos del mes en una vista limpia\n\n**Integración con Flash Booking:**\nSi marcas un día como ocupado en el Calendario, el toggle de Flash Booking se desactiva automáticamente para esa fecha, evitando que recibas ofertas que no puedes atender.\n\n**Consejo práctico:** Actualiza el calendario cada lunes — los empresarios que planifican el fin de semana lo consultan activamente. Un calendario actualizado transmite profesionalidad.',
    followUps: ['¿Se integra con Google Calendar?', '¿Cómo activo Flash Booking?'],
  },

  // ── Mapa ──────────────────────────────────────────────────────────────────
  {
    id: 'map',
    patterns: [/mapa|ubicación.*xpeak|geográfico|zona.*profesional|cerca de mí|cerca de mi|localizar.*dj|localizar.*profesional/i],
    answer: 'El **Mapa** muestra todos los profesionales activos con ciudad configurada.\n\n**Para empresarios:**\n• Ves puntos por rol (color diferente para DJ, Staff, Makeup, Media)\n• Haz clic en cualquier punto para abrir la tarjeta del profesional\n• Filtra por rol y disponibilidad para encontrar talento local rápido\n\n**Para profesionales:**\n• Apareces en el mapa si tienes ciudad configurada en tu perfil\n• Si trabajas en varias ciudades, pon la principal o la más activa\n• Añadir ciudad correcta mejora tu visibilidad en búsquedas locales\n\n**Alcance geográfico:**\nEl mapa cubre toda España y países vecinos. Los empresarios fuera de España también lo usan para buscar talento local para giras.',
    followUps: ['¿Cómo añado mi ciudad?', '¿Puedo poner varias ciudades?'],
  },

  // ── Panel Empresario ──────────────────────────────────────────────────────
  {
    id: 'empresario',
    patterns: [/panel.*empresario|cómo.*contratar|como.*contratar|soy.*empresario|soy.*sala|soy.*club|busco.*dj|buscar.*artista|organizo.*evento/i],
    answer: 'Como empresario, XPEAK te da todo lo que necesitas en un solo lugar.\n\n**Flujo de contratación completo:**\n1. **Busca** en el Directorio filtrando por rol + ciudad + disponibilidad\n2. **Escucha** el audio o mira el vídeo del profesional antes de contactar\n3. **Verifica** el Sello de Oro para seguridad adicional\n4. **Contacta** directamente con el botón Mensaje — sin intermediarios\n5. **Acuerda** precio y condiciones en el chat\n6. **Genera el contrato** en Herramientas → Contratos con datos de ambas partes\n7. **Firma** y archiva el PDF\n\n**Para urgencias:** Publica en **Flash Booking** con fecha, rol, ciudad y caché — en 2h tienes respuestas de profesionales disponibles.\n\n**Panel Empresario** (Directorio → Panel Empresario) agrupa todas las herramientas de búsqueda en una vista optimizada.',
    followUps: ['¿Cómo publico un Flash Booking?', '¿Cuánto cuesta para empresas?'],
  },

  // ── Ajustes generales ─────────────────────────────────────────────────────
  {
    id: 'settings',
    patterns: [/ajustes|configuración.*cuenta|cambiar.*email|cambiar.*contraseña|notificaciones.*configurar|preferencias.*cuenta/i],
    answer: 'En **Configuración → Ajustes** tienes control total sobre tu cuenta:\n\n**Cuenta:**\n• Cambiar email (requiere confirmación en el nuevo correo)\n• Cambiar contraseña (requiere la contraseña actual)\n\n**Notificaciones:**\n• Mensajes nuevos — activable por email y/o push\n• Nuevas ofertas Flash Booking en tu zona\n• Selección TOP Weekend\n• Actualizaciones de la plataforma\n\n**Privacidad:**\n• Quién puede enviarte mensajes (todos / solo verificados / nadie)\n• Visibilidad del perfil (público / oculto del directorio)\n• Mostrar u ocultar tarifa en el perfil público\n\n**Cuenta:**\n• Exportar datos ZIP (RGPD)\n• Eliminar cuenta permanentemente',
    followUps: ['¿Cómo bloqueo a alguien?', '¿Cómo elimino mi cuenta?'],
  },

  // ── Bloquear / reportar usuarios ──────────────────────────────────────────
  {
    id: 'block',
    patterns: [/bloquear|reportar.*usuario|usuario.*falso|perfil.*falso|spam|acoso|comportamiento.*inapropiado|denunciar/i],
    answer: 'XPEAK tiene mecanismos para mantener la comunidad profesional.\n\n**Bloquear un usuario:**\n• Entra en su perfil → menú de opciones (tres puntos) → "Bloquear"\n• El usuario bloqueado no puede enviarte mensajes ni ver tu perfil\n\n**Reportar un perfil falso o comportamiento inadecuado:**\n• Desde el perfil del usuario → "Reportar"\n• Selecciona el motivo: perfil falso, spam, contenido inapropiado, acoso\n• El equipo revisa los reportes en 24-48h\n• Tras 3 reportes verificados, la cuenta se suspende automáticamente\n\n**Si recibes un mensaje de acoso:**\nReenvíalo a soporte@xpeak.site con el ID del mensaje — se tramita como caso prioritario.',
    followUps: ['¿Cómo configuro quién puede escribirme?', '¿Cómo contacto con soporte?'],
  },

  // ── RGPD / privacidad / exportar datos ────────────────────────────────────
  {
    id: 'gdpr',
    patterns: [/rgpd|gdpr|privacidad.*datos|mis datos|exportar datos|portabilidad|derecho.*olvido|eliminar.*datos|política.*privacidad/i],
    answer: 'XPEAK cumple con el **RGPD** europeo y la **LOPDGDD** española.\n\n**Tus derechos en XPEAK:**\n• **Acceso** — puedes solicitar qué datos tenemos sobre ti en cualquier momento\n• **Rectificación** — edita tus datos directamente desde Mi Perfil o Ajustes\n• **Supresión ("derecho al olvido")** — elimina tu cuenta desde Ajustes → se borran todos tus datos en 30 días\n• **Portabilidad** — descarga un ZIP con todos tus datos (mensajes, perfil, estadísticas) desde Ajustes → Exportar datos\n• **Oposición al tratamiento** — escribe a privacidad@xpeak.site\n\n**Datos que no almacenamos:**\n• Datos bancarios (los gestiona Stripe de forma aislada)\n• Contraseñas en texto plano (encriptadas con bcrypt)\n\nLa política de privacidad completa está en **xpeak.site/privacidad**.',
    followUps: ['¿Cómo elimino mi cuenta?', '¿Cómo exporto mis datos?'],
  },

  // ── Eliminar cuenta ───────────────────────────────────────────────────────
  {
    id: 'deleteaccount',
    patterns: [/eliminar.*cuenta|borrar.*cuenta|dar.*baja|darme.*baja|cerrar.*cuenta|dejar.*xpeak/i],
    answer: 'Para eliminar tu cuenta permanentemente:\n\n1. Ve a **Ajustes** (menú lateral, abajo)\n2. Baja hasta la sección **"Zona de peligro"**\n3. Clic en **"Eliminar cuenta"**\n4. Confirma con tu contraseña\n\n**Qué ocurre al eliminar:**\n• Tu perfil desaparece del directorio inmediatamente\n• Los mensajes con otras personas se archivan (la otra parte puede seguir viendo su lado)\n• Tus datos se purgan de los servidores en **30 días** (RGPD)\n• Si tenías suscripción activa, se cancela automáticamente — no se realizan cobros adicionales\n\n**Antes de eliminar considera:**\n• Puedes desactivar la visibilidad del perfil temporalmente (Ajustes → Privacidad) sin borrar la cuenta\n• Puedes pausar la suscripción en lugar de eliminar la cuenta',
    followUps: ['¿Puedo reactivar la cuenta después?', '¿Qué pasa con mis estadísticas?'],
  },

  // ── Problema técnico / bug ────────────────────────────────────────────────
  {
    id: 'bug',
    patterns: [/no funciona|error.*técnico|error tecnico|bug|pantalla.*blanca|se cuelga|no carga|fallo.*app|problema.*técnico|problema tecnico|lento.*carga/i],
    answer: 'Pasos para resolver problemas técnicos en XPEAK:\n\n**Paso 1 — Soluciones rápidas:**\n• Recarga la página: **Ctrl+R** (Windows) / **Cmd+R** (Mac)\n• Cierra el navegador completamente y vuelve a abrir\n• Prueba en **modo incógnito** (descarta problemas de caché o extensiones)\n\n**Paso 2 — Limpieza de caché:**\n• Chrome: Menú → Más herramientas → Borrar datos de navegación → Imágenes y archivos en caché\n• Safari: Preferencias → Avanzado → Mostrar menú Desarrollo → Vaciar cachés\n\n**Paso 3 — Si persiste:**\nEscribe a **soporte@xpeak.site** con:\n• Qué acción estabas haciendo\n• Qué mensaje de error aparece (captura de pantalla si es posible)\n• Navegador y versión (Chrome 124, Safari 17…)\n• Dispositivo (Mac, Windows, iPhone, Android)\n\nTiempo de respuesta: 24-48h laborables.',
    followUps: ['¿Hay app móvil de XPEAK?', '¿Cómo contacto con soporte?'],
  },

  // ── App móvil ─────────────────────────────────────────────────────────────
  {
    id: 'mobile',
    patterns: [/app móvil|app movil|aplicación.*móvil|aplicacion.*movil|ios|android|iphone.*xpeak|play store|app store|descargar.*app/i],
    answer: 'Actualmente XPEAK es una **aplicación web** (PWA) — funciona desde el navegador de tu móvil sin necesidad de descargar nada.\n\n**Cómo usarla en móvil:**\n• Abre **xpeak.site** desde Safari (iPhone) o Chrome (Android)\n• El diseño está optimizado para móvil — interfaz bottom navigation con accesos rápidos\n\n**Para instalarla como app:**\n• **iPhone/Safari:** Compartir → "Añadir a pantalla de inicio" → aparece como icono de app\n• **Android/Chrome:** Menú → "Añadir a pantalla de inicio" o la notificación automática de instalación\n\nUna vez instalada funciona como una app nativa, con acceso directo y sin barra de navegación del navegador.\n\n**App nativa (iOS + Android)** está en el roadmap para 2026.',
    followUps: ['¿Funciona sin conexión?', '¿Hay notificaciones push?'],
  },

  // ── Soporte humano ────────────────────────────────────────────────────────
  {
    id: 'support',
    patterns: [/soporte|hablar con alguien|hablar con persona|equipo.*xpeak|contactar.*equipo|email soporte|soporte@/i],
    answer: 'El equipo de XPEAK está disponible por:\n\n**Email:** soporte@xpeak.site\n• Tiempo de respuesta habitual: **24-48h** en días laborables (L-V)\n• Para urgencias relacionadas con eventos en menos de 48h, escribe con asunto **"URGENTE — [descripción breve]"** — se priorizan\n\n**Qué incluir en tu email para resolución más rápida:**\n• Tu nombre de usuario o email de cuenta\n• Descripción clara del problema o pregunta\n• Capturas de pantalla si hay un error visual\n• Plataforma (web / iPhone / Android)\n\n**Para consultas sobre facturación:** incluye el ID de tu suscripción (visible en Mi Cuenta → Suscripción)\n\n**Para reportes de usuarios:** usa la función de reporte dentro de la plataforma o envía el perfil del usuario al email.',
    followUps: ['¿Hay soporte en fin de semana?', '¿Qué tipo de problemas resolvéis?'],
  },

  // ── Consejos para conseguir más bookings ──────────────────────────────────
  {
    id: 'morebookings',
    patterns: [/más bookings|mas bookings|más contratos|mas contratos|conseguir.*trabajo|primer.*booking|cómo.*conseguir.*evento|como.*conseguir.*evento|no me contratan/i],
    answer: 'Para conseguir más bookings en XPEAK, sigue este checklist:\n\n**Perfil (base):**\n✓ Foto profesional de alta calidad (no selfie, no foto de fiesta)\n✓ Bio clara con especialidad, experiencia y propuesta de valor\n✓ Géneros/especialidades correctamente etiquetados\n✓ Tarifa visible (los empresarios prefieren saber el precio antes de escribir)\n✓ Audio embed con tu mejor mix\n\n**Visibilidad:**\n✓ Solicita el **Sello de Oro** — sube al top del directorio sin coste extra\n✓ Activa disponibilidad los **jueves-domingos** — es cuando más buscan los empresarios\n✓ Emite en el **Escenario Virtual** en viernes por la tarde (plan Business)\n✓ Mantén el calendario actualizado\n\n**Conversión:**\n✓ Responde los mensajes en menos de 2 horas — la velocidad de respuesta influye en las estadísticas de perfil\n✓ Tras acordar verbalmente, genera el contrato inmediatamente',
    followUps: ['¿Cómo obtengo el Sello de Oro?', '¿Qué plan me da más visibilidad?'],
  },

  // ── Europa / bookings internacionales ────────────────────────────────────
  {
    id: 'international',
    patterns: [/europa|internacional|internacionales|otro.*país|fuera.*españa|alemania|francia|italia|reino unido|ibiza|baleares|canarias/i],
    answer: 'XPEAK está activo en **España** y abierto a profesionales de toda Europa.\n\n**Si trabajas en varios países:**\n• Pon tu ciudad principal en el perfil\n• En la bio menciona las zonas donde trabajas habitualmente\n• Añade los idiomas que hablas (inglés + idioma local = más contactos internacionales)\n\n**Los empresarios europeos también usan XPEAK para:**\n• Buscar talento español para giras por Europa\n• Encontrar DJs para residencias temporales en Ibiza, Berlín, Amsterdam\n• Fichajes para festivales internacionales\n\n**Para aparecer en búsquedas de otros países:**\nActualmente el filtro es por ciudad española. Con la expansión europea (prevista para 2026) habrá filtrado por país. Mientras, menciona en tu bio las ciudades europeas donde estás disponible.\n\nLos contratos de XPEAK son válidos en la UE bajo la normativa de prestación de servicios transfronteriza.',
    followUps: ['¿El contrato es válido en otros países de la UE?', '¿Cómo añado idiomas al perfil?'],
  },

  // ── Privacidad del perfil / quién me ve ───────────────────────────────────
  {
    id: 'profileprivacy',
    patterns: [/quién.*ve.*perfil|quien.*ve.*perfil|ocultar.*perfil|perfil.*privado|quién puede.*contactar|quien puede.*contactar|privacidad.*perfil/i],
    answer: 'Tienes control sobre la visibilidad de tu perfil desde **Ajustes → Privacidad**:\n\n**Visibilidad del perfil:**\n• **Público** (por defecto) — apareces en el directorio y el mapa\n• **Solo búsqueda directa** — no apareces en el directorio general pero sí si alguien busca tu nombre exacto\n• **Oculto** — perfil invisible para todos (útil si estás de pausa)\n\n**Quién puede enviarte mensajes:**\n• Todos los usuarios registrados\n• Solo usuarios con Sello de Oro verificado\n• Nadie (solo tú puedes iniciar conversaciones)\n\n**Tu tarifa:**\n• Puedes elegir mostrarla u ocultarla del perfil público\n• Si la ocultas, los empresarios te preguntarán directamente en el chat\n\n**Lo que siempre es público:**\n• Nombre, rol y ciudad (necesarios para aparecer en el directorio)',
    followUps: ['¿Cómo bloqueo a un usuario específico?', '¿Puedo pausar temporalmente mi perfil?'],
  },

  // ── Agradecimientos ───────────────────────────────────────────────────────
  {
    id: 'thanks',
    patterns: [/^(gracias|thanks|thank you|perfecto|genial|entendido|ok|vale|de acuerdo|me queda claro|claro|bien|excelente|super|guay)\b/i],
    answer: '¡Perfecto! Ya sabes dónde encontrarme si surge cualquier otra duda. Mucho éxito con tus próximos bookings.',
    followUps: ['Tengo otra pregunta', 'Ver todos los temas'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORING ENGINE — puntúa cada entrada por número de patrones que hacen match
// ─────────────────────────────────────────────────────────────────────────────
function getBestMatch(input: string): KBEntry | null {
  const text = input.trim();
  let best: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of KB) {
    let score = 0;
    for (const p of entry.patterns) {
      if (p.test(text)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}

// Fallback inteligente: sugiere los temas más relevantes
const TOPIC_HINTS = [
  { label: 'Flash Booking',      keyword: 'cómo funciona el flash booking' },
  { label: 'Planes y precios',   keyword: 'diferencia entre planes' },
  { label: 'Mi perfil',          keyword: 'cómo completo mi perfil' },
  { label: 'Contratos',          keyword: 'cómo genero un contrato' },
  { label: 'Más bookings',       keyword: 'cómo conseguir más bookings' },
  { label: 'Sello de Oro',       keyword: 'cómo obtengo el sello de oro' },
  { label: 'Fan Club',           keyword: 'qué es el fan club' },
  { label: 'Streaming',          keyword: 'escenario virtual' },
  { label: 'Estadísticas',       keyword: 'estadísticas perfil' },
  { label: 'Cancelaciones',      keyword: 'qué pasa si se cancela el evento' },
  { label: 'Privacidad',         keyword: 'quién ve mi perfil' },
  { label: 'Soporte humano',     keyword: 'soporte equipo xpeak' },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTIONS ────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: Zap,        label: 'Flash Booking',  msg: '¿Cómo funciona el flash booking?' },
  { icon: User,       label: 'Mi perfil',      msg: '¿Cómo completo mi perfil?' },
  { icon: CreditCard, label: 'Precios',        msg: '¿Cuánto cuesta XPEAK?' },
  { icon: FileText,   label: 'Contratos',      msg: '¿Cómo genero un contrato?' },
  { icon: Star,       label: 'Sello de Oro',   msg: '¿Cómo obtengo el sello de oro?' },
  { icon: Radio,      label: 'Streaming',      msg: '¿Cómo emito en directo?' },
  { icon: Heart,      label: 'Fan Club',       msg: '¿Qué es el fan club?' },
  { icon: Building2,  label: 'Empresarios',    msg: '¿Cómo funciona para empresarios?' },
  { icon: Award,      label: 'TOP Weekend',    msg: '¿Qué es el TOP Weekend?' },
  { icon: BarChart3,  label: 'Estadísticas',   msg: '¿Qué estadísticas puedo ver?' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN-LITE RENDERER
// ─────────────────────────────────────────────────────────────────────────────
const MsgText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {parts.map((p, i) => {
        if (p === '\n') return <br key={i} />;
        if (p.startsWith('**') && p.endsWith('**'))
          return <strong key={i} style={{ color: '#D4AF37' }}>{p.slice(2, -2)}</strong>;
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const GREETING: Msg = {
  from: 'bot',
  text: '¡Hola! Soy el asistente de **XPEAK**. Puedo responderte sobre el directorio, suscripciones, flash booking, contratos, streaming y mucho más.\n\n¿En qué te puedo ayudar?',
  ts: Date.now(),
  followUps: ['¿Qué es XPEAK?', '¿Cómo funciona el Flash Booking?', '¿Cuánto cuesta?'],
};

const SupportChat = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [noMatchCount, setNoMatchCount] = useState(0);
  const [showTopics, setShowTopics] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setShowTopics(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing, open]);

  const pushBot = useCallback((text: string, followUps?: string[]) => {
    setMsgs(prev => [...prev, { from: 'bot', text, ts: Date.now(), followUps }]);
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { from: 'user', text, ts: Date.now() }]);
    setInput('');
    setTyping(true);
    setShowTopics(false);

    const delay = 500 + Math.random() * 600;

    setTimeout(() => {
      setTyping(false);

      // Special: mostrar todos los temas
      if (/ver todos|todos los temas|qué puedes|que puedes|menú|menu|ayuda\b/i.test(text)) {
        setShowTopics(true);
        pushBot('Aquí tienes todos los temas sobre los que puedo ayudarte. Haz clic en cualquiera:');
        setNoMatchCount(0);
        return;
      }

      const match = getBestMatch(text);

      if (match) {
        pushBot(match.answer, match.followUps);
        setNoMatchCount(0);
        if (!open) setUnread(n => n + 1);
      } else {
        const newCount = noMatchCount + 1;
        setNoMatchCount(newCount);

        if (newCount >= 2) {
          setShowTopics(true);
          pushBot('No he encontrado una respuesta exacta para eso. Aquí tienes los temas sobre los que sí puedo ayudarte:', ['Ver todos los temas']);
        } else {
          pushBot('Mmm, no estoy seguro de entender eso. ¿Puedes reformularlo? O escoge uno de los temas de abajo.', ['Ver todos los temas', '¿Qué es XPEAK?', '¿Cómo puedo contactar con soporte?']);
        }

        if (!open) setUnread(n => n + 1);
      }
    }, delay);
  }, [noMatchCount, open, pushBot]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const isInitial = msgs.length <= 1;

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          bottom: isMobile ? 'calc(4.5rem + env(safe-area-inset-bottom))' : '1.5rem',
          background: 'linear-gradient(135deg, #D4AF37, #B8941E)',
          boxShadow: '0 4px 24px rgba(212,175,55,0.45)',
        }}
        aria-label={open ? 'Cerrar soporte' : 'Abrir asistente XPEAK'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown size={22} color="#000" />
            </motion.div>
          ) : (
            <motion.div key="open"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} color="#000" />
            </motion.div>
          )}
        </AnimatePresence>
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ background: '#ff5f56', color: '#fff' }}>{unread}</span>
        )}
      </motion.button>

      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed right-4 z-50 flex flex-col rounded-2xl overflow-hidden"
            style={{
              bottom: isMobile ? 'calc(7.5rem + env(safe-area-inset-bottom))' : '5.5rem',
              width: 'min(400px, calc(100vw - 2rem))',
              height: isMobile ? 'min(480px, calc(100vh - 12rem))' : 'min(560px, calc(100vh - 8rem))',
              background: '#0a0a0e',
              border: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, #0f0f14, #121218)', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
                <span className="text-xs font-black text-black">X</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-none">Asistente XPEAK</p>
                <p className="text-[0.68rem] mt-0.5" style={{ color: '#22c55e' }}>● En línea · responde al instante</p>
              </div>
              <button type="button" onClick={() => {
                setMsgs([GREETING]);
                setNoMatchCount(0);
                setShowTopics(false);
              }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 mr-1"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                title="Reiniciar conversación">
                <RefreshCw size={13} />
              </button>
              <button type="button" onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}>
                  <div className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.from === 'bot' && (
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
                        <span className="text-[9px] font-black text-black">X</span>
                      </div>
                    )}
                    <div className="max-w-[82%] px-3 py-2 rounded-xl text-xs"
                      style={m.from === 'user'
                        ? { background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.25)', color: '#fff', borderRadius: '14px 14px 4px 14px' }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', borderRadius: '4px 14px 14px 14px' }
                      }>
                      <MsgText text={m.text} />
                    </div>
                  </div>

                  {/* Follow-up suggestions */}
                  {m.from === 'bot' && m.followUps && m.followUps.length > 0 && i === msgs.length - 1 && !typing && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                      {m.followUps.map(fu => (
                        <button key={fu} type="button"
                          onClick={() => sendMessage(fu)}
                          className="text-[0.65rem] px-2 py-1 rounded-lg transition-all hover:scale-105 active:scale-95"
                          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37', fontWeight: 600 }}>
                          {fu}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
                    <span className="text-[9px] font-black text-black">X</span>
                  </div>
                  <div className="px-3 py-2.5 rounded-xl flex gap-1"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#D4AF37' }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Topic grid (shown on request or after 2 misses) */}
              {showTopics && !typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="ml-8 grid grid-cols-2 gap-1.5 mt-1">
                  {TOPIC_HINTS.map(t => (
                    <button key={t.label} type="button"
                      onClick={() => { setShowTopics(false); sendMessage(t.keyword); }}
                      className="text-[0.65rem] px-2 py-1.5 rounded-lg text-left transition-all hover:scale-105"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                      {t.label}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick actions — solo al inicio */}
            {isInitial && !typing && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-[0.62rem] font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'rgba(255,255,255,0.25)' }}>Temas frecuentes</p>
                <div className="grid grid-cols-5 gap-1">
                  {QUICK_ACTIONS.slice(0, 10).map(qa => (
                    <button key={qa.label} type="button" onClick={() => sendMessage(qa.msg)}
                      className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-center transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <qa.icon size={12} style={{ color: '#D4AF37' }} />
                      <span className="text-[0.55rem] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>{qa.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Escribe tu pregunta..."
                  maxLength={400}
                  className="flex-1 bg-transparent outline-none text-xs py-2 px-3 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />
                <button type="button" onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
                  <Send size={14} color="#000" />
                </button>
              </div>
              <p className="text-[0.58rem] text-center mt-1.5" style={{ color: 'rgba(255,255,255,0.18)' }}>
                XPEAK · Asistente virtual · 24h
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChat;
