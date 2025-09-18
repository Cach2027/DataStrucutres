// src/LinearSearch.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/*
 LinearSearch.jsx
 - Insertar números uno a uno (sin comas)
 - Validación: no duplicados, longitud de dígitos
 - Generar aleatorios únicos según tamaño y dígitos
 - Buscar: simula la búsqueda secuencial paso a paso
 - Controles: anterior / siguiente / play-pause
 - Resultado muestra posición comenzando en 1
*/

function LinearSearch() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [size, setSize] = useState(5);
  const [digits, setDigits] = useState(2);
  const [data, setData] = useState([]);

  const [currentInput, setCurrentInput] = useState("");
  const [targetInput, setTargetInput] = useState("");

  // Steps: array of { index, value }
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1); // -1 = no iniciado
  const [foundIndex, setFoundIndex] = useState(null); // -1 not found, >=0 index found
  const [playing, setPlaying] = useState(false);

  // GENERAR NÚMERO ALEATORIO con 'digits' dígitos (sin ceros a la izquierda)
  const generateNumber = (digits) => {
    if (digits <= 1) return Math.floor(Math.random() * 10);
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generar array aleatorio con valores únicos
  const generateData = () => {
    const set = new Set();
    const maxUnique = Math.pow(10, digits) - Math.pow(10, Math.max(0, digits - 1));
    if (size > maxUnique) {
      alert(`Imposible generar ${size} claves únicos con ${digits} dígitos. Reduce tamaño o aumenta dígitos.`);
      return;
    }
    while (set.size < size) {
      set.add(generateNumber(digits));
    }
    setData(Array.from(set));
    clearSimulation();
  };

  // Limpiar datos y simulación
  const clearData = () => {
    setData([]);
    clearSimulation();
  };

  const clearSimulation = () => {
    setSteps([]);
    setCurrentStep(-1);
    setFoundIndex(null);
    setPlaying(false);
  };

  // Añadir número manualmente (sin duplicados y con validación de dígitos)
  const addNumber = () => {
    if (data.length >= size) {
      alert("La estructura ya alcanzó el tamaño máximo.");
      return;
    }
    if (!/^\d+$/.test(currentInput)) {
      alert("Ingresa una clave válida (solo dígitos).");
      return;
    }
    const num = parseInt(currentInput, 10);
    // Validar cantidad de dígitos: permitir 1..digits
    const len = currentInput.length;
    if (len !== digits) {
      const ok = confirm(`Has ingresado ${len} dígitos y la estructura está configurada para ${digits}. ¿Deseas aceptar igual?`);
      if (!ok) return;
    }
    if (data.includes(num)) {
      alert("No se permiten claves repetidas.");
      return;
    }
    setData((d) => [...d, num]);
    setCurrentInput("");
    clearSimulation();
  };

  // Iniciar búsqueda (prepara los pasos)
  const handleSearch = () => {
    if (data.length === 0) {
      alert("La estructura está vacía. Genera o inserta datos primero.");
      return;
    }
    if (!/^\d+$/.test(targetInput)) {
      alert("Ingresa un clave a buscar (solo dígitos).");
      return;
    }
    const target = parseInt(targetInput, 10);

    // Crear pasos (recorrido secuencial)
    const newSteps = data.map((v, i) => ({ index: i, value: v }));
    setSteps(newSteps);
    setCurrentStep(0);
    setFoundIndex(null);
    setPlaying(false); // empieza en pausa; usuario puede presionar Play
  };

  // Efecto autoplay: avanza pasos si playing === true
  useEffect(() => {
    if (!playing) return;
    if (steps.length === 0) {
      setPlaying(false);
      return;
    }
    // Si ya estamos al final, detener
    if (currentStep >= steps.length) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => {
      setCurrentStep((s) => {
        const next = s + 1;
        // si next exceeds steps.length-1, stop at end
        if (next >= steps.length) {
          setPlaying(false);
          return s;
        }
        return next;
      });
    }, 650);
    return () => clearTimeout(id);
  }, [playing, currentStep, steps]);

  // Cada vez que avanza currentStep comprobamos si encontramos el target
  useEffect(() => {
    if (currentStep < 0 || steps.length === 0) return;
    const step = steps[currentStep];
    const target = parseInt(targetInput || "NaN", 10);
    if (step.value === target) {
      setFoundIndex(step.index);
      setPlaying(false);
    } else {
      // si llegamos al final y no coincide, marcar no encontrado
      if (currentStep === steps.length - 1 && step.value !== target) {
        setFoundIndex(-1);
        setPlaying(false);
      }
    }
  }, [currentStep, steps, targetInput]);

  // Controles prev/next/play-pause
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setFoundIndex(null);
    }
  };
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };
  const togglePlay = () => {
    if (steps.length === 0 || currentStep < 0) return;
    setPlaying((p) => !p);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar (fixed) */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-800 text-gray-200 shadow-xl transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-bold">📚 Algoritmos</h2>
          <button onClick={() => setMenuOpen(false)} className="text-2xl hover:text-red-400">❌</button>
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-4 flex items-center justify-between shadow-md">
          <button onClick={() => setMenuOpen(true)} className="text-2xl font-bold hover:text-sky-200">☰</button>
          <h1 className="text-2xl font-bold text-center flex-1">🔎 Búsqueda Lineal</h1>

          {/* Botón "volver" al inicio (opcional) */}
          <Link to="/" className="ml-4 text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20">Inicio</Link>
        </header>

        {/* Main */}
        <main className="flex-1 p-10 text-center">
          <h2 className="text-xl font-semibold mb-6 text-sky-700 dark:text-sky-300">Configuración de la estructura</h2>

          {/* Controles: tamaño y dígitos */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-6">
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Tamaño de la estructura:</label>
              <input type="number" min="1" max="20" value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-sky-400" />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Dígitos por clave:</label>
              <input type="number" min="1" max="6" value={digits}
                onChange={(e) => setDigits(Number(e.target.value))}
                className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-sky-400" />
            </div>
          </div>

          {/* Botones generar / limpiar */}
          <div className="flex gap-6 justify-center mb-6">
            <button onClick={generateData} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md">🎲 Generar aleatorios</button>
            <button onClick={clearData} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md">🧹 Limpiar</button>
          </div>

          {/* Inserción manual */}
          <div className="flex gap-3 justify-center items-center mb-6">
            <input
              placeholder={`Inserta clave de (${digits} dígitos)`}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-sky-400"
            />
            <button onClick={addNumber} disabled={data.length >= size}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md disabled:opacity-50">
              ➕ Agregar
            </button>
          </div>

          {/* Input búsqueda y botón Buscar */}
          <div className="flex gap-3 justify-center items-center mb-6">
            <input
              placeholder="Clave a buscar"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-sky-400"
            />
            <button onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md">
              🔍 Buscar
            </button>
          </div>

          {/* Mostrar array */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {data.length === 0 ? (
              <p className="text-gray-500">(No hay claves — genera o agrega manualmente)</p>
            ) : (
              data.map((num, idx) => (
                <div key={idx}
                  className={`px-4 py-3 rounded-md shadow-md font-bold text-lg
                    ${foundIndex === idx ? "bg-green-400 text-white" : ""}
                    ${currentStep === idx && foundIndex !== idx ? "bg-yellow-300" : ""}
                    ${currentStep !== idx && foundIndex !== idx ? "bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-gray-200" : ""}
                  `}>
                  {num}
                  <div className="text-xs mt-1">#{idx + 1}</div>
                </div>
              ))
            )}
          </div>

          {/* Controles de pasos (solo si hay steps) */}
          {steps.length > 0 && (
            <div className="mt-8">
              <p className="mb-2">Paso {currentStep + 1} de {steps.length}</p>
              <div className="flex gap-3 justify-center mb-3">
                <button onClick={prevStep} className="px-3 py-1 bg-white/80 dark:bg-gray-800 rounded shadow">⬅ Anterior</button>
                <button onClick={togglePlay} className="px-3 py-1 bg-white/80 dark:bg-gray-800 rounded shadow">{playing ? "⏸ Pausar" : "▶ Reproducir"}</button>
                <button onClick={nextStep} className="px-3 py-1 bg-white/80 dark:bg-gray-800 rounded shadow">Siguiente ➡</button>
              </div>
            </div>
          )}

          {/* Resultado */}
          {foundIndex !== null && currentStep >= 0 && (
            <div className="mt-6">
              {foundIndex >= 0 ? (
                <h3 className="text-2xl font-bold text-green-600">✅ Encontrado en posición {foundIndex + 1}</h3>
              ) : (
                <h3 className="text-2xl font-bold text-red-500">❌ No encontrado</h3>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-400 text-center p-4">
          <p>👨‍💻 Desarrollado por <b className="text-gray-900 dark:text-white">Carlos Celis</b></p>
          <p>📧 contacto: tuemail@ejemplo.com</p>
        </footer>
      </div>
    </div>
  );
}

export default LinearSearch;
