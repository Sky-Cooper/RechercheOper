import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FordBellman from "./components/FordBellman";
import FordBellmanStyled from "./components/FordBellmanStyled";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/fordbellman" element={<FordBellman />}></Route>
        <Route
          path="/fordbellmanstyled"
          element={<FordBellmanStyled />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
