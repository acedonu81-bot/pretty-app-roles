const src = await Deno.readTextFile(Deno.args[0]);
const a = src.indexOf('const esc = ');
const b = src.indexOf('const badge = ');
const c = src.indexOf('  concurso_resultado_votantes:');
const d = src.indexOf('  // Captación (24 oct 2026, ficha XDS aprobada)');
const code = src.slice(a, b) + 'const btn = ' + src.slice(src.indexOf('const btn = ') + 12, src.indexOf('// Círculo con inicial')) +
  'const T: Record<string, (d: any) => any> = {\n' + src.slice(c, d) + '};\nexport { T };';
await Deno.writeTextFile(Deno.args[1] + '/tpl.ts', code);
const { T } = await import(Deno.args[1] + '/tpl.ts');
const base = { email: 'x@y.es', name: 'Lucía', ganador: 'Zulo Creativo', ganador_url: 'https://xpeak.es/p/ab1f4291-68d7-40e7-bde4-9b652151f061', finalistas: ['DJ VIZARD', 'RUBEN TRIAS', 'Zulo Creativo'] };
const vars: Record<string, any> = {
  votante: { ...base, voto: true },
  dj_incompleto: { ...base, dj: true, falta: 'foto y bio' },
  participante_completo: { ...base, dj: true, participante: true, falta: '' },
};
for (const [k, v] of Object.entries(vars)) {
  const m = T.concurso_resultado_votantes(v);
  await Deno.writeTextFile(`${Deno.args[1]}/${k}.html`, `<meta charset="utf-8">${m.html.replaceAll('{{UNSUB_URL}}', 'https://xpeak.es/baja')}`);
  console.log(k, m.subject);
}
