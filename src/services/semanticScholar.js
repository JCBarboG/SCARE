// Wrapper cliente para Semantic Scholar (uso local / fallback).
const S2_URL = 'https://api.semanticscholar.org/graph/v1/paper/search';

export async function searchSemanticScholar(title, limit = 10) {
  const url = `${S2_URL}?query=${encodeURIComponent(title)}&limit=${limit}&fields=title,authors,year,abstract`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error consultando Semantic Scholar');
  const data = await res.json();

  return (data.data || []).map((item) => ({
    title: item.title,
    authors: (item.authors || []).map((a) => a.name),
    year: item.year,
    abstract: item.abstract,
  }));
}
