import {handler} from './index.ts';
const token='t'.repeat(48);
function assert(ok:unknown,message='assertion failed'):asserts ok{if(!ok)throw new Error(message);}
const request=(body:unknown,auth=token)=>new Request('http://localhost/',{method:'POST',headers:{authorization:`Bearer ${auth}`},body:JSON.stringify(body)});
Deno.test('fails closed without token, rejects bad auth/method/input',async()=>{
 Deno.env.delete('AUDIT_RUNNER_TOKEN');assert((await handler(request({}))).status===503);
 Deno.env.set('AUDIT_RUNNER_TOKEN',token);
 assert((await handler(request({},'wrong'))).status===401);
 assert((await handler(new Request('http://localhost/',{headers:{authorization:`Bearer ${token}`}}))).status===405);
 assert((await handler(request({kind:'arbitrary',date:'2026-09-25'}))).status===400);
 assert((await handler(request({kind:'seo',date:'x&select=*'}))).status===400);
});
Deno.test('private persistence, previous report and idempotent completed run',async()=>{
 Deno.env.set('AUDIT_RUNNER_TOKEN',token);Deno.env.set('SUPABASE_URL','https://example.invalid');Deno.env.set('SUPABASE_SERVICE_ROLE_KEY','test-only');
 const original=globalThis.fetch;const rows:Record<string,any>={};
 globalThis.fetch=(async(input:RequestInfo|URL,init?:RequestInit)=>{
  const u=new URL(String(input));assert(u.origin==='https://example.invalid');
  assert((init?.headers as Record<string,string>).apikey==='test-only');
  const id=u.searchParams.get('id')?.slice(3);
  if(init?.method==='POST'){const row=JSON.parse(String(init.body));rows[row.id]=row;return new Response(null,{status:204});}
  if(init?.method==='PATCH'){assert(id);rows[id]=JSON.parse(String(init.body));return new Response(null,{status:204});}
  return Response.json(id?(rows[id]?[rows[id]]:[]):Object.values(rows).filter(r=>r.status==='complete').map(r=>({report:r.report})));
 }) as typeof fetch;
 try{
  const data={kind:'seo',date:'2026-09-24'};const report={id:'seo-2026-09-24',kind:'seo',status:'partial',findings:[]};
  assert((await handler(request({...data,action:'save',report,markdown:'Informe parcial'}))).status===200);
  assert(rows[report.id].status==='partial');
  report.status='complete';assert((await handler(request({...data,action:'save',report,markdown:'Completo'}))).status===200);
  const duplicate=await handler(request({...data,action:'save',report,markdown:'No sobrescribir'}));
  assert((await duplicate.json()).duplicate===true);assert(rows[report.id].markdown==='Completo');
  const previous=await handler(request({...data,date:'2026-10-01',action:'previous'}));assert((await previous.json()).id===report.id);
  assert((await handler(request({...data,action:'save',report:{...report,id:'other'},markdown:'x'}))).status===400);
 }finally{globalThis.fetch=original;}
});
Deno.test('database errors return only generic text; oversized input rejected',async()=>{
 const original=globalThis.fetch;globalThis.fetch=(()=>Promise.resolve(new Response('secret database content',{status:500}))) as typeof fetch;
 try {const res=await handler(request({action:'previous',kind:'security',date:'2026-09-25'}));assert(res.status===500);assert(!(await res.text()).includes('secret'));}
 finally{globalThis.fetch=original;}
 assert((await handler(request({text:'a'.repeat(1_500_001)}))).status===413);
});
