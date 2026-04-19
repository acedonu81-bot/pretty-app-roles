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
// KNOWLEDGE BASE — ampliada y con follow-ups
// ─────────────────────────────────────────────────────────────────────────────
const KB: KBEntry[] = [
  // ── Saludos ──────────────────────────────────────────────────────────────
  {
    id: 'greeting',
    patterns: [/^\s*(hola|buenas|buenos días|buenos dias|hey|hi|saludos|ey|qué hay|que hay|buenas noches|buenas tardes)\s*[!?]?\s*$/i],
    answer: '¡Hola! Soy el asistente de **XPEAK**. Estoy aquí para ayudarte con cualquier duda sobre la plataforma.\n\n¿Sobre qué quieres saber?',
    followUps: ['¿Qué es XPEAK?', '¿Cómo funciona el Flash Booking?', '¿Cuánto cuesta?', '¿Cómo completo mi perfil?'],
  },

  // ── Qué es XPEAK ─────────────────────────────────────────────────────────
  {
    id: 'about',
    patterns: [/qué es|que es|para qu[eé]|cómo funciona xpeak|como funciona xpeak|explícame|explicame|cuéntame|cuentame|información general|info/i],
    answer: '**XPEAK** es el directorio profesional de la industria del entretenimiento nocturno en Europa.\n\nConectamos **DJs, artistas, staff, maquilladores, media y promotores** con empresarios, salas y clubs de toda España y Europa.\n\n• Busca talento filtrado por rol, ciudad y disponibilidad\n• Contrata con contratos legales en minutos\n• Flash Booking para eventos urgentes\n• Fan Club para monetizar tu comunidad\n• Escenario Virtual para streaming en directo',
    followUps: ['¿Cómo me registro?', '¿Qué roles hay disponibles?', '¿Cuánto cuesta?'],
  },

  // ── Registro / cuenta nueva ───────────────────────────────────────────────
  {
    id: 'register',
    patterns: [/registr|crear cuenta|cuenta nueva|sign up|cómo entro|como entro|acceder|login|contraseña|password|correo|email/i],
    answer: 'Para registrarte en XPEAK:\n\n1. Ve a **xpeak.site** → botón "Entrar"\n2. Crea cuenta con email o Google\n3. Elige tu rol (DJ, Staff, Makeup, Media…)\n4. Completa tu perfil para aparecer en el directorio\n\nSi ya tienes cuenta y no puedes entrar, usa la opción **"¿Olvidaste tu contraseña?"** en la pantalla de login.',
    followUps: ['¿Cómo completo mi perfil?', '¿Qué roles existen?', '¿Cuánto cuesta?'],
  },

  // ── Perfil ────────────────────────────────────────────────────────────────
  {
    id: 'profile',
    patterns: [/mi perfil|perfil|profile|foto|avatar|bio|descripci|rider|tarifa|precio hora|géneros|generos|idioma|disponib|editar.*perfil|completar.*perfil/i],
    answer: 'Tu perfil es tu carta de presentación. Para editarlo ve a **Mi Cuenta → Mi Perfil**.\n\nPuedes configurar:\n• **Foto** — sube una imagen profesional\n• **Bio** — preséntate en 2-3 líneas\n• **Géneros / especialidades** — lo que filtran los empresarios\n• **Tarifa** — precio por hora o caché\n• **Rider técnico** — tus requisitos técnicos\n• **Idiomas** — útil para eventos internacionales\n• **Audio embed** — enlaza tu SoundCloud, Mixcloud o hearthis.at\n• **Disponibilidad** — activa el toggle para aparecer en Flash Booking\n\nUn perfil completo multiplica por 5 las visitas.',
    followUps: ['¿Cómo funciona el Flash Booking?', '¿Qué es el Sello de Oro?', '¿Cómo subo audio?'],
  },

  // ── Audio / mix ───────────────────────────────────────────────────────────
  {
    id: 'audio',
    patterns: [/audio|mix|mezcla|soundcloud|mixcloud|hearthis|podcast|sesión|sesion|demo|track/i],
    answer: 'Para que los empresarios escuchen tu trabajo:\n\n1. Sube tu mix a **SoundCloud**, **Mixcloud** o **hearthis.at**\n2. Copia la URL del mix\n3. Ve a **Mi Perfil → Redes & Plataformas → hearthis / Mixcloud / SoundCloud**\n4. Pega la URL y guarda\n\nEl audio aparecerá embebido en tu ficha pública. Los empresarios lo pueden escuchar sin salir de XPEAK.',
    followUps: ['¿Puedo subir vídeo también?', '¿Qué es el Escenario Virtual?'],
  },

  // ── Flash Booking ─────────────────────────────────────────────────────────
  {
    id: 'flashbooking',
    patterns: [/flash booking|flash|booking urgente|oferta.*urgente|urgente|disponib|última hora|ultima hora|oferta.*flash/i],
    answer: '**Flash Booking** es el mercado de contratación rápida.\n\n**Si eres profesional:**\n• Activa el toggle **"Disponible ahora"** en Mi Perfil\n• Apareces en tiempo real para los empresarios que buscan para esa noche o el fin de semana\n• Recibes la oferta directamente por Mensajes\n\n**Si eres empresario:**\n• Ve a **Flash Booking** en el menú lateral\n• Publica una oferta indicando rol, fecha, lugar y caché\n• La oferta caduca en 2 horas — solo contactan los disponibles\n\nLos planes **Elite y Agency** tienen acceso prioritario sin retraso de visibilidad.',
    followUps: ['¿Qué plan necesito para Flash Booking?', '¿Cómo activo mi disponibilidad?', '¿Cómo respondo a una oferta?'],
  },

  // ── Contratos ─────────────────────────────────────────────────────────────
  {
    id: 'contracts',
    patterns: [/contrato|contratos|pdf|legal|factura|firma|iva|irpf|fiscal|tributar|prestación de servicio/i],
    answer: 'En **Herramientas → Contratos** puedes generar contratos de prestación de servicios **conformes a la legislación española**.\n\nIncluye:\n• Código Civil art. 1544\n• ET art. 1.1 — autónomo independiente\n• IVA 21% + IRPF 15%\n• Cláusulas de cancelación y penalización\n• Logo y datos de ambas partes\n\nSe genera como **PDF imprimible**. La firma digital eIDAS (válida legalmente) llegará próximamente.',
    followUps: ['¿Cómo contacto con un profesional?', '¿Puedo guardar borradores?'],
  },

  // ── Mensajes / chat ───────────────────────────────────────────────────────
  {
    id: 'messages',
    patterns: [/mensaje|mensajes|chat|conversar|contactar|hablar|escribir|dm|directo|comunicar/i],
    answer: 'El sistema de **Mensajes** permite comunicación directa sin intermediarios.\n\n• Inicia una conversación desde cualquier tarjeta de perfil con el botón **"Mensaje"**\n• O ve directamente a **Herramientas → Mensajes**\n• Los mensajes son privados y en tiempo real\n• Puedes adjuntar tu rider o solicitar disponibilidad\n\nNo hay comisiones ni formularios: tratas directamente con el profesional.',
    followUps: ['¿Cómo genero un contrato tras acordar?', '¿Hay notificaciones de mensajes?'],
  },

  // ── Directorio / búsqueda ─────────────────────────────────────────────────
  {
    id: 'directory',
    patterns: [/directorio|buscar|búsqueda|busqueda|filtrar|filtro|encontrar.*profesional|listar|aparecer|visibilidad/i],
    answer: 'El **Directorio** está dividido por roles:\n\n• **DJs & Artistas** — música electrónica, todos los géneros\n• **DJ / Artista Promesa** — talento emergente con precios accesibles\n• **Staff & Promoción** — azafatas, RRPP, camareros\n• **Maquillaje & Peluquería** — artistas de imagen\n• **Media & Contenido** — fotógrafos, videógrafos, reels\n• **Panel Empresario** — vista específica para clubs y salas\n\nPuedes filtrar por **ciudad**, **disponibilidad**, **verificación** y **géneros/especialidad**.\n\nPara aparecer en el directorio necesitas perfil activo. El plan **Business o superior** te da posición prioritaria.',
    followUps: ['¿Cómo mejoro mi posición?', '¿Qué es el Sello de Oro?', '¿Puedo filtrar por precio?'],
  },

  // ── Roles disponibles ─────────────────────────────────────────────────────
  {
    id: 'roles',
    patterns: [/qué roles|que roles|tipos de perfil|tipos de usuario|categorías|categorias|staff|makeup|maquill|media|ambassador|promotor|diseñ|design|vestuario/i],
    answer: 'XPEAK tiene los siguientes **roles profesionales**:\n\n• **DJ / Artista** — música electrónica, sesiones\n• **DJ Promesa** — talento en desarrollo\n• **Staff & Promoción** — azafatas, RRPP, camareros, hostess\n• **Maquillaje & Peluquería** — imagen artística y nupcial\n• **Media & Contenido** — foto, vídeo, reels, drone\n• **Diseño & Visuales** — VJing, mapping, branding\n• **Promotor** — organización de eventos\n• **Embajador** — representación de marcas en clubs\n• **Empresario** — clubs, salas, venues, agencias\n\nElige el rol al registrarte o cámbialo en **Ajustes**.',
    followUps: ['¿Cómo edito mi perfil?', '¿Puedo tener varios roles?'],
  },

  // ── Suscripciones / precios ───────────────────────────────────────────────
  {
    id: 'subscription',
    patterns: [/suscripci|precio|plan\b|tarifa|coste|costo|cuánto cuesta|cuanto cuesta|gratis|free|pago|mensual|anual|upgrade|mejorar.*plan/i],
    answer: 'XPEAK tiene **4 planes**:\n\n**Free** — Gratis\n• Perfil básico, apareces en el directorio\n• Visibilidad estándar, sin flash booking\n\n**Starter** — Acceso a flash booking + prioridad media\n\n**Business** — Posición destacada en directorio + streaming + sin retrasos\n\n**Elite / Agency** — Máxima visibilidad, badge AGENCIA, acceso a todas las funciones\n\nVe a **Mi Cuenta → Suscripción** para ver precios exactos y comparar planes.',
    followUps: ['¿Qué incluye el plan Business?', '¿Puedo cancelar cuando quiera?', '¿Hay descuento anual?'],
  },

  // ── Sello de Oro / verificación ───────────────────────────────────────────
  {
    id: 'verification',
    patterns: [/sello|verificad|badge|verificar|oro|gold|✓|checkmark|aprobad|revisar perfil/i],
    answer: 'El **Sello de Oro XPEAK** es la verificación de calidad máxima.\n\nPara obtenerlo:\n1. Completa tu perfil al 100%\n2. Sube un **vídeo demostrando tu trabajo** (mínimo 2 minutos)\n3. Solicítalo desde **Mi Perfil → Verificación**\n4. El equipo lo revisa en **24-48h**\n\nBeneficios:\n• Posicionas **primero** en todas las búsquedas\n• Badge visible en tu tarjeta y perfil\n• Mayor confianza de los empresarios\n• Acceso prioritario a TOP Weekend',
    followUps: ['¿Cómo subo el vídeo?', '¿Qué es el TOP Weekend?'],
  },

  // ── TOP Weekend ───────────────────────────────────────────────────────────
  {
    id: 'topweekend',
    patterns: [/top weekend|topweekend|destacado|selección.*semana|seleccion.*semana|editorial/i],
    answer: '**TOP Weekend** es la selección editorial semanal de XPEAK.\n\nCada **jueves** el equipo elige a los mejores profesionales disponibles para ese fin de semana. Aparecen en la sección destacada que ven todos los empresarios.\n\nPara aparecer:\n• Ten el **Sello de Oro** activo\n• Perfil completo con audio/vídeo\n• Disponibilidad activada ese fin de semana\n• Plan **Business o Elite**\n\nEs la mayor visibilidad que puedes tener en XPEAK.',
    followUps: ['¿Cómo activo el Sello de Oro?', '¿Cómo activo mi disponibilidad?'],
  },

  // ── Escenario Virtual / streaming ─────────────────────────────────────────
  {
    id: 'streaming',
    patterns: [/escenario virtual|streaming|stream|directo|en vivo|en directo|twitch|youtube.*live|emitir|broadcast/i],
    answer: 'El **Escenario Virtual** es el espacio de streaming en directo de XPEAK.\n\nCómo emitir:\n1. Ve a **En Vivo → Escenario Virtual**\n2. Conecta tu canal de **Twitch, YouTube o Mixcloud**\n3. Activa la emisión — apareces en el feed de directos de todos los usuarios\n\nRequisitos:\n• Plan **Business o superior**\n• Perfil verificado recomendado\n\nLos empresarios pueden descubrir nuevo talento viéndote en directo.',
    followUps: ['¿Qué plan necesito?', '¿Puedo grabarlo y subirlo después?'],
  },

  // ── Fan Club ──────────────────────────────────────────────────────────────
  {
    id: 'fanclub',
    patterns: [/fan club|fanclub|seguidores|fans|suscriptor|exclusivo|monetiz|patreon|onlyfans/i],
    answer: '**Fan Club** es tu espacio de comunidad privada en XPEAK.\n\nPermite:\n• Publicar **contenido exclusivo** (fotos, vídeos, sets) solo para suscriptores\n• Crear **sorteos** y regalos para fans\n• Comunicación directa con tu base de seguidores\n• Monetización vía suscripción mensual (Stripe)\n\nLa monetización directa está **en desarrollo** — llegará en la próxima versión.\n\nVe a **Mi Cuenta → Fan Club** para configurar tu espacio.',
    followUps: ['¿Cuándo llega la monetización?', '¿Qué más puedo vender en XPEAK?'],
  },

  // ── Tienda / productos digitales ──────────────────────────────────────────
  {
    id: 'store',
    patterns: [/tienda|store|vender|venta|producto|sample|pack|merchandising|merch|digital|descargable/i],
    answer: 'La **Tienda XPEAK** te permitirá vender directamente desde tu perfil:\n\n• **Packs de samples** — loops, one-shots, stems\n• **Sesiones exclusivas** — sets 1h, 2h, grabaciones\n• **Merchandising** — camisetas, vinilos, prints\n• **Contenido digital** — cursos, tutoriales\n\nEstá actualmente en desarrollo. Ve a **Mi Cuenta → Mi Perfil** para ver la sección **Mi Tienda** — ahí podrás configurarla en cuanto esté disponible.\n\nLlegará en las próximas semanas.',
    followUps: ['¿Y el Fan Club sirve para vender?', '¿Cuándo se lanza?'],
  },

  // ── Estadísticas ──────────────────────────────────────────────────────────
  {
    id: 'stats',
    patterns: [/estadísticas|estadisticas|stats|métricas|metricas|visitas|clics|analítica|analitica|rendimiento/i],
    answer: 'En **Mi Cuenta → Estadísticas** tienes un panel completo de tu rendimiento:\n\n• **Visitas al perfil** — quién te ha visto\n• **Clics de contacto** — cuántos han pinchado en "Mensaje"\n• **Mensajes recibidos** — conversaciones iniciadas\n• **Evolución mensual** — tendencia de crecimiento\n\nCon plan **Business o Elite** tienes acceso a métricas detalladas y comparativas.',
    followUps: ['¿Cómo mejoro mis visitas?', '¿Qué plan da más métricas?'],
  },

  // ── Calendario ────────────────────────────────────────────────────────────
  {
    id: 'calendar',
    patterns: [/calendario|agenda|reservas|fechas|disponibilidad.*fecha|bloquer|evento.*fecha/i],
    answer: 'El **Calendario** en *Herramientas → Calendario* te permite:\n\n• Ver y gestionar tus **fechas ocupadas**\n• Bloquear días en los que no estás disponible\n• Llevar el control de tus bookings confirmados\n\nLos empresarios pueden ver tu disponibilidad antes de contactarte, lo que reduce el tiempo de negociación.',
    followUps: ['¿Cómo activo el Flash Booking?', '¿Se integra con Google Calendar?'],
  },

  // ── Mapa ──────────────────────────────────────────────────────────────────
  {
    id: 'map',
    patterns: [/mapa|ubicación|ubicacion|geográfico|geografico|zona|localización|localizacion|cerca/i],
    answer: 'El **Mapa** muestra la distribución geográfica de profesionales activos en España y Europa.\n\n• Filtrable por rol y especialidad\n• Haz clic en un punto para ver el perfil\n• Útil para encontrar talento local para eventos\n\nApareces en el mapa automáticamente si tienes **ciudad configurada** en tu perfil.',
    followUps: ['¿Cómo añado mi ciudad al perfil?'],
  },

  // ── Empresario / contratar ────────────────────────────────────────────────
  {
    id: 'empresario',
    patterns: [/empresario|venue|local|sala|club|contratar|organizar evento|buscar dj|buscar.*profesional|panel.*empresario/i],
    answer: 'El **Panel Empresario** está diseñado específicamente para clubs, salas y organizadores:\n\n• **Busca** por rol, ciudad, disponibilidad y verificación\n• **Escucha** el audio o ve el vídeo antes de contactar\n• **Mensaje directo** desde cualquier perfil\n• **Flash Booking** para contrataciones urgentes\n• **Contratos** generados al instante con todos los datos legales\n• **TOP Weekend** — selección editorial del mejor talento disponible\n\nVe a **Directorio → Panel Empresario** para ver la vista específica.',
    followUps: ['¿Cómo publico un Flash Booking?', '¿Cómo genero un contrato?', '¿Qué es el TOP Weekend?'],
  },

  // ── Ajustes / configuración ───────────────────────────────────────────────
  {
    id: 'settings',
    patterns: [/ajustes|settings|configuración|configuracion|cambiar.*email|cambiar.*contraseña|notificaciones|privacidad|eliminar.*cuenta|borrar.*cuenta/i],
    answer: 'En **Configuración → Ajustes** puedes:\n\n• Cambiar tu email y contraseña\n• Gestionar notificaciones\n• Configurar preferencias de privacidad\n• Exportar tus datos (RGPD)\n• Eliminar tu cuenta\n\nPara cambios de rol o problemas con la cuenta, escribe a **soporte@xpeak.site**.',
    followUps: ['¿Cómo cambio mi rol?', '¿Cómo elimino mi cuenta?'],
  },

  // ── Problema técnico ──────────────────────────────────────────────────────
  {
    id: 'bug',
    patterns: [/problema|error|bug|falla|fallo|no funciona|roto|crash|pantalla.*blanca|se cuelga|lento|carga.*mal|no carga|no se ve/i],
    answer: 'Lamento que estés teniendo problemas. Intenta estos pasos:\n\n1. **Recarga la página** (Ctrl+R / Cmd+R)\n2. **Limpia la caché** del navegador\n3. **Prueba en modo incógnito**\n4. Si el error persiste, **describe exactamente qué pasa** y escríbenos a **soporte@xpeak.site**\n\nIncluye: qué acción hiciste, qué mensaje de error aparece y desde qué dispositivo.',
    followUps: ['¿Cómo contacto con soporte?', '¿Dónde reporto bugs?'],
  },

  // ── Soporte humano ────────────────────────────────────────────────────────
  {
    id: 'support',
    patterns: [/soporte|ayuda humana|hablar con alguien|hablar con persona|equipo|contactar.*xpeak|email.*soporte|soporte.*email/i],
    answer: 'Puedes contactar con el equipo de XPEAK por:\n\n• **Email:** soporte@xpeak.site\n• **Tiempo de respuesta:** 24-48h en días laborables\n\nPara problemas urgentes relacionados con eventos inminentes, indícalo en el asunto del email con "URGENTE".',
    followUps: ['¿Hay chat en vivo?', '¿Cuánto tardan en responder?'],
  },

  // ── Facturación / cancelación ─────────────────────────────────────────────
  {
    id: 'billing',
    patterns: [/cancelar.*suscripci|cancelar.*plan|reembolso|devoluci|cobro|cargo|factura.*pago|método de pago|tarjeta/i],
    answer: 'Para gestionar tu suscripción:\n\n• Ve a **Mi Cuenta → Suscripción**\n• Puedes **cancelar en cualquier momento** — sin permanencia\n• Al cancelar conservas el plan hasta final del período pagado\n• Para solicitar un **reembolso** escribe a **soporte@xpeak.site** indicando el motivo\n\nLos pagos se procesan de forma segura vía **Stripe**.',
    followUps: ['¿Qué pasa si cancelo?', '¿Puedo cambiar de plan?'],
  },

  // ── RGPD / privacidad / datos ─────────────────────────────────────────────
  {
    id: 'gdpr',
    patterns: [/rgpd|gdpr|privacidad|datos personales|mis datos|exportar datos|derecho.*olvido|eliminar datos/i],
    answer: 'XPEAK cumple con el **RGPD** (Reglamento General de Protección de Datos).\n\nTus derechos:\n• **Acceso** — solicita una copia de tus datos\n• **Rectificación** — corrige tus datos desde el perfil\n• **Supresión** — elimina tu cuenta desde Ajustes\n• **Portabilidad** — exporta tus datos en formato ZIP desde Ajustes\n\nConsulta nuestra política completa en el pie de página de **xpeak.site**.',
    followUps: ['¿Cómo exporto mis datos?', '¿Cómo elimino mi cuenta?'],
  },

  // ── Agradecimientos / despedidas ──────────────────────────────────────────
  {
    id: 'thanks',
    patterns: [/^(gracias|thanks|thank you|perfecto|genial|entendido|ok|vale|de acuerdo|me queda claro|claro|bien|excelente)\b/i],
    answer: '¡Perfecto! Si necesitas algo más, aquí estoy. Mucho éxito con tus bookings.',
    followUps: ['¿Tienes otra duda?', 'Ver todos los temas'],
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
  { label: 'Flash Booking', keyword: 'flash booking' },
  { label: 'Suscripciones', keyword: 'suscripción' },
  { label: 'Mi perfil', keyword: 'mi perfil' },
  { label: 'Contratos', keyword: 'contratos' },
  { label: 'Mensajes', keyword: 'mensajes' },
  { label: 'Fan Club', keyword: 'fan club' },
  { label: 'Directorio', keyword: 'directorio' },
  { label: 'Streaming', keyword: 'escenario virtual' },
  { label: 'Estadísticas', keyword: 'estadísticas' },
  { label: 'Soporte', keyword: 'soporte' },
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
