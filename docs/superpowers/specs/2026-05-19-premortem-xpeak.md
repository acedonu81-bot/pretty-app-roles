# Premortem XPEAK — Mayo 2026

> Un premortem imagina que el proyecto ya fracasó y pregunta: ¿qué lo mató? Usarlo como brújula.

---

## Escenario: estamos en Mayo 2027. XPEAK ha cerrado. ¿Qué pasó?

---

## 1. Problema del huevo y la gallina (el más probable)

**Cómo muere:** No hay profesionales → no hay empresarios. No hay empresarios → no hay profesionales. La plataforma queda vacía de actividad real. Los pocos que se registran no reciben contactos, se olvidan del perfil, y el boca-oído negativo ("me registré y no pasó nada") bloquea el crecimiento.

**Señal de alerta temprana:** Ratio profesionales registrados vs. empresarios por debajo de 10:1. Cero Flash Bookings completados en el primer mes.

**Mitigación:** En los primeros 3 meses, XPEAK debe actuar de broker manual: crear demanda artificial haciendo de intermediario humano hasta que haya masa crítica. El producto no puede esperar a que el mercado se auto-equilibre.

---

## 2. Tráfico orgánico sin conversión (el más silencioso)

**Cómo muere:** El SEO funciona bien — bodas, camareros, DJs trae tráfico. Pero el visitante es una novia buscando presupuesto, no un DJ buscando trabajo. El 17/auth ya muestra esto: 17 visitas a registro, 0 completadas de ese segmento. La analítica mejora en vanity metrics (page views +298%) pero los registros se estancan.

**Señal de alerta temprana:** Más de 60% del tráfico llega por keywords de bodas/eventos y no convierte a ningún rol. El embudo boda → /auth → dashboard roto.

**Mitigación:** Diferenciar dos embudos: (a) profesional que busca trabajo → directorio → registro como pro, (b) organizador/novia → calculadora → registro como empresario. El /auth debe hablar a ambos de forma distinta.

---

## 3. Flash Booking promete lo que no puede entregar

**Cómo muere:** Un empresario publica una necesidad urgente. Ningún profesional responde en 60 minutos porque no tienen las notificaciones activadas, no tienen la app, o simplemente están trabajando. El empresario no vuelve. Se corre la voz de que el sistema no funciona.

**Señal de alerta temprana:** Primer Flash Booking sin respuesta en plazo.

**Mitigación:** Antes de activar Flash Booking públicamente, se necesita un pool mínimo de 30 profesionales activos por ciudad con notificaciones push configuradas. No lanzar la feature hasta tener ese pool. Alternativamente, hacer el SLA de 2h en vez de 60min.

---

## 4. Confianza cero en plataforma nueva

**Cómo muere:** Un empresario va a contratar a un DJ para una boda de 200 personas. XPEAK es una plataforma sin reviews, sin historico, sin garantías visibles. Prefiere llamar al mismo DJ de siempre o ir a Bodas.net (con 10 años de reviews). XPEAK no pasa el filtro de confianza mínima.

**Señal de alerta temprana:** CTR alto en perfiles de profesionales pero cero contactos iniciados.

**Mitigación:** Ofrecer garantía explícita ("Si el profesional no aparece, te reembolsamos o enviamos sustituto en 2h"). Mostrar testimonios aunque sean de conocidos en beta. Verificación de identidad visible en perfiles.

---

## 5. Scope creep mata la ejecución

**Cómo muere:** XPEAK intenta ser simultáneamente: directorio de DJs, calculadora de bodas, marketplace de camareros, plataforma de staff, booking de fotógrafos, herramienta de wedding planning. Ninguna funciona bien porque los recursos se dispersan. El producto queda a medias en todo.

**Señal de alerta temprana:** Más de 3 verticales activos sin ninguno con 50+ profesionales registrados.

**Mitigación:** Elegir UN vertical para dominar primero (recomendación: staff/camareros para bodas — demanda masiva, poca competencia digital directa, ticket alto). Clavarlo. Luego expandir.

---

## 6. Dependencia total de Google

**Cómo muere:** Un update de algoritmo (como los HCU de 2023-24) deja el tráfico orgánico a cero overnight. Sin email list, sin comunidad, sin directo — el negocio se apaga de golpe.

**Señal de alerta temprana:** Más del 80% del tráfico procedente de Google sin otro canal activo.

**Mitigación:** Construir email list desde el día 1 (cada registro = email capturado). Meta Ads como canal secundario de diversificación. Newsletter mensual que aporte valor para que no se desuscriban.

---

## 7. El modelo freemium nunca hace clic con el upsell

**Cómo muere:** Los profesionales se registran gratis, consiguen trabajo por el boca-oído gracias al perfil de XPEAK, pero nunca necesitan pagar el listing destacado. La plataforma genera tráfico y valor pero no ingresos.

**Señal de alerta temprana:** Más de 200 profesionales registrados y 0 upgrades de pago.

**Mitigación:** El primer tier de pago debe resolver un pain real e inmediato (ejemplo: aparecer primero en búsquedas de su ciudad, no solo "estar destacado"). Hacer que el valor sea obvio antes de pedir el pago — mostrar cuántas veces ha aparecido el perfil en búsquedas ese mes.

---

## 8. Competidor bien financiado copia el modelo

**Cómo muere:** Bodas.net, Eventbrite o un nuevo actor lanza una versión similar con €1M de presupuesto de marketing. Se lleva los primeros profesionales con ofertas de registro gratuito + comisión cero durante 12 meses.

**Señal de alerta temprana:** Aparece competidor directo con funding en TechCrunch/Crunchbase.

**Mitigación:** El foso de XPEAK no es la tecnología — es la comunidad y los reviews acumulados. Cuanto antes se creen esos activos (reviews verificados, comunidad WhatsApp/Discord de profesionales), más caro es copiarlo. Invertir en comunidad desde el mes 1.

---

## Mapa de riesgos (probabilidad × impacto)

| Riesgo | Probabilidad | Impacto | Urgencia |
|--------|-------------|---------|---------|
| Huevo y gallina | Alta | Letal | AHORA |
| Tráfico sin conversión | Alta | Alto | AHORA |
| Flash Booking falla | Media | Alto | Antes del lanzamiento |
| Confianza cero | Alta | Alto | AHORA |
| Scope creep | Alta | Alto | AHORA |
| Dependencia Google | Media | Letal | 3 meses |
| Freemium no convierte | Media | Alto | 6 meses |
| Competidor | Baja | Letal | 12 meses |

---

## Decisiones que cambia este premortem

1. **El /auth es la página más importante del producto.** No una formalidad. Cada elemento debe reducir fricción y construir confianza.

2. **Dos embudos distintos:** Pro (busca trabajo) vs. Empresario (necesita contratar). El copy y el tono de /auth deben hablar a ambos sin confundirlos.

3. **No más features hasta tener conversión.** El siguiente trabajo prioritario es: registro funciona → usuario llega a dashboard → ve valor en 60 segundos.

4. **Video de hero debe ser de eventos, no de nightlife.** El 60% del tráfico que convierte mejor viene de bodas y eventos, no de discotecas.

5. **Email list es prioridad paralela.** Cada registro = activo de comunicación directa que no depende de Google.

---

*Documento vivo — revisar tras cada cambio de estrategia o nuevo dato de analítica.*
