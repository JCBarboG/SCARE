const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function searchReviewers({ title, authors, yearFrom, yearTo }) {
  const res = await fetch(`${BASE_URL}/search-reviewers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, authors, yearFrom, yearTo }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error del servidor (${res.status})`);
  }

  return res.json();
}
