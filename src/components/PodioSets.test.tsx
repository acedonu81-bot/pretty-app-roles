import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import PodioSets from './PodioSets';
import type { PuestoPodio } from '@/hooks/usePodioSets';

const puesto = (n: 1 | 2 | 3, escuchas: number): PuestoPodio => ({
  puesto: n, set_url: `https://soundcloud.com/dj${n}/set-${n}`, dj_user_id: `dj-${n}`,
  nombre: `DJ ${n}`, foto: null, escuchas, titulo: `Set ${n}`, portada: null,
});

describe('PodioSets', () => {
  it('sin escuchas no pinta nada', () => {
    const { container } = render(<PodioSets podio={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('pinta oro, plata y bronce con sus escuchas y enlaza al DJ', () => {
    render(<PodioSets podio={[puesto(1, 40), puesto(2, 25), puesto(3, 1)]} />);
    expect(screen.getByLabelText('Medalla de oro: puesto 1')).toBeTruthy();
    expect(screen.getByLabelText('Medalla de plata: puesto 2')).toBeTruthy();
    expect(screen.getByLabelText('Medalla de bronce: puesto 3')).toBeTruthy();
    expect(screen.getByText('40 escuchas')).toBeTruthy();
    expect(screen.getByText('1 escucha')).toBeTruthy();
    expect(screen.getByText('Set 1').closest('a')?.getAttribute('href')).toBe('/p/dj-1');
  });

  it('con solo dos sets en el podio no se inventa el tercero', () => {
    render(<PodioSets podio={[puesto(1, 3), puesto(2, 2)]} />);
    expect(screen.queryByLabelText('Medalla de bronce: puesto 3')).toBeNull();
  });
});
