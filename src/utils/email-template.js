function guessTopic(title) {
  if (!title) return 'el área de este trabajo';
  // Heurística simple: usa el título completo si es corto, o lo trunca.
  return title.length <= 60 ? title : `${title.slice(0, 57)}...`;
}

export function buildEmailTemplate(reviewer, articleTitle) {
  const nombre = reviewer?.author || '[NOMBRE_REVISOR]';
  const titulo = articleTitle || '[TÍTULO_ARTÍCULO]';
  const tema = guessTopic(articleTitle);

  return `Buenas tardes, Doctor(a) ${nombre},

Espero que se encuentre bien. Le escribo para invitarle cordialmente a ser revisor de nuestro artículo titulado:

"${titulo}"

Su experiencia en temas relacionados a ${tema} lo hace un candidato ideal para realizar una revisión exhaustiva de nuestro trabajo.

Si acepta esta invitación, le solicitaríamos que complete un formulario de evaluación con sus recomendaciones y comentarios constructivos.

Agradecemos de antemano su tiempo y dedicación.

Saludos cordiales,
[Su nombre]
[Su institución]`;
}
