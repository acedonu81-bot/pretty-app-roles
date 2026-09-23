import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {ORIGIN,VERSION,slot,safeUrl,robotsAllowed,delta,markdown,secretSignals} from './core.mjs';
const kind=process.argv[2];const date=process.env.AUDIT_DATE || slot(kind);
const dir=process.env.AUDIT_DIR || '/tmp/xpeak-audits';
await mkdir(dir,{recursive:true,mode:0o700});
const report={sourceDirty:!!execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim(),id:`${kind}-${date}`,kind,date,version:VERSION,startedAt:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),status:'complete',findings:[],checked:[],coverage:[],limitations:[],measurements:{pages:[]}};
const add=(check,title,evidence,action,severity='media',priority='P2')=>report.findings.push({id:createHash('sha256').update(check).digest('hex').slice(0,16),check,title,evidence,action,severity,priority});
const incomplete=(text)=>{report.status='partial';report.limitations.push(text);};
const check=(id)=>report.checked.push(id);
const readJSON=async file=>JSON.parse(await readFile(file,'utf8'));
// Fixed host allowlist, no cookies, 1 request/second, no JS execution, 30s deadline,
// 2 MB body cap and maximum four same-site redirects. Never send gateway credentials.
let last=0;
async function get(input){
 let url=safeUrl(input);if(!url)throw new Error('URL fuera de alcance');
 const start=Date.now();
 for(let i=0;i<5;i++){
  await new Promise(r=>setTimeout(r,Math.max(0,1000-(Date.now()-last))));last=Date.now();
  const res=await fetch(url,{redirect:'manual',headers:{'User-Agent':'XpeakAudit/1.0 (+https://www.xpeak.es)'},signal:AbortSignal.timeout(30000)});
  if([301,302,303,307,308].includes(res.status)) {url=safeUrl(res.headers.get('location'),url);await res.body?.cancel();if(!url)throw new Error('Redirección fuera de alcance');continue;}
  let length=0;const parts=[];
  for await(const part of res.body){length+=part.length;if(length>2_000_000)throw new Error('Respuesta supera 2 MB');parts.push(part);}
  return {url,status:res.status,headers:res.headers,text:Buffer.concat(parts).toString('utf8'),ms:Date.now()-start,bytes:length};
 }throw new Error('Demasiadas redirecciones');
}
let previous=null,snapshot=null;
try {const context=await readJSON(`${dir}/${kind}-context.json`);previous=context.previous;snapshot=context.snapshot;}catch{incomplete('Sin contexto privado: comparación histórica y metadatos de Supabase no disponibles en esta ejecución.');}
try {
 let robots='';let allowed=false;
 try {const r=await get('/robots.txt');if(r.status===200){robots=r.text;allowed=true;}else if(r.status===404){allowed=true;add('robots','robots.txt no disponible','HTTP 404','Publicar reglas de rastreo explícitas.');}else incomplete(`Rastreo detenido: robots.txt responde HTTP ${r.status}.`);check('robots');}
 catch {incomplete('No se pudo leer robots.txt; no se rastrean páginas.');}
 if(kind==='seo'){
  report.coverage.push('SEO técnico y señales AEO/GEO en HTML servido, sin ejecutar JavaScript; hasta 20 páginas públicas, seleccionadas de forma determinista del sitemap.');
  report.limitations.push('Sin Search Console/GA4, posiciones, indexación real, backlinks, menciones externas ni respuestas de asistentes IA.','Citabilidad y calidad de respuestas: heurísticas de estructura, no prueba de citas ni evaluación editorial de veracidad.','Tiempos HTTP de laboratorio; no son Core Web Vitals ni datos reales de usuarios.','No se comprueba todo el sitio, enlaces externos ni recursos privados. llms.txt es una señal orientativa, no requisito de indexación.');
  const urls=new Set([ORIGIN+'/']);
  if(allowed && robotsAllowed(robots,'/sitemap.xml')){
   try {const s=await get('/sitemap.xml');check('sitemap');
    if(s.status!==200 || !/<(?:urlset|sitemapindex)\b/.test(s.text))add('sitemap','Sitemap no válido',`HTTP ${s.status}; XML urlset/sitemapindex=${/<(?:urlset|sitemapindex)\b/.test(s.text)}`,'Revisar sitemap y respuesta XML.','alta','P1');
    else {const doc=new JSDOM(s.text,{contentType:'text/xml'}).window.document;
     if(doc.querySelector('sitemapindex'))incomplete('Sitemap índice: esta versión no recorre sus sitemaps hijos.');
     const all=[...doc.querySelectorAll('url > loc')].map(n=>safeUrl(n.textContent)).filter(Boolean).sort();
     report.measurements.sitemapUrls=all.length;
     // Evenly distributed stable sample, plus homepage.
     for(let i=0;i<Math.min(19,all.length);i++)urls.add(all[Math.floor(i*all.length/Math.min(19,all.length))]);
    }
   }catch{incomplete('No se pudo analizar el sitemap.');}
  }
  if(allowed&&robotsAllowed(robots,'/llms.txt'))try{
   const l=await get('/llms.txt');check('llms');report.measurements.llms={status:l.status,bytes:l.bytes};
   if(l.status!==200||!/^#\s/m.test(l.text))add('llms','Revisar llms.txt',`HTTP ${l.status}; cabecera Markdown=${/^#\s/m.test(l.text)}`,'Publicar resumen y enlaces actuales para asistentes.','baja','P3');
  }catch{incomplete('llms.txt no comprobado.');}
  if(allowed){
   for(const agent of ['Googlebot','Bingbot','GPTBot','OAI-SearchBot','ChatGPT-User','PerplexityBot','Google-Extended']){
    const id=`crawler:${agent}`;check(id);const ok=robotsAllowed(robots,'/',agent);
    if(!ok)add(id,`${agent}: portada bloqueada en robots`,'Disallow aplicable a /','Confirmar si el bloqueo es intencional; bots de entrenamiento y búsqueda tienen fines distintos.','informativa','P3');
   }
   const contentHashes=new Map();const finalUrls=new Set();
   for(const url of urls){
    if(!robotsAllowed(robots,new URL(url).pathname)){report.limitations.push(`No rastreada por robots: ${url}`);continue;}
    try{
     const p=await get(url);const id=`page:${url}`;
     report.measurements.pages.push({url,status:p.status,ms:p.ms,bytes:p.bytes});
     check(`${id}:http`);
     if(p.status!==200){add(`${id}:http`,'Página no accesible',`${url}: HTTP ${p.status}`,'Corregir estado HTTP o retirar del sitemap.','alta','P1');continue;}
     if(finalUrls.has(p.url)){report.measurements.pages.at(-1).redirectDuplicate=true;continue;}
     finalUrls.add(p.url);
     const doc=new JSDOM(p.text).window.document;
     const title=doc.querySelector('title')?.textContent?.trim()||'';
     const description=doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
     const canonical=doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
     const h1=doc.querySelectorAll('h1').length;
     for(const [suffix,ok,titleText,evidence,action]of[
      ['title',title.length>0,'Falta título',`${url}: título vacío`,'Añadir título específico.'],
      ['description',!!description,'Falta descripción',`${url}: meta description ausente`,'Describir el servicio y la intención de búsqueda.'],
      ['canonical',!!canonical&&safeUrl(canonical,p.url)===p.url,'Canonical ausente o diferente',`${url}: canonical ${canonical?safeUrl(canonical,p.url)||'fuera del sitio':'ausente'}`,'Comprobar URL canónica frente al destino final y sitemap.'],
      ['h1',h1===1,'Revisar encabezado principal',`${url}: ${h1} elementos h1`,'Mantener un encabezado principal descriptivo.'],
      ['index',!(/noindex/i.test(doc.querySelector('meta[name="robots"]')?.getAttribute('content')||'')||/noindex/i.test(p.headers.get('x-robots-tag')||'')),'URL del sitemap con noindex',url,'Alinear sitemap y directivas de indexación.']]){
       check(`${id}:${suffix}`);if(!ok)add(`${id}:${suffix}`,titleText,evidence,action);
     }
     let valid=0,invalid=0;const types=[];
     for(const node of doc.querySelectorAll('script[type="application/ld+json"]'))try{const parsed=JSON.parse(node.textContent);valid++;const walk=v=>{if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object'){if(v['@type'])types.push(v['@type']);Object.values(v).forEach(walk);}};walk(parsed);}catch{invalid++;}
     check(`${id}:schema`);
     if(!valid||invalid)add(`${id}:schema`,'Revisar datos estructurados',`${url}: bloques válidos ${valid}, errores JSON ${invalid}`,'Validar JSON-LD, propiedades y correspondencia con contenido visible.');
     doc.querySelectorAll('script,style,nav,footer,header').forEach(n=>n.remove());
     const text=doc.body.textContent.replace(/\s+/g,' ').trim();const words=text.split(/\s+/).filter(Boolean).length;
     const hash=createHash('sha256').update(text).digest('hex');
     check(`${id}:duplicate`);if(contentHashes.has(hash))add(`${id}:duplicate`,'Contenido principal idéntico',`${url} y ${contentHashes.get(hash)}`,'Revisar prerender y diferenciación de páginas.');else contentHashes.set(hash,url);
     const answers=[...doc.querySelectorAll('h2,h3')].filter(n=>/[¿?]/.test(n.textContent)&&((n.nextElementSibling?.textContent||'').trim().length>50)).length;
     check(`${id}:answer`);if(words<100 || !answers)add(`${id}:answer`,'Oportunidad de respuesta directa',`${url}: ${words} palabras, ${answers} respuestas bajo encabezados de pregunta`,'Revisar manualmente e incluir respuestas útiles y verificables cuando encajen.','baja','P3');
     let broken=0;for(const a of doc.querySelectorAll('a[href^="#"]')){const target=a.getAttribute('href').slice(1);if(target&&!doc.getElementById(target))broken++;}
     check(`${id}:anchors`);if(broken)add(`${id}:anchors`,'Enlaces internos sin destino',`${url}: ${broken} anclas sin ID en HTML servido`,'Comprobar navegación y añadir destinos.','baja','P3');
     Object.assign(report.measurements.pages.at(-1),{titleLength:title.length,h1,words,jsonLdTypes:types,answerBlocks:answers});
    }catch{incomplete(`No se pudo analizar ${url}; no se dan sus hallazgos anteriores por resueltos.`);}
   }
  }
 }else if(kind==='security'){
  report.coverage.push('Cabeceras HTTPS públicas; dependencias del lockfile completo; patrones de secretos en archivos versionados actuales; metadatos de RLS y funciones de Supabase si el gateway está disponible.');
  report.limitations.push('No es pentest: sin explotación, fuzzing, intentos de acceso a datos ajenos ni escrituras de negocio.','Patrones estáticos de secretos pueden dar falsos positivos; no se incluyen valores ni se revisa todo el historial Git.','RLS y permisos de funciones: metadatos no demuestran corrección de autorización; revisión funcional de roles/IDOR pendiente.','MFA, protección de contraseñas filtradas, configuración de Auth, logs privados y reglas Vercel no se consultan con el token limitado.','El código auditado corresponde al commit de GitHub; no prueba que coincida con el frontend o funciones desplegados.');
  if(allowed&&robotsAllowed(robots,'/'))try{
   const p=await get('/');report.measurements.pages.push({url:p.url,status:p.status,ms:p.ms});
   for(const header of ['strict-transport-security','content-security-policy','x-content-type-options','referrer-policy','permissions-policy']){
    const id=`header:${header}`;check(id);const value=p.headers.get(header);report.measurements[header]=!!value;
    if(!value)add(id,`Falta ${header}`,`${p.url}: cabecera ausente`,'Configurar y comprobar la cabecera en Vercel.','media','P2');
   }
   const csp=p.headers.get('content-security-policy')||'';check('csp-eval');
   if(csp.includes("'unsafe-eval'"))add('csp-eval','CSP permite unsafe-eval','Directiva unsafe-eval en CSP','Revisar dependencias y retirar si no es necesaria.');
  }catch{incomplete('Cabeceras HTTP no comprobadas.');}
  try{
   let output;try{output=execFileSync('npm',['audit','--json','--ignore-scripts'],{encoding:'utf8',timeout:120000,maxBuffer:8_000_000,stdio:['ignore','pipe','pipe']});}catch(e){output=e.stdout;}
   const audit=JSON.parse(output);if(audit.error||!audit.vulnerabilities)throw new Error();
   check('dependencies');report.measurements.dependencies=audit.metadata?.vulnerabilities;
   for(const [name,v]of Object.entries(audit.vulnerabilities)){
    const id=`dependency:${name}`;check(id);
    add(id,`Dependencia vulnerable: ${name}`,`Severidad ${v.severity}; rango ${v.range}; avisos ${(v.via||[]).filter(x=>typeof x==='object').map(x=>x.source).join(',')||'transitiva'}`,'Revisar avisos y actualizar con pruebas; no se ejecuta npm audit fix.',({critical:'crítica',high:'alta',moderate:'media',low:'baja'})[v.severity]||'media',['critical','high'].includes(v.severity)?'P1':'P2');
   }
   // Only absence in a successful full audit can resolve old dependency findings.
   for(const f of previous?.findings||[])if(f.check.startsWith('dependency:'))check(f.check);
  }catch{incomplete('Registro npm no disponible o auditoría inválida; dependencias no verificadas.');}
  const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
  for(const file of files){
   if(!/\.(?:[cm]?[jt]sx?|json|ya?ml|toml|sql|env)$/.test(file)&&!/(^|\/)\.env($|\.)/.test(file))continue;
   try{const text=await readFile(file,'utf8');if(text.length>2_000_000)continue;
    const signals=secretSignals(text);
    for(const name of ['private-key','supabase-secret','github-token','service-role-jwt']){const id=`secret:${file}:${name}`;check(id);const found=signals.includes(name);
     if(found)add(id,'Posible secreto versionado',`${file}: patrón ${name}; valor omitido`,'Verificar privadamente, retirar y rotar si se confirma.','alta','P1');
    }
   }catch{incomplete(`Archivo no comprobado: ${file}`);}
  }
  if(snapshot){
   check('db:rls');check('db:searchpath');
   if(snapshot.tables_without_rls?.length)add('db:rls','Tablas públicas sin RLS',snapshot.tables_without_rls.join(', '),'Revisar exposición y definir políticas antes de permitir acceso.','alta','P1');
   if(snapshot.definer_without_search_path?.length)add('db:searchpath','Funciones privilegiadas sin search_path fijo',snapshot.definer_without_search_path.join(', '),'Fijar search_path y revisar permisos.','alta','P1');
   report.measurements.database=snapshot;
   if(snapshot.anon_definer_count>0)add('db:anon','Funciones privilegiadas ejecutables por anon',`${snapshot.anon_definer_count} funciones; no demuestra acceso indebido`,'Revisar guards y mínimo privilegio de cada RPC.','informativa','P3');check('db:anon');
  }else incomplete('No disponibles metadatos de seguridad de Supabase.');
 }else throw new Error('Tipo inválido');
}catch{report.status='failed';report.limitations.push('Fallo del motor: ejecución incompleta; revisar el entorno de auditoría.');}
report.delta=delta(report,previous);
await writeFile(`${dir}/${kind}.json`,JSON.stringify(report,null,2),{mode:0o600});
await writeFile(`${dir}/${kind}.md`,markdown(report),{mode:0o600});
console.log(`Informe ${kind} generado (${report.status}); contenido reservado para almacenamiento privado.`);
