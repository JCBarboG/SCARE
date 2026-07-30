import React, { useState } from 'react';
import SearchForm from '../components/SearchForm.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ResultsTable from '../components/ResultsTable.jsx';
import EmailModal from '../components/EmailModal.jsx';
import { searchReviewers } from '../services/api.js';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [articleTitle, setArticleTitle] = useState('');
  const [emailTarget, setEmailTarget] = useState(null);

  const handleSearch = async (payload) => {
    setLoading(true);
    setError(null);
    setReviewers([]);
    setArticleTitle(payload.title);

    try {
      const data = await searchReviewers(payload);
      setReviewers(data.reviewers || []);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al buscar revisores.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10">
      <section className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-serif italic text-3xl md:text-4xl text-navy mb-3">
          Busca revisores expertos
        </h1>
        <p className="text-slate-600">
          Automatiza la búsqueda de revisores académicos a partir del título y autores
          de tu artículo. Sin registro, sin costo.
        </p>
      </section>

      <SearchForm onSearch={handleSearch} loading={loading} />

      {loading && <ProgressBar />}

      {error && (
        <p className="max-w-2xl mx-auto mt-4 text-center text-red-600 text-sm">{error}</p>
      )}

      <ResultsTable
        reviewers={reviewers}
        setReviewers={setReviewers}
        onGenerateEmail={(r) => setEmailTarget(r)}
      />

      <EmailModal
        reviewer={emailTarget}
        articleTitle={articleTitle}
        onClose={() => setEmailTarget(null)}
      />
    </div>
  );
}
