import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Link, Route, Routes } from 'react-router-dom';
import { ReproductorConcursoProvider, useReproductorConcurso } from './ReproductorConcurso';

const Pagina = ({ nombre }: { nombre: string }) => {
  const { reproducir } = useReproductorConcurso();
  return (
    <div>
      <h1>{nombre}</h1>
      <button onClick={() => reproducir({ url: 'https://soundcloud.com/dj/sesion', titulo: 'Sesión de DJ Prueba' })}>escuchar</button>
      <Link to="/otra">ir a otra</Link>
    </div>
  );
};

describe('ReproductorConcurso', () => {
  it('sigue montado al cambiar de página y se cierra con la X', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ReproductorConcursoProvider>
          <Routes>
            <Route path="/" element={<Pagina nombre="inicio" />} />
            <Route path="/otra" element={<Pagina nombre="otra" />} />
          </Routes>
        </ReproductorConcursoProvider>
      </MemoryRouter>,
    );
    expect(screen.queryByRole('region')).toBeNull();
    fireEvent.click(screen.getByText('escuchar'));
    expect(screen.getByText('Sesión de DJ Prueba')).toBeTruthy();
    const iframe = document.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toContain('soundcloud.com/player');
    fireEvent.click(screen.getByText('ir a otra'));
    expect(screen.getByText('otra')).toBeTruthy();
    expect(screen.getByText('Sesión de DJ Prueba')).toBeTruthy();
    expect(document.querySelector('iframe')).toBe(iframe); // el mismo nodo: no se remonta
    expect(document.documentElement.hasAttribute('data-reproductor')).toBe(true);
    fireEvent.click(screen.getByLabelText('Cerrar el reproductor'));
    expect(screen.queryByRole('region')).toBeNull();
    expect(document.querySelector('iframe')).toBeNull();
  });
});

import EmbedDiferido from '@/components/EmbedDiferido';

describe('Anclar una sesión de perfil', () => {
  it('pasa la sesión a la barra y deja la tarjeta como "Sonando en la barra"', () => {
    render(
      <MemoryRouter>
        <ReproductorConcursoProvider>
          <EmbedDiferido src="https://www.mixcloud.com/widget/iframe/?feed=%2Fdj%2Fmix%2F" alto={120} tipo="Mixcloud" titulo="Mix" autor="DJ Prueba" />
        </ReproductorConcursoProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByLabelText('Escuchar Mix'));
    fireEvent.click(screen.getByLabelText('Anclar: seguir escuchando al navegar'));
    expect(screen.getByText(/Mix de DJ Prueba/)).toBeTruthy();
    expect(screen.getByText('Sonando en la barra de abajo')).toBeTruthy();
    const ifr = [...document.querySelectorAll('iframe')].find(f => f.src.includes('mixcloud'));
    expect(ifr?.src).toContain('autoplay=1');
    fireEvent.click(screen.getByLabelText('Cerrar el reproductor'));
    expect(screen.queryByText('Sonando en la barra de abajo')).toBeNull();
  });
});
