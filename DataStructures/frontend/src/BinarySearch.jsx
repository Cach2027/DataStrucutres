import { useState, useEffect } from "react";
import StructureControls from "./components/StructureControls";
import Layout from "./components/Layout";

function BinarySearch() {
  const [size, setSize] = useState();
  const [digits, setDigits] = useState();
  const [data, setData] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");

  // 🧹 Limpiar simulación
  const clearSimulation = () => {
    setSteps([]);
    setCurrentStep(-1);
    setFoundIndex(null);
    setPlaying(false);
    setMessage("");
  };

  // ➕ Insertar número
  const handleInsert = () => {
    if (data.length >= size) {
      setMessage("⚠️ La estructura está llena. No se pueden insertar más elementos.");
      return;
    }
    
    if (!/^\d+$/.test(inputValue)) {
      alert("⚠️ Ingresa un número válido.");
      return;
    }
    const num = parseInt(inputValue, 10);
    if (String(num).length !== digits) {
      alert(`⚠️ La clave debe tener exactamente ${digits} dígitos.`);
      return;
    }
    if (data.includes(num)) {
      alert("⚠️ No se permiten duplicados.");
      return;
    }
    
    const newData = [...data, num].sort((a, b) => a - b);
    setData(newData);
    setInputValue("");
    clearSimulation();
    
    if (newData.length === size) {
      setMessage(`✅ Clave ${num} insertada correctamente. ⚠️ La estructura está llena.`);
    } else {
      setMessage(`✅ Clave ${num} insertada correctamente.`);
    }
  };

  // 🔍 Buscar número
  const handleSearch = () => {
    if (data.length === 0) {
      alert("⚠️ Primero inserta datos.");
      return;
    }
    if (!/^\d+$/.test(inputValue)) {
      alert("⚠️ Ingresa un número válido para buscar.");
      return;
    }
    if (inputValue.length !== digits) {
      alert(`⚠️ La clave buscada debe tener ${digits} dígitos.`);
      return;
    }

    const target = parseInt(inputValue, 10);
    let low = 0,
      high = data.length - 1;
    const newSteps = [];

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      newSteps.push({ low, high, mid, value: data[mid] });

      if (data[mid] === target) break;
      else if (data[mid] < target) low = mid + 1;
      else high = mid - 1;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setFoundIndex(null);
    setPlaying(true);
    setMessage("");
  };

  // ➖ Eliminar número
  const handleDelete = () => {
    if (!/^\d+$/.test(inputValue)) {
      alert("⚠️ Ingresa un número válido para eliminar.");
      return;
    }
    const num = parseInt(inputValue, 10);
    if (!data.includes(num)) {
      alert(`⚠️ La clave ${num} no existe en la estructura.`);
      return;
    }
    const newData = data.filter((n) => n !== num);
    setData(newData);
    setInputValue("");
    clearSimulation();
    setMessage(`🗑️ Clave ${num} eliminada correctamente.`);
  };

  // ▶ Reproducción automática de pasos
  useEffect(() => {
    if (!playing || steps.length === 0) return;
    if (currentStep >= steps.length - 1) {
      setPlaying(false);
      return;
    }

    const id = setTimeout(() => setCurrentStep((s) => s + 1), 800);
    return () => clearTimeout(id);
  }, [playing, currentStep, steps]);

  // ✅ Verificar si encontramos
  useEffect(() => {
    if (currentStep < 0 || steps.length === 0) return;
    const step = steps[currentStep];
    const target = parseInt(inputValue, 10);

    if (step.value === target) {
      setFoundIndex(step.mid);
      setMessage(`✅ Valor ${target} encontrado en la posición #${step.mid + 1}`);
      setPlaying(false);
    } else if (currentStep === steps.length - 1) {
      setMessage(`❌ Valor ${target} no encontrado.`);
    }
  }, [currentStep, steps, inputValue]);

  // 💾 Guardar estructura actual
  const structure = { data, digits, size };

  // 📂 Cargar estructura guardada
  const handleLoadData = (loaded) => {
    setData(loaded.data || []);
    setDigits(loaded.digits || 2);
    setSize(loaded.size || 5);
    clearSimulation();
    setMessage("📂 Estructura cargada correctamente.");
  };

  // 🆕 Nueva estructura
  const handleNew = () => {
    setData([]);
    setInputValue("");
    clearSimulation();
    setMessage("🆕 Nueva estructura creada.");
  };

  return (
    <Layout title="Búsqueda Binaria" color="bg-[#1D6A96]">
      <div className="p-8 flex flex-col items-center gap-6">
        {/* Configuración */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <label className="font-semibold">Tamaño</label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-24 text-center border rounded-md p-1"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="font-semibold">Dígitos</label>
            <input
              type="number"
              value={digits}
              onChange={(e) => setDigits(Number(e.target.value))}
              className="w-24 text-center border rounded-md p-1"
            />
          </div>
        </div>

        {/* Input único + acciones */}
        <label className="font-semibold mb-2 text-gray-800">Digitar clave:</label>
        <div className="flex gap-3">
          <input
            placeholder={`Clave (${digits} dígitos)`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-3 py-2 rounded-md border border-cerulean w-60 text-center bg-white focus:ring-2 focus:ring-cerulean"
          />
          <button
            onClick={handleInsert}
            disabled={data.length >= size}
            className={`px-4 py-2 rounded-lg text-white shadow-md transition-colors ${
              data.length >= size
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1D6A96] hover:bg-[#144d6f]"
            }`}
          >
             Insertar
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]"
          >
             Buscar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]"
          >
            Eliminar
          </button>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
             Nueva
          </button>
        </div>

        {/* Guardar / Cargar */}
        <StructureControls structure={structure} onLoadData={handleLoadData} />

        {/* Estructura en tabla */}
        <div className="mt-8">
          {data.length === 0 ? (
            <p className="text-gray-500">(No hay datos aún)</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-400 text-center">
                <thead>
                  <tr>
                    {data.map((_, idx) => (
                      <th
                        key={idx}
                        className="border border-gray-400 px-3 py-2 bg-gray-200"
                      >
                        #{idx + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {data.map((num, idx) => {
                      const step = steps[currentStep];
                      const isMid = step && step.mid === idx;
                      const isFound = foundIndex === idx;

                      return (
                        <td
                          key={idx}
                          className={`border border-gray-400 px-4 py-3 font-semibold transition-colors duration-300 ${
                            isFound
                              ? "bg-green-500 text-white"
                              : isMid
                              ? "bg-yellow-300"
                              : "bg-white"
                          }`}
                        >
                          {num}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mensaje de resultado */}
        {message && (
          <div
            className={`mt-4 text-lg font-semibold ${
              message.startsWith("✅") || message.startsWith("📂") || message.startsWith("🆕")
                ? "text-green-600"
                : message.startsWith("⚠️")
                ? "text-orange-600"
                : message.startsWith("🗑️")
                ? "text-red-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BinarySearch;
