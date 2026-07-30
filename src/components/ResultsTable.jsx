import React, { useState } from 'react';
import { Copy, Trash2, Mail, Download } from 'lucide-react';
import { exportToExcel } from '../utils/excel-export.js';

export default function ResultsTable({ reviewers, setReviewers, onGenerateEmail }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const remove = (id) => {
    setReviewers((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const copyCell = (value) => {
    navigator.clipboard.writeText(value ?? '');
  };

  if (!reviewers.length) return null;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif italic text-xl text-navy">
          Revisores encontrados ({reviewers.length})
        </h2>
        <button
          onClick={() => exportToExcel(reviewers)}
          className="flex items-center gap-2 text-sm bg-brass text-navy-deep font-medium px-3 py-2 rounded-lg hover:opacity-90"
        >
          <Download size={16} />
          Descargar Excel
        </button>
      </div>

      {/* Tabla desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-navy text-papel">
            <tr>
              <th className="p-3 text-left w-8"></th>
              <th className="p-3 text-left">Autor</th>
              <th className="p-3 text-left">Afiliación</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Artículo similar</th>
              <th className="p-3 text-left">% Similitud</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reviewers.map((r, i) => (
              <tr
                key={r.id}
                className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-100'} hover:opacity-90`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                  />
                </td>
                <td className="p-3 font-medium">{r.author}</td>
                <td className="p-3 text-slate-600">{r.affiliation || 'No se encontró'}</td>
                <td className="p-3">
                  <button
                    onClick={() => copyCell(r.email)}
                    className="font-data bg-slate-100 px-2 py-1 rounded hover:bg-slate-200"
                    title="Copiar correo"
                  >
                    {r.email}
                  </button>
                </td>
                <td className="p-3 text-slate-600">{r.articleTitle}</td>
                <td className="p-3 font-data">{r.similarity}%</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onGenerateEmail(r)}
                      title="Generar correo"
                      className="text-navy hover:text-brass"
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      onClick={() => copyCell(`${r.author} — ${r.email}`)}
                      title="Copiar fila"
                      className="text-navy hover:text-brass"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => remove(r.id)}
                      title="Eliminar"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards móvil */}
      <div className="md:hidden flex flex-col gap-3">
        {reviewers.map((r) => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium">{r.author}</h3>
              <input
                type="checkbox"
                checked={selected.has(r.id)}
                onChange={() => toggle(r.id)}
              />
            </div>
            <p className="text-sm text-slate-600 mb-1">{r.affiliation || 'No se encontró'}</p>
            <p className="text-sm font-data bg-slate-100 rounded px-2 py-1 inline-block mb-2">
              {r.email}
            </p>
            <p className="text-sm text-slate-600 mb-1">{r.articleTitle}</p>
            <p className="text-sm font-data mb-3">{r.similarity}% similitud</p>
            <div className="flex gap-3">
              <button onClick={() => onGenerateEmail(r)} className="text-navy text-sm flex items-center gap-1">
                <Mail size={14} /> Correo
              </button>
              <button onClick={() => remove(r.id)} className="text-red-500 text-sm flex items-center gap-1">
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
