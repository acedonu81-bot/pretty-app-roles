import { useState, useRef, useEffect } from 'react';
import { FileText, X, Download, ChevronRight, AlertCircle, Sparkles, PenLine, Eraser } from 'lucide-react';
import type { Profile } from '@/data/profiles';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const esc = (s: string) =>
  s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

interface Props { professional: Profile; onClose: () => void; onSaved?: () => void; }

const ROLE_SERVICE: Record<string, string> = {
  dj:        'sesión de DJ y actuación musical en directo',
  rookie:    'actuación musical (artista emergente)',
  staff:     'servicios de staff y gestión de sala',
  makeup:    'servicios de maquillaje, peluquería y estilismo',
  media:     'servicios de fotografía y vídeo de evento',
  ambassador:'servicios de promotor y captación de público',
  design:    'servicios de diseño gráfico y/o VJing',
  catering:  'servicios de catering y chef profesional para eventos',
};

const EVENT_TYPES = [
  { id: 'club',       label: 'Club / Sala nocturna', equip: 'El PROFESIONAL aporta su propio equipo técnico (controladora, auriculares). La sala provee sistema de sonido principal, mesa de mezclas Pioneer y monitores.' },
  { id: 'festival',   label: 'Festival',             equip: 'El PROFESIONAL aporta su equipo personal portátil. El FESTIVAL provee backline completo (CDJ-3000, DJM-900NXS2, monitores laterales) conforme al rider técnico adjunto.' },
  { id: 'boda',       label: 'Boda / Evento privado', equip: 'El PROFESIONAL aporta equipo completo: sistema de sonido, iluminación básica y controladora. Espacio mínimo requerido: 2×2 m con acceso a corriente eléctrica.' },
  { id: 'corporate',  label: 'Corporativo',           equip: 'El CONTRATANTE provee el espacio y sistema audiovisual del recinto. El PROFESIONAL aporta su equipo personal conforme a las especificaciones técnicas del venue.' },
  { id: 'after',      label: 'After / Private party', equip: 'El PROFESIONAL aporta equipo completo. Acceso al espacio mínimo 1 hora antes del inicio para montaje. Requisito eléctrico: 2 tomas de 16A.' },
];

const todayStr = () => new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
const contractRef = () => `XPEAK-${Date.now().toString(36).toUpperCase().slice(-6)}`;

