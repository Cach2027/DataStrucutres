// src/HashSquare.jsx
import React, { useState } from "react";
import Layout from "./components/Layout";

export default function HashSquare() {
  const [size, setSize] = useState(10);
  const [digits, setDigits] = useState(2);
  const [data, setData] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const [currentInput, setCurrentInput] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [message, setMessage] = useState("");

  // Cantidad de dígitos centrales según tamaño
  const centralDigitsCount = (n) => n.toString().length - 1;

  // Función Hash Cuadrada
  const hashSquare = (key) => {
    const square = (key * key).toString();
    const len = square.length;
    const c = centralDigitsCount(size);

    let start = Math.floor((len - c) / 2);
    const central = square.substr(start, c);
    return (parseInt(central, 10) % size) + 1; // índice inicia en 1
  };

  // Inicializar tabla
  const generateTable = () => {
    setData(Array(size).fill(null));
    setInitialized(true);
    setMessage("✅ Tabla creada correctamente.");
  };

  // Limpiar tabla
  const resetStructure = () => {
    setData([]);
    setInitialized(false);
    setMessage("🧹 Tabla limpiada.");
    setCurrentInput("");
    setTargetInput("");
  };

  // Agregar clave
  const addKey = () => {
    if (!initialized) return alert("Primero genera la tabla.");
    if (!/^\d+$/.test(currentInput)) return alert("Número inválido.");
    if (currentInput.length !== digits)
      return alert(`La clave debe tener ${digits} dígitos.`);

    const key = parseInt(currentInput, 10);
    const index = hashSquare(key);

    if (data[index - 1] !== null) {
      setMessage(`⚠️ Colisión: la posición ${index} ya contiene ${data[index - 1]}.`);
      return;
    }

    const newData = [...data];
    newData[index - 1] = key;
    setData(newData);
    setMessage(`✅ Clave ${key} insertada en posición ${index}.`);
    setCurrentInput("");
  };

  // Buscar clave
  const searchKey = () => {
    if (!initialized) return alert("Primero genera la tabla.");
    if (!/^\d+$/.test(targetInput)) return alert("Número inválido.");
    const key = parseInt(targetInput, 10);
    const index = hashSquare(key);

    if (data[index - 1] === key) {
      setMessage(`🔎 Clave ${key} encontrada en posición ${index}.`);
    } else {
      setMessage(`❌ Clave ${key} no encontrada.`);
    }
  };

  // Eliminar clave
  const removeKey = () => {
    if (!initialized) return alert("Primero genera la tabla.");
    if (!/^\d+$/.test(targetInput)) return alert("Número inválido.");
    const key = parseInt(targetInput, 10);
    const index = hashSquare(key);

    if (data[index - 1] === key) {
      const newData = [...data];
      newData[index - 1] = null;
      setData(newData);
      setMessage(`🗑️ Clave ${key} eliminada de posición ${index}.`);
    } else {
      setMessage(`❌ La clave ${key} no se encuentra en la posición ${index}.`);
    }
  };

  return (
    <Layout title="🔲 Función Hash Cuadrada" color="hash">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200">
          Configuración de la tabla
        </h2>

        {/* Configuración */}
        <div className="flex flex-wrap gap-6 justify-center items-end">
          <div>
            <label className="block mb-1">Tamaño de la estructura:</label>
            <input
              type="number"
              min="2"
              max="100"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Dígitos por clave:</label>
            <input
              type="number"
              min="1"
              max="6"
              value={digits}
              onChange={(e) => setDigits(Number(e.target.value))}
              className="px-3 py-2 border rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateTable}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md"
            >
              📊 Generar tabla
            </button>
            <button
              onClick={resetStructure}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md"
            >
              🧹 Limpiar tabla
            </button>
          </div>
        </div>

        {/* Inserción */}
        <div className="flex gap-3 justify-center items-center">
          <input
            placeholder={`Inserta clave (${digits} dígitos)`}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="px-3 py-2 border rounded"
            disabled={!initialized}
          />
          <button
            onClick={addKey}
            disabled={!initialized}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md disabled:opacity-50"
          >
            ➕ Agregar
          </button>
        </div>

        {/* Buscar y eliminar */}
        <div className="flex gap-3 justify-center items-center">
          <input
            placeholder="Clave a buscar/eliminar"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="px-3 py-2 border rounded"
            disabled={!initialized}
          />
          <button
            onClick={searchKey}
            disabled={!initialized}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md disabled:opacity-50"
          >
            🔍 Buscar
          </button>
          <button
            onClick={removeKey}
            disabled={!initialized}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-md disabled:opacity-50"
          >
            🗑️ Eliminar
          </button>
        </div>

        {/* Mensaje */}
        {message && (
          <div className="text-center font-semibold text-purple-700 dark:text-purple-300">
            {message}
          </div>
        )}

        {/* Tabla */}
        {initialized && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 mx-auto">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 border">Índice</th>
                  <th className="px-4 py-2 border">Clave</th>
                </tr>
              </thead>
              <tbody>
                {data.map((val, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border px-4 py-2 font-bold">{idx + 1}</td>
                    <td className="border px-4 py-2">{val !== null ? val : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
