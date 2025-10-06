// src/components/HashCollisionResolver.jsx
import React from "react";

/**
 * Componente que aplica y visualiza la resolución de colisiones.
 * Métodos disponibles:
 * - lineal
 * - cuadrática
 * - dobleHash
 * - encadenamiento
 * - anidado
 */
function HashCollisionResolver({ table, hashFunction, method, newKey, onUpdateTable }) {
  // Calcular posición inicial
  const initialPos = hashFunction(newKey, table.length);

  // Copia para no mutar el estado original
  const newTable = [...table];

  const resolveCollision = () => {
    let pos = initialPos;

    if (method === "lineal") {
      // Sondeo lineal: i + 1, i + 2, ...
      for (let i = 0; i < table.length; i++) {
        pos = (initialPos + i) % table.length;
        if (newTable[pos] === null) {
          newTable[pos] = newKey;
          break;
        }
      }
    } else if (method === "cuadrática") {
      // Sondeo cuadrático: i + 1², i + 2², ...
      for (let i = 0; i < table.length; i++) {
        pos = (initialPos + i * i) % table.length;
        if (newTable[pos] === null) {
          newTable[pos] = newKey;
          break;
        }
      }
    } else if (method === "dobleHash") {
      // Doble función hash: usar segunda función h2(k) = 1 + (k mod (n-1))
      const h2 = 1 + (newKey % (table.length - 1));
      for (let i = 0; i < table.length; i++) {
        pos = (initialPos + i * h2) % table.length;
        if (newTable[pos] === null) {
          newTable[pos] = newKey;
          break;
        }
      }
    } else if (method === "encadenamiento") {
      // Cada celda contiene una lista (arreglo de claves)
      if (!Array.isArray(newTable[pos])) newTable[pos] = [];
      newTable[pos].push(newKey);
    } else if (method === "anidado") {
      // Arreglo anidado: usar subarreglos fijos
      const subSize = 3; // tamaño fijo del subarreglo
      if (!Array.isArray(newTable[pos])) newTable[pos] = Array(subSize).fill(null);

      const slot = newTable[pos].findIndex((v) => v === null);
      if (slot !== -1) {
        newTable[pos][slot] = newKey;
      } else {
        console.warn("⚠️ Subarreglo lleno en posición", pos);
      }
    }

    onUpdateTable(newTable);
  };

  return (
    <div className="mt-6 text-center">
      <h3 className="font-bold text-[#1D6A96] mb-3">
        Resolución de colisiones: {method.toUpperCase()}
      </h3>

      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-400 mx-auto">
          <thead>
            <tr>
              {newTable.map((_, i) => (
                <th key={i} className="border border-gray-400 px-4 py-2 bg-gray-200">
                  {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {newTable.map((cell, i) => (
                <td
                  key={i}
                  className="border border-gray-400 px-4 py-2 min-w-[60px] text-center"
                >
                  {Array.isArray(cell)
                    ? cell.join(", ")
                    : cell === null
                    ? "-"
                    : cell}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Este componente no tiene botones ni inputs */}
    </div>
  );
}

export default HashCollisionResolver;
