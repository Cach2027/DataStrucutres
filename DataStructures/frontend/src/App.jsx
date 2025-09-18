import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import BinarySearch from "./BinarySearch";
import LinearSearch from "./LinearSearch";
import HashMod from "./HashMod";
import HashSquare from "./HashSquare";
import HashTrunc from "./HashTrunc";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Algoritmos */}
        <Route path="/binary-search" element={<BinarySearch />} />
        <Route path="/linear-search" element={<LinearSearch />} />
        <Route path="/Hash-mod" element={<HashMod />} />
        <Route path="/hash-square" element={<HashSquare />} />
        <Route path="/hash-trunc" element={<HashTrunc />} />
      </Routes>
    </Router>
  );
}

export default App;
