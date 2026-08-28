/**
 * Formato único de Excel (.xlsx) para las exportaciones del Panel Empresario
 * (Talentos, Historial, Gastos). Mismo estilo de marca que ContractView.tsx:
 * cabecera dorada, filas alternas, totales en negrita. Las columnas marcadas
 * con `dataBar: true` llevan una barra de color proporcional al valor (no hay
 * gráficos nativos vía ExcelJS, esto sustituye a la "gráfica de evolución").
 */
import ExcelJS from 'exceljs';

export type CsvCell = string | number;
export type CsvRow = CsvCell[];

interface CsvSection {
  /** Título de sección (ej. "DESGLOSE MENSUAL"). Omitir para tabla única sin secciones. */
  title?: string;
  header: string[];
  rows: CsvRow[];
  /** Índice (0-based) de la columna numérica que debe llevar barra de datos proporcional. */
  dataBarColumn?: number;
}

const GOLD = 'FFD4AF37';
const GOLD_BORDER = 'FFB8941E';
const DARK = 'FF0A0908';
const STRIPE = 'FFF7F5EF';

export async function buildWorkbook(title: string, sections: CsvSection[]): Promise<ExcelJS.Workbook> {
  const width = Math.max(...sections.map(s => s.header.length));
  const wb = new ExcelJS.Workbook();
  wb.creator = 'XPEAK';
  wb.created = new Date();
  const ws = wb.addWorksheet(title.slice(0, 31), {
    views: [{ state: 'frozen', ySplit: 2 }],
  });

  const generatedAt = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  ws.mergeCells(1, 1, 1, width);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = `XPEAK — ${title}`;
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  ws.getRow(1).height = 28;

  ws.mergeCells(2, 1, 2, width);
  const subtitleCell = ws.getCell(2, 1);
  subtitleCell.value = `Generado el ${generatedAt} · xpeak.es`;
  subtitleCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: GOLD } };
  subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  ws.getRow(2).height = 16;

  for (const section of sections) {
    ws.addRow([]);

    if (section.title) {
      const titleRow = ws.addRow([section.title]);
      ws.mergeCells(titleRow.number, 1, titleRow.number, width);
      titleRow.getCell(1).font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF8A6D0F' } };
    }

    const headerRow = ws.addRow(section.header);
    headerRow.eachCell(cell => {
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1A1208' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GOLD } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { bottom: { style: 'thin', color: { argb: GOLD_BORDER } } };
    });
    headerRow.height = 20;

    const dataBarValues = section.dataBarColumn != null
      ? section.rows.map(r => Number(r[section.dataBarColumn!]) || 0)
      : [];
    const maxDataBar = Math.max(...dataBarValues, 1);

    section.rows.forEach((row, i) => {
      const dataRow = ws.addRow(row);
      dataRow.eachCell(cell => { cell.font = { name: 'Calibri', size: 10 }; cell.alignment = { vertical: 'middle' }; });
      if (i % 2 === 1) {
        dataRow.eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: STRIPE } }; });
      }
      if (section.dataBarColumn != null) {
        const value = Number(row[section.dataBarColumn]) || 0;
        const ratio = maxDataBar > 0 ? value / maxDataBar : 0;
        const barCell = dataRow.getCell(section.dataBarColumn + 1);
        barCell.value = `${'█'.repeat(Math.round(ratio * 10))}${'░'.repeat(10 - Math.round(ratio * 10))}  ${value.toFixed(2)}`;
        barCell.font = { name: 'Consolas', size: 10, color: { argb: 'FF8A6D0F' } };
      }
    });
  }

  const widths = Array.from({ length: width }, (_, i) => {
    const maxLen = Math.max(
      ...sections.flatMap(s => [s.header[i]?.length ?? 0, ...s.rows.map(r => String(r[i] ?? '').length)]),
    );
    return Math.min(Math.max(maxLen + 2, 10), 40);
  });
  ws.columns.forEach((col, i) => { col.width = widths[i]; });

  return wb;
}

export async function downloadWorkbook(wb: ExcelJS.Workbook, filename: string) {
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Fecha en formato ISO (yyyy-mm-dd). */
export function fmtDateISO(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : '—';
}

/** CSV plano de texto, sin estilos — usado por el ZIP RGPD (formato legal/portable, no de diseño). */
export function buildCsv(title: string, sections: Omit<CsvSection, 'dataBarColumn'>[]): string {
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
