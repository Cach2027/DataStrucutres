import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./Inicio";
import BinarySearch from "./BinarySearch";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Inicio />} />

        {/* Algoritmos */}
        <Route path="/binary-search" element={<BinarySearch />} />
      </Routes>
    </Router>
  );
}

export default App;
