import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.join(__dirname, 'scholarly_search.py');

const MAX_SEARCHES = Number(process.env.SCHOLARLY_MAX_SEARCHES || 5);
const DELAY_MS = Number(process.env.SCHOLARLY_DELAY_MS || 4000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ejecuta scholarly_search.py para un autor y devuelve
 * { found, name, affiliation, email } o null en caso de error.
 */
function runScholarly(authorName) {
  return new Promise((resolve) => {
    const proc = spawn('python3', [SCRIPT_PATH, authorName]);
    let out = '';
    let err = '';

    proc.stdout.on('data', (d) => (out += d.toString()));
    proc.stderr.on('data', (d) => (err += d.toString()));

    proc.on('close', () => {
      try {
        resolve(JSON.parse(out));
      } catch {
        resolve({ found: false, error: err || 'salida inválida de scholarly' });
      }
    });

    proc.on('error', () => resolve({ found: false, error: 'python3 no disponible' }));
  });
}

/**
 * Busca correos/afiliaciones para una lista de nombres de autores,
 * respetando el límite de búsquedas por sesión y el delay entre
 * peticiones para evitar bloqueos de Google Académico.
 */
export async function enrichAuthorsWithContact(authorNames, onProgress) {
  const results = [];
  const names = authorNames.slice(0, MAX_SEARCHES);

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    onProgress?.({ current: i + 1, total: names.length, name });

    const info = await runScholarly(name);
    results.push({
      name,
      affiliation: info?.affiliation || null,
      email: info?.email || null,
      found: Boolean(info?.found),
    });

    if (i < names.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  return results;
}
