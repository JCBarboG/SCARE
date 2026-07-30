import * as XLSX from 'xlsx';

export function exportToExcel(reviewers, filename = 'scare-revisores.xlsx') {
  const rows = reviewers.map((r) => ({
    Autor: r.author,
    Afiliación: r.affiliation || 'No se encontró',
    Correo: r.email,
    'Artículo similar': r.articleTitle,
    '% Similitud': r.similarity,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Revisores');
  XLSX.writeFile(workbook, filename);
}
