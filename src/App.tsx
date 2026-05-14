import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { XPeakToastProvider } from "@/lib/xpeak-toast";
import { lazy, Suspense } from "react";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import CookieBanner from "./components/CookieBanner";

// Code-split heavy routes — loaded on demand
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Privacidad = lazy(() => import("./pages/Privacidad"));
const Terminos = lazy(() => import("./pages/Terminos"));
const Cookies = lazy(() => import("./pages/Cookies"));
const AdminBeta = lazy(() => import("./pages/AdminBeta"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const SobreNosotros = lazy(() => import("./pages/SobreNosotros"));
const AvisoLegal = lazy(() => import("./pages/AvisoLegal"));
const CityLanding = lazy(() => import("./pages/CityLanding"));
const CategoryLanding = lazy(() => import("./pages/CategoryLanding"));
const BlogDJPrecio = lazy(() => import("./pages/BlogDJPrecio"));
const BlogCamarerosPrecio = lazy(() => import("./pages/BlogCamarerosPrecio"));
const BlogCuantosCalmarerosBoda = lazy(() => import("./pages/BlogCuantosCalmarerosBoda"));
const BlogDJBodaVsDiscoteca = lazy(() => import("./pages/BlogDJBodaVsDiscoteca"));
const BlogCosteBoda = lazy(() => import("./pages/BlogCosteBoda"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogFotografoBodas = lazy(() => import("./pages/BlogFotografoBodas"));
const BlogStaffDiscoteca = lazy(() => import("./pages/BlogStaffDiscoteca"));
const BlogCateringEmpresas = lazy(() => import("./pages/BlogCateringEmpresas"));
const BlogDiscoMovilComuniones = lazy(() => import("./pages/BlogDiscoMovilComuniones"));
const BlogPromotoresEventos = lazy(() => import("./pages/BlogPromotoresEventos"));
const BlogMaquillajeBoda = lazy(() => import("./pages/BlogMaquillajeBoda"));
const BlogDJCumpleanos = lazy(() => import("./pages/BlogDJCumpleanos"));
const BlogEventoCorporativo = lazy(() => import("./pages/BlogEventoCorporativo"));
const BlogMusicaBoda = lazy(() => import("./pages/BlogMusicaBoda"));
const BlogFotografiaEventosNocturnos = lazy(() => import("./pages/BlogFotografiaEventosNocturnos"));
const BlogPrecioAzafatas = lazy(() => import("./pages/BlogPrecioAzafatas"));
const BlogBarmanEventos = lazy(() => import("./pages/BlogBarmanEventos"));
const BlogDJBodaCivil = lazy(() => import("./pages/BlogDJBodaCivil"));
const Precios = lazy(() => import("./pages/Precios"));
const BajaEmails = lazy(() => import("./pages/BajaEmails"));
const BlogCateringBoda = lazy(() => import("./pages/BlogCateringBoda"));
const BlogVideografoBodas = lazy(() => import("./pages/BlogVideografoBodas"));
const BlogTendenciasBodas = lazy(() => import("./pages/BlogTendenciasBodas"));
const BlogAnimadoresInfantiles = lazy(() => import("./pages/BlogAnimadoresInfantiles"));
const BlogFiestaEmpresa = lazy(() => import("./pages/BlogFiestaEmpresa"));
const BlogWeddingPlanner = lazy(() => import("./pages/BlogWeddingPlanner"));
const BlogContratarPersonalEvento = lazy(() => import("./pages/BlogContratarPersonalEvento"));
const BlogDJResidenteDiscoteca = lazy(() => import("./pages/BlogDJResidenteDiscoteca"));
const BlogCateringComuniones = lazy(() => import("./pages/BlogCateringComuniones"));
const LocalSEOLanding = lazy(() => import("./pages/LocalSEOLanding"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <XPeakToastProvider>
    <TooltipProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#090909' }} />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/admin-beta" element={<AdminBeta />} />
            <Route path="/p/:slug" element={<PublicProfile />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            {/* Category landings */}
            <Route path="/contratar-dj" element={<CategoryLanding />} />
            <Route path="/contratar-staff" element={<CategoryLanding />} />
            <Route path="/contratar-fotografo" element={<CategoryLanding />} />
            <Route path="/contratar-camareros" element={<CategoryLanding />} />
            <Route path="/contratar-catering" element={<CategoryLanding />} />
            <Route path="/contratar-maquillaje" element={<CategoryLanding />} />
            <Route path="/contratar-promotores" element={<CategoryLanding />} />
            <Route path="/contratar-vestuario" element={<CategoryLanding />} />
            <Route path="/contratar-disco-movil" element={<CategoryLanding />} />
            {/* City landings */}
            <Route path="/contratar-dj/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-camareros/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-staff/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-fotografo/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-catering/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-disco-movil/:ciudad" element={<CityLanding />} />
            {/* Blog */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/cuanto-cobra-un-dj-en-espana" element={<BlogDJPrecio />} />
            <Route path="/blog/cuanto-cobra-un-camarero-de-eventos" element={<BlogCamarerosPrecio />} />
            <Route path="/blog/cuantos-camareros-necesito-para-mi-boda" element={<BlogCuantosCalmarerosBoda />} />
            <Route path="/blog/dj-para-bodas-vs-discoteca" element={<BlogDJBodaVsDiscoteca />} />
            <Route path="/blog/cuanto-cuesta-una-boda-en-espana" element={<BlogCosteBoda />} />
            <Route path="/blog/contratar-fotografo-de-bodas" element={<BlogFotografoBodas />} />
            <Route path="/blog/staff-de-discoteca-funciones-y-salario" element={<BlogStaffDiscoteca />} />
            <Route path="/blog/catering-para-eventos-de-empresa" element={<BlogCateringEmpresas />} />
            <Route path="/blog/disco-movil-para-comuniones" element={<BlogDiscoMovilComuniones />} />
            <Route path="/blog/promotores-de-eventos-que-hacen" element={<BlogPromotoresEventos />} />
            <Route path="/blog/maquillaje-nupcial-precio-guia" element={<BlogMaquillajeBoda />} />
            <Route path="/blog/dj-para-cumpleanos-precio" element={<BlogDJCumpleanos />} />
            <Route path="/blog/como-organizar-evento-corporativo" element={<BlogEventoCorporativo />} />
            <Route path="/blog/musica-para-bodas-guia" element={<BlogMusicaBoda />} />
            <Route path="/blog/fotografia-eventos-nocturnos" element={<BlogFotografiaEventosNocturnos />} />
            <Route path="/blog/precio-azafatas-eventos-espana" element={<BlogPrecioAzafatas />} />
            <Route path="/blog/contratar-barman-evento-privado" element={<BlogBarmanEventos />} />
            <Route path="/blog/dj-boda-civil-precio-canciones" element={<BlogDJBodaCivil />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/baja-emails" element={<BajaEmails />} />
            <Route path="/blog/catering-boda-precio-por-persona" element={<BlogCateringBoda />} />
            <Route path="/blog/videografo-bodas-precio" element={<BlogVideografoBodas />} />
            <Route path="/blog/tendencias-bodas-2026" element={<BlogTendenciasBodas />} />
            <Route path="/blog/animadores-infantiles-comuniones-cumpleanos" element={<BlogAnimadoresInfantiles />} />
            <Route path="/blog/como-organizar-fiesta-empresa" element={<BlogFiestaEmpresa />} />
            <Route path="/blog/wedding-planner-precio-espana" element={<BlogWeddingPlanner />} />
            <Route path="/blog/como-contratar-personal-para-un-evento" element={<BlogContratarPersonalEvento />} />
            <Route path="/blog/dj-residente-discoteca-precio" element={<BlogDJResidenteDiscoteca />} />
            <Route path="/blog/catering-comuniones-precio-persona" element={<BlogCateringComuniones />} />
            {/* Local SEO — /dj-madrid, /camareros-barcelona, /fotografo-sevilla, etc. */}
            {['madrid','barcelona','sevilla','valencia','malaga','bilbao'].flatMap(city =>
              ['dj','camareros','fotografo','maquillaje','staff'].map(cat => (
                <Route key={`${cat}-${city}`} path={`/${cat}-${city}`} element={<LocalSEOLanding />} />
              ))
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
    </XPeakToastProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
