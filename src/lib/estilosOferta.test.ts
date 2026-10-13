import { describe, it, expect } from 'vitest';
import { pideDeTodo, noEncajaEnDeTodo, listarEstilos } from './estilosOferta';

describe('oferta de DJ "de todo un poco"', () => {
  it('un DJ sin estilos concretos pide de todo; con estilos, no; otro rol, no', () => {
    expect(pideDeTodo(['DJ / Artista'], null)).toBe(true);
    expect(pideDeTodo(['DJ / Artista'], [])).toBe(true);
    expect(pideDeTodo(['DJ / Artista'], ['Techno'])).toBe(false);
    expect(pideDeTodo(['Fotógrafo'], null)).toBe(false);
  });
  it('solo House y Remember no encaja; con algo comercial o latino, sí', () => {
    expect(noEncajaEnDeTodo(['House', 'Remember'])).toBe(true);
    expect(noEncajaEnDeTodo(['Tech House', 'Pachanga'])).toBe(true);
    expect(noEncajaEnDeTodo(['House', 'comercial'])).toBe(false);
    expect(noEncajaEnDeTodo(['Remember', 'Reggaetón'])).toBe(false);
  });
  it('sin estilos declarados no se le avisa de nada', () => {
    expect(noEncajaEnDeTodo(null)).toBe(false);
    expect(noEncajaEnDeTodo([])).toBe(false);
  });
  it('lista como mucho 4 estilos', () => {
    expect(listarEstilos(['A', 'B', 'C', 'D', 'E'])).toBe('A, B, C, D');
  });
});
