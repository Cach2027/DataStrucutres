// src/components/StructureControls.jsx
import { useState } from "react";

function StructureControls({ structure, onLoadData }) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");

  const [showLoadModal, setShowLoadModal] = useState(false);
  const [selected, setSelected] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const structures = JSON.parse(localStorage.getItem("structures") || "{}");

  // 💾 Guardar estructura
  const handleSave = () => {
    if (!saveName.trim()) {
      alert("⚠️ Escribe un nombre válido.");
      return;
    }
    const updated = { ...structures, [saveName]: structure };
    localStorage.setItem("structures", JSON.stringify(updated));
    setSaveName("");
    setShowSaveModal(false);
    alert("✅ Estructura guardada correctamente.");
  };

  // 📂 Cargar estructura
  const handleLoad = () => {
    if (!selected) {
      alert("⚠️ Selecciona una estructura.");
      return;
    }
    const loaded = structures[selected];
    if (!loaded) {
      alert("⚠️ No se pudo cargar la estructura.");
      return;
    }
    onLoadData(loaded);
    setShowLoadModal(false);
  };

  // 🗑️ Eliminar estructura
  const handleDelete = () => {
    if (!selected) {
      alert("⚠️ Selecciona una estructura para eliminar.");
      return;
    }
    const updated = { ...structures };
    delete updated[selected];
    localStorage.setItem("structures", JSON.stringify(updated));
    setShowDeleteModal(false);
    alert(`🗑️ Estructura "${selected}" eliminada correctamente.`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]"
        >
          💾 Guardar
        </button>
        <button
          onClick={() => setShowLoadModal(true)}
          className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]"
        >
          📂 Cargar
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-[#1D6A96] text-white rounded-lg hover:bg-[#144d6f]"
        >
          🗑️ Eliminar estructura
        </button>
      </div>

      {/* Modal Guardar */}
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
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-[#1D6A96] text-white rounded-md hover:bg-[#144d6f]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cargar */}
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
              {Object.keys(structures).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLoadModal(false)}
                className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleLoad}
                className="px-3 py-2 bg-[#1D6A96] text-white rounded-md hover:bg-[#144d6f]"
              >
                Cargar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
            <h2 className="font-bold text-lg text-red-600">🗑️ Eliminar estructura</h2>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Seleccionar...</option>
              {Object.keys(structures).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600">
              Esta acción eliminará permanentemente la estructura seleccionada.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StructureControls;
