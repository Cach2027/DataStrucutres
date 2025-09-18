// src/BinarySearch.jsx
import { useState, useEffect } from "react";
import Layout from "./components/Layout";

function BinarySearch() {
  const [size, setSize] = useState(5);
  const [digits, setDigits] = useState(2);
  const [data, setData] = useState([]);

  const [currentInput, setCurrentInput] = useState("");

  // pasos: { low, mid, high }
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(null);
  const [playing, setPlaying] = useState(false);

  // generar número con n dígitos
  const generateNumber = (digits) => {
    if (digits <= 1) return Math.floor(Math.random() * 10);
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateData = () => {
    const set = new Set();
    const maxUnique =
      Math.pow(10, digits) - Math.pow(10, Math.max(0, digits - 1));
    if (size > maxUnique) {
      alert(`Imposible generar ${size} claves únicos con ${digits} dígitos.`);
      return;
    }
    while (set.size < size) {
      set.add(generateNumber(digits));
    }
    const arr = Array.from(set).sort((a, b) => a - b);
    setData(arr);
    clearSimulation();
  };

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

  const addNumber = () => {
    if (data.length >= size) {
      alert("La estructura ya alcanzó el tamaño máximo.");
      return;
    }
    if (!/^\d+$/.test(currentInput)) {
      alert("Ingresa un clave válido.");
      return;
    }
    const num = parseInt(currentInput, 10);
    if (data.includes(num)) {
      alert("No se permiten duplicados.");
      return;
    }
    setData((d) => [...d, num].sort((a, b) => a - b));
    setCurrentInput("");
    clearSimulation();
  };

  const handleSearch = () => {
    if (data.length === 0) {
      alert("Genera o inserta datos primero.");
      return;
    }
    if (!/^\d+$/.test(currentInput)) {
      alert("Ingresa una clave válida.");
      return;
    }
    const target = parseInt(currentInput, 10);

    let low = 0;
    let high = data.length - 1;
    const newSteps = [];

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      newSteps.push({ low, mid, high });
      if (data[mid] === target) break;
      if (data[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setFoundIndex(null);
    setPlaying(false);
  };

  // autoplay
  useEffect(() => {
    if (!playing) return;
    if (steps.length === 0) return;
    if (currentStep >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setCurrentStep((s) => s + 1), 650);
    return () => clearTimeout(id);
  }, [playing, currentStep, steps]);

  // check found
  useEffect(() => {
    if (currentStep < 0 || steps.length === 0) return;
    const step = steps[currentStep];
    const target = parseInt(currentInput || "NaN", 10);
    if (data[step.mid] === target) {
      setFoundIndex(step.mid);
      setPlaying(false);
    } else if (currentStep === steps.length - 1) {
      setFoundIndex(-1);
      setPlaying(false);
    }
  }, [currentStep, steps, currentInput, data]);

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setFoundIndex(null);
    }
  };
  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };
  const togglePlay = () => {
    if (steps.length === 0 || currentStep < 0) return;
    setPlaying((p) => !p);
  };

  return (
    <Layout title="🔍 Búsqueda Binaria" color="from-sky-500 to-sky-600">
      <main className="flex-1 p-10 text-center">
        <h2 className="text-xl font-semibold mb-6 text-[#1D6A96]">
          Configuración de la estructura
        </h2>

        {/* Configuración */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-6">
          <div>
            <label className="block mb-2 text-[#283B42]">
              Tamaño:
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-[#1D6A96]"
            />
          </div>
          <div>
            <label className="block mb-2 text-[#283B42]">Dígitos por clave:</label>
            <input
              type="number"
              min="1"
              max="6"
              value={digits}
              onChange={(e) => setDigits(Number(e.target.value))}
              className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-[#1D6A96]"
            />
          </div>
        </div>

        {/* Input único */}
        <div className="flex gap-3 justify-center mb-6">
          <input
            placeholder={`Clave (${digits} dígitos)`}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="px-3 py-2 rounded-md border w-60 text-center"
          />
          <button
            onClick={addNumber}
            disabled={data.length >= size}
            className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg shadow-md hover:bg-[#144d6f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
             Agregar
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg shadow-md hover:bg-[#144d6f]"
          >
             Buscar
          </button>
        </div>

        {/* Array */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {data.length === 0 ? (
            <p className="text-gray-500">(No hay Claves)</p>
          ) : (
            data.map((num, idx) => {
              const step = steps[currentStep];
              const isMid = step && step.mid === idx;
              const isFound = foundIndex === idx;
              return (
                <div
                  key={idx}
                  className={`px-4 py-3 rounded-md shadow-md font-bold text-lg
                    ${isFound ? "bg-green-400 text-white" : ""}
                    ${isMid && !isFound ? "bg-yellow-300" : ""}
                    ${!isMid && !isFound ? "bg-white/80 dark:bg-gray-800" : ""}
                  `}
                >
                  {num}
                  <div className="text-xs mt-1">#{idx + 1}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Controles */}
        {steps.length > 0 && (
          <div className="mt-8">
            <p className="mb-2">
              Paso {currentStep + 1} de {steps.length}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={prevStep} className="px-3 py-1 bg-gray-200 rounded">
                ⬅
              </button>
              <button onClick={togglePlay} className="px-3 py-1 bg-gray-200 rounded">
                {playing ? "⏸" : "▶"}
              </button>
              <button onClick={nextStep} className="px-3 py-1 bg-gray-200 rounded">
                ➡
              </button>
            </div>
          </div>
        )}

        {/* Resultado */}
        {foundIndex !== null && currentStep >= 0 && (
          <div className="mt-6">
            {foundIndex >= 0 ? (
              <h3 className="text-2xl font-bold text-green-600">
                ✅ Encontrado en posición {foundIndex + 1}
              </h3>
            ) : (
              <h3 className="text-2xl font-bold text-red-500">❌ No encontrado</h3>
            )}
          </div>
        )}
      </main>
    </Layout>
  );
}

export default BinarySearch;
