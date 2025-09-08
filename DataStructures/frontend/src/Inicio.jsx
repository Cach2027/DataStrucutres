import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Inicio() {
  const [message, setMessage] = useState("Cargando...");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/ping")
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("❌ Error al conectar con backend"));
  }, []);

  // Efecto para aplicar la clase `dark` al <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-500">
      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-800 text-gray-200 shadow-xl transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-bold">📚 Algoritmos</h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl hover:text-red-400 transition"
          >
            ❌
          </button>
        </div>
        <nav className="p-6 space-y-6">
          {/* Búsquedas */}
          <div>
            <h3 className="font-bold text-sky-400">🔎 Búsquedas Internas</h3>
            <ul className="ml-4 mt-2 space-y-2">
              <li>
                <Link
                  to="/binary-search"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-sky-300"
                >
                  🔍 Búsqueda Binaria
                </Link>
              </li>
              <li>
                <Link
                  to="/linear-search"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-sky-300"
                >
                  🔎 Búsqueda Lineal
                </Link>
              </li>
            </ul>
          </div>

          {/* Funciones Hash */}
          <div>
            <h3 className="font-bold text-teal-400">⚡ Funciones Hash</h3>
            <ul className="ml-4 mt-2 space-y-2">
              <li>
                <Link
                  to="/hash-mod"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-teal-300"
                >
                  ➗ Función MOD
                </Link>
              </li>
              <li>
                <Link
                  to="/hash-square"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-teal-300"
                >
                  🔲 Función Cuadrada
                </Link>
              </li>
              <li>
                <Link
                  to="/hash-trunc"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-teal-300"
                >
                  ✂️ Función Truncamiento
                </Link>
              </li>
              <li>
                <Link
                  to="/hash-folding"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-teal-300"
                >
                  📦 Función Plegamiento
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 flex items-center justify-between shadow-md">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-2xl font-bold hover:text-sky-400 transition"
          >
            ☰
          </button>

          <h1 className="text-2xl font-bold text-center flex-1">
            Ciencias de la Computación
          </h1>

          {/* Botón dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl px-3 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </header>

        {/* Descripción */}
        <main className="flex-1 p-10 text-center">
          <h2 className="text-2xl font-semibold mb-6 text-blue-800 dark:text-blue-300">
            Bienvenido al Aplicativo de Algoritmos de Búsqueda e Inserción
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            📚 Este aplicativo interactivo permite explorar y visualizar
            diferentes <b>estructuras de datos y algoritmos clásicos</b> como
            búsqueda binaria, búsqueda lineal, tablas hash y algoritmos de
            ordenamiento.
            <br />
            <br />
            La idea es ayudar a estudiantes a{" "}
            <b>comprender su funcionamiento paso a paso</b> de manera intuitiva.
          </p>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 text-center p-4">
          <p>
            👨‍💻 Desarrollado por{" "}
            <b className="text-white">Carlos Celis</b>
          </p>
          <p>📧 contacto: tuemail@ejemplo.com</p>
          <p>
            🌐{" "}
            <a
              href="https://github.com/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400"
            >
              GitHub
            </a>{" "}
            |{" "}
            <a
              href="https://linkedin.com/in/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 ml-2"
            >
              LinkedIn
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Inicio;