const ContractModal = ({ professional, onClose, onSaved }: Props) => {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tipoEvento, setTipoEvento] = useState('club');
  const [ref] = useState(contractRef());
  const [form, setForm] = useState({
    ciudadFirma: '',
    fechaFirma: todayStr(),
    contratanteNombre: '',
    contratanteNIF: '',
    empresaNombre: '',
    empresaCIF: '',
    empresaDireccion: '',
    nombreEvento: '',
    fechaEvento: '',
    horaInicio: '',
    horaFin: '',
    nombreLocal: '',
    direccionLocal: '',
    precioNeto: '500',
    formaPago: 'transferencia bancaria',
    diasPago: '30',
    equipoSonido: EVENT_TYPES[0].equip,
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  /* ── Canvas signature ─────────────────────────────────────────────────────── */
  const sigRef    = useRef<HTMLCanvasElement>(null);
  const drawing   = useRef(false);
  const [hasSig, setHasSig] = useState(false);

  useEffect(() => {
    const canvas = sigRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    const pos = (e: MouseEvent | Touch) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e instanceof Touch ? e.clientX : (e as MouseEvent).clientX) - r.left, y: (e instanceof Touch ? e.clientY : (e as MouseEvent).clientY) - r.top };
    };
    const start = (e: MouseEvent | TouchEvent) => {
      drawing.current = true;
      const p = pos(e instanceof TouchEvent ? e.touches[0] : e);
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      e.preventDefault();
    };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!drawing.current) return;
      const p = pos(e instanceof TouchEvent ? e.touches[0] : e);
      ctx.lineTo(p.x, p.y); ctx.stroke();
      setHasSig(true);
      e.preventDefault();
    };
    const end = () => { drawing.current = false; };

    canvas.addEventListener('mousedown',  start as EventListener);
    canvas.addEventListener('mousemove',  move  as EventListener);
    canvas.addEventListener('mouseup',    end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', start as EventListener, { passive: false });
    canvas.addEventListener('touchmove',  move  as EventListener, { passive: false });
    canvas.addEventListener('touchend',   end);
    return () => {
      canvas.removeEventListener('mousedown',  start as EventListener);
      canvas.removeEventListener('mousemove',  move  as EventListener);
      canvas.removeEventListener('mouseup',    end);
      canvas.removeEventListener('mouseleave', end);
      canvas.removeEventListener('touchstart', start as EventListener);
      canvas.removeEventListener('touchmove',  move  as EventListener);
      canvas.removeEventListener('touchend',   end);
    };
  }, [step]); // re-init when step changes so canvas is mounted

  const clearSig = () => {
    const canvas = sigRef.current;
    if (!canvas) return;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const selectEventType = (id: string) => {
    setTipoEvento(id);
    const et = EVENT_TYPES.find(e => e.id === id);
    if (et) setForm(f => ({ ...f, equipoSonido: et.equip }));
  };

  const price = parseFloat(form.precioNeto) || 0;
  const iva   = price * 0.21;
  const gross = price + iva;

  const fmt = (n: number) => n.toFixed(2).replace('.', ',');
  const serviceLabel = ROLE_SERVICE[professional.role] ?? 'prestación de servicios profesionales';
  const eventTypeLabel = EVENT_TYPES.find(e => e.id === tipoEvento)?.label ?? 'Evento';

  // ── Premium contract HTML ─────────────────────────────────────────────────
  const buildContractHTML = (sigDataUrl?: string) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contrato ${esc(ref)} — ${esc(professional.name)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
  @page { margin: 0; size: A4; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { color-scheme: light only; }

  body {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    font-size: 11pt;
    color: #1a1a1a;
    line-height: 1.7;
    background: #fff;
  }

  /* ── Outer frame ── */
  .doc-wrap {
    min-height: 100%;
    border: 1.5px solid #C8A84B;
    margin: 8mm;
  }

  /* ── Hero header ── */
  .contract-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 36px 26px;
    background: linear-gradient(135deg, #050506 0%, #0d0c09 40%, #111008 100%);
    border-bottom: 3px solid #C8A84B;
    position: relative;
  }
  .contract-header::after {
    content: '';
    position: absolute;
    bottom: 3px;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.3) 70%, transparent);
  }
  .brand-name {
    font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
    font-size: 36pt;
    font-weight: 800;
    letter-spacing: 6px;
    color: #C9A227;
    line-height: 1;
    text-shadow: 0 0 30px rgba(201,162,39,0.2), 0 2px 6px rgba(0,0,0,0.9);
  }
  .brand-sub {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 6.5pt;
    letter-spacing: 3.5px;
    color: rgba(201,162,39,0.6);
    text-transform: uppercase;
    margin-top: 7px;
    font-weight: 500;
  }
  .contract-meta {
    text-align: right;
    font-size: 9pt;
    color: rgba(255,255,255,0.5);
    line-height: 2;
  }
  .contract-meta strong {
    color: #C9A227;
    font-size: 11pt;
    letter-spacing: 1.5px;
    display: block;
    font-weight: 700;
    text-shadow: 0 0 20px rgba(201,162,39,0.3);
  }

  /* ── Content padding ── */
  .doc-content { padding: 24px 32px 28px; }

  /* ── Title ── */
  .contract-title {
    text-align: center;
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px solid #e8dfc0;
  }
  .contract-title h1 {
    font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
    font-size: 15pt;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #0a0a0c;
    margin-bottom: 6px;
  }
  .contract-title p {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 8.5pt;
    color: #B8941E;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .gold-line {
    height: 2px;
    background: linear-gradient(to right, transparent, #C8A84B 30%, #C9A227 50%, #C8A84B 70%, transparent);
    margin: 10px auto;
    width: 45%;
  }

  /* ── Intro ── */
  .intro { font-size: 9.5pt; color: #444; margin-bottom: 16px; text-align: justify; line-height: 1.7; }

  /* ── Parties ── */
  .parties { display: flex; gap: 14px; margin-bottom: 16px; }
  .party {
    flex: 1;
    padding: 13px 15px;
    border: 1px solid #e0d4a8;
    border-top: 3px solid #C8A84B;
    background: linear-gradient(160deg, #fffdf5 0%, #fefefe 100%);
  }
  .party-role {
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #B8941E;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #ede8d5;
  }
  .party p { font-size: 10pt; color: #333; margin-bottom: 4px; }
  .party strong { color: #0a0a0c; font-weight: 600; }

  /* ── Section headings ── */
  h2 {
    font-family: 'Inter', sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #0a0a0c;
    margin: 20px 0 12px;
    padding: 9px 12px 9px 15px;
    background: #f8f5ed;
    border-left: 3px solid #C8A84B;
  }

  /* ── Body text ── */
  p.clause { font-size: 10.5pt; color: #333; text-align: justify; margin-bottom: 11px; line-height: 1.75; }
  .clause-num { font-weight: 700; color: #0a0a0c; text-transform: uppercase; letter-spacing: 0.3px; }

  /* ── Economic table ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px;
    font-size: 10.5pt;
    border: 1px solid #e0d4a8;
  }
  thead tr { background: #0a0a0c; }
  thead th {
    color: #D4AF37;
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    letter-spacing: 1px;
    font-size: 8.5pt;
    text-transform: uppercase;
  }
  tbody tr:nth-child(odd) { background: #fff; }
  tbody tr:nth-child(even) { background: #fdfaf2; }
  tbody td { padding: 9px 14px; color: #333; border-bottom: 1px solid #ede8d5; }
  tbody tr:last-child { background: #0a0a0c !important; }
  tbody tr:last-child td { color: rgba(255,255,255,0.75); border-bottom: none; font-weight: 500; }
  tbody tr:last-child .td-net { color: #D4AF37; font-size: 13pt; font-weight: 700; }
  .td-total { font-weight: 700; color: #0a0a0c; }
  .td-net { font-weight: 700; color: #B8941E; }
  .td-neg { color: #c0392b; }

  /* ── Event box ── */
  .event-box {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 13px 16px;
    border: 1px solid #e0d4a8;
    border-left: 4px solid #C8A84B;
    background: linear-gradient(135deg, #fffdf5 0%, #fefefe 100%);
    margin-bottom: 16px;
    font-size: 9pt;
  }
  .event-field { flex: 1; min-width: 115px; }
  .event-field .lbl {
    font-size: 6.5pt;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #B8941E;
    font-weight: 700;
    margin-bottom: 3px;
  }
  .event-field .val { font-weight: 600; color: #0a0a0c; font-size: 9pt; }

  /* ── Warning ── */
  .warn {
    margin: 16px 0;
    padding: 10px 14px;
    background: #fffbeb;
    border: 1px solid #e8c040;
    border-left: 4px solid #D4AF37;
    font-size: 8.5pt;
    color: #6a5200;
    line-height: 1.6;
  }

  /* ── Signatures ── */
  .sigs {
    display: flex;
    gap: 36px;
    margin-top: 34px;
    page-break-inside: avoid;
    padding-top: 18px;
    border-top: 1.5px solid #e0d4a8;
  }
  .sig { flex: 1; }
  .sig-role {
    font-size: 7pt;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #B8941E;
    margin-bottom: 6px;
    font-weight: 700;
  }
  .sig-image { max-width: 100%; height: 56px; display: block; margin-bottom: 4px; object-fit: contain; }
  .sig-line {
    border-bottom: 1px solid #0a0a0c;
    height: 56px;
    margin-bottom: 8px;
  }
  .sig p { font-size: 8.5pt; color: #555; line-height: 1.8; }
  .sig strong { color: #0a0a0c; }

  /* ── Footer ── */
  .footer {
    padding: 10px 24px;
    border-top: 1px solid #e0d4a8;
    font-size: 7pt;
    color: #aaa;
    text-align: center;
    line-height: 1.9;
    background: #f8f5ed;
  }
  .footer strong { color: #B8941E; letter-spacing: 1px; }

  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
</style>
</head>
<body>
<div class="doc-wrap">

<!-- Header -->
<div class="contract-header">
  <div>
    <div class="brand-name">XPEAK</div>
    <div class="brand-sub">Plataforma Profesional de Eventos · xpeak.es</div>
  </div>
  <div class="contract-meta">
    <strong>REF. ${esc(ref)}</strong>
    Tipo: ${esc(eventTypeLabel)}<br>
    Emitido: ${esc(form.fechaFirma)}<br>
    Versión: 2.1
  </div>
</div>

<div class="doc-content">

<!-- Title -->
<div class="contract-title">
  <h1>Contrato de Prestación de Servicios Profesionales</h1>
  <div class="gold-line"></div>
  <p>${esc(serviceLabel.toUpperCase())}</p>
</div>

<!-- Intro -->
<p class="intro">
  En <strong>${esc(form.ciudadFirma||'_________________')}</strong>, a <strong>${esc(form.fechaFirma)}</strong>,
  las partes que a continuación se identifican, reconociéndose mutuamente capacidad legal suficiente para contratar,
  convienen celebrar el presente contrato de prestación de servicios profesionales de naturaleza mercantil,
  con sujeción a las siguientes estipulaciones.
</p>

<!-- Parties -->
<h2>Las Partes</h2>
<div class="parties">
  <div class="party">
    <div class="party-role">El Contratante</div>
    <p><strong>${esc(form.contratanteNombre||'_________________')}</strong></p>
    <p>DNI / NIF: <strong>${esc(form.contratanteNIF||'_______________')}</strong></p>
    <p>Empresa: <strong>${esc(form.empresaNombre||'_________________')}</strong></p>
    <p>CIF: <strong>${esc(form.empresaCIF||'_______________')}</strong></p>
    <p>Domicilio fiscal: ${esc(form.empresaDireccion||'_________________')}</p>
  </div>
  <div class="party">
    <div class="party-role">El Profesional</div>
    <p><strong>${esc(professional.name)}</strong></p>
    <p>Prestador independiente · RETA</p>
    <p>Actividad: ${esc(serviceLabel)}</p>
    ${professional.id > 0 ? `<p>ID XPEAK: <strong>${esc(String(professional.id))}</strong></p>` : ''}
  </div>
</div>

<!-- Event details -->
<h2>El Evento</h2>
<div class="event-box">
  <div class="event-field"><div class="lbl">Nombre del evento</div><div class="val">${esc(form.nombreEvento||'—')}</div></div>
  <div class="event-field"><div class="lbl">Fecha</div><div class="val">${form.fechaEvento ? esc(new Date(form.fechaEvento + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })) : '—'}</div></div>
  <div class="event-field"><div class="lbl">Horario</div><div class="val">${esc(form.horaInicio||'—')} – ${esc(form.horaFin||'—')}</div></div>
  <div class="event-field"><div class="lbl">Local</div><div class="val">${esc(form.nombreLocal||'—')}</div></div>
  <div class="event-field"><div class="lbl">Dirección</div><div class="val">${esc(form.direccionLocal||'—')}</div></div>
  <div class="event-field"><div class="lbl">Tipo de evento</div><div class="val">${esc(eventTypeLabel)}</div></div>
</div>

<!-- Clauses -->
<h2>Estipulaciones</h2>

<p class="clause"><span class="clause-num">PRIMERA · Objeto.</span>
El PROFESIONAL prestará los servicios de <strong>${esc(serviceLabel)}</strong> el día
<strong>${form.fechaEvento ? esc(new Date(form.fechaEvento + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })) : '_______'}</strong>, en horario de
<strong>${esc(form.horaInicio||'__:__')}</strong> a <strong>${esc(form.horaFin||'__:__')}</strong>,
en el local "<strong>${esc(form.nombreLocal||'_______')}</strong>",
ubicado en <strong>${esc(form.direccionLocal||'_______')}</strong>,
en el marco del evento "<strong>${esc(form.nombreEvento||'_______')}</strong>"
de tipología <em>${esc(eventTypeLabel)}</em>.</p>

<p class="clause"><span class="clause-num">SEGUNDA · Naturaleza jurídica.</span>
El presente contrato tiene naturaleza <strong>mercantil y no laboral</strong>, al amparo del art. 1.1 del ET.
El PROFESIONAL actúa como prestador de servicios independiente, asumiendo el riesgo empresarial inherente
a su actividad sin vínculo laboral, dependencia ni ajenidad respecto al CONTRATANTE.
XPEAK actúa exclusivamente como plataforma intermediaria sin ser parte del contrato ni empleador de ninguna de las partes.</p>

<p class="clause"><span class="clause-num">TERCERA · Precio y condiciones económicas.</span>
La retribución acordada por la prestación es la siguiente:</p>

<table>
  <thead>
    <tr>
      <th>Concepto</th>
      <th>Base</th>
      <th>Importe</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Precio neto acordado (base imponible)</td>
      <td>—</td>
      <td><strong>€ ${esc(form.precioNeto||'0,00')}</strong></td>
    </tr>
    <tr>
      <td>IVA (21%) — art. 11 LIVA</td>
      <td>21% s/base</td>
      <td>${price > 0 ? `€ ${fmt(iva)}` : '—'}</td>
    </tr>
    <tr style="background:#fffdf5">
      <td class="td-net"><strong>Total con IVA (21%)</strong></td>
      <td>—</td>
      <td class="td-net"><strong>€ ${price > 0 ? fmt(gross) : '—'}</strong></td>
    </tr>
  </tbody>
</table>

<p class="clause">Forma de pago: <strong>${esc(form.formaPago)}</strong>.
Plazo máximo: <strong>${esc(form.diasPago)} días naturales</strong> desde la recepción de la correspondiente factura.
El PROFESIONAL expedirá factura conforme a los arts. 164 ss. LIVA.</p>

<p class="clause"><span class="clause-num">CUARTA · Equipamiento técnico.</span>
${esc(form.equipoSonido)}</p>

<p class="clause"><span class="clause-num">QUINTA · Cancelaciones y penalizaciones.</span>
En caso de cancelación imputable al CONTRATANTE: <strong>(a)</strong> con más de 15 días de antelación: sin penalización;
<strong>(b)</strong> entre 7 y 15 días: 50% del precio neto acordado;
<strong>(c)</strong> con menos de 7 días o el mismo día del evento: 100% del precio neto acordado.
La acreditación de fuerza mayor exonera a ambas partes de toda penalización.</p>

<p class="clause"><span class="clause-num">SEXTA · Propiedad intelectual y derechos conexos.</span>
La comunicación pública de fonogramas durante el evento es responsabilidad exclusiva del CONTRATANTE,
quien deberá disponer de las preceptivas licencias de SGAE, AIE y AGEDI (arts. 116 ss. RDL 1/1996, LPI).
El PROFESIONAL conserva la titularidad de las grabaciones de su propia actuación;
cualquier difusión por parte del CONTRATANTE requerirá autorización escrita y expresa del PROFESIONAL.</p>

<p class="clause"><span class="clause-num">SÉPTIMA · Derechos de imagen.</span>
La captación y difusión de la imagen del PROFESIONAL queda sujeta a la LO 1/1982.
El uso comercial de su imagen o voz requiere autorización escrita y expresa del PROFESIONAL.</p>

<p class="clause"><span class="clause-num">OCTAVA · Protección de datos.</span>
Los datos personales de las partes serán tratados conforme al RGPD (UE) 2016/679 y la LOPDGDD (LO 3/2018),
con la única finalidad de gestionar la presente relación contractual, sin cesión a terceros salvo obligación legal.</p>

<p class="clause"><span class="clause-num">NOVENA · Indemnización y responsabilidad.</span>
El PROFESIONAL se compromete a mantener indemne al CONTRATANTE y a la plataforma XPEAK frente a cualquier reclamación,
sanción, multa o daño derivado de: (i) infracciones de derechos de propiedad intelectual o industrial;
(ii) incumplimiento de obligaciones fiscales, laborales o de Seguridad Social; o (iii) daños a terceros causados
por culpa o negligencia del PROFESIONAL durante la prestación del servicio.
La responsabilidad máxima de cada parte quedará limitada al importe del precio neto del presente contrato,
salvo en caso de dolo o negligencia grave.</p>

<p class="clause"><span class="clause-num">DÉCIMA · Ley aplicable y jurisdicción.</span>
El presente contrato se rige por la legislación española.
Las controversias que pudieran derivarse del mismo se someterán a los Juzgados y Tribunales del lugar de celebración del evento,
con renuncia expresa a cualquier otro fuero que pudiera corresponder.</p>

<div class="warn">
  ⚠ <strong>Aviso legal:</strong> Este documento es un modelo orientativo generado por la plataforma XPEAK.
  No constituye asesoramiento jurídico vinculante. Se recomienda su revisión por un abogado o asesor jurídico colegiado
  antes de su firma, especialmente en contratos que superen los €3.000.
</div>

<!-- Signatures -->
<h2>Firmas</h2>
<div class="sigs">
  <div class="sig">
    <div class="sig-role">El Contratante</div>
    ${sigDataUrl
      ? `<img src="${sigDataUrl}" class="sig-image" alt="Firma digital" />`
      : '<div class="sig-line"></div>'
    }
    <p><strong>${esc(form.contratanteNombre||'_________________')}</strong></p>
    <p>DNI/NIF: ${esc(form.contratanteNIF||'_______________')}</p>
    <p>En representación de: ${esc(form.empresaNombre||'_______')}</p>
    <p>Fecha: ${esc(form.fechaFirma)}</p>
  </div>
  <div class="sig">
    <div class="sig-role">El Profesional</div>
    <div class="sig-line"></div>
    <p><strong>${esc(professional.name)}</strong></p>
    <p>Plataforma: XPEAK${professional.id > 0 ? ` · ID: ${esc(String(professional.id))}` : ''}</p>
    <p>Actividad: ${esc(serviceLabel)}</p>
    <p>Fecha: ${esc(form.fechaFirma)}</p>
  </div>
</div>

</div><!-- /doc-content -->

<!-- Footer -->
<div class="footer">
  <strong>XPEAK</strong> · Plataforma Profesional de Eventos · xpeak.es<br>
  Ref. ${esc(ref)} · C.Civil arts. 1254 ss. · ET art. 1.1 · LPI RDL 1/1996 · RGPD 2016/679 · LOPDGDD LO 3/2018<br>
  ${hasSig ? `✦ Firmado digitalmente por ${esc(form.contratanteNombre||'el contratante')} · ${esc(form.fechaFirma)} · Ref. ${esc(ref)}` : '✦ Documento generado electrónicamente — pendiente de firma por las partes'}
</div>

</div><!-- /doc-wrap -->
</body>
</html>`;

  const handleGenerate = async () => {
    if (price <= 0) { toast.error('El precio neto debe ser mayor que €0'); return; }
    const today = new Date(); today.setHours(0,0,0,0);
    if (form.fechaEvento) {
      const evDate = new Date(form.fechaEvento);
      if (evDate < today) { toast.error('La fecha del evento no puede ser anterior a hoy'); return; }
    }

    const sigDataUrl = hasSig ? (sigRef.current?.toDataURL('image/png') ?? undefined) : undefined;
    const html = buildContractHTML(sigDataUrl);

    // Save to DB first
    if (user) {
      await supabase.from('contracts').insert({
        user_id:           user.id,
        ref,
        professional_name: professional.name,
        professional_role: professional.role,
        event_type:        tipoEvento,
        event_name:        form.nombreEvento || null,
        event_date:        form.fechaEvento  || null,
        venue:             form.nombreLocal  || null,
        city:              form.ciudadFirma  || null,
        contratante_nombre: form.contratanteNombre || null,
        empresa_nombre:    form.empresaNombre || null,
        precio_neto:       price > 0 ? price : null,
      });
      onSaved?.();
    }

    // Generate PDF via browser print dialog (reliable, respects all CSS)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=900,height=700');
    if (win) {
      win.onload = () => {
        setTimeout(() => {
          win.focus();
          win.print();
          URL.revokeObjectURL(url);
        }, 800);
      };
    } else {
      URL.revokeObjectURL(url);
    }
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
  const inp = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const inpStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } as const;
  const lbl = "text-xs font-bold uppercase tracking-wider mb-1.5 block";
  const lblStyle = { color: 'rgba(255,255,255,0.4)' };
  const sec = "text-xs font-black tracking-widest mb-4";
  const secStyle = { color: 'rgba(212,175,55,0.7)' };

  const STEPS = ['Partes', 'Evento', 'Condiciones'];
  const stepComplete = [
    form.contratanteNombre && form.contratanteNIF && form.empresaNombre,
    form.nombreEvento && form.fechaEvento && form.horaInicio && form.nombreLocal,
    form.precioNeto,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} />
      <div className="relative w-full max-w-xl my-4 rounded-2xl flex flex-col"
        style={{ background: '#0a0a0e', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.25)' }}>
              <FileText size={16} style={{ color: '#D4AF37' }} />
            </div>
            <div>
              <h3 className="text-sm font-bold">Generar Contrato</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Con <span style={{ color: '#D4AF37' }}>{professional.name}</span> · Ref. {ref}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <button onClick={() => setStep((i + 1) as 1|2|3)}
                className="flex items-center gap-1.5 text-xs font-bold transition-all"
                style={{ color: step === i+1 ? '#D4AF37' : stepComplete[i] ? 'rgba(34,197,94,0.8)' : 'rgba(255,255,255,0.3)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ background: step === i+1 ? 'rgba(212,175,55,0.15)' : stepComplete[i] ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${step === i+1 ? 'rgba(212,175,55,0.4)' : stepComplete[i] ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  {stepComplete[i] ? '✓' : i+1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < 2 && <ChevronRight size={12} className="flex-1 mx-1" style={{ color: 'rgba(255,255,255,0.15)' }} />}
            </div>
          ))}
        </div>

        {/* Legal notice */}
        <div className="mx-5 mt-4 p-3 rounded-xl flex items-start gap-2"
          style={{ background: 'rgba(255,188,0,0.04)', border: '1px solid rgba(255,188,0,0.15)' }}>
          <AlertCircle size={12} style={{ color: '#ffbc00', flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Modelo orientativo conforme a legislación española. Recomendamos revisión por abogado antes de firmar.
          </p>
        </div>

        {/* Form body */}
        <div className="px-5 py-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>

          {/* ── STEP 1: Partes ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl} style={lblStyle}>Ciudad de firma</label>
                  <input className={inp} style={inpStyle} placeholder="Madrid" value={form.ciudadFirma} onChange={set('ciudadFirma')} />
                </div>
                <div>
                  <label className={lbl} style={lblStyle}>Fecha contrato</label>
                  <input className={inp} style={{ ...inpStyle, colorScheme: 'dark' }} type="date"
                    value={form.fechaFirma.split('/').reverse().join('-')}
                    onChange={e => setForm(f => ({ ...f, fechaFirma: e.target.value.split('-').reverse().join('/') }))} />
                </div>
              </div>

              <p className={sec} style={secStyle}>— CONTRATANTE —</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className={lbl} style={lblStyle}>Nombre completo *</label>
                  <input className={inp} style={inpStyle} placeholder="Juan García López" value={form.contratanteNombre} onChange={set('contratanteNombre')} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={lbl} style={lblStyle}>DNI / NIF *</label>
                  <input className={inp} style={inpStyle} placeholder="12345678A" value={form.contratanteNIF} onChange={set('contratanteNIF')} maxLength={15} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={lbl} style={lblStyle}>Empresa / Local *</label>
                  <input className={inp} style={inpStyle} placeholder="Club Amnesia S.L." value={form.empresaNombre} onChange={set('empresaNombre')} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={lbl} style={lblStyle}>CIF empresa</label>
                  <input className={inp} style={inpStyle} placeholder="B12345678" value={form.empresaCIF} onChange={set('empresaCIF')} maxLength={12} />
                </div>
                <div className="col-span-2">
                  <label className={lbl} style={lblStyle}>Dirección fiscal</label>
                  <input className={inp} style={inpStyle} placeholder="Calle Mayor 1, 28001 Madrid" value={form.empresaDireccion} onChange={set('empresaDireccion')} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Evento ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={lbl} style={lblStyle}>Tipo de evento</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EVENT_TYPES.map(et => (
                    <button key={et.id} type="button" onClick={() => selectEventType(et.id)}
                      className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left"
                      style={{
                        background: tipoEvento === et.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${tipoEvento === et.id ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: tipoEvento === et.id ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                      }}>
                      {et.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={lbl} style={lblStyle}>Nombre del evento *</label>
                <input className={inp} style={inpStyle} placeholder="Opening Summer Party 2026" value={form.nombreEvento} onChange={set('nombreEvento')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl} style={lblStyle}>Fecha del evento *</label>
                  <input className={inp} style={{ ...inpStyle, colorScheme: 'dark' }} type="date" value={form.fechaEvento} onChange={set('fechaEvento')} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={lbl} style={lblStyle}>Inicio *</label>
                    <input className={inp} style={inpStyle} type="time" value={form.horaInicio} onChange={set('horaInicio')} />
                  </div>
                  <div className="flex-1">
                    <label className={lbl} style={lblStyle}>Fin</label>
                    <input className={inp} style={inpStyle} type="time" value={form.horaFin} onChange={set('horaFin')} />
                  </div>
                </div>
                <div>
                  <label className={lbl} style={lblStyle}>Nombre del local *</label>
                  <input className={inp} style={inpStyle} placeholder="Pacha Ibiza" value={form.nombreLocal} onChange={set('nombreLocal')} />
                </div>
                <div>
                  <label className={lbl} style={lblStyle}>Dirección</label>
                  <input className={inp} style={inpStyle} placeholder="Av. 8 de Agosto, Ibiza" value={form.direccionLocal} onChange={set('direccionLocal')} />
                </div>
              </div>
              <div>
                <label className={lbl} style={lblStyle}>Equipamiento técnico</label>
                <textarea className={inp} style={{ ...inpStyle, resize: 'none' } as React.CSSProperties}
                  rows={3} value={form.equipoSonido} onChange={set('equipoSonido')} />
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Pre-rellenado según tipo de evento. Edita si es necesario.</p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Condiciones ── */}
          {step === 3 && (
            <div className="space-y-4">
              <p className={sec} style={secStyle}>— CONDICIONES ECONÓMICAS —</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className={lbl} style={lblStyle}>Base imponible € (sin IVA) *</label>
                  <input className={inp} style={{ ...inpStyle, borderColor: (form.precioNeto && price <= 0) ? 'rgba(255,95,86,0.5)' : undefined }} type="number" min={1} placeholder="500" value={form.precioNeto} onChange={set('precioNeto')} />
                  {form.precioNeto && price <= 0 && <p className="text-xs mt-1" style={{ color: '#ff5f56' }}>El precio debe ser mayor que €0</p>}
                </div>
                <div>
                  <label className={lbl} style={lblStyle}>Forma de pago</label>
                  <input className={inp} style={inpStyle} placeholder="transferencia bancaria" value={form.formaPago} onChange={set('formaPago')} />
                </div>
                <div>
                  <label className={lbl} style={lblStyle}>Plazo (días)</label>
                  <input className={inp} style={inpStyle} type="number" placeholder="30" value={form.diasPago} onChange={set('diasPago')} />
                </div>
              </div>

              {price > 0 && (
                <div className="rounded-2xl p-4 grid grid-cols-3 gap-3 text-center"
                  style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  {[
                    { label: 'Base imponible',  value: `€${fmt(price)}`, color: 'rgba(255,255,255,0.7)' },
                    { label: 'IVA 21%',         value: `+€${fmt(iva)}`,  color: '#fff' },
                    { label: 'Total con IVA',   value: `€${fmt(gross)}`, color: '#D4AF37' },
                  ].map(x => (
                    <div key={x.label}>
                      <p className="text-xs text-muted-foreground mb-1">{x.label}</p>
                      <p className="text-base font-black" style={{ color: x.color }}>{x.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Digital signature */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: '#D4AF37' }}>
                    <PenLine size={13} /> Firma digital del contratante <span className="text-muted-foreground font-normal">(opcional)</span>
                  </p>
                  {hasSig && (
                    <button onClick={clearSig} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-all hover:scale-105"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#8E8EA0' }}>
                      <Eraser size={11} /> Borrar
                    </button>
                  )}
                </div>
                <canvas ref={sigRef} width={460} height={90}
                  className="w-full rounded-lg cursor-crosshair touch-none"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${hasSig ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)'}`, display: 'block' }} />
                <p className="text-xs text-muted-foreground mt-1.5">Dibuja tu firma con el ratón o con el dedo. Se incrustará en el PDF.</p>
              </div>

              {/* Generate button */}
              <button onClick={handleGenerate}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:scale-[1.01] transition-all mt-2"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 8px 24px rgba(212,175,55,0.2)' }}>
                <Sparkles size={18} /> Generar Contrato PDF
              </button>
              <p className="text-xs text-center text-muted-foreground">
                El contrato se descargará como PDF en tu dispositivo
              </p>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex gap-3 px-5 pb-5">
          {step > 1 && (
            <button onClick={() => setStep(s => (s - 1) as 1|2|3)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#8E8EA0' }}>
              ← Anterior
            </button>
          )}
          {step < 3 && (
            <button onClick={() => setStep(s => (s + 1) as 1|2|3)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Siguiente →
            </button>
          )}
          {step === 3 && (
            <button onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
              <Download size={14} /> PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
