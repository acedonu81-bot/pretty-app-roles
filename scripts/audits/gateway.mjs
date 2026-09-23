import {readFile,writeFile,mkdir,appendFile} from 'node:fs/promises';
import {slot,markdown as renderMarkdown,VERSION} from './core.mjs';
const [action,kind]=process.argv.slice(2);
if(!['prepare','publish'].includes(action)||!['seo','security'].includes(kind))throw new Error('Argumentos inválidos');
const dir=process.env.AUDIT_DIR||'/tmp/xpeak-audits';
const date=process.env.AUDIT_DATE||slot(kind);
const token=process.env.AUDIT_RUNNER_TOKEN;
if(!token||token.length<40)throw new Error('Falta configurar AUDIT_RUNNER_TOKEN');
const call=async(data)=>{
 const r=await fetch('https://ddrqhwravupjzysriblq.supabase.co/functions/v1/weekly-audit-gateway',{
 method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({...data,kind,date}),signal:AbortSignal.timeout(30000)});
 if(!r.ok)throw new Error(`Gateway de auditorías: HTTP ${r.status}`);
 return r.json();
};
await mkdir(dir,{recursive:true,mode:0o700});
if(action==='prepare'){
 const exists=await call({action:'exists'});
 const skip=exists?.status==='complete';
 if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,`skip=${skip}\ndate=${date}\n`);
 if(!skip){const previous=await call({action:'previous'});let snapshot=null;
  if(kind==='security')try{snapshot=await call({action:'snapshot'});}catch{/* Explicit incomplete coverage in report. */}
  await writeFile(`${dir}/${kind}-context.json`,JSON.stringify({previous,snapshot}),{mode:0o600});
 }
}else{
 let report,markdown;
 try{report=JSON.parse(await readFile(`${dir}/${kind}.json`,'utf8'));markdown=await readFile(`${dir}/${kind}.md`,'utf8');}
 catch{report={id:`${kind}-${date}`,kind,date,version:VERSION,startedAt:new Date().toISOString(),commit:process.env.GITHUB_SHA||'desconocido',status:'failed',findings:[],checked:[],coverage:[],limitations:['La ejecución falló antes de generar el informe. Revisar el estado de GitHub Actions.'],measurements:{},delta:{baseline:false}};markdown=renderMarkdown(report);}
 const result=await call({action:'save',report,markdown});if(!result.saved)throw new Error('No se confirmó el guardado');
 if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,`Auditoría ${kind} del ${date}: informe guardado. Consulta **Xpeak → Administración → Salud del sistema → Auditorías semanales**.\n`);
 // A persisted partial report must not look like a successful full audit.
 if(report.status!=='complete')process.exitCode=1;
}
