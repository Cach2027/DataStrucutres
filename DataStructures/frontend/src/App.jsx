import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import BinarySearch from "./BinarySearch";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#f5f5f5" }}>
        <Link to="/" style={{ marginRight: "15px" }}>🏠 Inicio</Link>
        <Link to="/binary-search">🔍 Búsqueda Binaria</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/binary-search" element={<BinarySearch />} />
      </Routes>
    </Router>
  );
}

export default App;
