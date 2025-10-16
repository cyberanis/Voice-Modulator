import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Local from "./pages/Local";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={<Local />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
