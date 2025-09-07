import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>📊 Data Structures</h1>
      <p>Selecciona un algoritmo para visualizar:</p>
      <Link to="/binary-search">
        <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          🔍 Búsqueda Binaria
        </button>
      </Link>
    </div>
  );
}

export default Home;
