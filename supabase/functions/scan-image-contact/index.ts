import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PLACEHOLDER_B64 } from './placeholder.ts';

// Filtro automático de datos de contacto en imágenes (Ficha XDS 75,7, 15 oct 2026).
// Lo dispara el trigger scan_image_contact de storage.objects (migración
// 20261015120000) con x-internal-secret. Un modelo de visión lee la imagen:
//   nivel 'alto' = teléfono, WhatsApp, email o web escritos  -> se oculta en modo activo
//   nivel 'bajo' = solo @usuario de red social               -> solo se registra
// Modo (tabla image_contact_config): 'sombra' registra y avisa sin tocar la
// imagen; 'activo' además la sustituye en público por un placeholder y guarda
// el original en el bucket privado contact-quarantine. Nunca se borra nada.
// Restaurar: POST { action: 'restaurar', flag_id } con x-internal-secret.

const MODEL = 'claude-haiku-5-5';
const MAX_BYTES = 5 * 1024 * 1024; // límite de imagen de la API
const ADMIN_EMAIL = 'info@xpeak.site';

const PROMPT = `Eres un revisor de imágenes de una plataforma que NO permite datos de contacto directos en las fotos de perfil, portfolio o eventos.
Lee TODO el texto visible de la imagen (incluido texto estilizado, en cursiva, pequeño o en capturas de pantalla) y responde SOLO con JSON, sin explicaciones:
{"alto": boolean, "bajo": boolean, "tipos": ["telefono"|"whatsapp"|"email"|"web"|"usuario_red"], "texto": "lo detectado, literal"}
- alto = true si hay un número de teléfono o móvil, un WhatsApp con número, un email o una dirección web completa escritos en la imagen.
- bajo = true si solo hay un @usuario de Instagram/TikTok u otra red, sin teléfono, email ni web.
- Un nombre artístico, un logo o precios NO cuentan. Si no hay nada, {"alto":false,"bajo":false,"tipos":[],"texto":""}.`;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function b64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

serve(async (req) => {
  const internal = Deno.env.get('INTERNAL_SECRET');
  if (!internal || req.headers.get('x-internal-secret') !== internal) return json({ error: 'forbidden' }, 403);

  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const body = await req.json().catch(() => ({}));

  // ---- Restaurar una imagen retirada ----
  if (body.action === 'restaurar') {
    const { data: flag } = await admin.from('image_contact_flags').select('*').eq('id', body.flag_id).maybeSingle();
    if (!flag || flag.estado !== 'oculta') return json({ error: 'no hay nada que restaurar' }, 404);
    const { data: orig, error: dErr } = await admin.storage.from('contact-quarantine').download(`${flag.bucket}/${flag.path}`);
    if (dErr || !orig) return json({ error: 'original no encontrado' }, 404);
    const { error: uErr } = await admin.storage.from(flag.bucket).upload(flag.path, orig, { upsert: true, contentType: orig.type || 'image/jpeg', cacheControl: '0' });
    if (uErr) return json({ error: uErr.message }, 500);
    await admin.from('image_contact_flags').update({ estado: body.falso_positivo ? 'falso_positivo' : 'restaurada', reviewed_at: new Date().toISOString() }).eq('id', flag.id);
    return json({ ok: true });
  }

  const { bucket, name } = body as { bucket?: string; name?: string };
  if (!bucket || !name) return json({ error: 'bucket y name requeridos' }, 400);

  const { data: cfg } = await admin.from('image_contact_config').select('modo').eq('id', true).maybeSingle();
  const modo = cfg?.modo ?? 'sombra';
  if (modo === 'apagado') return json({ skipped: 'apagado' });

  const apiKey = (Deno.env.get('ANTHROPIC_API_KEY') ?? '').trim();
  if (!/^sk-ant-[\x21-\x7e]+$/.test(apiKey)) {
    console.error('[scan-image-contact] ANTHROPIC_API_KEY ausente o no válida (debe empezar por sk-ant-), no se revisa');
    return json({ skipped: 'clave no válida' });
  }

  const ownerId = /^[0-9a-f-]{36}$/i.test(name.split('/')[0]) ? name.split('/')[0] : null;
  const registrar = (nivel: string, estado: string, tipos: string[], texto: string) =>
    admin.from('image_contact_flags').insert({ bucket, path: name, owner_id: ownerId, nivel, tipos, texto: texto.slice(0, 500), estado });

  const { data: file, error: dlErr } = await admin.storage.from(bucket).download(name);
  if (dlErr || !file) return json({ error: 'no se pudo descargar' }, 500);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.length > MAX_BYTES) {
    await registrar('bajo', 'no_revisada', [], `imagen de ${(bytes.length / 1048576).toFixed(1)} MB, supera el límite de revisión`);
    return json({ skipped: 'grande' });
  }
  const mediaType = /\.png$/i.test(name) ? 'image/png' : /\.webp$/i.test(name) ? 'image/webp' : 'image/jpeg';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: b64(bytes) } },
        { type: 'text', text: PROMPT },
      ] }],
    }),
  });
  if (!res.ok) {
    console.error('[scan-image-contact] API', res.status, (await res.text()).slice(0, 200));
    return json({ error: 'fallo del modelo' }, 502);
  }
  const out = await res.json();
  const raw: string = out?.content?.[0]?.text ?? '';
  let r: { alto?: boolean; bajo?: boolean; tipos?: string[]; texto?: string } = {};
  try { r = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); } catch { return json({ error: 'respuesta ilegible' }, 502); }

  if (!r.alto && !r.bajo) return json({ ok: true, contacto: false });

  const nivel = r.alto ? 'alto' : 'bajo';
  const ocultar = modo === 'activo' && nivel === 'alto';
  const tipos = Array.isArray(r.tipos) ? r.tipos : [];
  const texto = r.texto ?? '';

  if (ocultar) {
    // 1) original al bucket privado, 2) placeholder en la ruta pública
    const { error: qErr } = await admin.storage.from('contact-quarantine').upload(`${bucket}/${name}`, bytes, { upsert: true, contentType: mediaType });
    if (qErr) { console.error('[scan-image-contact] cuarentena', qErr.message); return json({ error: 'cuarentena falló' }, 500); }
    const ph = Uint8Array.from(atob(PLACEHOLDER_B64), (c) => c.charCodeAt(0));
    const { error: pErr } = await admin.storage.from(bucket).upload(name, ph, { upsert: true, contentType: 'image/jpeg', cacheControl: '0' });
    if (pErr) { console.error('[scan-image-contact] placeholder', pErr.message); return json({ error: 'placeholder falló' }, 500); }
  }

  const { data: flag } = await registrar(nivel, ocultar ? 'oculta' : 'sombra', tipos, texto).select('id').maybeSingle();

  // Aviso al admin solo para nivel alto (el bajo solo queda registrado).
  if (nivel === 'alto') {
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`, 'x-internal-secret': internal },
      body: JSON.stringify({ type: 'admin_imagen_contacto', data: {
        email: ADMIN_EMAIL, flag_id: flag?.id, modo: ocultar ? 'oculta' : 'sombra', tipos: tipos.join(', '),
        texto, owner_id: ownerId, url: `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/${bucket}/${name}`,
      } }),
    }).catch((e) => console.error('[scan-image-contact] aviso', e));
  }
  return json({ ok: true, contacto: true, nivel, estado: ocultar ? 'oculta' : 'sombra' });
});
