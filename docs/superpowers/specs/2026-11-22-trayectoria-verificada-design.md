# Trayectoria verificada (diseño, 22 nov 2026)

Estado: BORRADOR pendiente de aprobación de Daniel. No se construye nada hasta que lo apruebe y la ficha XDS llegue a 75 o más.

## Intención y por qué
XPEAK tiene 167 profesionales en 19 oficios y 94 son DJs. Los DJs tienen su música como ventaja propia; el resto no tiene nada equivalente que justifique una suscripción. Lo que todos comparten es que trabajan en eventos. La trayectoria verificada convierte "los eventos en los que he trabajado" en la ventaja común de todos los oficios y da al organizador una prueba de confianza que otros directorios no ofrecen.

## Qué es
Una sección "Trayectoria" en la ficha pública de cada profesional con los eventos en los que ha trabajado: fecha, tipo, ciudad, lugar y, opcionalmente, una foto. Cada evento lleva una marca:

| Marca | Significado | Quién la tiene |
|---|---|---|
| Declarado | Lo dice el profesional | Plan Profesional y Premium |
| Confirmado | El organizador lo ha confirmado con un clic | Solo Premium puede pedirlo |
| Contrato XPEAK | Hay contrato digital de XPEAK (sello fuerte, se confirma solo) | Todos los planes |

En la tarjeta y la ficha del Premium aparece un contador ("9 eventos confirmados").

## Cómo se confirma
1. El profesional Premium añade el evento y el correo del organizador.
2. XPEAK envía un correo con su propio remitente (nunca en nombre del profesional) con un botón "Sí, trabajó en mi evento".
3. Con un clic, sin crear cuenta, el evento pasa a Confirmado.
4. Cuentan también los eventos hechos fuera de XPEAK: lo que importa es que el evento ocurrió, no dónde se cerró el trato.
5. Antifraude: no se confirma con el correo del propio profesional, y un mismo correo solo puede confirmar un número limitado de eventos al mes.

## Medir los acuerdos que se cierran desde XPEAK
Si dos personas han hablado en el chat y pasa la fecha del evento, XPEAK pregunta a las dos: "¿Se cerró el acuerdo?" (Sí / No). Si alguien dice Sí, se le ofrece añadir el evento a su trayectoria. Se guarda el resultado de cada pregunta y se compara con lo que declara el otro lado, para conocer:
- cuántas conversaciones acaban en acuerdo,
- cuántos acuerdos coinciden entre profesional y organizador,
- cuántos eventos de la trayectoria vienen de XPEAK y cuántos de fuera.
Es un dato interno de XPEAK, no un requisito para el profesional ni para el organizador.

## Metas
- Dar a todos los oficios una ventaja de suscripción que no dependa de la música.
- Que el organizador vea confianza comprobable antes de contactar.
- Saber por primera vez cuántos acuerdos se cierran desde XPEAK (hoy hay 4 contratos y 6 reseñas).

## No metas y antimetas
- No obligar a cerrar dentro de XPEAK ni sacar contacto de la app (el chat sigue libre).
- No poner la trayectoria entera de pago: una ficha de Profesional vacía quitaría confianza a todo el directorio.
- Antimeta: que se llene de eventos falsos y el sello pierda valor.
- Nada escrito en nombre del profesional; todo sale como XPEAK.

## Restricciones
- Textos sin rayas largas, sin emojis, sin "bolo/bolos", sin "gratis" ni "sin comisión" como gancho.
- XDS antes de construir (umbral 75). Un cambio en la base de datos va como migración que ejecuta Daniel en el SQL Editor.
- Nada se despliega sin que Daniel lo pida.
- Hay que decidir cuándo se activa: con los cobros apagados, la parte de pago (confirmar y sello) no debería ofrecerse.

## Alternativas consideradas
| Opción | Por qué se descartó |
|---|---|
| Solo contratos de XPEAK | Hoy hay 4 contratos: casi nadie tendría nada |
| Confirmación entre compañeros | Con pocos perfiles por oficio es fácil de falsear |
| Premiar subiendo en el directorio | Penaliza al que busca y no consigue trabajo (decisión de Daniel) |
| Trayectoria entera de pago | Deja vacía la ficha del Profesional |
Elegida: eventos declarados para todos, confirmación y sello solo en Premium, y medición de acuerdos con la pregunta "¿se cerró?".

## Lo que se deja al constructor
Nombres de tablas, texto exacto de los correos, límite mensual de confirmaciones por correo, cómo se presenta la lista en móvil y cuándo se envía la pregunta tras la fecha del evento.
