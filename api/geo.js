// Devuelve la comunidad autónoma desde la que se pide la página, sin guardar
// ni devolver la IP. Vercel pone la ubicación en las cabeceras de cada
// petición a una función; las páginas estáticas no las reciben.

// Códigos de provincia (ISO 3166-2:ES) y de comunidad -> nombre de comunidad.
const REGIONES = {
  // Andalucía
  AN: 'Andalucía', AL: 'Andalucía', CA: 'Andalucía', CO: 'Andalucía', GR: 'Andalucía',
  H: 'Andalucía', J: 'Andalucía', MA: 'Andalucía', SE: 'Andalucía',
  // Aragón
  AR: 'Aragón', HU: 'Aragón', TE: 'Aragón', Z: 'Aragón',
  // Asturias
  AS: 'Asturias', O: 'Asturias',
  // Baleares
  IB: 'Baleares', PM: 'Baleares',
  // Canarias
  CN: 'Canarias', GC: 'Canarias', TF: 'Canarias',
  // Cantabria
  CB: 'Cantabria', S: 'Cantabria',
  // Castilla y León
  CL: 'Castilla y León', AV: 'Castilla y León', BU: 'Castilla y León', LE: 'Castilla y León',
  P: 'Castilla y León', SA: 'Castilla y León', SG: 'Castilla y León', SO: 'Castilla y León',
  VA: 'Castilla y León', ZA: 'Castilla y León',
  // Castilla-La Mancha
  CM: 'Castilla-La Mancha', AB: 'Castilla-La Mancha', CR: 'Castilla-La Mancha',
  CU: 'Castilla-La Mancha', GU: 'Castilla-La Mancha', TO: 'Castilla-La Mancha',
  // Cataluña
  CT: 'Cataluña', B: 'Cataluña', GI: 'Cataluña', L: 'Cataluña', T: 'Cataluña',
  // Comunidad Valenciana
  VC: 'Comunidad Valenciana', A: 'Comunidad Valenciana', CS: 'Comunidad Valenciana', V: 'Comunidad Valenciana',
  // Extremadura
  EX: 'Extremadura', BA: 'Extremadura', CC: 'Extremadura',
  // Galicia
  GA: 'Galicia', C: 'Galicia', LU: 'Galicia', OR: 'Galicia', PO: 'Galicia',
  // La Rioja
  RI: 'La Rioja', LO: 'La Rioja',
  // Madrid
  MD: 'Madrid', M: 'Madrid',
  // Murcia
  MC: 'Murcia', MU: 'Murcia',
  // Navarra
  NC: 'Navarra', NA: 'Navarra',
  // País Vasco
  PV: 'País Vasco', BI: 'País Vasco', SS: 'País Vasco', VI: 'País Vasco',
  // Ciudades autónomas
  CE: 'Ceuta', ML: 'Melilla',
};

export default function handler(req, res) {
  const pais = String(req.headers['x-vercel-ip-country'] || '').toUpperCase();
  const codigo = String(req.headers['x-vercel-ip-country-region'] || '').toUpperCase();

  let region = null;
  if (pais && pais !== 'ES') region = 'Fuera de España';
  else if (pais === 'ES') region = REGIONES[codigo] || 'España (sin dato)';

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ region });
}
