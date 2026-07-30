import React from 'react';

export default function ProgressBar({ label = 'Buscando revisores…' }) {
  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <p className="text-sm text-slate-600 mb-2 font-sans">{label}</p>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-brass animate-pulse w-2/3 rounded-full transition-all duration-500" />
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Esto puede tardar entre 15 y 30 segundos. La plataforma sigue trabajando.
      </p>
    </div>
  );
}
