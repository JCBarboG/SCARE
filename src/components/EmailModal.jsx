import React, { useState, useEffect } from 'react';
import { X, Copy } from 'lucide-react';
import { buildEmailTemplate } from '../utils/email-template.js';

export default function EmailModal({ reviewer, articleTitle, onClose }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (reviewer) {
      setText(buildEmailTemplate(reviewer, articleTitle));
    }
  }, [reviewer, articleTitle]);

  if (!reviewer) return null;

  const copy = () => navigator.clipboard.writeText(text);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-papel w-full max-w-xl rounded-xl overflow-hidden shadow-xl">
        <div className="bg-navy border-b-[3px] border-brass px-5 py-4 flex items-center justify-between">
          <h3 className="font-serif italic text-lg text-papel">
            Generar correo para revisor
          </h3>
          <button onClick={onClose} className="text-papel hover:text-brass">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brass"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              Cerrar
            </button>
            <button
              onClick={copy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brass text-navy-deep font-medium hover:opacity-90"
            >
              <Copy size={16} />
              Copiar correo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
