// src/HashMod.jsx
import React, { useState } from "react";
import Layout from "./components/Layout";

function nextPrime(n) {
  const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  };
  let candidate = n + 1;
  while (!isPrime(candidate)) candidate++;
  return candidate;
}

export default function HashMod() {
  const [size, setSize] = useState(10);
  const [digits, setDigits] = useState(2);
  const [table, setTable] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const [inputKey, setInputKey] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [message, setMessage] = useState("");

  const generateTable = () => {
    setTable(Array(size).fill(null));
    setInitialized(true);
    setMessage("✅ Tabla creada correctamente.");
  };

  const resetStructure = () => {
    setTable([]);
    setInitialized(false);
    setInputKey("");
    setSearchKey("");
    setMessage("🧹 Tabla limpiada.");
  };

  const hashFunction = (key) => {
    const p = nextPrime(size);
    return (key % p) % size;
  };

  const isValidNumberInput = (str) => /^\d+$/.test(str);

  const addKey = () => {
    if (!initialized) return alert("Primero genera la tabla.");
    if (!isValidNumberInput(inputKey)) return alert("Número inválido.");
    if (inputKey.length !== digits)
      return alert(`La clave debe tener ${digits} dígitos.`);

    const num = parseInt(inputKey, 10);
    if (table.includes(num)) {
      setMessage(`⚠️ El número ${num} ya existe en la tabla.`);
      return;
    }

    const idx = hashFunction(num);
    if (table[idx] !== null) {
      setMessage(`⚠️ Colisión: la posición ${idx + 1} ya tiene ${table[idx]}.`);
      return;
    }

    const newTable = [...table];
    newTable[idx] = num;
    setTable(newTable);
    setInputKey("");
    setMessage(`✅ Clave ${num} insertada en posición ${idx + 1}.`);
  };

  const searchInTable = () => {
    if (!initialized) return alert("Primero genera la tabla.");
    if (!isValidNumberInput(searchKey)) return alert("Número inválido.");
    const num = parseInt(searchKey, 10);
    const idx = hashFunction(num);
    if (table[idx] === num) {
      setMessage(`🔎 Clave ${num} encontrada en posición ${idx + 1}.`);
    } else {
      setMessage(`❌ Clave ${num} no encontrada.`);
    }
  };

  const removeKey = () => {
    if (!initialized) return alert("Primero genera la tabla.");
    if (!isValidNumberInput(searchKey)) return alert("Número inválido.");
    const num = parseInt(searchKey, 10);
    const idx = hashFunction(num);
    if (table[idx] === num) {
      const newTable = [...table];
      newTable[idx] = null;
      setTable(newTable);
      setMessage(`🗑️ Clave ${num} eliminada de posición ${idx + 1}.`);
    } else {
      setMessage(`❌ La clave ${num} no se encuentra.`);
    }
  };

  return (
    <Layout title="➗ Función Hash MOD" color="hash">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Configuración */}
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200">
          Configuración de la tabla
        </h2>
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
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
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
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="px-3 py-2 border rounded"
            disabled={!initialized}
          />
          <button
            onClick={searchInTable}
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
                {table.map((val, idx) => (
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
