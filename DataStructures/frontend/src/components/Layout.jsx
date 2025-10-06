// src/components/Layout.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SidebarMenu from "./Sidebar";

function Layout({ children, title = "Ciencias de la Computación II", color = "from-cerulean to-turquoise" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#D1DDDB]">
      {/* 🔹 Sidebar (Menú lateral) */}
      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Header con gradiente dinámico */}
      <header className={`${color} text-white p-4 flex items-center shadow-md`}>
        {/* Botón abrir menú */}
        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl mr-4 hover:scale-110 transition-transform"
        >
          ☰
        </button>

        {/* Columna izquierda (volver) */}
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 rounded bg-white/20 hover:bg-white/30"
          >
            ⬅ Volver
          </button>
        </div>

        {/* Columna centro (titulo dinámico siempre centrado) */}
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        {/* Columna derecha (inicio) */}
        <div className="flex-1 flex justify-end">
          <Link
            to="/"
            className="px-3 py-1 rounded bg-white/20 hover:bg-white/30"
          >
            Inicio 🏠
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#283B42] text-gray-200 text-center p-4">
        <p>
          👨‍💻 Desarrollado por <b className="text-white">Carlos Celis</b>
        </p>
      </footer>
    </div>
  );
}

export default Layout;
