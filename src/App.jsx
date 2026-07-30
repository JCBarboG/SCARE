import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Guide from './pages/Guide.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-papel text-slate-900">
      <Header page={page} setPage={setPage} />
      <main className="flex-1">
        {page === 'home' && <Home />}
        {page === 'guide' && <Guide />}
        {page === 'contact' && <Contact />}
      </main>
      <Footer />
    </div>
  );
}
