import { searchAllSources, titleSimilarity } from './apis.js';
import { enrichAuthorsWithContact } from './scholarly.js';

function normalize(name) {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function includesOriginalAuthor(candidateAuthors, originalAuthors) {
  const originals = originalAuthors.map(normalize);
  return candidateAuthors.some((a) => originals.some((o) => o && normalize(a).includes(o)));
}

/**
 * Ejecuta el flujo completo de búsqueda de revisores descrito en el
 * endpoint POST /api/search-reviewers:
 * 1. Busca en CrossRef + Semantic Scholar (paralelo)
 * 2. Filtra por rango de años
 * 3. Excluye artículos de los autores originales
 * 4. Enriquece autores candidatos con Scholarly (correo/afiliación)
 * 5. Descarta artículos sin ningún correo encontrado
 */
export async function runReviewerSearch({ title, authors = [], yearFrom, yearTo }, onProgress) {
  const candidates = await searchAllSources(title);

  const filtered = candidates.filter((c) => {
    if (!c.year) return true; // no descartar por falta de metadato
    if (yearFrom && c.year < yearFrom) return false;
    if (yearTo && c.year > yearTo) return false;
    return true;
  });

  const excludingOriginal = filtered.filter(
    (c) => !includesOriginalAuthor(c.authors, authors)
  );

  // Autores únicos candidatos a revisor, ordenados por similitud del
  // artículo en el que aparecen.
  const seenAuthors = new Set();
  const candidateAuthors = [];

  for (const article of excludingOriginal) {
    const similarity = titleSimilarity(title, article.title);
    for (const authorName of article.authors) {
      const key = normalize(authorName);
      if (!key || seenAuthors.has(key)) continue;
      seenAuthors.add(key);
      candidateAuthors.push({ authorName, article, similarity });
    }
  }

  candidateAuthors.sort((a, b) => b.similarity - a.similarity);

  const namesToEnrich = candidateAuthors.map((c) => c.authorName);
  const enriched = await enrichAuthorsWithContact(namesToEnrich, onProgress);
  const contactByName = new Map(enriched.map((e) => [normalize(e.name), e]));

  const reviewers = [];
  let id = 1;

  for (const candidate of candidateAuthors) {
    const contact = contactByName.get(normalize(candidate.authorName));
    if (!contact?.email) continue; // descartar sin correo (regla del spec)

    reviewers.push({
      id: id++,
      author: candidate.authorName,
      affiliation: contact.affiliation || null,
      email: contact.email,
      articleTitle: candidate.article.title,
      similarity: candidate.similarity,
    });
  }

  return reviewers;
}
