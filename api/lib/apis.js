import axios from 'axios';

const CROSSREF_URL = 'https://api.crossref.org/works';
const S2_URL = 'https://api.semanticscholar.org/graph/v1/paper/search';

/**
 * Busca artículos en CrossRef por título.
 */
export async function searchCrossref(title, rows = 10) {
  const { data } = await axios.get(CROSSREF_URL, {
    params: { 'query.bibliographic': title, rows },
    timeout: 10000,
  });

  return (data.message?.items || []).map((item) => ({
    source: 'crossref',
    title: item.title?.[0] || '',
    authors: (item.author || []).map((a) => `${a.given || ''} ${a.family || ''}`.trim()),
    year: item.issued?.['date-parts']?.[0]?.[0] || null,
    doi: item.DOI || null,
  }));
}

/**
 * Busca artículos en Semantic Scholar por título.
 */
export async function searchSemanticScholar(title, limit = 10) {
  const { data } = await axios.get(S2_URL, {
    params: { query: title, limit, fields: 'title,authors,year,abstract' },
    timeout: 10000,
  });

  return (data.data || []).map((item) => ({
    source: 'semantic-scholar',
    title: item.title || '',
    authors: (item.authors || []).map((a) => a.name),
    year: item.year || null,
    abstract: item.abstract || null,
  }));
}

/**
 * Combina resultados de ambas fuentes en paralelo.
 */
export async function searchAllSources(title) {
  const [crossref, semanticScholar] = await Promise.allSettled([
    searchCrossref(title),
    searchSemanticScholar(title),
  ]);

  return [
    ...(crossref.status === 'fulfilled' ? crossref.value : []),
    ...(semanticScholar.status === 'fulfilled' ? semanticScholar.value : []),
  ];
}

/**
 * Calcula una similitud simple (0-100) entre dos títulos usando
 * coincidencia de palabras. Sirve como aproximación de "% similitud"
 * mientras no se integra un modelo de embeddings.
 */
export function titleSimilarity(a, b) {
  const norm = (s) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .split(/\W+/)
      .filter(Boolean);

  const wordsA = new Set(norm(a));
  const wordsB = new Set(norm(b));
  if (!wordsA.size || !wordsB.size) return 0;

  let overlap = 0;
  for (const w of wordsA) if (wordsB.has(w)) overlap++;

  return Math.round((overlap / Math.max(wordsA.size, wordsB.size)) * 100);
}
