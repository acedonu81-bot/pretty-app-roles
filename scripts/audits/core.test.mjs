import test from 'node:test';
import assert from 'node:assert/strict';
import {slot,safeUrl,robotsAllowed,delta,markdown,secretSignals} from './core.mjs';
test('Madrid 09:00 invierno, verano y ambos cambios de hora',()=>{
 for(const [now,kind,date] of [
 ['2026-01-08T08:00:00Z','seo','2026-01-08'],['2026-07-02T07:00:00Z','seo','2026-07-02'],
 ['2026-03-26T08:00:00Z','seo','2026-03-26'],['2026-04-02T07:00:00Z','seo','2026-04-02'],
 ['2026-10-23T07:00:00Z','security','2026-10-23'],['2026-10-30T08:00:00Z','security','2026-10-30'],
 ['2026-09-24T06:59:00Z','seo','2026-09-17'],['2026-09-25T07:00:00Z','security','2026-09-25'],
 ['2026-09-26T12:00:00Z','seo','2026-09-24']]) assert.equal(slot(kind,new Date(now)),date);
});
test('URL allowlist bloquea hosts, credenciales y consultas',()=>{
 for(const url of ['http://www.xpeak.es','https://www.xpeak.es.evil.com','https://user@xpeak.es','https://127.0.0.1','https://xpeak.es:8443','https://xpeak.es/?token=x'])assert.equal(safeUrl(url),null);
 assert.equal(safeUrl('/hola#id'),'https://www.xpeak.es/hola');
});
test('robots wildcard, grupos específicos, precedencia allow y fin de cadena',()=>{
 const r='User-agent: *\nDisallow: /admin\nDisallow: /private/*\nAllow: /private/open$\nUser-agent: GPTBot\nDisallow: /';
 assert.equal(robotsAllowed(r,'/admin'),false);assert.equal(robotsAllowed(r,'/'),true);
 assert.equal(robotsAllowed(r,'/private/open'),true);assert.equal(robotsAllowed(r,'/private/open/extra'),false);
 assert.equal(robotsAllowed(r,'/','GPTBot'),false);
 assert.equal(robotsAllowed('User-agent: *\nDisallow: /x\nAllow: /x','/x'),true);
});
test('comparación no da por resuelto lo no reevaluado',()=>{
 const prev={version:1,findings:[{id:'a',check:'a'},{id:'b',check:'b'},{id:'c',check:'c'}]};
 assert.deepEqual(delta({version:1,findings:[{id:'a'},{id:'d'}],checked:['a','b','d']},prev),{baseline:true,new:['d'],persisting:['a'],resolved:['b'],unverified:['c']});
 assert.equal(delta({version:2,findings:[],checked:[]},prev).baseline,false);
});
test('informe español reutilizable sin HTML ejecutable',()=>{
 const m=markdown({kind:'seo',date:'2026-09-24',startedAt:'hoy',status:'partial',version:1,commit:'abc',coverage:['<script>'],findings:[],delta:{baseline:false},limitations:['Sin datos privados'],measurements:{}});
 assert.match(m,/Auditoría SEO, AEO y GEO/);assert.match(m,/Sin datos privados/);assert.ok(!m.includes('<script>'));
});

test('detector de secretos distingue un delimitador de una clave completa',()=>{
 assert.deepEqual(secretSignals("pem.replace('-----BEGIN PRIVATE KEY-----','')"),[]);
 const pem='-----BEGIN PRIVATE KEY-----\n'+'A'.repeat(80)+'\n-----END PRIVATE KEY-----';
 assert.deepEqual(secretSignals(pem),['private-key']);
 const jwt=role=>'eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({role})).toString('base64url')+'.signature';
 assert.deepEqual(secretSignals(jwt('anon')),[]);
 assert.deepEqual(secretSignals(jwt('service_role')),['service-role-jwt']);
});
