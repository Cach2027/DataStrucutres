import { useState } from "react";
import axios from "axios";

function BinarySearch() {
  const [size, setSize] = useState(5);
  const [array, setArray] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [target, setTarget] = useState("");
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const addNumber = () => {
    if (currentInput === "" || array.length >= size) return;
    setArray([...array, parseInt(currentInput)]);
    setCurrentInput("");
  };

  const clearArray = () => {
    setArray([]);
    setResult(null);
    setCurrentStep(0);
  };

  const handleSearch = async () => {
    if (!target) return alert("Ingresa un número a buscar");

    try {
      const res = await axios.post("http://127.0.0.1:8000/binary_search", {
        array: array.length > 0 ? array : null,
        size: array.length === 0 ? size : null,
        target: parseInt(target),
      });
      setResult(res.data);
      setCurrentStep(0);
    } catch (err) {
      console.error(err);
      alert("Error en la búsqueda");
    }
  };

  const nextStep = () => {
    if (result && currentStep < result.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getBoxStyle = (index) => {
    if (!result) return { background: "#f0f0f0" };

    const step = result.steps[currentStep];
    if (index === step.left) return { background: "#4da6ff" };   // Azul
    if (index === step.right) return { background: "#4dff88" };  // Verde
    if (index === step.mid) return { background: "#ffd633" };    // Amarillo
    if (result.found_index === index) return { background: "#ff4d4d" }; // Rojo encontrado
    return { background: "#f0f0f0" };
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>🔍 Búsqueda Binaria</h1>

      {/* Tamaño del array */}
      <label>
        Tamaño del array:
        <input
          type="number"
          min="2"
          max="20"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          style={{ marginLeft: "10px" }}
        />
      </label>

      <br /><br />

      {/* Input para ingresar elementos */}
      <input
        type="number"
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        placeholder="Número"
      />
      <button onClick={addNumber} disabled={array.length >= size} style={{ marginLeft: "10px" }}>
        ➕ Agregar
      </button>
      <button onClick={clearArray} style={{ marginLeft: "10px" }}>🗑️ Limpiar</button>

      <p>Array actual: [{array.join(", ")}]</p>

      <br />

      {/* Target */}
      <input
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Número a buscar"
      />
      <button onClick={handleSearch} style={{ marginLeft: "10px" }}>🔍 Buscar</button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Array usado:</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px" }}>
            {result.array.map((num, index) => (
              <div
                key={index}
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid black",
                  borderRadius: "8px",
                  fontSize: "18px",
                  ...getBoxStyle(index),
                }}
              >
                {num}
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: "20px" }}>Paso {currentStep + 1} de {result.steps.length}</h3>
          <p>
            left={result.steps[currentStep].left}, right={result.steps[currentStep].right}, mid={result.steps[currentStep].mid}, valor={result.steps[currentStep].mid_value}
          </p>

          <div style={{ marginTop: "20px" }}>
            <button onClick={prevStep} disabled={currentStep === 0} style={{ marginRight: "10px" }}>
              ⬅️ Anterior
            </button>
            <button onClick={nextStep} disabled={currentStep === result.steps.length - 1}>
              Siguiente ➡️
            </button>
          </div>

          <h2 style={{ marginTop: "20px" }}>
            Resultado:{" "}
            {result.found_index !== -1
              ? `✅ Encontrado en posición ${result.found_index}`
              : "❌ No encontrado"}
          </h2>
        </div>
      )}
    </div>
  );
}

export default BinarySearch;
