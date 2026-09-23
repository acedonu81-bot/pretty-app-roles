import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Audit = {id:string; kind:'seo'|'security'; scheduled_date:string; created_at:string; status:string; markdown:string};

export default function AdminAuditReports() {
  const [reports,setReports]=useState<Audit[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [selected,setSelected]=useState<Audit|null>(null);
  const load=async()=>{
    setLoading(true);setError('');
    const {data,error:queryError}=await supabase.from('weekly_audit_reports' as never)
      .select('id,kind,scheduled_date,created_at,status,markdown').order('scheduled_date',{ascending:false}).limit(26);
    if(queryError)setError('No se pudieron cargar los informes. Puede faltar la activación de las auditorías o el permiso de administrador.');
    else setReports((data ?? []) as unknown as Audit[]);
    setLoading(false);
  };
  useEffect(()=>{void load();},[]);
  const download=(r:Audit)=>{
    const url=URL.createObjectURL(new Blob([r.markdown],{type:'text/markdown;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=`${r.id}.md`;link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  return <section className="mb-6 rounded-xl border p-4" aria-label="Auditorías semanales">
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-bold">Auditorías semanales</h3>
      <button className="text-sm underline" onClick={()=>void load()} disabled={loading}>Actualizar informes</button>
    </div>
    <p className="mt-1 text-sm text-muted-foreground">SEO, AEO y GEO: jueves. Seguridad: viernes. Programadas a las 09:00, hora de Madrid; el inicio puede retrasarse.</p>
    {loading && <p className="mt-3 text-sm" role="status">Cargando informes…</p>}
    {error && <p className="mt-3 text-sm text-amber-700" role="alert">{error}</p>}
    {!loading&&!error&&(['seo','security'] as const).map(kind=>{
      const latest=reports.find(r=>r.kind===kind);
      const stale=!latest||Date.now()-new Date(latest.created_at).getTime()>8*86400000;
      return <p key={kind} className={`mt-2 text-sm ${stale?'text-amber-700':''}`}>
        {kind==='seo'?'SEO, AEO y GEO':'Seguridad'}: {latest?`último informe ${latest.scheduled_date}${stale?' — necesita revisión: lleva más de ocho días sin informe nuevo':''}`:'todavía no hay informes; no se ha confirmado una ejecución.'}
      </p>;
    })}
    <ul className="mt-3 space-y-2">
      {reports.map(r=><li key={r.id} className="flex flex-wrap items-center gap-3 text-sm">
        <button className="underline text-left" onClick={()=>setSelected(r)}>{r.kind==='seo'?'SEO, AEO y GEO':'Seguridad'} · {r.scheduled_date}</button>
        <span>{({complete:'Completada',partial:'Cobertura parcial',failed:'Fallida'} as Record<string,string>)[r.status]||r.status}</span>
        <button className="underline" onClick={()=>download(r)} aria-label={`Descargar ${r.id}`}>Descargar informe</button>
      </li>)}
    </ul>
    {selected&&<div className="mt-4 rounded-lg border p-3">
      <button className="mb-3 text-sm underline" onClick={()=>setSelected(null)}>Cerrar informe</button>
      <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">{selected.markdown}</pre>
    </div>}
    <p className="mt-3 text-xs text-muted-foreground">Informes privados para administradores. Se muestran las últimas 26 ejecuciones; el historial completo se conserva en Supabase.</p>
  </section>;
}
