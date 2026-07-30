import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchForm({ onSearch, loading }) {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [yearFrom, setYearFrom] = useState(2020);
  const [yearTo, setYearTo] = useState(new Date().getFullYear());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSearch({
      title: title.trim(),
      authors: authors
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      yearFrom: Number(yearFrom),
      yearTo: Number(yearTo),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white/60 border border-slate-200 rounded-xl p-6 shadow-sm"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Título del artículo
        </label>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          required
          placeholder='Ej: "La lista negra"'
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brass"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Autores del artículo (separados por comas)
        </label>
        <textarea
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          rows={2}
          placeholder="Ej: Giancarlo Barbosa González"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brass"
        />
        <p className="text-xs text-slate-400 mt-1">
          Estos autores se excluyen automáticamente de los resultados.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Desde</label>
          <input
            type="number"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-data focus:outline-none focus:ring-2 focus:ring-brass"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hasta</label>
          <input
            type="number"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-data focus:outline-none focus:ring-2 focus:ring-brass"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-deep disabled:opacity-50 text-papel font-medium py-3 rounded-lg transition-colors"
      >
        <Search size={18} />
        {loading ? 'Buscando…' : 'Buscar revisores'}
      </button>
    </form>
  );
}
