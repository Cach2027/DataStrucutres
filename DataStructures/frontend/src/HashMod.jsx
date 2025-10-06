// src/HashMod.jsx
import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";

export default function HashMod() {
  const [size, setSize] = useState(10);
  const [digits, setDigits] = useState(2);
  const [collisionMethod, setCollisionMethod] = useState("");
  const [table, setTable] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const [inputKey, setInputKey] = useState("");
  const [message, setMessage] = useState("");
  const [foundIndex, setFoundIndex] = useState(null);

  // Estados para los modales visuales
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [selected, setSelected] = useState("");

  const savedStructures = JSON.parse(localStorage.getItem("hashStructures") || "{}");

  // Crear tabla automáticamente cuando se define tamaño y método
  useEffect(() => {
    if (size > 0 && collisionMethod) {
      setTable(Array(size).fill(null));
      setInitialized(true);
      setMessage(`✅ Tabla creada (${size} posiciones) con método ${collisionMethod}.`);
      setFoundIndex(null);
    }
  }, [size, collisionMethod]);

  // Función hash (mod simple)
  const hashFunction = (key) => key % size;

  // Verificar existencia
  const keyExists = (key, tableData) => {
    for (let i = 0; i < tableData.length; i++) {
      const val = tableData[i];
      if (val === key) return i;
      if (Array.isArray(val) && val.includes(key)) return i;
    }
    return -1;
  };

  // Resolver colisiones
  const resolveCollision = (key, initialIdx, tableData) => {
    let idx = initialIdx;
    let i = 1;
    const maxTries = size;

    if (collisionMethod === "lineal") {
      while (tableData[idx] !== null && i <= maxTries) {
        idx = (initialIdx + i) % size;
        i++;
      }
    } else if (collisionMethod === "cuadratica") {
      while (tableData[idx] !== null && i <= maxTries) {
        idx = (initialIdx + i * i) % size;
        i++;
      }
    } else if (collisionMethod === "doble") {
      const h2 = 1 + (key % (size - 1));
      while (tableData[idx] !== null && i <= maxTries) {
        idx = (initialIdx + i * h2) % size;
        i++;
      }
    } else if (collisionMethod === "encadenamiento" || collisionMethod === "arreglo") {
      if (!Array.isArray(tableData[initialIdx])) tableData[initialIdx] = [];
      tableData[initialIdx].push(key);
      return initialIdx;
    }

    return tableData[idx] === null ? idx : -1;
  };

  // Insertar
  const handleInsert = () => {
    if (!initialized) return alert("⚠️ Primero define tamaño y método.");
    if (!/^\d+$/.test(inputKey)) return alert("⚠️ Ingresa un número válido.");
    if (inputKey.length !== digits)
      return alert(`⚠️ La clave debe tener ${digits} dígitos.`);

    const num = parseInt(inputKey, 10);
    const newTable = [...table];

    const existingIdx = keyExists(num, newTable);
    if (existingIdx !== -1) {
      setMessage(`⚠️ La clave ${num} ya existe en la posición ${existingIdx + 1}.`);
      setInputKey("");
      return;
    }

    const idx = hashFunction(num);
    if (Array.isArray(newTable[idx])) {
      newTable[idx].push(num);
      setMessage(`⚠️ Colisión en ${idx + 1}, agregado por encadenamiento.`);
    } else if (newTable[idx] === null) {
      newTable[idx] = num;
      setMessage(`✅ Clave ${num} insertada en posición ${idx + 1}.`);
    } else {
      const resolvedIdx = resolveCollision(num, idx, newTable);
      if (resolvedIdx !== -1) {
        newTable[resolvedIdx] = num;
        setMessage(`⚠️ Colisión en ${idx + 1}, resuelta en posición ${resolvedIdx + 1}.`);
      } else {
        setMessage(`❌ No se pudo insertar la clave ${num}, tabla llena.`);
      }
    }

    setTable(newTable);
    setInputKey("");
    setFoundIndex(null);
  };

  // Buscar
  const handleSearch = () => {
    if (!initialized) return alert("⚠️ Primero genera la tabla.");
    const num = parseInt(inputKey, 10);
    const idxFound = keyExists(num, table);

    if (idxFound !== -1) {
      setFoundIndex(idxFound);
      setMessage(`🔎 Clave ${num} encontrada en posición ${idxFound + 1}.`);
    } else {
      setFoundIndex(null);
      setMessage(`❌ Clave ${num} no encontrada.`);
    }
  };

  // Eliminar
  const handleDelete = () => {
    if (!initialized) return alert("⚠️ Primero genera la tabla.");
    const num = parseInt(inputKey, 10);
    const newTable = [...table];
    const idx = keyExists(num, newTable);

    if (idx === -1) {
      setMessage(`❌ La clave ${num} no se encuentra.`);
      return;
    }

    if (Array.isArray(newTable[idx])) {
      newTable[idx] = newTable[idx].filter((x) => x !== num);
      if (newTable[idx].length === 0) newTable[idx] = null;
    } else {
      newTable[idx] = null;
    }

    setTable(newTable);
    setMessage(`🗑️ Clave ${num} eliminada correctamente.`);
    setInputKey("");
    setFoundIndex(null);
  };

  // Nuevo
  const handleNew = () => {
    setSize(0);
    setDigits(0);
    setCollisionMethod("");
    setTable([]);
    setInputKey("");
    setInitialized(false);
    setFoundIndex(null);
    setMessage("🆕 Estructura reiniciada. Define tamaño y método para comenzar.");
  };

  // Guardar / Cargar / Eliminar estructuras
  const confirmSave = () => {
    if (!saveName.trim()) return alert("⚠️ Ingresa un nombre válido.");
    const saved = { ...savedStructures, [saveName]: { size, digits, collisionMethod, table } };
    localStorage.setItem("hashStructures", JSON.stringify(saved));
    setShowSaveModal(false);
    setSaveName("");
    setMessage(`💾 Estructura '${saveName}' guardada correctamente.`);
  };

  const confirmLoad = () => {
    if (!selected) return alert("⚠️ Selecciona una estructura.");
    const structure = savedStructures[selected];
    if (!structure) return alert("Estructura no encontrada.");
    setSize(structure.size);
    setDigits(structure.digits);
    setCollisionMethod(structure.collisionMethod);
    setTable(structure.table);
    setInitialized(true);
    setShowLoadModal(false);
    setMessage(`📂 Estructura '${selected}' cargada correctamente.`);
  };

  const confirmDelete = () => {
    if (!selected) return alert("⚠️ Selecciona una estructura para eliminar.");
    const updated = { ...savedStructures };
    delete updated[selected];
    localStorage.setItem("hashStructures", JSON.stringify(updated));
    setShowDeleteModal(false);
    setSelected("");
    setMessage(`🗑️ Estructura '${selected}' eliminada correctamente.`);
  };

  const rows = table.map((val, idx) => [idx, val]).filter(([_, val]) => val !== null);

  return (
    <Layout title="🔢 Función Hash MOD" color="bg-[#1D6A96]">
      <div className="p-8 flex flex-col items-center gap-6">
        {/* Configuración */}
        <div className="flex flex-wrap justify-center gap-6 items-end mt-6">
          <div className="flex flex-col items-center">
            <label className="font-semibold mb-1">Tamaño</label>
            <input
              type="number"
              min="2"
              max="100"
              value={size || ""}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-24 text-center border border-cerulean rounded-md p-2"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="font-semibold mb-1">Dígitos</label>
            <input
              type="number"
              min="1"
              max="6"
              value={digits || ""}
              onChange={(e) => setDigits(Number(e.target.value))}
              className="w-24 text-center border border-cerulean rounded-md p-2"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="font-semibold mb-1">Método de colisión</label>
            <select
              value={collisionMethod}
              onChange={(e) => setCollisionMethod(e.target.value)}
              className="border border-cerulean rounded-md p-2 w-48 text-center"
            >
              <option value="">Seleccionar...</option>
              <option value="lineal">Sondeo Lineal</option>
              <option value="cuadratica">Sondeo Cuadrático</option>
              <option value="doble">Doble Hash</option>
              <option value="encadenamiento">Encadenamiento</option>
              <option value="arreglo">Arreglos Anidados</option>
            </select>
          </div>
        </div>

        <div className="mt-6 text-center font-semibold text-gray-700">Digitar clave:</div>

        {/* Acciones principales */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <input
            placeholder={`Clave (${digits} dígitos)`}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="px-3 py-2 rounded-md border border-cerulean w-60 text-center bg-white focus:ring-2 focus:ring-cerulean"
          />
          <button onClick={handleInsert} className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]">➕ Insertar</button>
          <button onClick={handleSearch} className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]">🔍 Buscar</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]">🗑️ Eliminar</button>
          <button onClick={handleNew} className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]">🆕 Nuevo</button>
        </div>

        {/* Guardar / Cargar / Eliminar */}
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setShowSaveModal(true)} className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg shadow-md hover:bg-[#144d6f]">💾 Guardar</button>
          <button onClick={() => setShowLoadModal(true)} className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg shadow-md hover:bg-[#144d6f]">📂 Cargar</button>
          <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg shadow-md hover:bg-[#144d6f]">❌ Eliminar estructuras</button>
        </div>

        {/* Tabla con scroll */}
        {initialized && rows.length > 0 && (
          <div className="w-full mt-6">
            <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-md">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border px-4 py-2">Índice</th>
                    <th className="border px-4 py-2">Clave(s)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([idx, val]) => (
                    <tr
                      key={idx}
                      className={`transition-colors duration-300 ${
                        foundIndex === idx ? "bg-green-300" : "bg-white"
                      }`}
                    >
                      <td className="border px-4 py-2 font-bold">{idx + 1}</td>
                      <td className="border px-4 py-2">
                        {Array.isArray(val) ? val.join(", ") : val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mensaje */}
        {message && <div className="text-center font-semibold text-[#1D6A96] mt-4">{message}</div>}

        {/* Modales visuales */}
        {showSaveModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              <h2 className="font-bold text-lg">💾 Guardar estructura</h2>
              <input
                placeholder="Nombre..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="px-3 py-2 border rounded-md"
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowSaveModal(false)} className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                  Cancelar
                </button>
                <button onClick={confirmSave} className="px-3 py-2 bg-[#1D6A96] text-white rounded-md hover:bg-[#144d6f]">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {showLoadModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              <h2 className="font-bold text-lg">📂 Cargar estructura</h2>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Seleccionar...</option>
                {Object.keys(savedStructures).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowLoadModal(false)} className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                  Cancelar
                </button>
                <button onClick={confirmLoad} className="px-3 py-2 bg-[#1D6A96] text-white rounded-md hover:bg-[#144d6f]">
                  Cargar
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              <h2 className="font-bold text-lg">🗑️ Eliminar estructura</h2>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Seleccionar...</option>
                {Object.keys(savedStructures).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowDeleteModal(false)} className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                  Cancelar
                </button>
                <button onClick={confirmDelete} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
