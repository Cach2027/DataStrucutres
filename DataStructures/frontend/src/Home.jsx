// src/Home.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center text-center py-20 px-6 bg-[#D1DDDB] min-h-screen">
      {/* Botón menú arriba izquierda */}
      <button
        onClick={() => setMenuOpen(true)}
        className="absolute top-6 left-6 text-3xl font-bold text-[#1D6A96] hover:text-[#85B8CB]"
      >
        ☰
      </button>

      {/* Título */}
      <h1 className="text-6xl font-extrabold text-[#1D6A96] drop-shadow-md mb-6">
        Ciencias de la Computación II
      </h1>

      {/* Botón debajo del título */}
      <button
        onClick={() => setMenuOpen(true)}
        className="px-6 py-3 bg-[#1D6A96] text-white rounded-lg shadow-md hover:bg-[#144B66] transition"
      >
        Menú
      </button>

      

      {/* Menú lateral */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

export default Home;
