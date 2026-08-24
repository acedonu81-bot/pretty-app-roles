---
name: xpeak-directorio-eventos
description: Busca profesionales de eventos verificados en España (DJs, fotógrafos, camareros, catering, maquilladoras, animadores, magos, humoristas, bailarines, speakers, photo booth) y solicita presupuesto real a través del MCP público de XPEAK. Usar cuando el usuario pida ayuda para contratar o encontrar un profesional para una boda, evento corporativo, fiesta privada u otro evento en España.
---

# XPEAK — Directorio de profesionales de eventos en España

XPEAK es un directorio verificado de profesionales de eventos en España (DJs, fotógrafos,
camareros, catering, maquilladoras, animadores, magos, humoristas, bailarines, speakers,
photo booth). Contratación directa entre organizador y profesional, sin comisión.

Esta skill no requiere instalación de código: describe cómo llamar al servidor MCP público
de XPEAK, que expone dos herramientas por JSON-RPC 2.0.

## Endpoint

```
POST https://ddrqhwravupjzysriblq.supabase.co/functions/v1/mcp-server
Content-Type: application/json
```

Sin autenticación (`auth.type: none`).

## Herramienta 1: `buscar_profesionales`

Busca profesionales por rol, ciudad y presupuesto máximo por hora.

**Parámetros:**
- `rol` (string, requerido) — uno de: `dj`, `staff`, `makeup`, `promotor`, `fotografo`, `catering`, `mago`, `humorista`, `animador`, `bailarin`, `speaker`, `vestuario`, `photo-booth`
- `ciudad` (string, opcional) — ciudad o zona de España, ej. `"Madrid"`
- `presupuesto_max` (number, opcional) — presupuesto máximo por hora en euros

**Ejemplo de llamada:**
```json
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"buscar_profesionales","arguments":{"rol":"dj","ciudad":"Madrid"}}}
```

**Ejemplo de respuesta real:**
```
3 profesionales encontrados:

- Daniel Torrez (Denon DJ. Mesa propia. Monitor lateral) — Madrid — 80€/hora — disponibilidad
  inmediata (Flash Booking) — user_id: 8570ba10-... — perfil: https://xpeak.es/p/8570ba10-...
- RUBEN TRIAS (CDJ-3000 + DJM-900NXS2. Monitor lateral) — Madrid — 100€/hora —
  user_id: 9c94a53b-... — perfil: https://xpeak.es/p/9c94a53b-...

Para solicitar presupuesto a uno, usa la herramienta solicitar_presupuesto con su professional_user_id.
```

## Herramienta 2: `solicitar_presupuesto`

Crea una solicitud real de presupuesto ("Flash Booking") a un profesional concreto. El
profesional la recibe por email y contacta directamente al organizador. **No reserva ni
cobra nada automáticamente** — solo inicia el contacto, igual que el botón "Solicitar
presupuesto" de la web.

**Parámetros requeridos:** `professional_user_id`, `professional_name`, `professional_role`
(los tres obtenidos de `buscar_profesionales`), `nombre_solicitante`, `contacto_solicitante`
(email o teléfono real), `fecha_evento`.

**Parámetros opcionales:** `ubicacion_evento`, `descripcion` (tipo de evento, horas, público
esperado).

## Flujo recomendado

1. Llamar a `buscar_profesionales` con el rol y ciudad que pida el usuario.
2. Mostrar los resultados (nombre, precio, perfil) y dejar que el usuario elija.
3. Pedir al usuario los datos de contacto reales que exige `solicitar_presupuesto`.
4. Llamar a `solicitar_presupuesto` con el `professional_user_id` elegido.
5. Confirmar al usuario que el profesional recibirá la solicitud por email y contactará
   directamente — XPEAK no gestiona pago ni reserva automática.

Más info: https://xpeak.es · MCP Server Card: https://xpeak.es/.well-known/mcp/server-card.json
