// Wrapper cliente para consultar CrossRef directamente desde el navegador.
// Uso principal: pruebas locales o fallback si el backend no está disponible.
const CROSSREF_URL = 'https://api.crossref.org/works';

export async function searchCrossref(title, rows = 10) {
  const url = `${CROSSREF_URL}?query.bibliographic=${encodeURIComponent(title)}&rows=${rows}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error consultando CrossRef');
  const data = await res.json();

  return (data.message?.items || []).map((item) => ({
    title: item.title?.[0] || '',
    authors: (item.author || []).map((a) => `${a.given || ''} ${a.family || ''}`.trim()),
    year: item.issued?.['date-parts']?.[0]?.[0] || null,
    doi: item.DOI,
  }));
}
