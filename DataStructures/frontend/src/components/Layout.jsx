// src/components/Layout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#D1DDDB]">
      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#1D6A96] to-[#85B8CB] text-white p-4 flex items-center justify-between shadow-md">
        <button onClick={() => setMenuOpen(true)} className="text-2xl font-bold">
          ☰
        </button>
        <h1 className="text-2xl font-bold">🏫 Ciencias de la Computación II</h1>
        <div className="w-8" /> {/* para centrar */}
      </header>

      {/* Contenido */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#283B42] text-gray-200 text-center p-4">
        <p>👨‍💻 Desarrollado por <b className="text-white">Carlos Celis</b></p>
      </footer>
    </div>
  );
}

export default Layout;
