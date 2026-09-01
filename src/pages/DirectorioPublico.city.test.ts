import { describe, it, expect } from 'vitest';
import { cityFromParam } from './DirectorioPublico';
import { expandRole, canonicalRole } from '@/lib/constants';

// El filtro de ciudad se guardaba solo en useState, así que entrar por un
// enlace a ?ciudad=madrid mostraba los perfiles de TODAS las provincias como
// si fueran de Madrid (verificado en producción: /directorio/staff y
// /directorio/staff?ciudad=madrid devolvían los mismos 7 perfiles, incluidos
// los de Palma y A Coruña).
describe('cityFromParam', () => {
  it('sin parámetro no filtra', () => {
    expect(cityFromParam(null)).toBe('Todas');
    expect(cityFromParam('')).toBe('Todas');
  });

  it('reconoce una ciudad de la lista', () => {
    expect(cityFromParam('Madrid')).toBe('Madrid');
    expect(cityFromParam('Barcelona')).toBe('Barcelona');
  });

  it('acepta minúsculas, espacios y acentos como llegan en una URL', () => {
    expect(cityFromParam('madrid')).toBe('Madrid');
    expect(cityFromParam('  madrid  ')).toBe('Madrid');
    expect(cityFromParam('malaga')).toBe('Málaga');
    expect(cityFromParam('MÁLAGA')).toBe('Málaga');
  });

  it('ignora valores que no son ciudades en vez de filtrar por basura', () => {
    expect(cityFromParam('<script>')).toBe('Todas');
    expect(cityFromParam('Cuenca')).toBe('Todas');
  });
});

// staff y camarero son el mismo rol de cara al usuario ('camarero' es legacy).
// El mapa estaba duplicado a mano en varios sitios y cada copia contemplaba
// alias distintos, así que un perfil salía en una vista y no en otra.
describe('alias de roles', () => {
  it('staff arrastra a los camareros legacy', () => {
    expect(expandRole('staff').sort()).toEqual(['camarero', 'staff']);
  });

  it('makeup arrastra a peluquería', () => {
    expect(expandRole('makeup').sort()).toEqual(['makeup', 'peluqueria']);
  });

  it('un rol sin alias se queda como está', () => {
    expect(expandRole('dj')).toEqual(['dj']);
  });

  it('agrupa las variantes bajo un único rol canónico', () => {
    expect(canonicalRole('camarero')).toBe('staff');
    expect(canonicalRole('staff')).toBe('staff');
    expect(canonicalRole('peluqueria')).toBe('makeup');
    expect(canonicalRole('dj')).toBe('dj');
    expect(canonicalRole(null)).toBeNull();
  });
});
