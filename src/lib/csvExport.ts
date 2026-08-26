/**
 * Formato único de CSV para todas las exportaciones del Panel Empresario
 * (Talentos, Historial, Gastos). Antes cada tab tenía su propio CSV plano
 * sin cabecera ni contexto — visualmente distintos entre sí. Este helper
 * fija un único diseño: cabecera "XPEAK — {título}" + fecha de generación,
 * secciones opcionales en mayúsculas, y ancho de columna consistente.
 */

export type CsvCell = string | number;
export type CsvRow = CsvCell[];

interface CsvSection {
  /** Título de sección en mayúsculas (ej. "DESGLOSE MENSUAL"). Omitir para tabla única sin secciones. */
  title?: string;
  header: string[];
  rows: CsvRow[];
}

export function buildCsv(title: string, sections: CsvSection[]): string {
  const width = Math.max(...sections.map(s => s.header.length));
  const pad = (row: CsvCell[]): CsvCell[] => row.concat(Array(Math.max(0, width - row.length)).fill(''));
  const generatedAt = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  const lines: CsvCell[][] = [
    pad([`XPEAK — ${title}`]),
    pad([`Generado el ${generatedAt}`]),
  ];

  for (const section of sections) {
    lines.push(pad([]));
    if (section.title) lines.push(pad([section.title]));
    lines.push(pad(section.header));
    for (const row of section.rows) lines.push(pad(row));
  }

  return lines
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Fecha en formato ISO (yyyy-mm-dd) — Excel/Sheets la reconoce como fecha real y permite ordenar/filtrar. */
export function fmtDateISO(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : '—';
}
