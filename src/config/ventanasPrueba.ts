import ventanas from './ventanasPrueba.json';

// Ventanas de prueba de la portada (Ficha XDS despedidas, 31 oct 2026). Cada una
// se apaga cambiando "activa" a false en ventanasPrueba.json; los scripts de
// prerender y sitemap leen el mismo archivo, así que no queda nada a medias.
export type VentanaPrueba = 'healthyZone' | 'despedidas';

export const ventanaActiva = (v: VentanaPrueba): boolean => ventanas[v].activa === true;
