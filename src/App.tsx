import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { XPeakToastProvider } from "@/lib/xpeak-toast";
import { lazy, Suspense } from "react";
const Landing = lazy(() => import("./pages/Landing"));
import NotFound from "./pages/NotFound";
import CookieBanner from "./components/CookieBanner";
import EventCartWidget from "./components/EventCartWidget";

// Code-split heavy routes — loaded on demand
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Privacidad = lazy(() => import("./pages/Privacidad"));
const EliminarCuenta = lazy(() => import("./pages/EliminarCuenta"));
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
const BlogBodaLowCost = lazy(() => import("./pages/BlogBodaLowCost"));
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
const BlogMaestroCeremonias = lazy(() => import("./pages/BlogMaestroCeremonias"));
const BlogMusicaEnVivoBodas = lazy(() => import("./pages/BlogMusicaEnVivoBodas"));
const BlogDJErroresBoda = lazy(() => import("./pages/BlogDJErroresBoda"));
const BlogDJFiestaPrivada = lazy(() => import("./pages/BlogDJFiestaPrivada"));
const BlogComunionCosto = lazy(() => import("./pages/BlogComunionCosto"));
const BlogCantanteBodas = lazy(() => import("./pages/BlogCantanteBodas"));
const BlogDJCorporativo = lazy(() => import("./pages/BlogDJCorporativo"));
const BlogMaquillajeEventos = lazy(() => import("./pages/BlogMaquillajeEventos"));
const BlogSaxofonistaBodas = lazy(() => import("./pages/BlogSaxofonistaBodas"));
const BlogTecnicoSonido = lazy(() => import("./pages/BlogTecnicoSonido"));
const BlogPersonalImagen = lazy(() => import("./pages/BlogPersonalImagen"));
const HubDJ = lazy(() => import("./pages/HubDJ"));
const HubBodas = lazy(() => import("./pages/HubBodas"));
const HubStaff = lazy(() => import("./pages/HubStaff"));
const BlogDJComunion = lazy(() => import("./pages/BlogDJComunion"));
const BlogFotografoComunion = lazy(() => import("./pages/BlogFotografoComunion"));
const BlogContratoDJ = lazy(() => import("./pages/BlogContratoDJ"));
const BodasLanding = lazy(() => import("./pages/BodasLanding"));
const PresupuestoBoda = lazy(() => import("./pages/PresupuestoBoda"));
const HubFotografia = lazy(() => import("./pages/HubFotografia"));
const HubComuniones = lazy(() => import("./pages/HubComuniones"));
const BlogDJBodaMadrid = lazy(() => import("./pages/BlogDJBodaMadrid"));
const BlogDJBodaBarcelona = lazy(() => import("./pages/BlogDJBodaBarcelona"));
const BlogDJBodaValencia = lazy(() => import("./pages/BlogDJBodaValencia"));
const BlogFotografoComunionMadrid = lazy(() => import("./pages/BlogFotografoComunionMadrid"));
const BlogConseguirBolosDJ = lazy(() => import("./pages/BlogConseguirBolosDJ"));
const BlogTrabajarCamareroEventos = lazy(() => import("./pages/BlogTrabajarCamareroEventos"));
const BlogFotografoConseguirClientes = lazy(() => import("./pages/BlogFotografoConseguirClientes"));
const BlogComoSerPromotorEventos = lazy(() => import("./pages/BlogComoSerPromotorEventos"));
const BlogMaquilladoraConseguirClientes = lazy(() => import("./pages/BlogMaquilladoraConseguirClientes"));
const BlogRRPPDiscoteca = lazy(() => import("./pages/BlogRRPPDiscoteca"));
const DirectorioPublico = lazy(() => import("./pages/DirectorioPublico"));
const BlogDJBodaBilbao = lazy(() => import("./pages/BlogDJBodaBilbao"));
const BlogDJBodaMallorca = lazy(() => import("./pages/BlogDJBodaMallorca"));
const BlogFotografoBoda = lazy(() => import("./pages/BlogFotografoBoda"));
const BlogFotografoBodaBilbao = lazy(() => import("./pages/BlogFotografoBodaBilbao"));
const BlogFotografoBodaMalaga = lazy(() => import("./pages/BlogFotografoBodaMalaga"));
const BlogFotografoBodaMallorca = lazy(() => import("./pages/BlogFotografoBodaMallorca"));
const BlogFotografoBodaValencia = lazy(() => import("./pages/BlogFotografoBodaValencia"));
const BlogFotografoBodaSevilla = lazy(() => import("./pages/BlogFotografoBodaSevilla"));
const BlogDJBodaSevilla = lazy(() => import("./pages/BlogDJBodaSevilla"));
const BlogDJBodaMalaga = lazy(() => import("./pages/BlogDJBodaMalaga"));
const BlogFotografoBodaMadrid = lazy(() => import("./pages/BlogFotografoBodaMadrid"));
const BlogFotografoBodaBarcelona = lazy(() => import("./pages/BlogFotografoBodaBarcelona"));
const BlogDJBodaZaragoza = lazy(() => import("./pages/BlogDJBodaZaragoza"));
const BlogDJBodaGranada = lazy(() => import("./pages/BlogDJBodaGranada"));
const BlogDJBodaIbiza = lazy(() => import("./pages/BlogDJBodaIbiza"));
const BlogDJBodaMurcia = lazy(() => import("./pages/BlogDJBodaMurcia"));
const BlogDJBodaAlicante = lazy(() => import("./pages/BlogDJBodaAlicante"));
const BlogFotografoBodaGranada = lazy(() => import("./pages/BlogFotografoBodaGranada"));
const BlogFotografoBodaAlicante = lazy(() => import("./pages/BlogFotografoBodaAlicante"));
const BlogFotografoBodaZaragoza = lazy(() => import("./pages/BlogFotografoBodaZaragoza"));
const BlogFotografoBodaTenerife = lazy(() => import("./pages/BlogFotografoBodaTenerife"));
const BlogFotografoBodaMurcia = lazy(() => import("./pages/BlogFotografoBodaMurcia"));
const BlogFotografoBodaCordoba = lazy(() => import("./pages/BlogFotografoBodaCordoba"));
const BlogGrupoMusicalBoda = lazy(() => import("./pages/BlogGrupoMusicalBoda"));
const BlogDJTechnoMadrid = lazy(() => import("./pages/BlogDJTechnoMadrid"));
const BlogChecklistEventoSala = lazy(() => import("./pages/BlogChecklistEventoSala"));
const BlogAntelacionReservasBoda = lazy(() => import("./pages/BlogAntelacionReservasBoda"));
const BlogFlashBookingComoFunciona = lazy(() => import("./pages/BlogFlashBookingComoFunciona"));
const BlogPersonalExtraHosteleria = lazy(() => import("./pages/BlogPersonalExtraHosteleria"));
const BlogDiscoMovilVerbenas = lazy(() => import("./pages/BlogDiscoMovilVerbenas"));
const BlogFiestaVillaIbiza = lazy(() => import("./pages/BlogFiestaVillaIbiza"));
const BlogFotografoComunionBarcelona = lazy(() => import("./pages/BlogFotografoComunionBarcelona"));
const BlogCateringBodaPrecio = lazy(() => import("./pages/BlogCateringBodaPrecio"));
const BlogOrganizarFiestaEmpresa = lazy(() => import("./pages/BlogOrganizarFiestaEmpresa"));
const BlogDJBodaCordoba = lazy(() => import("./pages/BlogDJBodaCordoba"));
const BlogDJBodaValladolid = lazy(() => import("./pages/BlogDJBodaValladolid"));
const BlogDJBodaACoruna = lazy(() => import("./pages/BlogDJBodaACoruna"));
const BlogDJBodaTenerife = lazy(() => import("./pages/BlogDJBodaTenerife"));
const BlogDJBodaSanSebastian = lazy(() => import("./pages/BlogDJBodaSanSebastian"));
const BlogDJBodaVitoria = lazy(() => import("./pages/BlogDJBodaVitoria"));
const BlogDJBodaPamplona = lazy(() => import("./pages/BlogDJBodaPamplona"));
const BlogDJBodaSantander = lazy(() => import("./pages/BlogDJBodaSantander"));
const BlogDJBodaOviedo = lazy(() => import("./pages/BlogDJBodaOviedo"));
const BlogDJBodaVigo = lazy(() => import("./pages/BlogDJBodaVigo"));
const BlogDJBodaSantiago = lazy(() => import("./pages/BlogDJBodaSantiago"));
const BlogDJBodaLogrono = lazy(() => import("./pages/BlogDJBodaLogrono"));
const BlogDJBodaBurgos = lazy(() => import("./pages/BlogDJBodaBurgos"));
const BlogDJBodaSalamanca = lazy(() => import("./pages/BlogDJBodaSalamanca"));
const BlogDJBodaLeon = lazy(() => import("./pages/BlogDJBodaLeon"));
const BlogDJBodaToledo = lazy(() => import("./pages/BlogDJBodaToledo"));
const BlogDJBodaCadiz = lazy(() => import("./pages/BlogDJBodaCadiz"));
const BlogDJBodaHuelva = lazy(() => import("./pages/BlogDJBodaHuelva"));
const BlogDJBodaAlmeria = lazy(() => import("./pages/BlogDJBodaAlmeria"));
const BlogDJBodaJaen = lazy(() => import("./pages/BlogDJBodaJaen"));
const BlogDJBodaLasPalmas = lazy(() => import("./pages/BlogDJBodaLasPalmas"));
const BlogDJBodaBadajoz = lazy(() => import("./pages/BlogDJBodaBadajoz"));
const BlogDJBodaCaceres = lazy(() => import("./pages/BlogDJBodaCaceres"));
const BlogDJBodaGirona = lazy(() => import("./pages/BlogDJBodaGirona"));
const BlogDJBodaTarragona = lazy(() => import("./pages/BlogDJBodaTarragona"));
const BlogDJBodaLleida = lazy(() => import("./pages/BlogDJBodaLleida"));
const BlogDJBodaCastellon = lazy(() => import("./pages/BlogDJBodaCastellon"));
const BlogDJBodaAlbacete = lazy(() => import("./pages/BlogDJBodaAlbacete"));
const PlantillaContratoDJ = lazy(() => import("./pages/PlantillaContratoDJ"));
const BlogComoContratarDJ = lazy(() => import("./pages/BlogComoContratarDJ"));
const BlogDJEmpresa = lazy(() => import("./pages/BlogDJEmpresa"));
const BlogCalculadoraTarifaDJ = lazy(() => import("./pages/BlogCalculadoraTarifaDJ"));

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
            <Route path="/eliminar-cuenta" element={<EliminarCuenta />} />
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
            <Route path="/contratar-peluqueria" element={<CategoryLanding />} />
            <Route path="/contratar-promotores" element={<CategoryLanding />} />
            <Route path="/contratar-vestuario" element={<CategoryLanding />} />
            <Route path="/contratar-disco-movil" element={<CategoryLanding />} />
            <Route path="/contratar-humorista" element={<CategoryLanding />} />
            <Route path="/contratar-animador" element={<CategoryLanding />} />
            <Route path="/contratar-animadores" element={<CategoryLanding />} />
            <Route path="/contratar-speaker" element={<CategoryLanding />} />
            <Route path="/contratar-mago" element={<CategoryLanding />} />
            <Route path="/contratar-bailarin" element={<CategoryLanding />} />
            <Route path="/contratar-payaso" element={<CategoryLanding />} />
            <Route path="/contratar-payasos" element={<CategoryLanding />} />
            {/* City landings */}
            <Route path="/contratar-dj/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-camareros/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-staff/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-fotografo/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-catering/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-disco-movil/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-speaker/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-mago/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-bailarin/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-humorista/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-monologo/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-monologos/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-maquillaje/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-peluqueria/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-promotores/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-animador/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-animadores/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-payaso/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-payasos/:ciudad" element={<CityLanding />} />
            {/* Blog */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/cuanto-cobra-un-dj-en-espana" element={<BlogDJPrecio />} />
            <Route path="/blog/cuanto-cobra-un-camarero-de-eventos" element={<BlogCamarerosPrecio />} />
            <Route path="/blog/cuantos-camareros-necesito-para-mi-boda" element={<BlogCuantosCalmarerosBoda />} />
            <Route path="/blog/dj-para-bodas-vs-discoteca" element={<BlogDJBodaVsDiscoteca />} />
            <Route path="/blog/cuanto-cuesta-una-boda-en-espana" element={<BlogCosteBoda />} />
            <Route path="/blog/boda-low-cost-checklist-completo" element={<BlogBodaLowCost />} />
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
            <Route path="/blog/maestro-de-ceremonias-boda-precio-guia" element={<BlogMaestroCeremonias />} />
            <Route path="/blog/musica-en-vivo-para-bodas" element={<BlogMusicaEnVivoBodas />} />
            <Route path="/blog/10-errores-contratar-dj-boda" element={<BlogDJErroresBoda />} />
            <Route path="/blog/dj-para-fiesta-privada-precio" element={<BlogDJFiestaPrivada />} />
            <Route path="/blog/cuanto-cuesta-una-comunion-en-espana" element={<BlogComunionCosto />} />
            <Route path="/blog/cantante-para-bodas-precio" element={<BlogCantanteBodas />} />
            <Route path="/blog/dj-para-eventos-corporativos-precio" element={<BlogDJCorporativo />} />
            <Route path="/blog/maquilladora-para-eventos-precio" element={<BlogMaquillajeEventos />} />
            <Route path="/blog/saxofonista-para-bodas-precio" element={<BlogSaxofonistaBodas />} />
            <Route path="/blog/tecnico-de-sonido-para-eventos" element={<BlogTecnicoSonido />} />
            <Route path="/blog/personal-de-imagen-ferias-y-congresos" element={<BlogPersonalImagen />} />
            {/* Nuevos artículos */}
            <Route path="/blog/dj-para-comunion-precio" element={<BlogDJComunion />} />
            <Route path="/blog/fotografo-para-comunion-precio" element={<BlogFotografoComunion />} />
            <Route path="/blog/contrato-dj-que-debe-incluir" element={<BlogContratoDJ />} />
            {/* Hub pages */}
            <Route path="/blog/dj-para-eventos" element={<HubDJ />} />
            <Route path="/blog/profesionales-bodas" element={<HubBodas />} />
            <Route path="/blog/staff-para-eventos" element={<HubStaff />} />
            <Route path="/blog/fotografos-eventos" element={<HubFotografia />} />
            <Route path="/blog/comuniones-guia-completa" element={<HubComuniones />} />
            <Route path="/blog/dj-bodas-madrid" element={<BlogDJBodaMadrid />} />
            <Route path="/blog/dj-bodas-barcelona" element={<BlogDJBodaBarcelona />} />
            <Route path="/blog/dj-bodas-valencia" element={<BlogDJBodaValencia />} />
            <Route path="/blog/fotografo-comunion-madrid" element={<BlogFotografoComunionMadrid />} />
            <Route path="/blog/como-conseguir-bolos-dj" element={<BlogConseguirBolosDJ />} />
            <Route path="/blog/como-trabajar-de-camarero-eventos" element={<BlogTrabajarCamareroEventos />} />
            <Route path="/blog/fotografo-como-conseguir-clientes" element={<BlogFotografoConseguirClientes />} />
            <Route path="/blog/como-ser-promotor-eventos" element={<BlogComoSerPromotorEventos />} />
            <Route path="/blog/maquilladora-conseguir-clientes" element={<BlogMaquilladoraConseguirClientes />} />
            <Route path="/blog/como-trabajar-de-rrpp-discoteca" element={<BlogRRPPDiscoteca />} />
            {/* Directorio público — sin login */}
            <Route path="/directorio/:rol" element={<DirectorioPublico />} />
            <Route path="/blog/dj-bodas-sevilla" element={<BlogDJBodaSevilla />} />
            <Route path="/blog/dj-bodas-bilbao" element={<BlogDJBodaBilbao />} />
            <Route path="/blog/dj-bodas-mallorca" element={<BlogDJBodaMallorca />} />
            <Route path="/blog/fotografo-boda-valencia" element={<BlogFotografoBodaValencia />} />
            <Route path="/blog/fotografo-boda-sevilla" element={<BlogFotografoBodaSevilla />} />
            <Route path="/blog/dj-bodas-malaga" element={<BlogDJBodaMalaga />} />
            <Route path="/blog/dj-bodas-zaragoza" element={<BlogDJBodaZaragoza />} />
            <Route path="/blog/dj-bodas-granada" element={<BlogDJBodaGranada />} />
            <Route path="/blog/dj-bodas-ibiza" element={<BlogDJBodaIbiza />} />
            <Route path="/blog/dj-bodas-murcia" element={<BlogDJBodaMurcia />} />
            <Route path="/blog/dj-bodas-alicante" element={<BlogDJBodaAlicante />} />
            <Route path="/blog/dj-bodas-cordoba" element={<BlogDJBodaCordoba />} />
            <Route path="/blog/dj-bodas-valladolid" element={<BlogDJBodaValladolid />} />
            <Route path="/blog/dj-bodas-a-coruna" element={<BlogDJBodaACoruna />} />
            <Route path="/blog/dj-bodas-tenerife" element={<BlogDJBodaTenerife />} />
            <Route path="/blog/dj-bodas-san-sebastian" element={<BlogDJBodaSanSebastian />} />
            <Route path="/blog/dj-bodas-vitoria" element={<BlogDJBodaVitoria />} />
            <Route path="/blog/dj-bodas-pamplona" element={<BlogDJBodaPamplona />} />
            <Route path="/blog/dj-bodas-santander" element={<BlogDJBodaSantander />} />
            <Route path="/blog/dj-bodas-oviedo" element={<BlogDJBodaOviedo />} />
            <Route path="/blog/dj-bodas-vigo" element={<BlogDJBodaVigo />} />
            <Route path="/blog/dj-bodas-santiago" element={<BlogDJBodaSantiago />} />
            <Route path="/blog/dj-bodas-logrono" element={<BlogDJBodaLogrono />} />
            <Route path="/blog/dj-bodas-burgos" element={<BlogDJBodaBurgos />} />
            <Route path="/blog/dj-bodas-salamanca" element={<BlogDJBodaSalamanca />} />
            <Route path="/blog/dj-bodas-leon" element={<BlogDJBodaLeon />} />
            <Route path="/blog/dj-bodas-toledo" element={<BlogDJBodaToledo />} />
            <Route path="/blog/dj-bodas-cadiz" element={<BlogDJBodaCadiz />} />
            <Route path="/blog/dj-bodas-huelva" element={<BlogDJBodaHuelva />} />
            <Route path="/blog/dj-bodas-almeria" element={<BlogDJBodaAlmeria />} />
            <Route path="/blog/dj-bodas-jaen" element={<BlogDJBodaJaen />} />
            <Route path="/blog/dj-bodas-las-palmas" element={<BlogDJBodaLasPalmas />} />
            <Route path="/blog/dj-bodas-badajoz" element={<BlogDJBodaBadajoz />} />
            <Route path="/blog/dj-bodas-caceres" element={<BlogDJBodaCaceres />} />
            <Route path="/blog/dj-bodas-girona" element={<BlogDJBodaGirona />} />
            <Route path="/blog/dj-bodas-tarragona" element={<BlogDJBodaTarragona />} />
            <Route path="/blog/dj-bodas-lleida" element={<BlogDJBodaLleida />} />
            <Route path="/blog/dj-bodas-castellon" element={<BlogDJBodaCastellon />} />
            <Route path="/blog/dj-bodas-albacete" element={<BlogDJBodaAlbacete />} />
            <Route path="/plantilla-contrato-dj" element={<PlantillaContratoDJ />} />
            <Route path="/blog/como-contratar-un-dj" element={<BlogComoContratarDJ />} />
            <Route path="/blog/dj-empresa-precio" element={<BlogDJEmpresa />} />
            <Route path="/blog/calculadora-tarifa-dj" element={<BlogCalculadoraTarifaDJ />} />
            <Route path="/blog/fotografo-boda-madrid" element={<BlogFotografoBodaMadrid />} />
            <Route path="/blog/fotografo-boda-barcelona" element={<BlogFotografoBodaBarcelona />} />
            <Route path="/blog/fotografo-boda" element={<BlogFotografoBoda />} />
            <Route path="/blog/fotografo-boda-bilbao" element={<BlogFotografoBodaBilbao />} />
            <Route path="/blog/fotografo-boda-malaga" element={<BlogFotografoBodaMalaga />} />
            <Route path="/blog/fotografo-boda-mallorca" element={<BlogFotografoBodaMallorca />} />
            <Route path="/blog/fotografo-boda-granada" element={<BlogFotografoBodaGranada />} />
            <Route path="/blog/fotografo-boda-alicante" element={<BlogFotografoBodaAlicante />} />
            <Route path="/blog/fotografo-boda-zaragoza" element={<BlogFotografoBodaZaragoza />} />
            <Route path="/blog/fotografo-boda-tenerife" element={<BlogFotografoBodaTenerife />} />
            <Route path="/blog/fotografo-boda-murcia" element={<BlogFotografoBodaMurcia />} />
            <Route path="/blog/fotografo-boda-cordoba" element={<BlogFotografoBodaCordoba />} />
            <Route path="/blog/grupo-musical-para-boda-precio" element={<BlogGrupoMusicalBoda />} />
            <Route path="/blog/dj-techno-madrid" element={<BlogDJTechnoMadrid />} />
            <Route path="/blog/checklist-organizar-evento-sala" element={<BlogChecklistEventoSala />} />
            <Route path="/blog/antelacion-reservar-proveedores-boda" element={<BlogAntelacionReservasBoda />} />
            <Route path="/blog/como-funciona-flash-booking-xpeak" element={<BlogFlashBookingComoFunciona />} />
            <Route path="/blog/personal-extra-hosteleria-temporada" element={<BlogPersonalExtraHosteleria />} />
            <Route path="/blog/disco-movil-verbenas-fiestas-pueblo" element={<BlogDiscoMovilVerbenas />} />
            <Route path="/blog/fiesta-privada-villa-ibiza" element={<BlogFiestaVillaIbiza />} />
            <Route path="/blog/fotografo-comunion-barcelona" element={<BlogFotografoComunionBarcelona />} />
            <Route path="/blog/catering-boda-precio-por-persona" element={<BlogCateringBodaPrecio />} />
            <Route path="/blog/como-organizar-fiesta-de-empresa" element={<BlogOrganizarFiestaEmpresa />} />
            <Route path="/bodas" element={<BodasLanding />} />
            <Route path="/presupuesto-boda" element={<PresupuestoBoda />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
        <EventCartWidget />
      </BrowserRouter>
    </TooltipProvider>
    </XPeakToastProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
