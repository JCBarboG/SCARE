import React from 'react';

const steps = [
  ['Completa el formulario', 'Pega el título del artículo, los autores originales y el rango de años.'],
  ['Presiona "Buscar revisores"', 'SCARE consulta CrossRef y Semantic Scholar en paralelo, filtra por año y excluye a los autores originales.'],
  ['Revisa la tabla de resultados', 'Cada fila incluye nombre, afiliación (si está disponible), correo y el artículo que motivó la sugerencia.'],
  ['Exporta o contacta', 'Descarga los resultados en Excel, copia datos individuales o genera un correo de invitación listo para editar.'],
];

export default function Guide() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-serif italic text-3xl text-navy mb-6">Guía de uso</h1>
      <ol className="space-y-5">
        {steps.map(([title, desc], i) => (
          <li key={i} className="flex gap-4">
            <span className="w-8 h-8 shrink-0 rounded-full bg-navy text-papel flex items-center justify-center font-data text-sm">
              {i + 1}
            </span>
            <div>
              <h2 className="font-medium text-slate-900">{title}</h2>
              <p className="text-slate-600 text-sm">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
