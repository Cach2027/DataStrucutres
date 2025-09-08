import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BinarySearch() {
  const [size, setSize] = useState(5);
  const [array, setArray] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [target, setTarget] = useState("");
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [digits, setDigits] = useState(2);
  const [autoPlay, setAutoPlay] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Dark mode efecto
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Animación automática
  useEffect(() => {
    let timer;
    if (autoPlay && result && currentStep < result.steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), 1000);
    }
    if (result && currentStep === result.steps.length - 1 && result.found) {
      setHighlightedIndex(result.found_index);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, currentStep, result]);

  const addNumber = () => {
    if (currentInput === "" || array.length >= size) return;
    const num = parseInt(currentInput);
    if (num.toString().length !== digits) {
      alert(`El número debe tener exactamente ${digits} dígitos`);
      return;
    }
    if (array.includes(num)) {
      alert("⚠️ No se pueden ingresar números repetidos");
      setCurrentInput("");
      return;
    }
    setArray([...array, num]);
    setCurrentInput("");
  };

  const clearArray = () => {
    setArray([]);
    setResult(null);
    setCurrentStep(0);
    setAutoPlay(false);
    setHighlightedIndex(null);
  };

  const handleSearch = async () => {
    if (!target) return alert("Ingresa un número a buscar");
    try {
      const res = await axios.post("http://127.0.0.1:8000/binary_search", {
        array: array.length > 0 ? array : null,
        size: array.length === 0 ? size : null,
        digits: digits,
        target: parseInt(target),
      });
      setResult(res.data);
      setCurrentStep(0);
      setAutoPlay(false);
      setHighlightedIndex(null);
    } catch (err) {
      console.error(err);
      alert("Error en la búsqueda");
    }
  };

  const nextStep = () => { if (result && currentStep < result.steps.length - 1) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const toggleAutoPlay = () => setAutoPlay(!autoPlay);

  const getBoxStyle = (index) => {
    if (!result) return "bg-gray-200 dark:bg-gray-700 text-black";
    if (highlightedIndex === index) return "bg-red-500 text-white font-bold";
    const step = result.steps[currentStep];
    if (index === step.left) return "bg-blue-500 text-white";
    if (index === step.right) return "bg-green-400 text-black";
    if (index === step.mid) return "bg-yellow-400 text-black font-bold";
    return "bg-gray-200 dark:bg-gray-700 text-black";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-500">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 shadow-md flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl font-bold hover:text-sky-400 transition"
        >
          ☰
        </button>
        <h1 className="text-3xl font-bold text-center flex-1">🔍 Búsqueda Binaria</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl px-3 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        ></div>
      )}

      <div className="flex flex-1">
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
            <div>
              <h3 className="font-bold text-sky-400">🔎 Búsquedas Internas</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li><Link to="/binary-search" onClick={() => setMenuOpen(false)} className="block hover:text-sky-300">🔍 Búsqueda Binaria</Link></li>
                <li><Link to="/linear-search" onClick={() => setMenuOpen(false)} className="block hover:text-sky-300">🔎 Búsqueda Lineal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-teal-400">⚡ Funciones Hash</h3>
              <ul className="ml-4 mt-2 space-y-2">
                <li><Link to="/hash-mod" onClick={() => setMenuOpen(false)} className="block hover:text-teal-300">➗ Función MOD</Link></li>
                <li><Link to="/hash-square" onClick={() => setMenuOpen(false)} className="block hover:text-teal-300">🔲 Función Cuadrada</Link></li>
                <li><Link to="/hash-trunc" onClick={() => setMenuOpen(false)} className="block hover:text-teal-300">✂️ Función Truncamiento</Link></li>
                <li><Link to="/hash-folding" onClick={() => setMenuOpen(false)} className="block hover:text-teal-300">📦 Función Plegamiento</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-10 flex-1">
          {/* Izquierda: Interactivo */}
          <section className="flex flex-col items-center">
            {/* Configuración */}
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <div>
                <label className="block mb-1">Tamaño del array</label>
                <input type="number" min="2" max="20" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="p-2 rounded border border-gray-400 dark:border-gray-600" />
              </div>
              <div>
                <label className="block mb-1">Tamaño de las claves</label>
                <input type="number" min="1" max="10" value={digits} onChange={(e) => setDigits(parseInt(e.target.value))} className="p-2 rounded border border-gray-400 dark:border-gray-600" />
              </div>
            </div>

            {/* Inputs y botones */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <input type="number" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} placeholder="Insertar clave" className="p-2 rounded border border-gray-400 dark:border-gray-600" />
              <button onClick={addNumber} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">➕ Agregar</button>
              <button onClick={clearArray} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">🗑️ Limpiar</button>
            </div>

            <p className="mb-4">Array actual: [{array.join(", ")}]</p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Clave a buscar" className="p-2 rounded border border-gray-400 dark:border-gray-600" />
              <button onClick={handleSearch} className="px-4 py-2 bg-green-400 text-black rounded hover:bg-green-500 transition">🔍 Buscar</button>
            </div>

            {/* Animación pasos */}
            {result && (
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {result.array.map((num, index) => (
                    <div key={index} className={`w-12 h-12 flex items-center justify-center rounded border ${getBoxStyle(index)} transition-all duration-500`}>{num}</div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 mb-4">
                  <button onClick={prevStep} disabled={currentStep === 0} className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50 hover:bg-gray-500 transition">⬅️ Anterior</button>
                  <button onClick={nextStep} disabled={currentStep === result.steps.length - 1} className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50 hover:bg-gray-500 transition">Siguiente ➡️</button>
                  <button onClick={toggleAutoPlay} className={`px-4 py-2 rounded ${autoPlay ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white hover:bg-blue-600'} transition`}>
                    {autoPlay ? '⏸️ Pausar' : '▶️ Auto'}
                  </button>
                </div>

                <p className="mb-2">
                  Paso {currentStep + 1} de {result.steps.length} | left={result.steps[currentStep].left}, right={result.steps[currentStep].right}, mid={result.steps[currentStep].mid}, valor={result.steps[currentStep].mid_value}
                </p>

                <h2 className={`text-2xl font-bold ${result.found ? 'text-green-400' : 'text-red-500'}`}>
                  Resultado: {result.found ? `✅ Encontrado en posición ${result.position}` : "❌ No encontrado"}
                </h2>
              </div>
            )}
          </section>

          {/* Derecha: Contexto educativo */}
          <aside className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-md text-left">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">📘 ¿Qué es la Búsqueda Binaria?</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              La búsqueda binaria es un algoritmo eficiente para encontrar un elemento dentro de un array <b>ordenado</b>. Divide repetidamente el espacio de búsqueda a la mitad hasta encontrar el elemento o determinar que no está presente.
            </p>
            <h3 className="font-semibold mb-2 text-teal-600 dark:text-teal-400">Cómo usar esta herramienta:</h3>
            <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Define el tamaño del array y el número de dígitos de cada clave.</li>
              <li>Agrega números únicos al array.</li>
              <li>Introduce el valor que deseas buscar.</li>
              <li>Observa paso a paso cómo la búsqueda binaria encuentra (o no) el elemento.</li>
              <li>Usa el modo automático para animar los pasos.</li>
            </ul>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default BinarySearch;
