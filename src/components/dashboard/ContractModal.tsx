import { useState } from 'react';
import { FileText, X, Printer, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import type { Profile } from '@/data/profiles';

// Escape HTML special chars to prevent XSS when building the contract document
const esc = (s: string) =>
  s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

interface Props {
  professional: Profile;
  onClose: () => void;
}

const ROLE_SERVICE_LABEL: Record<string, string> = {
  dj:        'sesión de DJ / actuación musical en directo',
  rookie:    'actuación musical (artista emergente)',
  staff:     'servicios de staff y gestión de sala',
  makeup:    'servicios de maquillaje y peluquería',
  media:     'servicios de fotografía y/o vídeo de evento',
  ambassador:'servicios de promotor y captación de público',
  design:    'servicios de diseño y/o VJing',
};

const todayStr = () =>
  new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

const ContractModal = ({ professional, onClose }: Props) => {
  const [preview, setPreview] = useState(false);
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
    precioNeto: '',
    tipoRetencion: '15',
    formaPago: 'transferencia bancaria',
    diasPago: '30',
    equipoSonido: 'El PROFESIONAL aporta su propio equipo técnico.',
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const price = parseFloat(form.precioNeto) || 0;
  const ret   = parseFloat(form.tipoRetencion) || 15;
  const precioIVA    = price > 0 ? (price * 1.21).toFixed(2) : '—';
  const retencion    = price > 0 ? (price * ret / 100).toFixed(2) : '—';
  const liquidoP     = price > 0 ? (price * (1 + 0.21 - ret / 100)).toFixed(2) : '—';

  const serviceLabel = ROLE_SERVICE_LABEL[professional.role] ?? 'prestación de servicios profesionales';

  const buildContractHTML = () => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Contrato – ${esc(professional.name)}</title>
<style>
@page{margin:2cm}
*{box-sizing:border-box}
body{font-family:'Times New Roman',Times,serif;font-size:11pt;color:#111;line-height:1.6}
.hdr{text-align:center;border-bottom:2px solid #111;padding-bottom:12px;margin-bottom:20px}
.hdr h1{font-size:14pt;font-weight:bold;margin:0 0 4px;letter-spacing:1px}
.hdr p{font-size:10pt;color:#444;margin:0}
.badge{display:inline-block;border:1px solid #999;border-radius:4px;font-size:9pt;padding:2px 8px;color:#666}
h2{font-size:11pt;font-weight:bold;margin:18px 0 6px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #ddd;padding-bottom:4px}
p{margin:4px 0 8px;text-align:justify}
.parties{display:flex;gap:30px;margin-bottom:16px}
.party{flex:1;padding:10px;border:1px solid #ccc;border-radius:4px}
.party strong{display:block;font-size:10pt;text-transform:uppercase;color:#555;margin-bottom:4px}
.hl{font-weight:bold}
table{width:100%;border-collapse:collapse;margin:8px 0}
th,td{border:1px solid #ccc;padding:5px 8px;font-size:10pt;text-align:left}
th{background:#f5f5f5;font-weight:bold}
.cn{font-weight:bold}
.sigs{display:flex;gap:60px;margin-top:40px}
.sig{flex:1;border-top:1px solid #999;padding-top:8px}
.sig p{font-size:10pt;margin:2px 0}
.footer{font-size:8pt;color:#888;border-top:1px solid #ddd;margin-top:24px;padding-top:6px;text-align:center}
.warn{background:#fff8e1;border:1px solid #f0c040;border-radius:4px;padding:8px 12px;font-size:9pt;margin:10px 0}
</style>
</head>
<body>
<div class="hdr">
  <h1>CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES</h1>
  <p>Generado a través de <strong>XPEAK Platform</strong> &nbsp;<span class="badge">DEMO — no firmado digitalmente</span></p>
</div>
<p>En <strong>${esc(form.ciudadFirma||'___')}</strong>, a <strong>${esc(form.fechaFirma)}</strong></p>
<h2>REUNIDOS</h2>
<div class="parties">
  <div class="party">
    <strong>EL CONTRATANTE</strong>
    <p><span class="hl">${esc(form.contratanteNombre||'___')}</span>, DNI/NIF <strong>${esc(form.contratanteNIF||'___')}</strong>,
    en representación de <strong>${esc(form.empresaNombre||'___')}</strong>, CIF <strong>${esc(form.empresaCIF||'___')}</strong>,
    domicilio: ${esc(form.empresaDireccion||'___')}.</p>
  </div>
  <div class="party">
    <strong>EL PROFESIONAL</strong>
    <p><span class="hl">${esc(professional.name)}</span>, prestador de servicios independiente,
    dado de alta en el RETA. Actividad: ${esc(serviceLabel)}. XPEAK ID: ${esc(String(professional.id))}.</p>
  </div>
</div>
<p>Ambas partes se reconocen capacidad legal suficiente para contratar y, a tal efecto,</p>
<h2>EXPONEN</h2>
<p>I. El CONTRATANTE precisa servicios de <strong>${esc(serviceLabel)}</strong> para el evento "<strong>${esc(form.nombreEvento||'___')}</strong>".</p>
<p>II. El PROFESIONAL presta dichos servicios de manera independiente y sin relación de subordinación laboral.</p>
<p>III. Ambas partes acuerdan la prestación en los términos que siguen.</p>
<h2>ESTIPULACIONES</h2>
<p><span class="cn">PRIMERA — OBJETO.</span> El PROFESIONAL prestará servicios de <strong>${esc(serviceLabel)}</strong>
el día <strong>${esc(form.fechaEvento||'___')}</strong>, de <strong>${esc(form.horaInicio||'__:__')}</strong>
a <strong>${esc(form.horaFin||'__:__')}</strong>, en el local "<strong>${esc(form.nombreLocal||'___')}</strong>",
sito en <strong>${esc(form.direccionLocal||'___')}</strong>.</p>
<p><span class="cn">SEGUNDA — NATURALEZA JURÍDICA.</span> El presente contrato tiene naturaleza <strong>mercantil y no laboral</strong>.
El PROFESIONAL actúa como prestador independiente, sin vínculo laboral, dependencia ni ajenidad (art. 1.1 ET).
Organiza autónomamente su actividad y asume el riesgo empresarial inherente.</p>
<p><span class="cn">TERCERA — PRECIO Y RETENCIONES.</span></p>
<table>
<tr><th>Concepto</th><th>Importe</th></tr>
<tr><td>Precio neto acordado</td><td><strong>€${esc(form.precioNeto||'0,00')}</strong></td></tr>
<tr><td>IVA (21%) — art. 11 LIVA</td><td>€${price > 0 ? (price*0.21).toFixed(2) : '—'}</td></tr>
<tr><td><strong>Total bruto</strong></td><td><strong>€${precioIVA}</strong></td></tr>
<tr><td>Retención IRPF (${esc(form.tipoRetencion)}%) — art. 95 RIRPF</td><td>– €${retencion}</td></tr>
<tr><td><strong>Líquido a percibir</strong></td><td><strong>€${liquidoP}</strong></td></tr>
</table>
<p>Pago: <strong>${esc(form.formaPago)}</strong>, plazo máximo <strong>${esc(form.diasPago)} días</strong> desde recepción de factura.</p>
<p><span class="cn">CUARTA — EQUIPAMIENTO.</span> ${esc(form.equipoSonido)}</p>
<p><span class="cn">QUINTA — CANCELACIONES.</span> Por cancelación imputable al CONTRATANTE: (a) &gt;15 días: sin penalización;
(b) 7–15 días: 50% del precio neto; (c) &lt;7 días o mismo día: 100% del precio neto.
En fuerza mayor debidamente acreditada ninguna parte incurrirá en penalización.</p>
<p><span class="cn">SEXTA — PROPIEDAD INTELECTUAL.</span> La comunicación pública de fonogramas es responsabilidad del CONTRATANTE,
quien deberá disponer de licencias ante SGAE, AIE y AGEDI (arts. 116 ss. RDL 1/1996, LPI).
Las grabaciones del PROFESIONAL de su propia actuación son de su titularidad; su difusión requiere autorización escrita del CONTRATANTE.</p>
<p><span class="cn">SÉPTIMA — DERECHOS DE IMAGEN.</span> Captación y difusión de la imagen del PROFESIONAL queda sujeta a LO 1/1982.
El uso comercial de su imagen requiere autorización escrita y expresa del PROFESIONAL.</p>
<p><span class="cn">OCTAVA — PROTECCIÓN DE DATOS.</span> Los datos de las partes se tratarán conforme al RGPD (UE) 2016/679 y la LOPDGDD (LO 3/2018),
exclusivamente para gestión de esta relación contractual, sin cesión a terceros salvo obligación legal.</p>
<p><span class="cn">NOVENA — RESPONSABILIDAD.</span> Cada parte responde de los daños causados por dolo o negligencia grave.
Responsabilidad del PROFESIONAL limitada al precio neto del contrato, salvo dolo.</p>
<p><span class="cn">DÉCIMA — LEY APLICABLE Y JURISDICCIÓN.</span> Rige la legislación española. Controversias se someten a los
Juzgados del lugar de celebración del evento, con renuncia a cualquier otro fuero.</p>
<div class="warn">⚠️ Este contrato es un modelo orientativo generado por XPEAK. Se recomienda revisión por abogado colegiado antes de su firma. No constituye asesoramiento jurídico vinculante.</div>
<h2>FIRMAS</h2>
<div class="sigs">
  <div class="sig">
    <p><strong>EL CONTRATANTE</strong></p>
    <p style="margin-top:40px">Fdo.: ${esc(form.contratanteNombre||'___')}</p>
    <p>DNI/NIF: ${esc(form.contratanteNIF||'___')}</p>
    <p>Fecha: ${esc(form.fechaFirma)}</p>
  </div>
  <div class="sig">
    <p><strong>EL PROFESIONAL</strong></p>
    <p style="margin-top:40px">Fdo.: ${esc(professional.name)}</p>
    <p>Plataforma: XPEAK</p>
    <p>Fecha: ${esc(form.fechaFirma)}</p>
  </div>
</div>
<div class="footer">
  XPEAK Platform · Contrato de Prestación de Servicios · Código Civil arts. 1254 ss. ·
  Estatuto de los Trabajadores art. 1.1 · LPI RDL 1/1996 · RGPD 2016/679 · LOPDGDD LO 3/2018
</div>
</body>
</html>`;

  const handlePrint = () => {
    const html = buildContractHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const w    = window.open(url, '_blank', 'width=900,height=700');
    if (w) {
      w.addEventListener('load', () => {
        w.print();
        URL.revokeObjectURL(url);
      });
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none transition-all";
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } as const;
  const labelCls  = "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} />
      <div className="relative w-full max-w-2xl my-4 rounded-2xl flex flex-col"
        style={{ background: '#0a0a0e', border: '1px solid rgba(212,175,55,0.2)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <FileText size={16} style={{ color: '#D4AF37' }} />
            </div>
            <div>
              <h3 className="text-base font-bold">Generar Contrato</h3>
              <p className="text-xs text-muted-foreground">Con <span style={{ color: '#D4AF37' }}>{professional.name}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button onClick={() => setPreview(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              {preview ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
              {preview ? 'Ocultar' : 'Vista previa'}
            </button>
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Printer size={12} /> PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5">
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Legal notice */}
        <div className="mx-6 mt-4 p-3 rounded-lg flex items-start gap-2"
          style={{ background: 'rgba(255,188,0,0.05)', border: '1px solid rgba(255,188,0,0.2)' }}>
          <AlertCircle size={13} style={{ color: '#ffbc00', flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ color: '#ffbc00', fontWeight: 700 }}>Marco legal:</span>{' '}
            Código Civil art. 1254 · ET art. 1.1 · LPI RDL 1/1996 · RGPD 2016/679 · LOPDGDD LO 3/2018.
            Modelo orientativo — recomendamos revisión por abogado colegiado.
          </p>
        </div>

        <div className="px-6 py-4 overflow-y-auto">

          {/* Firma location/date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelCls}>Ciudad de firma</label>
              <input className={inputCls} style={inputStyle} placeholder="Madrid" value={form.ciudadFirma} onChange={set('ciudadFirma')} />
            </div>
            <div>
              <label className={labelCls}>Fecha del contrato</label>
              <input className={inputCls} style={inputStyle} type="date"
                value={form.fechaFirma.split('/').reverse().join('-')}
                onChange={e => setForm(f => ({ ...f, fechaFirma: e.target.value.split('-').reverse().join('/') }))} />
            </div>
          </div>

          <p className="text-xs font-black tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.6)' }}>— CONTRATANTE —</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelCls}>Nombre completo</label>
              <input className={inputCls} style={inputStyle} placeholder="Juan García López" value={form.contratanteNombre} onChange={set('contratanteNombre')} />
            </div>
            <div>
              <label className={labelCls}>DNI / NIF</label>
              <input className={inputCls} style={inputStyle} placeholder="12345678A" value={form.contratanteNIF} onChange={set('contratanteNIF')} />
            </div>
            <div>
              <label className={labelCls}>Empresa / Local</label>
              <input className={inputCls} style={inputStyle} placeholder="Club Amnesia S.L." value={form.empresaNombre} onChange={set('empresaNombre')} />
            </div>
            <div>
              <label className={labelCls}>CIF empresa</label>
              <input className={inputCls} style={inputStyle} placeholder="B12345678" value={form.empresaCIF} onChange={set('empresaCIF')} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Dirección fiscal</label>
              <input className={inputCls} style={inputStyle} placeholder="Calle Mayor 1, 28001 Madrid" value={form.empresaDireccion} onChange={set('empresaDireccion')} />
            </div>
          </div>

          <p className="text-xs font-black tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.6)' }}>— EVENTO —</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="sm:col-span-2">
              <label className={labelCls}>Nombre del evento</label>
              <input className={inputCls} style={inputStyle} placeholder="Opening Summer Party 2026" value={form.nombreEvento} onChange={set('nombreEvento')} />
            </div>
            <div>
              <label className={labelCls}>Fecha del evento</label>
              <input className={inputCls} style={inputStyle} type="date" value={form.fechaEvento} onChange={set('fechaEvento')} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className={labelCls}>Inicio</label>
                <input className={inputCls} style={inputStyle} type="time" value={form.horaInicio} onChange={set('horaInicio')} />
              </div>
              <div className="flex-1">
                <label className={labelCls}>Fin</label>
                <input className={inputCls} style={inputStyle} type="time" value={form.horaFin} onChange={set('horaFin')} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Nombre del local</label>
              <input className={inputCls} style={inputStyle} placeholder="Pacha Ibiza" value={form.nombreLocal} onChange={set('nombreLocal')} />
            </div>
            <div>
              <label className={labelCls}>Dirección del local</label>
              <input className={inputCls} style={inputStyle} placeholder="Av. 8 de Agosto, 07800 Ibiza" value={form.direccionLocal} onChange={set('direccionLocal')} />
            </div>
          </div>

          <p className="text-xs font-black tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.6)' }}>— CONDICIONES ECONÓMICAS —</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Precio neto (€ sin IVA)</label>
              <input className={inputCls} style={inputStyle} type="number" placeholder="500" value={form.precioNeto} onChange={set('precioNeto')} />
            </div>
            <div>
              <label className={labelCls}>Retención IRPF</label>
              <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }} value={form.tipoRetencion} onChange={set('tipoRetencion')}>
                <option value="7" style={{ background: '#0a0a0e' }}>7% — Inicio actividad (primeros 2 años)</option>
                <option value="15" style={{ background: '#0a0a0e' }}>15% — General autónomo</option>
              </select>
            </div>
            {price > 0 && (
              <div className="sm:col-span-2 p-3 rounded-lg grid grid-cols-3 gap-3 text-center"
                style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
                {[
                  { label: 'Total c/IVA 21%',      value: `€${precioIVA}`, color: '#fff' },
                  { label: `Retención ${form.tipoRetencion}%`, value: `–€${retencion}`, color: '#ef4444' },
                  { label: 'Líquido a percibir',    value: `€${liquidoP}`, color: '#D4AF37' },
                ].map(x => (
                  <div key={x.label}>
                    <p className="text-xs text-muted-foreground mb-0.5">{x.label}</p>
                    <p className="text-base font-black" style={{ color: x.color }}>{x.value}</p>
                  </div>
                ))}
              </div>
            )}
            <div>
              <label className={labelCls}>Forma de pago</label>
              <input className={inputCls} style={inputStyle} placeholder="transferencia bancaria" value={form.formaPago} onChange={set('formaPago')} />
            </div>
            <div>
              <label className={labelCls}>Plazo (días)</label>
              <input className={inputCls} style={inputStyle} type="number" placeholder="30" value={form.diasPago} onChange={set('diasPago')} />
            </div>
          </div>

          <div className="mb-4">
            <label className={labelCls}>Equipamiento / observaciones</label>
            <textarea className={inputCls} style={{ ...inputStyle, resize: 'none' } as React.CSSProperties} rows={2}
              value={form.equipoSonido} onChange={set('equipoSonido')} />
          </div>

          {/* Inline preview */}
          {preview && (
            <div className="rounded-xl p-4 mt-2 mb-4"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Georgia,serif' }}>
              <p className="text-xs font-black text-center tracking-widest mb-2" style={{ color: 'rgba(212,175,55,0.6)' }}>— RESUMEN —</p>
              <p className="text-xs text-muted-foreground">En <b>{form.ciudadFirma||'___'}</b>, a <b>{form.fechaFirma}</b></p>
              <p className="text-xs mt-1 text-muted-foreground"><b>Contratante:</b> {form.contratanteNombre||'___'} · {form.empresaNombre||'___'}</p>
              <p className="text-xs mt-1 text-muted-foreground"><b>Profesional:</b> {professional.name} — {serviceLabel}</p>
              <p className="text-xs mt-1 text-muted-foreground"><b>Evento:</b> {form.nombreEvento||'___'} · {form.fechaEvento||'___'} · {form.horaInicio||'__'}–{form.horaFin||'__'} · {form.nombreLocal||'___'}</p>
              <p className="text-xs mt-1 text-muted-foreground"><b>Precio neto:</b> €{form.precioNeto||'0'} → líquido: €{liquidoP}</p>
              <p className="text-xs mt-2 italic" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>
                Cláusulas: naturaleza mercantil · cancelaciones · propiedad intelectual · derechos de imagen · RGPD/LOPDGDD · jurisdicción española
              </p>
            </div>
          )}

          <button onClick={handlePrint}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            <Printer size={16} /> Generar y Descargar PDF
          </button>
          <p className="text-xs text-center mt-2 text-muted-foreground">
            Se abrirá el diálogo de impresión — selecciona "Guardar como PDF"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
