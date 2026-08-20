import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const SobreNosotros = lazy(() => import("./pages/SobreNosotros"));
const AvisoLegal = lazy(() => import("./pages/AvisoLegal"));
const CityLanding = lazy(() => import("./pages/CityLanding"));
const OccasionLanding = lazy(() => import("./pages/OccasionLanding"));
const Descubrir = lazy(() => import("./pages/Descubrir"));
const CategoryLanding = lazy(() => import("./pages/CategoryLanding"));
const BlogDJPrecio = lazy(() => import("./pages/BlogDJPrecio"));
const BlogMejoresPlataformasContratarDJ = lazy(() => import("./pages/BlogMejoresPlataformasContratarDJ"));
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
const BlogPrecioBailarin = lazy(() => import("./pages/BlogPrecioBailarin"));
const BlogPrecioAzafatasMadrid = lazy(() => import("./pages/BlogPrecioAzafatasMadrid"));
const BlogPrecioAzafatasBarcelona = lazy(() => import("./pages/BlogPrecioAzafatasBarcelona"));
const BlogPrecioAzafatasValencia = lazy(() => import("./pages/BlogPrecioAzafatasValencia"));
const BlogPrecioAzafatasSevilla = lazy(() => import("./pages/BlogPrecioAzafatasSevilla"));
const BlogPrecioAzafatasBilbao = lazy(() => import("./pages/BlogPrecioAzafatasBilbao"));
const BlogPrecioAzafatasMalaga = lazy(() => import("./pages/BlogPrecioAzafatasMalaga"));
const BlogPrecioAzafatasZaragoza = lazy(() => import("./pages/BlogPrecioAzafatasZaragoza"));
const BlogPrecioAzafatasPalma = lazy(() => import("./pages/BlogPrecioAzafatasPalma"));
const BlogPrecioAzafatasIbiza = lazy(() => import("./pages/BlogPrecioAzafatasIbiza"));
const BlogPrecioAzafatasAlicante = lazy(() => import("./pages/BlogPrecioAzafatasAlicante"));
const BlogPrecioAzafatasGranada = lazy(() => import("./pages/BlogPrecioAzafatasGranada"));
const BlogPrecioAzafatasMurcia = lazy(() => import("./pages/BlogPrecioAzafatasMurcia"));
const BlogPrecioAzafatasCordoba = lazy(() => import("./pages/BlogPrecioAzafatasCordoba"));
const BlogPrecioAzafatasValladolid = lazy(() => import("./pages/BlogPrecioAzafatasValladolid"));
const BlogPrecioAzafatasSanSebastian = lazy(() => import("./pages/BlogPrecioAzafatasSanSebastian"));
const BlogPrecioAzafatasSantander = lazy(() => import("./pages/BlogPrecioAzafatasSantander"));
const BlogPrecioAzafatasCoruna = lazy(() => import("./pages/BlogPrecioAzafatasCoruna"));
const BlogPrecioAzafatasTenerife = lazy(() => import("./pages/BlogPrecioAzafatasTenerife"));
const BlogPrecioAzafatasLasPalmas = lazy(() => import("./pages/BlogPrecioAzafatasLasPalmas"));
const BlogPrecioAzafatasVigo = lazy(() => import("./pages/BlogPrecioAzafatasVigo"));
const BlogPrecioAzafatasSantiago = lazy(() => import("./pages/BlogPrecioAzafatasSantiago"));
const BlogPrecioAzafatasGijon = lazy(() => import("./pages/BlogPrecioAzafatasGijon"));
const BlogPrecioAzafatasOviedo = lazy(() => import("./pages/BlogPrecioAzafatasOviedo"));
const BlogPrecioAzafatasVitoria = lazy(() => import("./pages/BlogPrecioAzafatasVitoria"));
const BlogPrecioAzafatasPamplona = lazy(() => import("./pages/BlogPrecioAzafatasPamplona"));
const BlogPrecioAzafatasLogrono = lazy(() => import("./pages/BlogPrecioAzafatasLogrono"));
const BlogPrecioAzafatasSalamanca = lazy(() => import("./pages/BlogPrecioAzafatasSalamanca"));
const BlogPrecioAzafatasToledo = lazy(() => import("./pages/BlogPrecioAzafatasToledo"));
const BlogPrecioAzafatasAlbacete = lazy(() => import("./pages/BlogPrecioAzafatasAlbacete"));
const BlogPrecioAzafatasMarbella = lazy(() => import("./pages/BlogPrecioAzafatasMarbella"));
const BlogPrecioAzafatasBenidorm = lazy(() => import("./pages/BlogPrecioAzafatasBenidorm"));
const BlogPrecioAzafatasSitges = lazy(() => import("./pages/BlogPrecioAzafatasSitges"));
const BlogPrecioAzafatasTarragona = lazy(() => import("./pages/BlogPrecioAzafatasTarragona"));
const BlogPrecioAzafatasLleida = lazy(() => import("./pages/BlogPrecioAzafatasLleida"));
const BlogPrecioAzafatasGirona = lazy(() => import("./pages/BlogPrecioAzafatasGirona"));
const BlogPrecioAzafatasBadalona = lazy(() => import("./pages/BlogPrecioAzafatasBadalona"));
const BlogPrecioAzafatasCaceres = lazy(() => import("./pages/BlogPrecioAzafatasCaceres"));
const BlogPrecioAzafatasSegovia = lazy(() => import("./pages/BlogPrecioAzafatasSegovia"));
const BlogPrecioAzafatasAvila = lazy(() => import("./pages/BlogPrecioAzafatasAvila"));
const BlogPrecioAzafatasHuesca = lazy(() => import("./pages/BlogPrecioAzafatasHuesca"));
const BlogPrecioAzafatasCuenca = lazy(() => import("./pages/BlogPrecioAzafatasCuenca"));
const BlogPrecioAzafatasEstepona = lazy(() => import("./pages/BlogPrecioAzafatasEstepona"));
const BlogPrecioAzafatasFuengirola = lazy(() => import("./pages/BlogPrecioAzafatasFuengirola"));
const BlogPrecioAzafatasTorremolinos = lazy(() => import("./pages/BlogPrecioAzafatasTorremolinos"));
const BlogPrecioAzafatasBenalmadena = lazy(() => import("./pages/BlogPrecioAzafatasBenalmadena"));
const BlogPrecioAzafatasJerez = lazy(() => import("./pages/BlogPrecioAzafatasJerez"));
const BlogPrecioAzafatasHospitalet = lazy(() => import("./pages/BlogPrecioAzafatasHospitalet"));
const BlogPrecioAzafatasSabadell = lazy(() => import("./pages/BlogPrecioAzafatasSabadell"));
const BlogPrecioAzafatasTerrassa = lazy(() => import("./pages/BlogPrecioAzafatasTerrassa"));
const BlogPrecioAzafatasManresa = lazy(() => import("./pages/BlogPrecioAzafatasManresa"));
const BlogPrecioAzafatasMataro = lazy(() => import("./pages/BlogPrecioAzafatasMataro"));
const BlogPrecioAzafatasGetafe = lazy(() => import("./pages/BlogPrecioAzafatasGetafe"));
const BlogPrecioAzafatasAlcorcon = lazy(() => import("./pages/BlogPrecioAzafatasAlcorcon"));
const BlogPrecioAzafatasLeganes = lazy(() => import("./pages/BlogPrecioAzafatasLeganes"));
const BlogPrecioAzafatasMostoles = lazy(() => import("./pages/BlogPrecioAzafatasMostoles"));
const BlogPrecioAzafatasFuenlabrada = lazy(() => import("./pages/BlogPrecioAzafatasFuenlabrada"));
const BlogPrecioAzafatasCastellon = lazy(() => import("./pages/BlogPrecioAzafatasCastellon"));
const BlogPrecioAzafatasElche = lazy(() => import("./pages/BlogPrecioAzafatasElche"));
const BlogPrecioAzafatasGandia = lazy(() => import("./pages/BlogPrecioAzafatasGandia"));
const BlogPrecioAzafatasDenia = lazy(() => import("./pages/BlogPrecioAzafatasDenia"));
const BlogPrecioAzafatasTorrevieja = lazy(() => import("./pages/BlogPrecioAzafatasTorrevieja"));
const BlogCamarerosMadrid = lazy(() => import("./pages/BlogCamarerosMadrid"));
const BlogCamarerosBarcelona = lazy(() => import("./pages/BlogCamarerosBarcelona"));
const BlogCamarerosValencia = lazy(() => import("./pages/BlogCamarerosValencia"));
const BlogCamarerosSevilla = lazy(() => import("./pages/BlogCamarerosSevilla"));
const BlogCamarerosBilbao = lazy(() => import("./pages/BlogCamarerosBilbao"));
const BlogCamarerosMalaga = lazy(() => import("./pages/BlogCamarerosMalaga"));
const BlogCamarerosZaragoza = lazy(() => import("./pages/BlogCamarerosZaragoza"));
const BlogCamarerosPalma = lazy(() => import("./pages/BlogCamarerosPalma"));
const BlogCamarerosIbiza = lazy(() => import("./pages/BlogCamarerosIbiza"));
const BlogCamarerosAlicante = lazy(() => import("./pages/BlogCamarerosAlicante"));
const BlogCamarerosGranada = lazy(() => import("./pages/BlogCamarerosGranada"));
const BlogCamarerosMurcia = lazy(() => import("./pages/BlogCamarerosMurcia"));
const BlogCamarerosCordoba = lazy(() => import("./pages/BlogCamarerosCordoba"));
const BlogCamarerosValladolid = lazy(() => import("./pages/BlogCamarerosValladolid"));
const BlogCamarerosSanSebastian = lazy(() => import("./pages/BlogCamarerosSanSebastian"));
const BlogCamarerosSantander = lazy(() => import("./pages/BlogCamarerosSantander"));
const BlogCamarerosCoruna = lazy(() => import("./pages/BlogCamarerosCoruna"));
const BlogCamarerosTenerife = lazy(() => import("./pages/BlogCamarerosTenerife"));
const BlogCamarerosLasPalmas = lazy(() => import("./pages/BlogCamarerosLasPalmas"));
const BlogCamarerosVigo = lazy(() => import("./pages/BlogCamarerosVigo"));
const BlogCamarerosSantiago = lazy(() => import("./pages/BlogCamarerosSantiago"));
const BlogCamarerosGijon = lazy(() => import("./pages/BlogCamarerosGijon"));
const BlogCamarerosOviedo = lazy(() => import("./pages/BlogCamarerosOviedo"));
const BlogCamarerosVitoria = lazy(() => import("./pages/BlogCamarerosVitoria"));
const BlogCamarerosPamplona = lazy(() => import("./pages/BlogCamarerosPamplona"));
const BlogCamarerosLogrono = lazy(() => import("./pages/BlogCamarerosLogrono"));
const BlogCamarerosSalamanca = lazy(() => import("./pages/BlogCamarerosSalamanca"));
const BlogCamarerosToledo = lazy(() => import("./pages/BlogCamarerosToledo"));
const BlogCamarerosAlbacete = lazy(() => import("./pages/BlogCamarerosAlbacete"));
const BlogCamarerosMarbella = lazy(() => import("./pages/BlogCamarerosMarbella"));
const BlogCamarerosBenidorm = lazy(() => import("./pages/BlogCamarerosBenidorm"));
const BlogCamarerosSitges = lazy(() => import("./pages/BlogCamarerosSitges"));
const BlogCamarerosTarragona = lazy(() => import("./pages/BlogCamarerosTarragona"));
const BlogCamarerosLleida = lazy(() => import("./pages/BlogCamarerosLleida"));
const BlogCamarerosGirona = lazy(() => import("./pages/BlogCamarerosGirona"));
const BlogCamarerosBadalona = lazy(() => import("./pages/BlogCamarerosBadalona"));
const BlogCamarerosCaceres = lazy(() => import("./pages/BlogCamarerosCaceres"));
const BlogCamarerosSegovia = lazy(() => import("./pages/BlogCamarerosSegovia"));
const BlogCamarerosAvila = lazy(() => import("./pages/BlogCamarerosAvila"));
const BlogCamarerosHuesca = lazy(() => import("./pages/BlogCamarerosHuesca"));
const BlogCamarerosCuenca = lazy(() => import("./pages/BlogCamarerosCuenca"));
const BlogCamarerosEstepona = lazy(() => import("./pages/BlogCamarerosEstepona"));
const BlogCamarerosFuengirola = lazy(() => import("./pages/BlogCamarerosFuengirola"));
const BlogCamarerosTorremolinos = lazy(() => import("./pages/BlogCamarerosTorremolinos"));
const BlogCamarerosBenalmadena = lazy(() => import("./pages/BlogCamarerosBenalmadena"));
const BlogCamarerosJerez = lazy(() => import("./pages/BlogCamarerosJerez"));
const BlogCamarerosHospitalet = lazy(() => import("./pages/BlogCamarerosHospitalet"));
const BlogCamarerosSabadell = lazy(() => import("./pages/BlogCamarerosSabadell"));
const BlogCamarerosTerrassa = lazy(() => import("./pages/BlogCamarerosTerrassa"));
const BlogCamarerosManresa = lazy(() => import("./pages/BlogCamarerosManresa"));
const BlogCamarerosMataro = lazy(() => import("./pages/BlogCamarerosMataro"));
const BlogCamarerosGetafe = lazy(() => import("./pages/BlogCamarerosGetafe"));
const BlogCamarerosAlcorcon = lazy(() => import("./pages/BlogCamarerosAlcorcon"));
const BlogCamarerosLeganes = lazy(() => import("./pages/BlogCamarerosLeganes"));
const BlogCamarerosMostoles = lazy(() => import("./pages/BlogCamarerosMostoles"));
const BlogCamarerosFuenlabrada = lazy(() => import("./pages/BlogCamarerosFuenlabrada"));
const BlogCamarerosCastellon = lazy(() => import("./pages/BlogCamarerosCastellon"));
const BlogCamarerosElche = lazy(() => import("./pages/BlogCamarerosElche"));
const BlogCamarerosGandia = lazy(() => import("./pages/BlogCamarerosGandia"));
const BlogCamarerosDenia = lazy(() => import("./pages/BlogCamarerosDenia"));
const BlogCamarerosTorrevieja = lazy(() => import("./pages/BlogCamarerosTorrevieja"));
const BlogMaquillajeMadrid = lazy(() => import("./pages/BlogMaquillajeMadrid"));
const BlogMaquillajeBarcelona = lazy(() => import("./pages/BlogMaquillajeBarcelona"));
const BlogMaquillajeValencia = lazy(() => import("./pages/BlogMaquillajeValencia"));
const BlogMaquillajeSevilla = lazy(() => import("./pages/BlogMaquillajeSevilla"));
const BlogMaquillajeBilbao = lazy(() => import("./pages/BlogMaquillajeBilbao"));
const BlogMaquillajeMalaga = lazy(() => import("./pages/BlogMaquillajeMalaga"));
const BlogMaquillajeZaragoza = lazy(() => import("./pages/BlogMaquillajeZaragoza"));
const BlogMaquillajePalma = lazy(() => import("./pages/BlogMaquillajePalma"));
const BlogMaquillajeIbiza = lazy(() => import("./pages/BlogMaquillajeIbiza"));
const BlogMaquillajeAlicante = lazy(() => import("./pages/BlogMaquillajeAlicante"));
const BlogMaquillajeGranada = lazy(() => import("./pages/BlogMaquillajeGranada"));
const BlogMaquillajeMurcia = lazy(() => import("./pages/BlogMaquillajeMurcia"));
const BlogMaquillajeCordoba = lazy(() => import("./pages/BlogMaquillajeCordoba"));
const BlogMaquillajeValladolid = lazy(() => import("./pages/BlogMaquillajeValladolid"));
const BlogMaquillajeSanSebastian = lazy(() => import("./pages/BlogMaquillajeSanSebastian"));
const BlogMaquillajeSantander = lazy(() => import("./pages/BlogMaquillajeSantander"));
const BlogMaquillajeCoruna = lazy(() => import("./pages/BlogMaquillajeCoruna"));
const BlogMaquillajeTenerife = lazy(() => import("./pages/BlogMaquillajeTenerife"));
const BlogMaquillajeLasPalmas = lazy(() => import("./pages/BlogMaquillajeLasPalmas"));
const BlogMaquillajeVigo = lazy(() => import("./pages/BlogMaquillajeVigo"));
const BlogMaquillajeSantiago = lazy(() => import("./pages/BlogMaquillajeSantiago"));
const BlogMaquillajeGijon = lazy(() => import("./pages/BlogMaquillajeGijon"));
const BlogMaquillajeOviedo = lazy(() => import("./pages/BlogMaquillajeOviedo"));
const BlogMaquillajeVitoria = lazy(() => import("./pages/BlogMaquillajeVitoria"));
const BlogMaquillajePamplona = lazy(() => import("./pages/BlogMaquillajePamplona"));
const BlogMaquillajeLogrono = lazy(() => import("./pages/BlogMaquillajeLogrono"));
const BlogMaquillajeSalamanca = lazy(() => import("./pages/BlogMaquillajeSalamanca"));
const BlogMaquillajeToledo = lazy(() => import("./pages/BlogMaquillajeToledo"));
const BlogMaquillajeAlbacete = lazy(() => import("./pages/BlogMaquillajeAlbacete"));
const BlogMaquillajeMarbella = lazy(() => import("./pages/BlogMaquillajeMarbella"));
const BlogMaquillajeBenidorm = lazy(() => import("./pages/BlogMaquillajeBenidorm"));
const BlogMaquillajeSitges = lazy(() => import("./pages/BlogMaquillajeSitges"));
const BlogMaquillajeTarragona = lazy(() => import("./pages/BlogMaquillajeTarragona"));
const BlogMaquillajeLleida = lazy(() => import("./pages/BlogMaquillajeLleida"));
const BlogMaquillajeGirona = lazy(() => import("./pages/BlogMaquillajeGirona"));
const BlogMaquillajeBadalona = lazy(() => import("./pages/BlogMaquillajeBadalona"));
const BlogMaquillajeCaceres = lazy(() => import("./pages/BlogMaquillajeCaceres"));
const BlogMaquillajeSegovia = lazy(() => import("./pages/BlogMaquillajeSegovia"));
const BlogMaquillajeAvila = lazy(() => import("./pages/BlogMaquillajeAvila"));
const BlogMaquillajeHuesca = lazy(() => import("./pages/BlogMaquillajeHuesca"));
const BlogMaquillajeCuenca = lazy(() => import("./pages/BlogMaquillajeCuenca"));
const BlogMaquillajeEstepona = lazy(() => import("./pages/BlogMaquillajeEstepona"));
const BlogMaquillajeFuengirola = lazy(() => import("./pages/BlogMaquillajeFuengirola"));
const BlogMaquillajeTorremolinos = lazy(() => import("./pages/BlogMaquillajeTorremolinos"));
const BlogMaquillajeBenalmadena = lazy(() => import("./pages/BlogMaquillajeBenalmadena"));
const BlogMaquillajeJerez = lazy(() => import("./pages/BlogMaquillajeJerez"));
const BlogMaquillajeHospitalet = lazy(() => import("./pages/BlogMaquillajeHospitalet"));
const BlogMaquillajeSabadell = lazy(() => import("./pages/BlogMaquillajeSabadell"));
const BlogMaquillajeTerrassa = lazy(() => import("./pages/BlogMaquillajeTerrassa"));
const BlogMaquillajeManresa = lazy(() => import("./pages/BlogMaquillajeManresa"));
const BlogMaquillajeMataro = lazy(() => import("./pages/BlogMaquillajeMataro"));
const BlogMaquillajeGetafe = lazy(() => import("./pages/BlogMaquillajeGetafe"));
const BlogMaquillajeAlcorcon = lazy(() => import("./pages/BlogMaquillajeAlcorcon"));
const BlogMaquillajeLeganes = lazy(() => import("./pages/BlogMaquillajeLeganes"));
const BlogMaquillajeMostoles = lazy(() => import("./pages/BlogMaquillajeMostoles"));
const BlogMaquillajeFuenlabrada = lazy(() => import("./pages/BlogMaquillajeFuenlabrada"));
const BlogMaquillajeCastellon = lazy(() => import("./pages/BlogMaquillajeCastellon"));
const BlogMaquillajeElche = lazy(() => import("./pages/BlogMaquillajeElche"));
const BlogMaquillajeGandia = lazy(() => import("./pages/BlogMaquillajeGandia"));
const BlogMaquillajeDenia = lazy(() => import("./pages/BlogMaquillajeDenia"));
const BlogMaquillajeTorrevieja = lazy(() => import("./pages/BlogMaquillajeTorrevieja"));
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
const BlogAnimadoresComunionPrecio = lazy(() => import("./pages/BlogAnimadoresComunionPrecio"));
const BlogCuartetoCuerdaPrecio = lazy(() => import("./pages/BlogCuartetoCuerdaPrecio"));
const BlogEventoEmpresaIdeas = lazy(() => import("./pages/BlogEventoEmpresaIdeas"));
const BlogMagoPrecioEventos = lazy(() => import("./pages/BlogMagoPrecioEventos"));
const BlogPhotoBoothPrecio = lazy(() => import("./pages/BlogPhotoBoothPrecio"));
const BlogSaxofonistaEventosPrecio = lazy(() => import("./pages/BlogSaxofonistaEventosPrecio"));
const BlogTecnicoSonido = lazy(() => import("./pages/BlogTecnicoSonido"));
const BlogPersonalImagen = lazy(() => import("./pages/BlogPersonalImagen"));
const HubDJ = lazy(() => import("./pages/HubDJ"));
const HubBodas = lazy(() => import("./pages/HubBodas"));
const HubStaff = lazy(() => import("./pages/HubStaff"));
const BlogDJComunion = lazy(() => import("./pages/BlogDJComunion"));
const BlogFotografoComunion = lazy(() => import("./pages/BlogFotografoComunion"));
const BlogContratoDJ = lazy(() => import("./pages/BlogContratoDJ"));
const BodasLanding = lazy(() => import("./pages/BodasLanding"));
const OrganizadoresLanding = lazy(() => import("./pages/OrganizadoresLanding"));
const BlogOrganizarEventoEmpresaPasoAPaso = lazy(() => import("./pages/BlogOrganizarEventoEmpresaPasoAPaso"));
const BlogComoCompararPresupuestosEventos = lazy(() => import("./pages/BlogComoCompararPresupuestosEventos"));
const BlogContratoProveedoresEventos = lazy(() => import("./pages/BlogContratoProveedoresEventos"));
const BlogGestionarVariosProveedoresEvento = lazy(() => import("./pages/BlogGestionarVariosProveedoresEvento"));
const BlogSoftwareGestionEventos = lazy(() => import("./pages/BlogSoftwareGestionEventos"));
const BlogCuantoCobraPromotorRRPP = lazy(() => import("./pages/BlogCuantoCobraPromotorRRPP"));
const BlogQueHacePromotorEventos = lazy(() => import("./pages/BlogQueHacePromotorEventos"));
const BlogComoContratarPromotoresDiscoteca = lazy(() => import("./pages/BlogComoContratarPromotoresDiscoteca"));
const BlogComoElegirMagoEventos = lazy(() => import("./pages/BlogComoElegirMagoEventos"));
const BlogTiposAnimacionEventos = lazy(() => import("./pages/BlogTiposAnimacionEventos"));
const BlogBailarinesParaEventos = lazy(() => import("./pages/BlogBailarinesParaEventos"));
const BlogCuantoCobraSpeakerEventos = lazy(() => import("./pages/BlogCuantoCobraSpeakerEventos"));
const BlogComoElegirPresentadorEventoEmpresa = lazy(() => import("./pages/BlogComoElegirPresentadorEventoEmpresa"));
const BlogCuantoCobraEstilistaEventos = lazy(() => import("./pages/BlogCuantoCobraEstilistaEventos"));
const BlogEstilistaBodaQueIncluye = lazy(() => import("./pages/BlogEstilistaBodaQueIncluye"));
const BlogCuantoCobraHumoristaEventos = lazy(() => import("./pages/BlogCuantoCobraHumoristaEventos"));
const BlogHumoristaCenaEmpresaComoElegir = lazy(() => import("./pages/BlogHumoristaCenaEmpresaComoElegir"));
const PresupuestoBoda = lazy(() => import("./pages/PresupuestoBoda"));
const ChecklistEventoEmpresa = lazy(() => import("./pages/ChecklistEventoEmpresa"));
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
const Socials = lazy(() => import("./pages/Socials"));
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
            <Route path="/descubrir" element={<Descubrir />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/eliminar-cuenta" element={<EliminarCuenta />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* Panel de admin unificado en /dashboard?view=admin — antes había un
                segundo panel duplicado aquí (códigos promo, ya migrados a la
                tab "Códigos Promo" del panel principal; solicitudes/usuarios
                eran duplicados exactos de lo que ya existe en /dashboard). */}
            <Route path="/admin-beta" element={<Navigate to="/dashboard?view=admin" replace />} />
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
            <Route path="/contratar-humorista" element={<CategoryLanding />} />
            <Route path="/contratar-animador" element={<CategoryLanding />} />
            <Route path="/contratar-animadores" element={<CategoryLanding />} />
            <Route path="/contratar-speaker" element={<CategoryLanding />} />
            <Route path="/contratar-mago" element={<CategoryLanding />} />
            <Route path="/contratar-bailarin" element={<CategoryLanding />} />
            <Route path="/contratar-payaso" element={<CategoryLanding />} />
            <Route path="/contratar-payasos" element={<CategoryLanding />} />
            <Route path="/contratar-grupo-musical" element={<CategoryLanding />} />
            <Route path="/contratar-photo-booth" element={<CategoryLanding />} />
            <Route path="/contratar-monologo" element={<CategoryLanding />} />
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
            <Route path="/contratar-promotores/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-animador/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-animadores/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-payaso/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-payasos/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-vestuario/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-grupo-musical/:ciudad" element={<CityLanding />} />
            <Route path="/contratar-photo-booth/:ciudad" element={<CityLanding />} />
            {/* Occasion landings — eje ocasión × rol (GEO/AEO) */}
            <Route path="/boda/contratar-dj" element={<OccasionLanding />} />
            <Route path="/boda/contratar-fotografo" element={<OccasionLanding />} />
            <Route path="/boda/contratar-catering" element={<OccasionLanding />} />
            <Route path="/boda/contratar-camareros" element={<OccasionLanding />} />
            <Route path="/boda/contratar-grupo-musical" element={<OccasionLanding />} />
            <Route path="/boda/contratar-animador" element={<OccasionLanding />} />
            <Route path="/cumpleanos/contratar-dj" element={<OccasionLanding />} />
            <Route path="/cumpleanos/contratar-fotografo" element={<OccasionLanding />} />
            <Route path="/cumpleanos/contratar-catering" element={<OccasionLanding />} />
            <Route path="/cumpleanos/contratar-animador" element={<OccasionLanding />} />
            <Route path="/cumpleanos/contratar-mago" element={<OccasionLanding />} />
            <Route path="/evento-empresa/contratar-dj" element={<OccasionLanding />} />
            <Route path="/evento-empresa/contratar-fotografo" element={<OccasionLanding />} />
            <Route path="/evento-empresa/contratar-catering" element={<OccasionLanding />} />
            <Route path="/evento-empresa/contratar-camareros" element={<OccasionLanding />} />
            <Route path="/evento-empresa/contratar-speaker" element={<OccasionLanding />} />
            <Route path="/comunion/contratar-fotografo" element={<OccasionLanding />} />
            <Route path="/comunion/contratar-catering" element={<OccasionLanding />} />
            <Route path="/comunion/contratar-animador" element={<OccasionLanding />} />
            <Route path="/comunion/contratar-mago" element={<OccasionLanding />} />
            <Route path="/comunion/contratar-dj" element={<OccasionLanding />} />
            <Route path="/fiesta-privada/contratar-dj" element={<OccasionLanding />} />
            <Route path="/fiesta-privada/contratar-fotografo" element={<OccasionLanding />} />
            <Route path="/fiesta-privada/contratar-catering" element={<OccasionLanding />} />
            <Route path="/fiesta-privada/contratar-camareros" element={<OccasionLanding />} />
            <Route path="/fiesta-privada/contratar-animador" element={<OccasionLanding />} />
            {/* Blog */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/cuanto-cobra-un-dj-en-espana" element={<BlogDJPrecio />} />
            <Route path="/blog/mejores-plataformas-contratar-dj-espana" element={<BlogMejoresPlataformasContratarDJ />} />
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
            <Route path="/blog/precio-bailarin-instructor-salsa-bachata" element={<BlogPrecioBailarin />} />
            <Route path="/blog/precio-azafatas-madrid" element={<BlogPrecioAzafatasMadrid />} />
            <Route path="/blog/precio-azafatas-barcelona" element={<BlogPrecioAzafatasBarcelona />} />
            <Route path="/blog/precio-azafatas-valencia" element={<BlogPrecioAzafatasValencia />} />
            <Route path="/blog/precio-azafatas-sevilla" element={<BlogPrecioAzafatasSevilla />} />
            <Route path="/blog/precio-azafatas-bilbao" element={<BlogPrecioAzafatasBilbao />} />
            <Route path="/blog/precio-azafatas-malaga" element={<BlogPrecioAzafatasMalaga />} />
            <Route path="/blog/precio-azafatas-zaragoza" element={<BlogPrecioAzafatasZaragoza />} />
            <Route path="/blog/precio-azafatas-palma" element={<BlogPrecioAzafatasPalma />} />
            <Route path="/blog/precio-azafatas-ibiza" element={<BlogPrecioAzafatasIbiza />} />
            <Route path="/blog/precio-azafatas-alicante" element={<BlogPrecioAzafatasAlicante />} />
            <Route path="/blog/precio-azafatas-granada" element={<BlogPrecioAzafatasGranada />} />
            <Route path="/blog/precio-azafatas-murcia" element={<BlogPrecioAzafatasMurcia />} />
            <Route path="/blog/precio-azafatas-cordoba" element={<BlogPrecioAzafatasCordoba />} />
            <Route path="/blog/precio-azafatas-valladolid" element={<BlogPrecioAzafatasValladolid />} />
            <Route path="/blog/precio-azafatas-sansebastian" element={<BlogPrecioAzafatasSanSebastian />} />
            <Route path="/blog/precio-azafatas-santander" element={<BlogPrecioAzafatasSantander />} />
            <Route path="/blog/precio-azafatas-coruna" element={<BlogPrecioAzafatasCoruna />} />
            <Route path="/blog/precio-azafatas-tenerife" element={<BlogPrecioAzafatasTenerife />} />
            <Route path="/blog/precio-azafatas-laspalmas" element={<BlogPrecioAzafatasLasPalmas />} />
            <Route path="/blog/precio-azafatas-vigo" element={<BlogPrecioAzafatasVigo />} />
            <Route path="/blog/precio-azafatas-santiago" element={<BlogPrecioAzafatasSantiago />} />
            <Route path="/blog/precio-azafatas-gijon" element={<BlogPrecioAzafatasGijon />} />
            <Route path="/blog/precio-azafatas-oviedo" element={<BlogPrecioAzafatasOviedo />} />
            <Route path="/blog/precio-azafatas-vitoria" element={<BlogPrecioAzafatasVitoria />} />
            <Route path="/blog/precio-azafatas-pamplona" element={<BlogPrecioAzafatasPamplona />} />
            <Route path="/blog/precio-azafatas-logrono" element={<BlogPrecioAzafatasLogrono />} />
            <Route path="/blog/precio-azafatas-salamanca" element={<BlogPrecioAzafatasSalamanca />} />
            <Route path="/blog/precio-azafatas-toledo" element={<BlogPrecioAzafatasToledo />} />
            <Route path="/blog/precio-azafatas-albacete" element={<BlogPrecioAzafatasAlbacete />} />
            <Route path="/blog/precio-azafatas-marbella" element={<BlogPrecioAzafatasMarbella />} />
            <Route path="/blog/precio-azafatas-benidorm" element={<BlogPrecioAzafatasBenidorm />} />
            <Route path="/blog/precio-azafatas-sitges" element={<BlogPrecioAzafatasSitges />} />
            <Route path="/blog/precio-azafatas-tarragona" element={<BlogPrecioAzafatasTarragona />} />
            <Route path="/blog/precio-azafatas-lleida" element={<BlogPrecioAzafatasLleida />} />
            <Route path="/blog/precio-azafatas-girona" element={<BlogPrecioAzafatasGirona />} />
            <Route path="/blog/precio-azafatas-badalona" element={<BlogPrecioAzafatasBadalona />} />
            <Route path="/blog/precio-azafatas-caceres" element={<BlogPrecioAzafatasCaceres />} />
            <Route path="/blog/precio-azafatas-segovia" element={<BlogPrecioAzafatasSegovia />} />
            <Route path="/blog/precio-azafatas-avila" element={<BlogPrecioAzafatasAvila />} />
            <Route path="/blog/precio-azafatas-huesca" element={<BlogPrecioAzafatasHuesca />} />
            <Route path="/blog/precio-azafatas-cuenca" element={<BlogPrecioAzafatasCuenca />} />
            <Route path="/blog/precio-azafatas-estepona" element={<BlogPrecioAzafatasEstepona />} />
            <Route path="/blog/precio-azafatas-fuengirola" element={<BlogPrecioAzafatasFuengirola />} />
            <Route path="/blog/precio-azafatas-torremolinos" element={<BlogPrecioAzafatasTorremolinos />} />
            <Route path="/blog/precio-azafatas-benalmadena" element={<BlogPrecioAzafatasBenalmadena />} />
            <Route path="/blog/precio-azafatas-jerez" element={<BlogPrecioAzafatasJerez />} />
            <Route path="/blog/precio-azafatas-hospitalet" element={<BlogPrecioAzafatasHospitalet />} />
            <Route path="/blog/precio-azafatas-sabadell" element={<BlogPrecioAzafatasSabadell />} />
            <Route path="/blog/precio-azafatas-terrassa" element={<BlogPrecioAzafatasTerrassa />} />
            <Route path="/blog/precio-azafatas-manresa" element={<BlogPrecioAzafatasManresa />} />
            <Route path="/blog/precio-azafatas-mataro" element={<BlogPrecioAzafatasMataro />} />
            <Route path="/blog/precio-azafatas-getafe" element={<BlogPrecioAzafatasGetafe />} />
            <Route path="/blog/precio-azafatas-alcorcon" element={<BlogPrecioAzafatasAlcorcon />} />
            <Route path="/blog/precio-azafatas-leganes" element={<BlogPrecioAzafatasLeganes />} />
            <Route path="/blog/precio-azafatas-mostoles" element={<BlogPrecioAzafatasMostoles />} />
            <Route path="/blog/precio-azafatas-fuenlabrada" element={<BlogPrecioAzafatasFuenlabrada />} />
            <Route path="/blog/precio-azafatas-castellon" element={<BlogPrecioAzafatasCastellon />} />
            <Route path="/blog/precio-azafatas-elche" element={<BlogPrecioAzafatasElche />} />
            <Route path="/blog/precio-azafatas-gandia" element={<BlogPrecioAzafatasGandia />} />
            <Route path="/blog/precio-azafatas-denia" element={<BlogPrecioAzafatasDenia />} />
            <Route path="/blog/precio-azafatas-torrevieja" element={<BlogPrecioAzafatasTorrevieja />} />
            <Route path="/blog/camareros-eventos-madrid" element={<BlogCamarerosMadrid />} />
            <Route path="/blog/camareros-eventos-barcelona" element={<BlogCamarerosBarcelona />} />
            <Route path="/blog/camareros-eventos-valencia" element={<BlogCamarerosValencia />} />
            <Route path="/blog/camareros-eventos-sevilla" element={<BlogCamarerosSevilla />} />
            <Route path="/blog/camareros-eventos-bilbao" element={<BlogCamarerosBilbao />} />
            <Route path="/blog/camareros-eventos-malaga" element={<BlogCamarerosMalaga />} />
            <Route path="/blog/camareros-eventos-zaragoza" element={<BlogCamarerosZaragoza />} />
            <Route path="/blog/camareros-eventos-palma" element={<BlogCamarerosPalma />} />
            <Route path="/blog/camareros-eventos-ibiza" element={<BlogCamarerosIbiza />} />
            <Route path="/blog/camareros-eventos-alicante" element={<BlogCamarerosAlicante />} />
            <Route path="/blog/camareros-eventos-granada" element={<BlogCamarerosGranada />} />
            <Route path="/blog/camareros-eventos-murcia" element={<BlogCamarerosMurcia />} />
            <Route path="/blog/camareros-eventos-cordoba" element={<BlogCamarerosCordoba />} />
            <Route path="/blog/camareros-eventos-valladolid" element={<BlogCamarerosValladolid />} />
            <Route path="/blog/camareros-eventos-sansebastian" element={<BlogCamarerosSanSebastian />} />
            <Route path="/blog/camareros-eventos-santander" element={<BlogCamarerosSantander />} />
            <Route path="/blog/camareros-eventos-coruna" element={<BlogCamarerosCoruna />} />
            <Route path="/blog/camareros-eventos-tenerife" element={<BlogCamarerosTenerife />} />
            <Route path="/blog/camareros-eventos-laspalmas" element={<BlogCamarerosLasPalmas />} />
            <Route path="/blog/camareros-eventos-vigo" element={<BlogCamarerosVigo />} />
            <Route path="/blog/camareros-eventos-santiago" element={<BlogCamarerosSantiago />} />
            <Route path="/blog/camareros-eventos-gijon" element={<BlogCamarerosGijon />} />
            <Route path="/blog/camareros-eventos-oviedo" element={<BlogCamarerosOviedo />} />
            <Route path="/blog/camareros-eventos-vitoria" element={<BlogCamarerosVitoria />} />
            <Route path="/blog/camareros-eventos-pamplona" element={<BlogCamarerosPamplona />} />
            <Route path="/blog/camareros-eventos-logrono" element={<BlogCamarerosLogrono />} />
            <Route path="/blog/camareros-eventos-salamanca" element={<BlogCamarerosSalamanca />} />
            <Route path="/blog/camareros-eventos-toledo" element={<BlogCamarerosToledo />} />
            <Route path="/blog/camareros-eventos-albacete" element={<BlogCamarerosAlbacete />} />
            <Route path="/blog/camareros-eventos-marbella" element={<BlogCamarerosMarbella />} />
            <Route path="/blog/camareros-eventos-benidorm" element={<BlogCamarerosBenidorm />} />
            <Route path="/blog/camareros-eventos-sitges" element={<BlogCamarerosSitges />} />
            <Route path="/blog/camareros-eventos-tarragona" element={<BlogCamarerosTarragona />} />
            <Route path="/blog/camareros-eventos-lleida" element={<BlogCamarerosLleida />} />
            <Route path="/blog/camareros-eventos-girona" element={<BlogCamarerosGirona />} />
            <Route path="/blog/camareros-eventos-badalona" element={<BlogCamarerosBadalona />} />
            <Route path="/blog/camareros-eventos-caceres" element={<BlogCamarerosCaceres />} />
            <Route path="/blog/camareros-eventos-segovia" element={<BlogCamarerosSegovia />} />
            <Route path="/blog/camareros-eventos-avila" element={<BlogCamarerosAvila />} />
            <Route path="/blog/camareros-eventos-huesca" element={<BlogCamarerosHuesca />} />
            <Route path="/blog/camareros-eventos-cuenca" element={<BlogCamarerosCuenca />} />
            <Route path="/blog/camareros-eventos-estepona" element={<BlogCamarerosEstepona />} />
            <Route path="/blog/camareros-eventos-fuengirola" element={<BlogCamarerosFuengirola />} />
            <Route path="/blog/camareros-eventos-torremolinos" element={<BlogCamarerosTorremolinos />} />
            <Route path="/blog/camareros-eventos-benalmadena" element={<BlogCamarerosBenalmadena />} />
            <Route path="/blog/camareros-eventos-jerez" element={<BlogCamarerosJerez />} />
            <Route path="/blog/camareros-eventos-hospitalet" element={<BlogCamarerosHospitalet />} />
            <Route path="/blog/camareros-eventos-sabadell" element={<BlogCamarerosSabadell />} />
            <Route path="/blog/camareros-eventos-terrassa" element={<BlogCamarerosTerrassa />} />
            <Route path="/blog/camareros-eventos-manresa" element={<BlogCamarerosManresa />} />
            <Route path="/blog/camareros-eventos-mataro" element={<BlogCamarerosMataro />} />
            <Route path="/blog/camareros-eventos-getafe" element={<BlogCamarerosGetafe />} />
            <Route path="/blog/camareros-eventos-alcorcon" element={<BlogCamarerosAlcorcon />} />
            <Route path="/blog/camareros-eventos-leganes" element={<BlogCamarerosLeganes />} />
            <Route path="/blog/camareros-eventos-mostoles" element={<BlogCamarerosMostoles />} />
            <Route path="/blog/camareros-eventos-fuenlabrada" element={<BlogCamarerosFuenlabrada />} />
            <Route path="/blog/camareros-eventos-castellon" element={<BlogCamarerosCastellon />} />
            <Route path="/blog/camareros-eventos-elche" element={<BlogCamarerosElche />} />
            <Route path="/blog/camareros-eventos-gandia" element={<BlogCamarerosGandia />} />
            <Route path="/blog/camareros-eventos-denia" element={<BlogCamarerosDenia />} />
            <Route path="/blog/camareros-eventos-torrevieja" element={<BlogCamarerosTorrevieja />} />
            <Route path="/blog/maquillaje-eventos-madrid" element={<BlogMaquillajeMadrid />} />
            <Route path="/blog/maquillaje-eventos-barcelona" element={<BlogMaquillajeBarcelona />} />
            <Route path="/blog/maquillaje-eventos-valencia" element={<BlogMaquillajeValencia />} />
            <Route path="/blog/maquillaje-eventos-sevilla" element={<BlogMaquillajeSevilla />} />
            <Route path="/blog/maquillaje-eventos-bilbao" element={<BlogMaquillajeBilbao />} />
            <Route path="/blog/maquillaje-eventos-malaga" element={<BlogMaquillajeMalaga />} />
            <Route path="/blog/maquillaje-eventos-zaragoza" element={<BlogMaquillajeZaragoza />} />
            <Route path="/blog/maquillaje-eventos-palma" element={<BlogMaquillajePalma />} />
            <Route path="/blog/maquillaje-eventos-ibiza" element={<BlogMaquillajeIbiza />} />
            <Route path="/blog/maquillaje-eventos-alicante" element={<BlogMaquillajeAlicante />} />
            <Route path="/blog/maquillaje-eventos-granada" element={<BlogMaquillajeGranada />} />
            <Route path="/blog/maquillaje-eventos-murcia" element={<BlogMaquillajeMurcia />} />
            <Route path="/blog/maquillaje-eventos-cordoba" element={<BlogMaquillajeCordoba />} />
            <Route path="/blog/maquillaje-eventos-valladolid" element={<BlogMaquillajeValladolid />} />
            <Route path="/blog/maquillaje-eventos-sansebastian" element={<BlogMaquillajeSanSebastian />} />
            <Route path="/blog/maquillaje-eventos-santander" element={<BlogMaquillajeSantander />} />
            <Route path="/blog/maquillaje-eventos-coruna" element={<BlogMaquillajeCoruna />} />
            <Route path="/blog/maquillaje-eventos-tenerife" element={<BlogMaquillajeTenerife />} />
            <Route path="/blog/maquillaje-eventos-laspalmas" element={<BlogMaquillajeLasPalmas />} />
            <Route path="/blog/maquillaje-eventos-vigo" element={<BlogMaquillajeVigo />} />
            <Route path="/blog/maquillaje-eventos-santiago" element={<BlogMaquillajeSantiago />} />
            <Route path="/blog/maquillaje-eventos-gijon" element={<BlogMaquillajeGijon />} />
            <Route path="/blog/maquillaje-eventos-oviedo" element={<BlogMaquillajeOviedo />} />
            <Route path="/blog/maquillaje-eventos-vitoria" element={<BlogMaquillajeVitoria />} />
            <Route path="/blog/maquillaje-eventos-pamplona" element={<BlogMaquillajePamplona />} />
            <Route path="/blog/maquillaje-eventos-logrono" element={<BlogMaquillajeLogrono />} />
            <Route path="/blog/maquillaje-eventos-salamanca" element={<BlogMaquillajeSalamanca />} />
            <Route path="/blog/maquillaje-eventos-toledo" element={<BlogMaquillajeToledo />} />
            <Route path="/blog/maquillaje-eventos-albacete" element={<BlogMaquillajeAlbacete />} />
            <Route path="/blog/maquillaje-eventos-marbella" element={<BlogMaquillajeMarbella />} />
            <Route path="/blog/maquillaje-eventos-benidorm" element={<BlogMaquillajeBenidorm />} />
            <Route path="/blog/maquillaje-eventos-sitges" element={<BlogMaquillajeSitges />} />
            <Route path="/blog/maquillaje-eventos-tarragona" element={<BlogMaquillajeTarragona />} />
            <Route path="/blog/maquillaje-eventos-lleida" element={<BlogMaquillajeLleida />} />
            <Route path="/blog/maquillaje-eventos-girona" element={<BlogMaquillajeGirona />} />
            <Route path="/blog/maquillaje-eventos-badalona" element={<BlogMaquillajeBadalona />} />
            <Route path="/blog/maquillaje-eventos-caceres" element={<BlogMaquillajeCaceres />} />
            <Route path="/blog/maquillaje-eventos-segovia" element={<BlogMaquillajeSegovia />} />
            <Route path="/blog/maquillaje-eventos-avila" element={<BlogMaquillajeAvila />} />
            <Route path="/blog/maquillaje-eventos-huesca" element={<BlogMaquillajeHuesca />} />
            <Route path="/blog/maquillaje-eventos-cuenca" element={<BlogMaquillajeCuenca />} />
            <Route path="/blog/maquillaje-eventos-estepona" element={<BlogMaquillajeEstepona />} />
            <Route path="/blog/maquillaje-eventos-fuengirola" element={<BlogMaquillajeFuengirola />} />
            <Route path="/blog/maquillaje-eventos-torremolinos" element={<BlogMaquillajeTorremolinos />} />
            <Route path="/blog/maquillaje-eventos-benalmadena" element={<BlogMaquillajeBenalmadena />} />
            <Route path="/blog/maquillaje-eventos-jerez" element={<BlogMaquillajeJerez />} />
            <Route path="/blog/maquillaje-eventos-hospitalet" element={<BlogMaquillajeHospitalet />} />
            <Route path="/blog/maquillaje-eventos-sabadell" element={<BlogMaquillajeSabadell />} />
            <Route path="/blog/maquillaje-eventos-terrassa" element={<BlogMaquillajeTerrassa />} />
            <Route path="/blog/maquillaje-eventos-manresa" element={<BlogMaquillajeManresa />} />
            <Route path="/blog/maquillaje-eventos-mataro" element={<BlogMaquillajeMataro />} />
            <Route path="/blog/maquillaje-eventos-getafe" element={<BlogMaquillajeGetafe />} />
            <Route path="/blog/maquillaje-eventos-alcorcon" element={<BlogMaquillajeAlcorcon />} />
            <Route path="/blog/maquillaje-eventos-leganes" element={<BlogMaquillajeLeganes />} />
            <Route path="/blog/maquillaje-eventos-mostoles" element={<BlogMaquillajeMostoles />} />
            <Route path="/blog/maquillaje-eventos-fuenlabrada" element={<BlogMaquillajeFuenlabrada />} />
            <Route path="/blog/maquillaje-eventos-castellon" element={<BlogMaquillajeCastellon />} />
            <Route path="/blog/maquillaje-eventos-elche" element={<BlogMaquillajeElche />} />
            <Route path="/blog/maquillaje-eventos-gandia" element={<BlogMaquillajeGandia />} />
            <Route path="/blog/maquillaje-eventos-denia" element={<BlogMaquillajeDenia />} />
            <Route path="/blog/maquillaje-eventos-torrevieja" element={<BlogMaquillajeTorrevieja />} />
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
            <Route path="/blog/animadores-comunion-precio" element={<BlogAnimadoresComunionPrecio />} />
            <Route path="/blog/cuarteto-cuerda-boda-precio" element={<BlogCuartetoCuerdaPrecio />} />
            <Route path="/blog/ideas-eventos-empresa-originales" element={<BlogEventoEmpresaIdeas />} />
            <Route path="/blog/mago-precio-eventos-espana" element={<BlogMagoPrecioEventos />} />
            <Route path="/blog/photobooth-precio-boda-evento" element={<BlogPhotoBoothPrecio />} />
            <Route path="/blog/saxofonista-precio-espana" element={<BlogSaxofonistaEventosPrecio />} />
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
            <Route path="/socials" element={<Socials />} />
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
            <Route path="/blog/como-organizar-fiesta-de-empresa" element={<BlogOrganizarFiestaEmpresa />} />
            <Route path="/bodas" element={<BodasLanding />} />
            <Route path="/organizar-eventos" element={<OrganizadoresLanding />} />
            <Route path="/blog/organizar-evento-empresa-paso-a-paso" element={<BlogOrganizarEventoEmpresaPasoAPaso />} />
            <Route path="/blog/comparar-presupuestos-proveedores-eventos" element={<BlogComoCompararPresupuestosEventos />} />
            <Route path="/blog/contrato-proveedores-eventos" element={<BlogContratoProveedoresEventos />} />
            <Route path="/blog/gestionar-varios-proveedores-evento" element={<BlogGestionarVariosProveedoresEvento />} />
            <Route path="/blog/software-para-organizar-eventos" element={<BlogSoftwareGestionEventos />} />
            <Route path="/blog/cuanto-cobra-un-promotor-rrpp" element={<BlogCuantoCobraPromotorRRPP />} />
            <Route path="/blog/que-hace-un-promotor-de-eventos" element={<BlogQueHacePromotorEventos />} />
            <Route path="/blog/como-contratar-promotores-discoteca" element={<BlogComoContratarPromotoresDiscoteca />} />
            <Route path="/blog/como-elegir-mago-para-tu-evento" element={<BlogComoElegirMagoEventos />} />
            <Route path="/blog/tipos-de-animacion-para-eventos" element={<BlogTiposAnimacionEventos />} />
            <Route path="/blog/bailarines-para-eventos" element={<BlogBailarinesParaEventos />} />
            <Route path="/blog/cuanto-cobra-un-speaker-de-eventos" element={<BlogCuantoCobraSpeakerEventos />} />
            <Route path="/blog/como-elegir-presentador-evento-empresa" element={<BlogComoElegirPresentadorEventoEmpresa />} />
            <Route path="/blog/cuanto-cobra-un-estilista-de-eventos" element={<BlogCuantoCobraEstilistaEventos />} />
            <Route path="/blog/estilista-de-boda-que-incluye" element={<BlogEstilistaBodaQueIncluye />} />
            <Route path="/blog/cuanto-cobra-un-humorista-eventos" element={<BlogCuantoCobraHumoristaEventos />} />
            <Route path="/blog/humorista-cena-empresa-como-elegir" element={<BlogHumoristaCenaEmpresaComoElegir />} />
            <Route path="/presupuesto-boda" element={<PresupuestoBoda />} />
            <Route path="/checklist-evento-empresa" element={<ChecklistEventoEmpresa />} />
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
