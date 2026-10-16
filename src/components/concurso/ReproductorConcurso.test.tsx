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
