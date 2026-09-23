export const ORIGIN='https://www.xpeak.es';
export const VERSION=1;
export function slot(kind, now=new Date()) {
  if(!['seo','security'].includes(kind)) throw new Error('Tipo no válido');
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
  const date=new Date(`${parts.year}-${parts.month}-${parts.day}T12:00:00Z`);
  const target=kind==='seo'?4:5;
  let ago=(date.getUTCDay()-target+7)%7;
  if(ago===0 && Number(parts.hour)<9) ago=7;
  date.setUTCDate(date.getUTCDate()-ago);
  return date.toISOString().slice(0,10);
}
export function safeUrl(value, base=ORIGIN) {
  try {const u=new URL(value,base);return u.protocol==='https:' && ['www.xpeak.es','xpeak.es'].includes(u.hostname) && !u.port && !u.username && !u.password && !u.search ? u.href.split('#')[0]:null;}catch{return null;}
}
export function robotsAllowed(text,path,agent='XpeakAudit') {
  const groups=[];let group={agents:[],rules:[]};let rules=false;
  for(const raw of text.split(/\r?\n/)) {
    const m=raw.split('#')[0].trim().match(/^([^:]+):\s*(.*)$/); if(!m)continue;
    const key=m[1].toLowerCase(),value=m[2].trim();
    if(key==='user-agent'){if(rules){groups.push(group);group={agents:[],rules:[]};rules=false;}group.agents.push(value.toLowerCase());}
    else if(['allow','disallow'].includes(key)&&group.agents.length){group.rules.push({allow:key==='allow',path:value});rules=true;}
  }
  groups.push(group);
  const matching=groups.filter(g=>g.agents.some(a=>a!=='*'&&agent.toLowerCase().includes(a)));
  const selected=matching.length?matching:groups.filter(g=>g.agents.includes('*'));
  let best={length:-1,allow:true};
  for(const r of selected.flatMap(g=>g.rules)){
    if(!r.path)continue;
    const end=r.path.endsWith('$');const literal=end?r.path.slice(0,-1):r.path;
    const pattern='^'+literal.split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*')+(end?'$':'');
    const length=literal.replaceAll('*','').length;
    if(new RegExp(pattern).test(path)&&(length>best.length || (length===best.length&&r.allow)))best={length,allow:r.allow};
  }
  return best.allow;
}
export function delta(report, previous) {
  if(!previous || previous.version!==report.version) return {baseline:false,new:[],persisting:[],resolved:[],unverified:[]};
  const current=new Set(report.findings.map(f=>f.id));
  const old=new Set(previous.findings.map(f=>f.id));
  const resolved=[],unverified=[];
  for(const f of previous.findings) if(!current.has(f.id)) (report.checked.includes(f.check)?resolved:unverified).push(f.id);
  return {baseline:true,new:[...current].filter(x=>!old.has(x)),persisting:[...current].filter(x=>old.has(x)),resolved,unverified};
}
export function markdown(r) {
  const clean=s=>String(s).replace(/[<>]/g,'').replace(/\r/g,'');
  return `# Auditoría ${r.kind==='seo'?'SEO, AEO y GEO':'de seguridad'} de Xpeak\n\nFecha programada: ${r.date}, 09:00 Europe/Madrid. Ejecutada: ${r.startedAt}.\nEstado: ${r.status}. Versión: ${r.version}. Commit: ${r.commit}${r.sourceDirty?' (incluye cambios locales sin commit)':''}.\n\n## Cobertura\n${r.coverage.map(x=>'- '+clean(x)).join('\n')}\n\n## Hallazgos\n${r.findings.map(f=>`### ${f.priority} · ${clean(f.title)}\nSeveridad: ${f.severity}. Evidencia: ${clean(f.evidence)}\n\nAcción: ${clean(f.action)}\n`).join('\n') || 'Sin hallazgos en las comprobaciones realizadas; no implica ausencia de riesgos.'}\n\n## Comparación\n${r.delta.baseline?`Nuevos: ${r.delta.new.length}; persistentes: ${r.delta.persisting.length}; resueltos comprobados: ${r.delta.resolved.length}; no reevaluados: ${r.delta.unverified.length}.`:'Primera referencia compatible; no hay comparación disponible.'}\n\n## Límites y áreas sin comprobar\n${r.limitations.map(x=>'- '+clean(x)).join('\n')}\n\n## Mediciones\n\`\`\`json\n${JSON.stringify(r.measurements,null,2)}\n\`\`\`\n`;
}
export function secretSignals(text) {
 const signals=[];
 if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----\s+[A-Za-z0-9+/=\s]{64,}-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text))signals.push('private-key');
 if(/sb_secret_[A-Za-z0-9_-]{20,}/.test(text))signals.push('supabase-secret');
 if(/gh[pousr]_[A-Za-z0-9]{30,}/.test(text))signals.push('github-token');
 for(const match of text.matchAll(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g))try{
  if(JSON.parse(Buffer.from(match[0].split('.')[1],'base64url')).role==='service_role'){signals.push('service-role-jwt');break;}
 }catch{/* Not a parseable JWT. */}
 return signals;
}
