# Flash: precio al apuntarse y cruce con fechas ocupadas (diseño breve, aprobado 22 nov 2026)

## Intención
Dos ventajas comunes a todos los oficios (no solo DJs) para los planes: que el profesional pueda dar un precio al apuntarse a una oferta Flash y que el organizador vea si está libre ese día. Ambas ya existen a medias (calendario `availability`, flujo ACEPTO en el chat) pero casi no se usan (5 perfiles con fechas marcadas, respuestas Flash solo con texto libre).

## Objetivos
- Precio opcional en la respuesta a una oferta Flash, visible para el organizador.
- Aviso al profesional si la fecha de la oferta está en sus fechas ocupadas.
- Etiqueta "Libre ese día" en cada respuesta, solo si el profesional usa el calendario y la fecha no está bloqueada.
- Aviso en el panel del profesional mientras no haya marcado ninguna fecha.

## No objetivos / antiobjetivos
- No crear tablas nuevas ni un módulo de presupuestos; no tocar ACEPTO ni el chat.
- Precio nunca obligatorio. No afirmar disponibilidad si el profesional nunca marcó fechas.
- No tocar Stripe ni planes. Sin sacar contacto fuera de la app.

## Restricciones
- XDS estimado ~75 (precio) y ~77 (fechas), en el umbral. Pasa a XDS al medir.
- Una columna nueva y opcional en `event_request_responses` exige migración (RLS existente se mantiene; revisar que el organizador solo lee las respuestas de su oferta).
- Deploy solo si Daniel lo pide; antes del 27 nov es el objetivo.
- Copy en español, sin rayas largas, sin "bolo", sin "gratis" como gancho.

## Enfoques considerados
1. **Mejorar lo existente (elegido):** columna `precio` + cruce con `availability` + aviso. Pequeño, sin duplicar.
2. Módulo de presupuestos nuevo: duplica ACEPTO. Descartado.
3. Calendario nuevo: duplica `AvailabilityCalendar`. Descartado.

## Diseño
- `applyToRequest` (EventRequestsSection.tsx) acepta un precio opcional además del mensaje y lo guarda en `event_request_responses.precio`.
- Antes de enviar, si alguna fecha de la oferta está en las fechas ocupadas del profesional, aviso no bloqueante.
- La tarjeta de respuesta del organizador muestra el precio y la etiqueta "Libre ese día" según `availability`, con la condición de uso del calendario.
- Aviso en el panel del profesional si no tiene ninguna fila en `availability`.

## Se deja al constructor
Nombre exacto de la columna y validación (número positivo, límite razonable), texto exacto de los avisos, lectura de `availability` por el organizador (comprobar RLS y, si hace falta, función segura que devuelva solo "libre/no consta"), y tests.
