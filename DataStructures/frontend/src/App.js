import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Cargando...");

  useEffect(() => {
    // Llamamos al backend en http://127.0.0.1:8000/ping
    axios
      .get("http://127.0.0.1:8000/ping")
      .then((res) => {
        setMessage(res.data.message); // Mostramos la respuesta
      })
      .catch((err) => {
        setMessage("❌ Error al conectar con backend");
        console.error(err);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Conexión Frontend + Backend</h1>
      <p>Respuesta del backend: <strong>{message}</strong></p>
    </div>
  );
}

export default App;
