// src/HashTrunc.jsx
import { useState } from "react";
import Layout from "./components/Layout";

function HashTrunc() {
    const [size, setSize] = useState(10);
    const [digits, setDigits] = useState(2);
    const [data, setData] = useState([]);
    const [initialized, setInitialized] = useState(false);

    const [currentInput, setCurrentInput] = useState("");
    const [targetInput, setTargetInput] = useState("");
    const [message, setMessage] = useState("");

    // Truncamiento: tomar tantos dígitos desde el inicio como ceros tenga n
    const truncHash = (key) => {
        const digitsNeeded = size.toString().length - 1;
        const keyStr = key.toString();
        const truncated = keyStr.substring(0, digitsNeeded);
        const index = (parseInt(truncated || "0", 10) % size) + 1;
        return index;
    };

    // Inicializar tabla
    const generateTable = () => {
        setData(Array(size).fill(null));
        setInitialized(true);
        setMessage("✅ Tabla de truncamiento creada.");
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
        if (!/^\d+$/.test(currentInput)) return alert("Ingresa un número válido.");

        const key = parseInt(currentInput, 10);
        if (key.toString().length !== digits) {
            return alert(`La clave debe tener exactamente ${digits} dígitos.`);
        }

        const index = truncHash(key);
        if (data[index - 1] !== null) {
            return setMessage(`⚠️ Colisión en posición ${index} (ya contiene ${data[index - 1]}).`);
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
        if (!/^\d+$/.test(targetInput)) return alert("Ingresa un número válido.");

        const key = parseInt(targetInput, 10);
        const index = truncHash(key);

        if (data[index - 1] === key) {
            setMessage(`🔎 Clave ${key} encontrada en posición ${index}.`);
        } else {
            setMessage(`❌ Clave ${key} no encontrada.`);
        }
    };

    // Eliminar clave
    const removeKey = () => {
        if (!initialized) return alert("Primero genera la tabla.");
        if (!/^\d+$/.test(targetInput)) return alert("Ingresa un número válido.");

        const key = parseInt(targetInput, 10);
        const index = truncHash(key);

        if (data[index - 1] === key) {
            const newData = [...data];
            newData[index - 1] = null;
            setData(newData);
            setMessage(`🗑️ Clave ${key} eliminada de posición ${index}.`);
        } else {
            setMessage(`❌ La clave ${key} no está en la posición ${index}.`);
        }
    };

    return (
        <Layout title="✂️ Función Hash Truncamiento" color="hash">
            <main className="flex-1 p-10 text-center">
                <h2 className="text-xl font-semibold mb-6 text-purple-700 dark:text-purple-300">
                    Configuración de la tabla
                </h2>

                {/* Configuración + Botones tabla en la misma fila */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-end mb-6">
                    <div>
                        <label className="block mb-2">Tamaño de la estructura:</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Dígitos por clave:</label>
                        <input
                            type="number"
                            min="1"
                            max="6"
                            value={digits}
                            onChange={(e) => setDigits(Number(e.target.value))}
                            className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    {/* Botones en la misma fila */}
                    <div className="flex gap-4">
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
                            🧹 Limpiar Estructura
                        </button>
                    </div>
                </div>


                {/* Inserción */}
                <div className="flex gap-3 justify-center items-center mb-6">
                    <input
                        placeholder={`Inserta clave (${digits} dígitos)`}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                        onClick={addKey}
                        disabled={!initialized}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md disabled:opacity-50"
                    >
                        ➕ Agregar
                    </button>
                </div>

                {/* Buscar y eliminar */}
                <div className="flex gap-3 justify-center items-center mb-6">
                    <input
                        placeholder="Clave a buscar/eliminar"
                        value={targetInput}
                        onChange={(e) => setTargetInput(e.target.value)}
                        className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-400"
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
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md shadow-md disabled:opacity-50"
                    >
                        🗑️ Eliminar
                    </button>
                </div>

                {/* Tabla */}
                {initialized && (
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full border border-gray-300 dark:border-gray-700">
                            <thead className="bg-gray-200 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-2 border">Índice</th>
                                    <th className="px-4 py-2 border">Clave</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((val, idx) => (
                                    <tr key={idx} className="text-center">
                                        <td className="border px-4 py-2">{idx + 1}</td>
                                        <td className="border px-4 py-2">{val !== null ? val : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Mensaje */}
                {message && (
                    <div className="mt-6 font-semibold text-purple-600 dark:text-purple-400">
                        {message}
                    </div>
                )}
            </main>
        </Layout>
    );
}

export default HashTrunc;
