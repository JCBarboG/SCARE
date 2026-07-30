import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

export default function Header({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: 'home', label: 'Inicio' },
    { id: 'guide', label: 'Guía' },
    { id: 'contact', label: 'Contacto' },
  ];

  const go = (id) => {
    setPage(id);
    setMenuOpen(false);
  };

  return (
    <header className="bg-navy border-b-[3px] border-brass sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2 text-papel"
        >
          <span className="w-8 h-8 rounded bg-brass text-navy-deep flex items-center justify-center font-bold">
            <Search size={18} />
          </span>
          <span className="font-serif italic text-xl tracking-wide">SCARE</span>
        </button>

        <nav className="hidden md:flex gap-6">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`text-sm font-medium transition-opacity ${
                page === l.id ? 'text-brass' : 'text-papel/80 hover:opacity-80'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          className="md:hidden text-papel"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-3">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`text-left text-sm py-2 ${
                page === l.id ? 'text-brass' : 'text-papel/80'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
