// A narrow gateway: GitHub receives only AUDIT_RUNNER_TOKEN, never a database key.
// Deploy with --no-verify-jwt; authentication below is mandatory and fail-closed.
const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
export async function handler(req: Request): Promise<Response> {
  const reply = (status: number, value: unknown) => new Response(JSON.stringify(value), {status, headers});
  const secret = Deno.env.get('AUDIT_RUNNER_TOKEN');
  if (!secret || secret.length < 40) return reply(503, {error:'unconfigured'});
  const provided = req.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  const digest = async (s: string) => new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
  const a = await digest(secret), b = await digest(provided);
  if (a.reduce((n,v,i)=>n | (v ^ b[i]),0)) return reply(401,{error:'unauthorized'});
  if(req.method !== 'POST') return reply(405,{error:'method'});
  try {
    const reader = req.body?.getReader();
    if (!reader) return reply(400,{error:'body'});
    let size=0; const chunks: Uint8Array[]=[];
    for (;;) { const {done,value}=await reader.read(); if(done) break; size+=value.length;
      if(size>1_500_000){await reader.cancel(); return reply(413,{error:'size'});} chunks.push(value); }
    const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
    const body=JSON.parse(new TextDecoder().decode(bytes));
    const root=Deno.env.get('SUPABASE_URL')!;
    const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const db=async(path:string,method='GET',payload?:unknown)=>{
      const r=await fetch(`${root}/rest/v1/${path}`,{method,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:payload===undefined?undefined:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
      if(!r.ok) throw new Error('database');
      return r.status===204 || r.headers.get('content-length')==='0'?null: await r.text();
    };
    if(body.action==='snapshot') return reply(200,JSON.parse(await db('rpc/weekly_audit_security_snapshot','POST',{}) ?? '{}'));
    if(!['seo','security'].includes(body.kind) || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) return reply(400,{error:'input'});
    const id=`${body.kind}-${body.date}`;
    if(body.action==='previous') {
      const rows=await db(`weekly_audit_reports?kind=eq.${body.kind}&scheduled_date=lt.${body.date}&status=eq.complete&order=scheduled_date.desc&limit=1&select=report`);
      return reply(200,JSON.parse(rows ?? '[]')[0]?.report ?? null);
    }
    if(body.action==='exists') {
      const rows=await db(`weekly_audit_reports?id=eq.${id}&select=status`);
      return reply(200,JSON.parse(rows ?? '[]')[0] ?? null);
    }
    if(body.action!=='save' || body.report?.id!==id || body.report?.kind!==body.kind ||
      !['complete','partial','failed'].includes(body.report?.status) || typeof body.markdown!=='string' ||
      !Array.isArray(body.report?.findings)) return reply(400,{error:'report'});
    // Reruns replace only incomplete attempts, preserving the completed weekly record.
    const existing=JSON.parse(await db(`weekly_audit_reports?id=eq.${id}&select=status`) ?? '[]')[0];
    if(existing?.status==='complete') return reply(200,{saved:true,duplicate:true});
    const row={id,kind:body.kind,scheduled_date:body.date,status:body.report.status,report:body.report,markdown:body.markdown};
    if(existing) await db(`weekly_audit_reports?id=eq.${id}&status=neq.complete`,'PATCH',row);
    else await db('weekly_audit_reports','POST',row);
    return reply(200,{saved:true});
  } catch { return reply(500,{error:'audit_gateway_failed'}); }
}
if (import.meta.main) Deno.serve(handler);
