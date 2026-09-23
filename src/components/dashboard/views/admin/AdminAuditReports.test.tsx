import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
import AdminAuditReports from './AdminAuditReports';
const {limit}=vi.hoisted(()=>({limit:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{from:()=>({select:()=>({order:()=>({limit})})})}}));
afterEach(cleanup);
beforeEach(()=>vi.clearAllMocks());
describe('informes privados del administrador',()=>{
 it('muestra el informe parcial y representa HTML como texto',async()=>{
  limit.mockResolvedValue({data:[{id:'seo-2026-09-24',kind:'seo',scheduled_date:'2026-09-24',created_at:new Date().toISOString(),status:'partial',markdown:'<script>malicioso</script> Evidencia'}],error:null});
  const {container}=render(<AdminAuditReports/>);
  await waitFor(()=>expect(screen.getByText('Cobertura parcial')).toBeTruthy());
  fireEvent.click(screen.getByText('SEO, AEO y GEO · 2026-09-24'));
  expect(screen.getByText('<script>malicioso</script> Evidencia')).toBeTruthy();
  expect(container.querySelector('script')).toBeNull();
  fireEvent.click(screen.getByText('Cerrar informe'));
  expect(container.querySelector('pre')).toBeNull();
 });
 it('una consulta denegada no se presenta como ausencia de problemas',async()=>{
  limit.mockResolvedValue({data:null,error:{message:'denied'}});render(<AdminAuditReports/>);
  await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('No se pudieron cargar'));
 });
 it('avisa cuando nunca se ejecutó',async()=>{
  limit.mockResolvedValue({data:[],error:null});render(<AdminAuditReports/>);
  await waitFor(()=>expect(screen.getAllByText(/todavía no hay informes/)).toHaveLength(2));
 });
});
