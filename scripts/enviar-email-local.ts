// Vista previa (y envío manual) de una plantilla de send-email desde el Mac,
// sin desplegar la función (12 oct 2026). Usa las MISMAS plantillas y el mismo
// sendMail (Hostinger SMTP, remitente "XPEAK <info@xpeak.site>").
//
// Uso normal, solo vista previa:
//   deno run -A scripts/enviar-email-local.ts <plantilla> '<json data>' --dry
// escribe el HTML en /tmp/xpeak-preview.html y no envía.
//
// El envío real necesita SMTP_PASS (la contraseña del buzón, la misma que el
// secreto de Supabase). El 12 oct la guardada en el Llavero (xpeak-smtp) no
// coincidía y Hostinger respondió 535: lo fiable es desplegar send-email y
// llamarla con la clave de servicio.
// El enlace de baja firmado necesita UNSUB_SECRET (solo en Supabase): aquí se
// sustituye por un mailto de baja a info@xpeak.site.
const src = await Deno.readTextFile(new URL('../supabase/functions/send-email/index.ts', import.meta.url));
const cut = src.indexOf('\nserve(async');
if (cut < 0) throw new Error('No encuentro serve() en send-email');
const mod = src.slice(0, cut) + '\nexport { TEMPLATES, sendMail, UNSUB_PLACEHOLDER };\n';
const tmp = await Deno.makeTempFile({ suffix: '.ts' });
await Deno.writeTextFile(tmp, mod);
const { TEMPLATES, sendMail, UNSUB_PLACEHOLDER } = await import('file://' + tmp);

const [type, json, flag] = Deno.args;
const tpl = TEMPLATES[type];
if (!tpl) throw new Error(`Plantilla desconocida: ${type}`);
const data = JSON.parse(json);
const { subject, html: raw, to, replyTo } = tpl(data);
if (!to) throw new Error('La plantilla no devuelve destinatario (falta data.email)');
const baja = 'mailto:info@xpeak.site?subject=Baja%20emails%20XPEAK';
const html = raw.replaceAll(UNSUB_PLACEHOLDER, baja);

if (flag === '--dry') {
  await Deno.writeTextFile('/tmp/xpeak-preview.html', html);
  console.log(JSON.stringify({ dry: true, to, subject }));
} else {
  await sendMail(to, subject, html, replyTo, baja);
  console.log(JSON.stringify({ ok: true, to, subject }));
}
Deno.exit(0);
