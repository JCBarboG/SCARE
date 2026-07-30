import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy-deep border-t-[3px] border-brass py-6 mt-12">
      <p className="text-center text-papel/70 text-sm font-sans">
        © {new Date().getFullYear()} SCARE — Sistema de búsqueda de Autores y Revisores Expertos
      </p>
    </footer>
  );
}
